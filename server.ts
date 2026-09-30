/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

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

// Invariant Secret Boundary Sanitizer (Sección 21)
function sanitizeText(text: string): { sanitized: string; redactedCount: number } {
  let count = 0;
  let result = text;

  // Mask common API keys and tokens
  const patterns = [
    /sk-[a-zA-Z0-9_-]{20,}/g, // OpenAI/Anthropic keys
    /AIza[0-9A-Za-z-_]{35}/g, // Google API keys
    /ghp_[a-zA-Z0-9]{36}/g, // GitHub personal access tokens
    /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC )?PRIVATE KEY-----/g, // Private keys
    /bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, // Bearer tokens
  ];

  for (const regex of patterns) {
    result = result.replace(regex, (match) => {
      count++;
      return `[REDACTED_SECRET_HASH_${crypto.createHash('sha256').update(match).digest('hex').substring(0, 8)}]`;
    });
  }

  return { sanitized: result, redactedCount: count };
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

// Hermes Chat Stream Endpoint
app.post('/api/hermes/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], attachments = [] } = req.body;

    if (!message && (!attachments || attachments.length === 0)) {
      res.status(400).json({ error: 'Se requiere un mensaje o al menos un archivo adjunto.' });
      return;
    }

    // 1. Secret Boundary Sanitization
    let totalRedacted = 0;
    const sanitizedUserMessage = sanitizeText(message || '');
    totalRedacted += sanitizedUserMessage.redactedCount;

    const sanitizedAttachments = (attachments as { name: string; content: string }[]).map((att) => {
      const san = sanitizeText(att.content);
      totalRedacted += san.redactedCount;
      const hash = crypto.createHash('sha256').update(att.content).digest('hex');
      return {
        name: att.name,
        content: san.sanitized,
        hash,
        redactedCount: san.redactedCount,
      };
    });

    // 2. Prepare context with SHA-256 hashes
    let userPromptWithContext = sanitizedUserMessage.sanitized;
    if (sanitizedAttachments.length > 0) {
      userPromptWithContext += '\n\n=== ARTEFACTOS / DOCUMENTOS ADJUNTOS (SANITISADOS POR HERMES GATE) ===\n';
      sanitizedAttachments.forEach((att, index) => {
        userPromptWithContext += `\n--- ARTEFACTO [${index + 1}]: ${att.name} (SHA-256: ${att.hash}) ---\n${att.content}\n--- FIN ARTEFACTO ---\n`;
      });
    }

    // Setup Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

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
    let lastError: any = null;

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
      } catch (err: any) {
        console.warn(`Model ${modelName} failed in /api/hermes/chat:`, err.message);
        lastError = err;
      }
    }

    if (!streamSucceeded) {
      throw lastError || new Error('No se pudo establecer conexión con los modelos de inferencia.');
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error in /api/hermes/chat:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Error en Hermes Core Ingestion' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
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

  app.listen(PORT, () => {
    console.log(`Hermes Server running on port ${PORT}`);
  });
}

startServer();
