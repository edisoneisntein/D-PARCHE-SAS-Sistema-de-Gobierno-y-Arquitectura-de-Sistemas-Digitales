/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Gemini AIProvider Implementation
 * Extracted from server.ts getGenAI() logic
 */

import { GoogleGenAI } from '@google/genai';
import {
  AIProvider,
  AIProviderConfig,
  AIProviderGenerateContentRequest,
  AIProviderGenerateContentResponse,
  AIProviderStreamChunk,
} from './ai-provider';
import { VERIFIED_GEMINI_MODELS } from '../config/systemPrompt';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  readonly supportedModels = [...VERIFIED_GEMINI_MODELS];

  private client: GoogleGenAI;
  private timeoutMs: number;

  constructor(config: AIProviderConfig) {
    this.client = new GoogleGenAI({ apiKey: config.apiKey });
    this.timeoutMs = config.timeoutMs ?? 120000;
  }

  async generateContent(
    req: AIProviderGenerateContentRequest
  ): Promise<AIProviderGenerateContentResponse> {
    const model = req.model;
    const contents = req.contents;
    const config = req.config;

    const response = await this.withTimeout(
      this.client.models.generateContent({
        model,
        contents,
        config: config
          ? {
              systemInstruction: config.systemInstruction,
              temperature: config.temperature,
              maxOutputTokens: config.maxOutputTokens,
            }
          : undefined,
      }),
      this.timeoutMs
    );

    return {
      text: response.text ?? '',
      usageMetadata: response.usageMetadata
        ? {
            promptTokenCount: response.usageMetadata.promptTokenCount ?? 0,
            candidatesTokenCount: response.usageMetadata.candidatesTokenCount ?? 0,
            totalTokenCount: response.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
    };
  }

  async *generateContentStream(
    req: AIProviderGenerateContentRequest
  ): AsyncIterable<AIProviderStreamChunk> {
    const model = req.model;
    const contents = req.contents;
    const config = req.config;

    const responseStream = await this.withTimeout(
      this.client.models.generateContentStream({
        model,
        contents,
        config: config
          ? {
              systemInstruction: config.systemInstruction,
              temperature: config.temperature,
              maxOutputTokens: config.maxOutputTokens,
            }
          : undefined,
      }),
      this.timeoutMs
    );

    let finalUsage: AIProviderStreamChunk['usageMetadata'] = undefined;

    for await (const chunk of responseStream) {
      if (chunk.usageMetadata) {
        finalUsage = {
          promptTokenCount: chunk.usageMetadata.promptTokenCount ?? 0,
          candidatesTokenCount: chunk.usageMetadata.candidatesTokenCount ?? 0,
          totalTokenCount: chunk.usageMetadata.totalTokenCount ?? 0,
        };
      }
      if (chunk.text) {
        yield {
          text: chunk.text,
          done: false,
          usageMetadata: finalUsage,
        };
      }
    }

    yield {
      text: '',
      done: true,
      usageMetadata: finalUsage,
    };
  }

  async listModels(): Promise<string[]> {
    try {
      // models.list() returns Promise<Pager<Model>>, await to get Pager<Model>
      const pager = await this.client.models.list();
      const modelNames: string[] = [];
      for await (const model of pager) {
        if (model.name) {
          modelNames.push(model.name.replace('models/', ''));
        }
      }
      return modelNames.length > 0 ? modelNames : [...VERIFIED_GEMINI_MODELS];
    } catch {
      return [...VERIFIED_GEMINI_MODELS];
    }
  }

  async countTokens(req: {
    model: string;
    contents: AIProviderGenerateContentRequest['contents'];
  }): Promise<number> {
    try {
      const result = await this.client.models.countTokens({
        model: req.model,
        contents: req.contents,
      });
      return result.totalTokens ?? 0;
    } catch {
      return 0;
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }
}

/**
 * Create GeminiProvider from environment
 */
export function createGeminiProviderFromEnv(): GeminiProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GeminiProvider({ apiKey });
}
