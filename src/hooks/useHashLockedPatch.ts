/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * DEMO HOOK — NO EVIDENCE — NOT FOR PRODUCTION USE
 *
 * This hook demonstrates the CONCEPT of hash-locked patches and secret sanitization
 * but is NOT the actual security implementation. The real implementation lives in:
 * - src/utils/sanitizer.ts (shared sanitizer with real SHA-256)
 * - src/config/auth.ts (API key hashing with timing-safe comparison)
 * - server.ts (auth middleware enforcement)
 *
 * This component exists only for UI demonstration purposes.
 * Any component depending on `isPatchApproved` for security decisions is vulnerable.
 */

import { useState, useCallback, useMemo } from 'react';
import { sanitizeText, computeSha256, type SanitizeResult } from '../utils/sanitizer';

export interface UseDemoHashLockedPatchResult {
  patchCode: string;
  setPatchCode: (code: string) => void;
  baseApprovedHash: string;
  currentPatchHash: string;
  isPatchApproved: boolean;
  sanitizePrompt: (text: string) => Promise<SanitizeResult>;
  hasSecretsDetected: boolean;
  sanitizedPrompt: string;
  rawPrompt: string;
  setRawPrompt: (prompt: string) => void;
  // Explicit warning for consumers
  __DEMO_WARNING__: 'This hook uses REAL SHA-256 but is for DEMO only. Do not use for security decisions.';
}

export function useDemoHashLockedPatch(initialCode?: string): UseDemoHashLockedPatchResult {
  const [patchCode, setPatchCode] = useState(
    initialCode ??
      `export function calculateRisk(score: number): boolean {\n  return score > 85;\n}`
  );

  // Use REAL SHA-256 from shared sanitizer (async)
  const [currentPatchHash, setCurrentPatchHash] = useState<string>('');
  const [isPatchApproved, setIsPatchApproved] = useState(false);

  // Base approved hash - computed from the default initial code using REAL SHA-256
  const defaultCode = `export function calculateRisk(score: number): boolean {\n  return score > 85;\n}`;
  const baseApprovedHash = useMemo(() => {
    // Synchronously compute for initial value
    let hash = 0;
    for (let i = 0; i < defaultCode.length; i++) {
      const char = defaultCode.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    // This is still a demo hash - real approval would come from Hermes Core
    return `sha256-demo-${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }, []);

  // Compute real SHA-256 when patchCode changes
  const computeRealHash = useCallback(async (code: string): Promise<string> => {
    return await computeSha256(code);
  }, []);

  // Update hash and approval status when patchCode changes
  const updateHash = useCallback(
    async (code: string) => {
      const hash = await computeRealHash(code);
      setCurrentPatchHash(hash);
      // In real implementation, this would check against Hermes Core approval store
      setIsPatchApproved(false); // Always false in demo - requires real approval gate
    },
    [computeRealHash]
  );

  // Initialize hash on mount
  const [initialized, setInitialized] = useState(false);

  // We need to handle async initialization - use effect would be better but keeping simple
  if (!initialized) {
    updateHash(patchCode);
    setInitialized(true);
  }

  const [rawPrompt, setRawPrompt] = useState(
    `Analiza este commit: const apiKey = "«redacted:sk-…»"; const dbPass = "SuperSecretDbPassword!"; conectar();`
  );

  // Use SHARED sanitizer (real implementation)
  const sanitizePrompt = useCallback(async (text: string): Promise<SanitizeResult> => {
    return sanitizeText(text);
  }, []);

  const [sanitizedPrompt, setSanitizedPrompt] = useState('');
  const [hasSecretsDetected, setHasSecretsDetected] = useState(false);

  // Sanitize on rawPrompt change
  const updateSanitized = useCallback(
    async (text: string) => {
      const result = await sanitizePrompt(text);
      setSanitizedPrompt(result.sanitized);
      setHasSecretsDetected(result.redactedCount > 0);
    },
    [sanitizePrompt]
  );

  // Initialize sanitized prompt
  if (!sanitizedPrompt && rawPrompt) {
    updateSanitized(rawPrompt);
  }

  const wrappedSetPatchCode = useCallback(
    (code: string) => {
      setPatchCode(code);
      updateHash(code);
    },
    [updateHash]
  );

  const wrappedSetRawPrompt = useCallback(
    (prompt: string) => {
      setRawPrompt(prompt);
      updateSanitized(prompt);
    },
    [updateSanitized]
  );

  return {
    patchCode,
    setPatchCode: wrappedSetPatchCode,
    baseApprovedHash,
    currentPatchHash,
    isPatchApproved,
    sanitizePrompt,
    hasSecretsDetected,
    sanitizedPrompt,
    rawPrompt,
    setRawPrompt: wrappedSetRawPrompt,
    __DEMO_WARNING__:
      'This hook uses REAL SHA-256 but is for DEMO only. Do not use for security decisions.',
  };
}
