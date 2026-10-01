/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Re-export shared sanitizer for client-side use
export { sanitizeText as sanitizeClientContent, type SanitizeResult } from '../utils/sanitizer';
export { computeSha256 } from '../utils/sanitizer';

// Re-export system prompt from single source of truth
export {
  HERMES_CORE_SYSTEM_PROMPT,
  VERIFIED_GEMINI_MODELS,
  DEFAULT_MODEL,
  HERMES_TEMPERATURE,
} from '../config/systemPrompt';

export async function* streamHermesResponse(
  message: string,
  history: Array<{ role: 'user' | 'model'; content: string }>,
  attachments: Array<{ name: string; content: string }>
): AsyncGenerator<{ type: 'chunk' | 'meta'; text?: string; sanitizedCount?: number }> {
  // 1. Secret Boundary Sanitization (using shared sanitizer)
  const { sanitizeText } = await import('../utils/sanitizer');
  const sanitizedUser = sanitizeText(message);
  const totalRedacted = sanitizedUser.redactedCount;

  // 2. Get API key from environment (Vite exposes VITE_* vars to client)
  const apiKey = import.meta.env.VITE_HERMES_API_KEY;

  // 3. Client calls backend proxy endpoint with full-stack server session
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch('/api/hermes/chat', {
    method: 'POST',
    headers,
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
