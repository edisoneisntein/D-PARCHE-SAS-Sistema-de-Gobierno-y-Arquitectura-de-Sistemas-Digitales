/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Authentication middleware for Express
 * Validates Bearer token against hashed API keys
 */

import { Request, Response, NextFunction } from 'express';
import { getAuthConfig, validateApiKey, extractBearerToken, hashApiKey } from '../config/auth';
import pino from 'pino';

const logger = pino({ name: 'auth-middleware' });

export interface AuthenticatedRequest extends Request {
  auth?: {
    keyHash: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const config = getAuthConfig();

  if (!config.requireAuth) {
    if (!config.isProduction) {
      logger.debug({ path: req.path }, 'Auth disabled in development (REQUIRE_AUTH=false)');
    }
    return next();
  }

  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    logger.warn({ ip: req.ip, path: req.path }, 'Missing Authorization header');
    res.status(401).json({ error: 'Authentication required: Bearer token missing' });
    return;
  }

  if (!validateApiKey(token, config.keyHashes)) {
    logger.warn({ ip: req.ip, path: req.path }, 'Invalid API key');
    res.status(403).json({ error: 'Invalid or revoked API key' });
    return;
  }

  req.auth = { keyHash: hashApiKey(token) };
  next();
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const config = getAuthConfig();
  const origin = req.headers.origin;

  if (origin && config.corsOrigins.length > 0) {
    if (config.corsOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  } else if (!config.isProduction && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
}

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  const config = getAuthConfig();

  if (config.isProduction) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  next();
}
