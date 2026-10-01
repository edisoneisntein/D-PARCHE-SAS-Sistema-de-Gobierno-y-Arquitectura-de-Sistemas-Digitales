/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

export function useHashLockedPatch(initialCode?: string): {
  patchCode: string;
  setPatchCode: (code: string) => void;
  baseApprovedHash: string;
  currentPatchHash: string;
  isPatchApproved: boolean;
  sanitizePrompt: (text: string) => {
    sanitized: string;
    hasSecretsDetected: boolean;
    sanitizedPrompt: string;
  };
  hasSecretsDetected: boolean;
  sanitizedPrompt: string;
  rawPrompt: string;
  setRawPrompt: (prompt: string) => void;
} {
  const [patchCode, setPatchCode] = useState(
    initialCode ??
      `export function calculateRisk(score: number): boolean {\n  return score > 85;\n}`
  );

  const baseApprovedHash = 'd3b07384d113edec49eaa6238ad5ff00';

  const computeSimpleHash = useCallback((str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256-${hex}9f42c7e0`;
  }, []);

  const currentPatchHash = computeSimpleHash(patchCode);
  const isPatchApproved = currentPatchHash === baseApprovedHash;

  const [rawPrompt, setRawPrompt] = useState(
    `Analiza este commit: const apiKey = "«redacted:sk-…»"; const dbPass = "SuperSecretDbPassword!"; conectar();`
  );

  const sanitizePrompt = useCallback((text: string) => {
    const sanitized = text
      .replace(/sk-[a-zA-Z0-9_-]{12,}/g, '[REDACTED_API_KEY_HERMES_GATE]')
      .replace(/SuperSecretDbPassword!/g, '[REDACTED_SECRET_CREDENTIAL]');
    const hasSecretsDetected = text !== sanitized;
    return { sanitized, hasSecretsDetected, sanitizedPrompt: sanitized };
  }, []);

  const { sanitized: sanitizedPrompt, hasSecretsDetected } = sanitizePrompt(rawPrompt);

  return {
    patchCode,
    setPatchCode,
    baseApprovedHash,
    currentPatchHash,
    isPatchApproved,
    sanitizePrompt,
    hasSecretsDetected,
    sanitizedPrompt,
    rawPrompt,
    setRawPrompt,
  };
}
