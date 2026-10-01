/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  content: string;
  hash?: string;
  redacted?: boolean;
}

export function useFileUpload() {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addFiles = useCallback(async (files: FileList) => {
    setIsProcessing(true);
    const newFiles: AttachedFile[] = [];
    for (const file of Array.from(files)) {
      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });
      newFiles.push({ id: crypto.randomUUID(), name: file.name, size: file.size, content });
    }
    setAttachedFiles((prev) => [...prev, ...newFiles]);
    setIsProcessing(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setAttachedFiles([]);
  }, []);

  return { attachedFiles, addFiles, removeFile, clearFiles, isProcessing };
}
