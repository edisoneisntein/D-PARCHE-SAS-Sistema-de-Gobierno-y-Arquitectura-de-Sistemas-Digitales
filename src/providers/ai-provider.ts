/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AIProvider Interface — Single abstraction for all LLM providers
 * Implements Section 11: Model-agnosticism, AIProvider desacoplado del dominio central
 */

export interface AIProviderGenerateContentRequest {
  model: string;
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  config?: {
    systemInstruction?: string;
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface AIProviderGenerateContentResponse {
  text: string;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface AIProviderStreamChunk {
  text: string;
  done: boolean;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface AIProvider {
  readonly name: string;
  readonly supportedModels: readonly string[];

  generateContentStream(
    req: AIProviderGenerateContentRequest
  ): AsyncIterable<AIProviderStreamChunk>;
  generateContent(
    req: AIProviderGenerateContentRequest
  ): Promise<AIProviderGenerateContentResponse>;
  listModels(): Promise<string[]>;
  countTokens(req: {
    model: string;
    contents: AIProviderGenerateContentRequest['contents'];
  }): Promise<number>;
}

export interface AIProviderConfig {
  apiKey: string;
  defaultModel?: string;
  timeoutMs?: number;
}

/**
 * Provider registry for runtime provider resolution
 */
export class AIProviderRegistry {
  private static providers: Map<string, AIProvider> = new Map();
  private static defaultProvider: string | null = null;

  static register(provider: AIProvider, isDefault = false): void {
    this.providers.set(provider.name, provider);
    if (isDefault || this.defaultProvider === null) {
      this.defaultProvider = provider.name;
    }
  }

  static get(name?: string): AIProvider {
    const providerName = name ?? this.defaultProvider;
    if (!providerName) {
      throw new Error('No AI provider registered');
    }
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`AI provider not found: ${providerName}`);
    }
    return provider;
  }

  static list(): string[] {
    return Array.from(this.providers.keys());
  }

  static clear(): void {
    this.providers.clear();
    this.defaultProvider = null;
  }
}

/**
 * Validate model name against verified models
 */
export function validateModelName(model: string, provider: AIProvider): string {
  if (provider.supportedModels.includes(model)) {
    return model;
  }
  // Fallback to first supported model
  return provider.supportedModels[0] ?? 'gemini-2.0-flash-exp';
}
