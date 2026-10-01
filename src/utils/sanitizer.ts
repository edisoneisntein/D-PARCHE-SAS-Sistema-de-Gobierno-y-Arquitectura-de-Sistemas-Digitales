/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Hermes Secret Boundary Sanitizer (Sección 21)
 *
 * Sanitizes text by detecting and redacting secrets (API keys, tokens, private keys, etc.)
 * Returns sanitized text + count of redacted secrets + SHA-256 hashes of redacted content
 * for audit trail without exposing secrets.
 */

import { createHash } from 'crypto';

export interface SanitizeResult {
  sanitized: string;
  redactedCount: number;
  redactedHashes: string[];
}

// Patterns for common secret formats
const SECRET_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'openai_key', regex: /sk-[a-zA-Z0-9_-]{20,}/g },
  { name: 'anthropic_key', regex: /sk-ant-[a-zA-Z0-9_-]{20,}/g },
  { name: 'google_api_key', regex: /AIza[0-9A-Za-z-_]{35}/g },
  { name: 'github_pat', regex: /ghp_[a-zA-Z0-9]{36}/g },
  { name: 'github_oauth', regex: /gho_[a-zA-Z0-9]{36}/g },
  { name: 'github_app', regex: /ghs_[a-zA-Z0-9]{36}/g },
  {
    name: 'private_key',
    regex:
      /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC )?PRIVATE KEY-----/g,
  },
  { name: 'bearer_token', regex: /bearer\s+[a-zA-Z0-9_.-]{20,}/gi },
  { name: 'aws_access_key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'aws_secret_key', regex: /[A-Za-z0-9/+=]{40}/g },
  { name: 'slack_token', regex: /xox[baprs]-[a-zA-Z0-9-]{10,}/g },
  { name: 'discord_token', regex: /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g },
  { name: 'jwt', regex: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g },
];

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function sanitizeText(text: string): SanitizeResult {
  if (!text || typeof text !== 'string') {
    return { sanitized: text ?? '', redactedCount: 0, redactedHashes: [] };
  }

  let result = text;
  const redactedHashes: string[] = [];
  let totalRedacted = 0;

  for (const { name, regex } of SECRET_PATTERNS) {
    const matches = [...text.matchAll(regex)];
    for (const match of matches) {
      const secret = match[0];
      const hash = sha256(secret).substring(0, 16);
      redactedHashes.push(`[${name}:${hash}]`);
      result = result.replace(secret, `[REDACTED_${name.toUpperCase()}_${hash}]`);
      totalRedacted++;
    }
  }

  return {
    sanitized: result,
    redactedCount: totalRedacted,
    redactedHashes,
  };
}

/**
 * Compute SHA-256 hash of text (for content integrity / approval locking)
 */
export async function computeSha256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for non-browser environments
    return sha256(text);
  }
}

/**
 * Synchronously compute SHA-256 (Node.js only)
 */
export function computeSha256Sync(text: string): string {
  return sha256(text);
}
