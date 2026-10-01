/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Anthropic AIProvider Implementation
 * Uses Anthropic's Messages API
 * Supports claude-3-5-sonnet, claude-3-opus, claude-3-haiku
 */

import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import {
  AIProvider,
  AIProviderConfig,
  AIProviderGenerateContentRequest,
  AIProviderGenerateContentResponse,
  AIProviderStreamChunk,
} from './ai-provider';

const DEFAULT_ANTHROPIC_MODEL = 'claude-3-5-sonnet-20241022';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  readonly supportedModels = [
    DEFAULT_ANTHROPIC_MODEL,
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ];

  private client: Anthropic;
  private timeoutMs: number;

  constructor(config: AIProviderConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
      timeout: config.timeoutMs ?? 120000,
      dangerouslyAllowBrowser: true,
    });
    this.timeoutMs = config.timeoutMs ?? 120000;
  }

  private convertToAnthropicFormat(req: AIProviderGenerateContentRequest) {
    const systemInstruction = req.config?.systemInstruction;
    const messages: MessageParam[] = req.contents
      .filter((c) => c.role === 'user' || c.role === 'model')
      .map((c) => ({
        role: c.role === 'model' ? 'assistant' : 'user',
        content: c.parts.map((p) => p.text).join('\n'),
      }));

    return {
      model: req.model ?? DEFAULT_ANTHROPIC_MODEL,
      messages,
      system: systemInstruction,
      temperature: req.config?.temperature ?? 0.2,
      max_tokens: req.config?.maxOutputTokens ?? 4096,
      stream: false,
    };
  }

  private convertToAnthropicStreamFormat(req: AIProviderGenerateContentRequest) {
    const systemInstruction = req.config?.systemInstruction;
    const messages: MessageParam[] = req.contents
      .filter((c) => c.role === 'user' || c.role === 'model')
      .map((c) => ({
        role: c.role === 'model' ? 'assistant' : 'user',
        content: c.parts.map((p) => p.text).join('\n'),
      }));

    return {
      model: req.model ?? DEFAULT_ANTHROPIC_MODEL,
      messages,
      system: systemInstruction,
      temperature: req.config?.temperature ?? 0.2,
      max_tokens: req.config?.maxOutputTokens ?? 4096,
      stream: true,
    };
  }

  async generateContent(
    req: AIProviderGenerateContentRequest
  ): Promise<AIProviderGenerateContentResponse> {
    const params = this.convertToAnthropicFormat(req);

    const response = await this.withTimeout(
      this.client.messages.create(params as any),
      this.timeoutMs
    );

    const text = response.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('\n');

    return {
      text,
      usageMetadata: response.usage
        ? {
            promptTokenCount: response.usage.input_tokens ?? 0,
            candidatesTokenCount: response.usage.output_tokens ?? 0,
            totalTokenCount:
              (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0),
          }
        : undefined,
    };
  }

  async *generateContentStream(
    req: AIProviderGenerateContentRequest
  ): AsyncIterable<AIProviderStreamChunk> {
    const params = this.convertToAnthropicStreamFormat(req);

    const stream = this.client.messages.stream(params as any);

    // Add timeout for stream
    const streamWithTimeout = this.withTimeoutStream(stream, this.timeoutMs);

    let finalUsage: AIProviderStreamChunk['usageMetadata'] = undefined;

    for await (const chunk of streamWithTimeout as any) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield {
          text: chunk.delta.text,
          done: false,
          usageMetadata: undefined,
        };
      }
      if (chunk.type === 'message_delta' && chunk.usage) {
        finalUsage = {
          promptTokenCount: chunk.usage.input_tokens ?? 0,
          candidatesTokenCount: chunk.usage.output_tokens ?? 0,
          totalTokenCount: (chunk.usage.input_tokens ?? 0) + (chunk.usage.output_tokens ?? 0),
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
    try {
      const response = await this.client.messages.countTokens({
        model: req.model,
        messages: req.contents.map((c) => ({
          role: c.role === 'model' ? 'assistant' : 'user',
          content: c.parts.map((p) => p.text).join('\n'),
        })),
      });
      return response.input_tokens ?? 0;
    } catch {
      const text = req.contents.map((c) => c.parts.map((p) => p.text).join('\n')).join('\n');
      return Math.ceil(text.length / 4);
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`Anthropic request timeout after ${ms}ms`)),
        ms
      );
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  /**
   * Wrap an async iterable with a timeout
   */
  private async *withTimeoutStream<T>(iterable: AsyncIterable<T>, ms: number): AsyncIterable<T> {
    const _timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Anthropic stream timeout after ${ms}ms`)), ms);
    });

    const iterator = iterable[Symbol.asyncIterator]();
    let done = false;

    while (!done) {
      const raceResult = await Promise.race([
        iterator.next(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error(`Anthropic stream timeout after ${ms}ms`)), ms);
        }),
      ]);

      if (raceResult.done) {
        done = true;
        return;
      }
      yield raceResult.value;
    }
  }
}

/**
 * Create AnthropicProvider from environment
 * Expects ANTHROPIC_API_KEY in env
 */
export function createAnthropicProviderFromEnv(): AnthropicProvider | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new AnthropicProvider({ apiKey });
}
