/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Authentication configuration for Hermes API
 * Uses hashed API keys from environment variable AUTH_KEY_HASHES
 * Format: comma-separated SHA-256 hashes (hex)
 * Example: AUTH_KEY_HASHES="a1b2c3...,d4e5f6..."
 */

import { createHash } from 'crypto';

export interface AuthConfig {
  keyHashes: Set<string>;
  corsOrigins: string[];
  isProduction: boolean;
  requireAuth: boolean;
}

function parseKeyHashes(envValue: string | undefined): Set<string> {
  if (!envValue || envValue.trim() === '') {
    return new Set();
  }
  return new Set(
    envValue
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter((h) => h.length === 64)
  );
}

function parseCorsOrigins(envValue: string | undefined, isProduction: boolean): string[] {
  if (!envValue || envValue.trim() === '') {
    if (isProduction) {
      return [];
    }
    return [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];
  }
  return envValue
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
}

export function getAuthConfig(): AuthConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const requireAuth = isProduction || process.env.REQUIRE_AUTH === 'true';

  return {
    keyHashes: parseKeyHashes(process.env.AUTH_KEY_HASHES),
    corsOrigins: parseCorsOrigins(process.env.ALLOWED_ORIGIN, isProduction),
    isProduction,
    requireAuth,
  };
}

export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function validateApiKey(providedKey: string, keyHashes: Set<string>): boolean {
  if (keyHashes.size === 0) {
    return false;
  }
  const providedHash = hashApiKey(providedKey).toLowerCase();
  for (const storedHash of keyHashes) {
    if (timingSafeEqual(providedHash, storedHash)) {
      return true;
    }
  }
  return false;
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7).trim();
}
