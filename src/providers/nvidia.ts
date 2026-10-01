/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * NVIDIA AIProvider Implementation
 * Uses NVIDIA's OpenAI-compatible API at https://integrate.api.nvidia.com/v1
 * Model: nvidia/nemotron-3-nano-omni-30b-a3b-reasoning
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import {
  AIProvider,
  AIProviderConfig,
  AIProviderGenerateContentRequest,
  AIProviderGenerateContentResponse,
  AIProviderStreamChunk,
} from './ai-provider';

const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const DEFAULT_NVIDIA_MODEL = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning';

export class NvidiaProvider implements AIProvider {
  readonly name = 'nvidia';
  readonly supportedModels = [
    DEFAULT_NVIDIA_MODEL,
    'nvidia/nemotron-3-ultra',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'nvidia/llama-3.1-nemotron-51b-instruct',
  ];

  private client: OpenAI;
  private timeoutMs: number;

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: NVIDIA_BASE_URL,
      timeout: config.timeoutMs ?? 120000,
      defaultHeaders: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      dangerouslyAllowBrowser: true,
    });
    this.timeoutMs = config.timeoutMs ?? 120000;
  }

  private convertToOpenAIFormat(req: AIProviderGenerateContentRequest) {
    const messages: ChatCompletionMessageParam[] = req.contents.map((c) => ({
      role: c.role === 'model' ? 'assistant' : 'user',
      content: c.parts.map((p) => p.text).join('\n'),
    }));

    return {
      model: req.model ?? DEFAULT_NVIDIA_MODEL,
      messages,
      temperature: req.config?.temperature ?? 0.2,
      max_tokens: req.config?.maxOutputTokens,
      stream: false,
    };
  }

  private convertToOpenAIStreamFormat(req: AIProviderGenerateContentRequest) {
    const messages: ChatCompletionMessageParam[] = req.contents.map((c) => ({
      role: c.role === 'model' ? 'assistant' : 'user',
      content: c.parts.map((p) => p.text).join('\n'),
    }));

    return {
      model: req.model ?? DEFAULT_NVIDIA_MODEL,
      messages,
      temperature: req.config?.temperature ?? 0.2,
      max_tokens: req.config?.maxOutputTokens,
      stream: true,
    };
  }

  async generateContent(
    req: AIProviderGenerateContentRequest
  ): Promise<AIProviderGenerateContentResponse> {
    const params = this.convertToOpenAIFormat(req);

    const response = await this.withTimeout(
      this.client.chat.completions.create(params as any),
      this.timeoutMs
    );

    const choice = response.choices[0];
    const text = choice?.message?.content ?? '';

    return {
      text,
      usageMetadata: response.usage
        ? {
            promptTokenCount: response.usage.prompt_tokens ?? 0,
            candidatesTokenCount: response.usage.completion_tokens ?? 0,
            totalTokenCount: response.usage.total_tokens ?? 0,
          }
        : undefined,
    };
  }

  async *generateContentStream(
    req: AIProviderGenerateContentRequest
  ): AsyncIterable<AIProviderStreamChunk> {
    const params = this.convertToOpenAIStreamFormat(req);

    const stream = await this.withTimeout(
      this.client.chat.completions.create(params as any),
      this.timeoutMs
    );

    let finalUsage: AIProviderStreamChunk['usageMetadata'] = undefined;

    for await (const chunk of stream as any) {
      const delta = chunk.choices[0]?.delta;
      if (delta?.content) {
        yield {
          text: delta.content,
          done: false,
          usageMetadata: undefined,
        };
      }
      if (chunk.usage) {
        finalUsage = {
          promptTokenCount: chunk.usage.prompt_tokens ?? 0,
          candidatesTokenCount: chunk.usage.completion_tokens ?? 0,
          totalTokenCount: chunk.usage.total_tokens ?? 0,
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
    return this.supportedModels;
  }

  async countTokens(req: {
    model: string;
    contents: AIProviderGenerateContentRequest['contents'];
  }): Promise<number> {
    const text = req.contents.map((c) => c.parts.map((p) => p.text).join('\n')).join('\n');
    return Math.ceil(text.length / 4);
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`NVIDIA request timeout after ${ms}ms`)), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }
}

/**
 * Create NvidiaProvider from environment
 * Expects NVIDIA_API_KEY in env
 */
export function createNvidiaProviderFromEnv(): NvidiaProvider | null {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new NvidiaProvider({ apiKey });
}
