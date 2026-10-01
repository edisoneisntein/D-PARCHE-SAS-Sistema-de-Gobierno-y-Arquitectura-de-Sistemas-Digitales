/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Re-export shared sanitizer for client-side use
export { sanitizeText as sanitizeClientContent, type SanitizeResult } from '../utils/sanitizer';
export { computeSha256 } from '../utils/sanitizer';

// Keep the system prompt in sync (could be moved to shared location later)
export const HERMES_CORE_SYSTEM_PROMPT = `
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

export async function* streamHermesResponse(
  message: string,
  history: Array<{ role: 'user' | 'model'; content: string }>,
  attachments: Array<{ name: string; content: string }>
): AsyncGenerator<{ type: 'chunk' | 'meta'; text?: string; sanitizedCount?: number }> {
  // 1. Secret Boundary Sanitization (using shared sanitizer)
  const { sanitizeText } = await import('../utils/sanitizer');
  const sanitizedUser = sanitizeText(message);
  const totalRedacted = sanitizedUser.redactedCount;

  // 2. Client calls backend proxy endpoint with full-stack server session
  const response = await fetch('/api/hermes/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      message: sanitizedUser.sanitized,
      history,
      attachments,
    }),
  });

  if (!response.ok) {
    let errorMsg = `Error HTTP ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error) {
        errorMsg = errJson.error;
      }
    } catch {
      const text = await response.text();
      if (text) errorMsg = text.substring(0, 300);
    }
    throw new Error(errorMsg);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('El navegador no pudo abrir el stream de lectura de Hermes.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    // Split on double or single newlines
    const rawEvents = buffer.split(/\r?\n\r?\n/);
    buffer = rawEvents.pop() || '';

    for (const rawEvent of rawEvents) {
      const lines = rawEvent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === 'meta') {
              yield { type: 'meta', sanitizedCount: data.sanitizedCount || totalRedacted };
            } else if (data.type === 'chunk' && data.text) {
              yield { type: 'chunk', text: data.text };
            } else if (data.type === 'error') {
              throw new Error(data.error);
            }
          } catch (e: any) {
            if (e.message && e.message.includes('Error')) {
              throw e;
            }
          }
        }
      }
    }
  }
}
