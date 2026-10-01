/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { streamHermesResponse } from '../services';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  content: string;
  hash?: string;
  redacted?: boolean;
}

interface StreamCallbacks {
  onMeta?: (sanitizedCount: number) => void;
  onChunk?: (text: string) => void;
  onError?: (error: Error) => void;
  onDone?: () => void;
}

interface UseHermesStreamResult {
  sendMessage: (
    message: string,
    history: Array<{ role: 'user' | 'model'; content: string }>,
    attachments: AttachedFile[]
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  cancel: () => void;
}

export function useHermesStream(callbacks: StreamCallbacks = {}): UseHermesStreamResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const sendMessage = useCallback(
    async (
      message: string,
      history: Array<{ role: 'user' | 'model'; content: string }>,
      attachments: AttachedFile[]
    ) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const generator = streamHermesResponse(message, history, attachments);

        for await (const event of generator) {
          if (abortControllerRef.current?.signal.aborted) {
            break;
          }

          if (event.type === 'meta' && event.sanitizedCount !== undefined) {
            callbacks.onMeta?.(event.sanitizedCount);
          } else if (event.type === 'chunk' && event.text) {
            callbacks.onChunk?.(event.text);
          }
        }

        if (!abortControllerRef.current?.signal.aborted) {
          callbacks.onDone?.();
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          const error = err as Error;
          setError(error);
          callbacks.onError?.(error);
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoading(false);
        }
        abortControllerRef.current = null;
      }
    },
    [callbacks]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { sendMessage, isLoading, error, cancel };
}
