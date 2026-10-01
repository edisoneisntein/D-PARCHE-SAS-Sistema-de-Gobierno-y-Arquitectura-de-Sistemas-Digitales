/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Integration tests for authentication on /api/hermes/chat
 * Tests: 401 (no auth), 403 (invalid key), 200 (valid key)
 *
 * Run with: npm run test -- src/test/integration/auth.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express, { Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth, corsMiddleware, securityHeadersMiddleware } from '../../middleware/auth';
import { getAuthConfig, hashApiKey, validateApiKey } from '../../config/auth';
import { sanitizeText } from '../../utils/sanitizer';

// Test API key and its hash
const TEST_API_KEY = 'hk_test_integration_key_1234567890abcdef';
const TEST_KEY_HASH = hashApiKey(TEST_API_KEY);
const INVALID_API_KEY = 'hk_invalid_key_0987654321fedcba';

// Create test app with auth middleware
function createTestApp(): Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.use(securityHeadersMiddleware);
  app.use(corsMiddleware);

  // Rate limiting by IP
  const ipLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', ipLimiter);

  // Rate limiting by key
  const keyLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      const authReq = req as any;
      if (authReq.auth?.keyHash) {
        return `key:${authReq.auth.keyHash}`;
      }
      return `ip:${req.ip}`;
    },
  });

  // Mock chat endpoint with auth
  app.post(
    '/api/hermes/chat',
    requireAuth,
    keyLimiter,
    async (req: Request, res: Response): Promise<void> => {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ error: 'Message required' });
        return;
      }

      // Sanitize
      const sanitized = sanitizeText(message);

      // Mock SSE response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      res.write(
        `data: ${JSON.stringify({ type: 'meta', sanitizedCount: sanitized.redactedCount })}\n\n`
      );
      res.write(
        `data: ${JSON.stringify({ type: 'chunk', text: 'Test response from Hermes Core' })}\n\n`
      );
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    }
  );

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

describe('Auth Integration Tests', () => {
  let app: Express;
  let server: any;
  const PORT = 3456;
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.AUTH_KEY_HASHES = TEST_KEY_HASH;
    process.env.REQUIRE_AUTH = 'true';
    process.env.ALLOWED_ORIGIN = 'http://localhost:5173';

    app = createTestApp();
    server = app.listen(PORT);
    await new Promise((resolve) => server.on('listening', resolve));
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    delete process.env.AUTH_KEY_HASHES;
    delete process.env.REQUIRE_AUTH;
    delete process.env.ALLOWED_ORIGIN;
  });

  describe('Config: hashApiKey / validateApiKey', () => {
    it('should generate consistent SHA-256 hash', () => {
      const hash1 = hashApiKey(TEST_API_KEY);
      const hash2 = hashApiKey(TEST_API_KEY);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex = 64 chars
    });

    it('should validate correct API key', () => {
      const keyHashes = new Set([TEST_KEY_HASH]);
      expect(validateApiKey(TEST_API_KEY, keyHashes)).toBe(true);
    });

    it('should reject invalid API key', () => {
      const keyHashes = new Set([TEST_KEY_HASH]);
      expect(validateApiKey(INVALID_API_KEY, keyHashes)).toBe(false);
    });

    it('should reject when no keys configured', () => {
      const keyHashes = new Set<string>();
      expect(validateApiKey(TEST_API_KEY, keyHashes)).toBe(false);
    });
  });

  describe('Middleware: requireAuth', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toContain('Authentication required');
    });

    it('should return 401 when Authorization header is malformed', async () => {
      const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic invalid',
        },
        body: JSON.stringify({ message: 'Hello' }),
      });

      expect(response.status).toBe(401);
    });

    it('should return 403 when API key is invalid', async () => {
      const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${INVALID_API_KEY}`,
        },
        body: JSON.stringify({ message: 'Hello' }),
      });

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toContain('Invalid or revoked API key');
    });

    it('should return 200 and stream when API key is valid', async () => {
      const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TEST_API_KEY}`,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ message: 'Test message' }),
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/event-stream');

      const text = await response.text();
      // Parse SSE events
      const events = text.split('\n\n').filter((e) => e.trim().startsWith('data: '));
      const metaEvent = events.find((e) => e.includes('"type":"meta"'));
      const chunkEvent = events.find((e) => e.includes('"type":"chunk"'));
      const doneEvent = events.find((e) => e.includes('"type":"done"'));

      expect(metaEvent).toBeDefined();
      expect(chunkEvent).toBeDefined();
      expect(doneEvent).toBeDefined();
    });

    it('should return 400 when message is missing', async () => {
      const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TEST_API_KEY}`,
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Message required');
    });
  });

  describe('CORS Middleware', () => {
    it('should allow configured origin in development', async () => {
      const response = await fetch(`${BASE_URL}/healthz`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
        },
      });

      expect(response.status).toBe(204);
      expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
      expect(response.headers.get('access-control-allow-credentials')).toBe('true');
    });

    it('should reject non-allowed origin', async () => {
      const response = await fetch(`${BASE_URL}/healthz`, {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://evil.com',
          'Access-Control-Request-Method': 'GET',
        },
      });

      // In test env with ALLOWED_ORIGIN set, it should reject
      // The middleware only sets CORS headers for allowed origins
      expect(response.headers.get('access-control-allow-origin')).toBeNull();
    });
  });

  describe('Security Headers Middleware', () => {
    it('should set security headers in production-like env', async () => {
      // Temporarily set to production
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Recreate app with production env
      const prodApp = createTestApp();
      const prodServer = prodApp.listen(3457);
      await new Promise((resolve) => prodServer.on('listening', resolve));

      try {
        const response = await fetch('http://localhost:3457/healthz');
        expect(response.headers.get('cross-origin-opener-policy')).toBe('same-origin');
        expect(response.headers.get('cross-origin-resource-policy')).toBe('same-origin');
        expect(response.headers.get('x-content-type-options')).toBe('nosniff');
        expect(response.headers.get('x-frame-options')).toBe('DENY');
      } finally {
        await new Promise((resolve) => prodServer.close(resolve));
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests under limit', async () => {
      // Make a few requests - should succeed
      for (let i = 0; i < 5; i++) {
        const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TEST_API_KEY}`,
          },
          body: JSON.stringify({ message: `Test ${i}` }),
        });
        expect(response.status).toBe(200);
      }
    });

    // Note: Full rate limit test (exceeding 50/min) would be slow
    // This is tested manually or in load testing
  });

  describe('Sanitization Integration', () => {
    it('should sanitize secrets in message before processing', async () => {
      const messageWithSecret =
        'My API key is sk-1234567890abcdef1234 and password is SuperSecretDbPassword!';

      const response = await fetch(`${BASE_URL}/api/hermes/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TEST_API_KEY}`,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ message: messageWithSecret }),
      });

      expect(response.status).toBe(200);
      const text = await response.text();

      // Parse SSE events
      const events = text.split('\n\n').filter((e) => e.trim().startsWith('data: '));
      const metaEvent = events.find((e) => e.includes('"type":"meta"'));

      expect(metaEvent).toBeDefined();
      if (metaEvent) {
        const meta = JSON.parse(metaEvent.replace('data: ', ''));
        expect(meta.sanitizedCount).toBeGreaterThan(0);
      }
    });
  });
});

describe('Auth Config', () => {
  it('should parse key hashes from env', () => {
    process.env.AUTH_KEY_HASHES = `${TEST_KEY_HASH},${hashApiKey('another-key')}`;
    process.env.NODE_ENV = 'test';
    process.env.REQUIRE_AUTH = 'true';

    const config = getAuthConfig();
    expect(config.keyHashes.size).toBe(2);
    expect(config.keyHashes.has(TEST_KEY_HASH)).toBe(true);
    expect(config.requireAuth).toBe(true);

    delete process.env.AUTH_KEY_HASHES;
    delete process.env.REQUIRE_AUTH;
  });

  it('should default to dev CORS origins when not configured', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.ALLOWED_ORIGIN;

    const config = getAuthConfig();
    expect(config.corsOrigins).toContain('http://localhost:5173');
    expect(config.corsOrigins).toContain('http://localhost:3000');
  });

  it('should require auth in production regardless of REQUIRE_AUTH', () => {
    process.env.NODE_ENV = 'production';
    process.env.REQUIRE_AUTH = 'false';

    const config = getAuthConfig();
    expect(config.requireAuth).toBe(true);
    expect(config.isProduction).toBe(true);
  });
});
