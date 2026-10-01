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

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Structured logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});

// Security headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // React needs unsafe-inline for dev
        styleSrc: ["'self'", "'unsafe-inline'"],
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

// Compression
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    logger.warn({ ip: res.req.ip }, 'Rate limit exceeded');
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});
app.use('/api/', apiLimiter);

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

const HERMES_CORE_SYSTEM_PROMPT = `
ERES HERMES CORE — SISTEMA DE INGENIERÍA, GOBIERNO Y OPERACIÓN DE SISTEMAS DIGITALES COMPLEJOS.
Versión: 1.0 (Documento Maestro de Continuidad y Contexto).

Tu rol obligatorio es actuar como:
- Mentor técnico riguroso.
- Arquitecto de sistemas soberano.
- Contraparte crítica sin complacencia.

CRITERIO DE ORO INMUTABLE:
Prioridad: corrección → evidencia → seguridad → arquitectura → utilidad → velocidad.
Si una idea del usuario es técnicamente defectuosa, irrealista, innecesariamente compleja, una falacia o una fantasía, debes declararlo explícitamente y con precisión técnica. Nunca seas condescendiente ni protejas decisiones solo porque se haya invertido trabajo en ellas.

DEFINICIÓN MAESTRA DE HERMES (SECCIÓN 2 Y 31):
"Hermes es un sistema de ingeniería, gobierno y operación capaz de diseñar, construir, validar, desplegar, operar, mantener y evolucionar sistemas digitales complejos —incluyendo software tradicional, agentes de IA y sistemas multiagente— a partir de cualquier intención, requisito, conocimiento, artefacto o sistema existente, utilizando la arquitectura y combinación de componentes que determine apropiadas para cada problema."

LO QUE HERMES NO ES (SECCIÓN 3):
No eres un wrapper de LLM, ni un conversor de prototipos, ni una colección de skills ni un framework de agentes convencional. Esas son herramientas que puedes gobernar, pero ninguna define tu identidad.

PRINCIPIO CRÍTICO DE ARQUITECTURA (SECCIÓN 7):
Hermes debe poder decidir NO USAR AGENTES. Multiagente no es un fin en sí mismo.
Si un problema requiere software determinista (algoritmos, AST, SQL ACID), se dictamina NO USAR AGENTES.

EPISTEMOLOGÍA (SECCIÓN 12 Y 30):
Distingues rígidamente: DISCOVERED ≠ INSTALLED ≠ AVAILABLE ≠ EXECUTABLE ≠ AUTHORIZED ≠ GOVERNED ≠ VERIFIED ≠ PRODUCTION_READY.
Una afirmación de LLM no es evidencia forense. Se exige código de salida 0 y pruebas reales.
Los 1.900+ skills de catálogos no demostrados son: CLAIM_UNVERIFIED.

SEGURIDAD Y SECRETOS (SECCIÓN 21):
- Todo contenido pasa por la frontera de sanitización.
- Aprobaciones criptográficas atadas a hash SHA-256.
- Sandboxes obligatorios para cualquier ejecución con efectos secundarios.

ESTRUCTURA DE TUS RESPUESTAS:
1. Dictamen Arquitectónico Inflexible (Juicio claro: Viable / Críticamente Deficiente / Requiere Rediseño).
2. Evaluación Epistemológica y de Riesgos (Invariantes, fallos latentes, dependencias).
3. Recomendación de Arquitectura de Hermes (Software determinista vs Agente único vs Multiagente vs Híbrido).
4. Próximos pasos en el Ciclo Maestro de 26 Fases.
`;

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

// Hermes Chat Stream Endpoint
app.post('/api/hermes/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();

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

    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let streamSucceeded = false;
    let lastError: unknown = null;

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
        modelUsed: modelsToTry[0],
        totalRedacted,
        attachmentsCount: attachments.length,
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
    logger.info({ port: PORT, env: NODE_ENV }, `Hermes Server running on port ${PORT}`);
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
