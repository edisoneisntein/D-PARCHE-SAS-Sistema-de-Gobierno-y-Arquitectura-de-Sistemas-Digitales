/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import express, { Request, Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import pino from 'pino';
import { z } from 'zod';
import { sanitizeText, computeSha256Sync } from './src/utils/sanitizer';
import {
  requireAuth,
  corsMiddleware,
  securityHeadersMiddleware,
  AuthenticatedRequest,
} from './src/middleware/auth';
import { getAuthConfig } from './src/config/auth';
import { HERMES_CORE_SYSTEM_PROMPT } from './src/config/systemPrompt';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Structured logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
  redact: {
    paths: ['req.headers.authorization', 'req.body.message', 'req.body.attachments[*].content'],
    censor: '**REDACTED**',
  },
});

// Security headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: NODE_ENV === 'production' ? ["'self'"] : ["'self'", "'unsafe-inline'"],
        styleSrc: NODE_ENV === 'production' ? ["'self'"] : ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com'],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for Vite HMR
    crossOriginResourcePolicy: { policy: 'same-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'deny' },
  })
);

// Security headers middleware (COOP, CORP, etc.)
app.use(securityHeadersMiddleware);

// CORS middleware
app.use(corsMiddleware);

// Compression
app.use(compression());

// Rate limiting by IP (global)
const ipLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    logger.warn({ ip: res.req.ip }, 'IP rate limit exceeded');
    res.status(429).json({ error: 'Too many requests from this IP, please try again later.' });
  },
});
app.use('/api/', ipLimiter);

// Body parsing with strict limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging
app.use((req, _res, next) => {
  const start = Date.now();
  _res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.url,
        status: _res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      },
      'HTTP Request'
    );
  });
  next();
});

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment.');
    }
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Zod schemas for request validation
const AttachmentSchema = z.object({
  name: z.string().min(1).max(255),
  content: z.string().max(10 * 1024 * 1024), // 10MB max per attachment
});

const ChatRequestSchema = z.object({
  message: z.string().max(50000).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .max(8)
    .optional()
    .default([]),
  attachments: z.array(AttachmentSchema).max(5).optional().default([]),
});

interface SanitizedAttachment {
  name: string;
  content: string;
  hash: string;
  redactedCount: number;
}

// Rate limiting by API key (per-key, stricter)
const keyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per API key
  message: { error: 'Too many requests for this API key, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.auth?.keyHash) {
      return `key:${authReq.auth.keyHash}`;
    }
    return `ip:${req.ip}`;
  },
  handler: (_req, res) => {
    logger.warn({ ip: res.req.ip }, 'API key rate limit exceeded');
    res.status(429).json({ error: 'Too many requests for this API key, please try again later.' });
  },
});

// Hermes Chat Stream Endpoint
app.post('/api/hermes/chat', requireAuth, keyLimiter, async (req: Request, res: Response) => {
  const startTime = Date.now();
  const authReq = req as AuthenticatedRequest;

  try {
    // Validate request body
    const validation = ChatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      logger.warn({ errors: validation.error.flatten() }, 'Invalid chat request');
      res.status(400).json({ error: 'Invalid request body', details: validation.error.flatten() });
      return;
    }

    const { message, history = [], attachments = [] } = validation.data;

    if (!message && attachments.length === 0) {
      res.status(400).json({ error: 'Se requiere un mensaje o al menos un archivo adjunto.' });
      return;
    }

    // 1. Secret Boundary Sanitization (shared sanitizer)
    let totalRedacted = 0;
    const sanitizedUserMessage = sanitizeText(message || '');
    totalRedacted += sanitizedUserMessage.redactedCount;

    const sanitizedAttachments: SanitizedAttachment[] = attachments.map((att) => {
      const san = sanitizeText(att.content);
      const hash = computeSha256Sync(att.content);
      return {
        name: att.name,
        content: san.sanitized,
        hash,
        redactedCount: san.redactedCount,
      };
    });

    totalRedacted += sanitizedAttachments.reduce((sum, a) => sum + a.redactedCount, 0);

    // 2. Prepare context with SHA-256 hashes
    let userPromptWithContext = sanitizedUserMessage.sanitized;
    if (sanitizedAttachments.length > 0) {
      userPromptWithContext +=
        '\n\n=== ARTEFACTOS / DOCUMENTOS ADJUNTOS (SANITISADOS POR HERMES GATE) ===\n';
      sanitizedAttachments.forEach((att, index) => {
        userPromptWithContext += `\n--- ARTEFACTO [${index + 1}]: ${att.name} (SHA-256: ${att.hash}) ---\n${att.content}\n--- FIN ARTEFACTO ---\n`;
      });
    }

    // Setup Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Send metadata header event
    res.write(
      `data: ${JSON.stringify({
        type: 'meta',
        sanitizedCount: totalRedacted,
        attachmentHashes: sanitizedAttachments.map((a) => ({ name: a.name, hash: a.hash })),
      })}\n\n`
    );

    // Call Gemini with Hermes Core system instructions
    const ai = getGenAI();

    // Map history to contents format
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Prior history (max 8 turns for tight context window)
    const recentHistory = history.slice(-8);
    for (const h of recentHistory) {
      contents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }],
      });
    }

    // Current turn
    contents.push({
      role: 'user',
      parts: [{ text: userPromptWithContext }],
    });

    // Verified model names (as of 2026)
    const modelsToTry = ['gemini-3.1-pro-preview', 'gemini-2.5-flash', 'gemini-flash-latest'];
    let streamSucceeded = false;
    let lastError: unknown = null;
    let modelUsed = modelsToTry[0];

    for (const modelName of modelsToTry) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction: HERMES_CORE_SYSTEM_PROMPT,
            temperature: 0.2, // Low temperature for high deterministic rigor
          },
        });

        modelUsed = modelName;

        for await (const chunk of responseStream) {
          if (chunk.text) {
            res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk.text })}\n\n`);
          }
        }

        streamSucceeded = true;
        break;
      } catch (err) {
        const error = err as Error;
        logger.warn({ model: modelName, error: error.message }, 'Model failed in /api/hermes/chat');
        lastError = error;
      }
    }

    if (!streamSucceeded) {
      throw lastError || new Error('No se pudo establecer conexión con los modelos de inferencia.');
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

    logger.info(
      {
        duration: Date.now() - startTime,
        modelUsed,
        totalRedacted,
        attachmentsCount: attachments.length,
        keyHash: authReq.auth?.keyHash?.substring(0, 8),
      },
      'Chat request completed'
    );
  } catch (error) {
    const err = error as Error;
    logger.error({ err, duration: Date.now() - startTime }, 'Error in /api/hermes/chat');
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Error en Hermes Core Ingestion' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
  }
});

// Health check endpoint
app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, () => {
    const authConfig = getAuthConfig();
    logger.info(
      {
        port: PORT,
        env: NODE_ENV,
        authRequired: authConfig.requireAuth,
        corsOrigins: authConfig.corsOrigins,
        keyHashesConfigured: authConfig.keyHashes.size,
      },
      `Hermes Server running on port ${PORT}`
    );
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info({ signal }, 'Shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
    // Force close after 10s
    setTimeout(() => {
      logger.error('Forced shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
