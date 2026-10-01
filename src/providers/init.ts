/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Provider initialization - separated to avoid circular dependencies
 */

import { AIProviderRegistry } from './ai-provider';
import { createGeminiProviderFromEnv } from './gemini';
import { createNvidiaProviderFromEnv } from './nvidia';
import { createAnthropicProviderFromEnv } from './anthropic';

/**
 * Initialize all available providers from environment variables
 * Call this once at application startup
 */
export function initializeProviders(): void {
  // Clear existing providers
  AIProviderRegistry.clear();

  // Register Gemini (required - GEMINI_API_KEY should exist)
  const geminiProvider = createGeminiProviderFromEnv();
  if (geminiProvider) {
    AIProviderRegistry.register(geminiProvider, true); // Default provider
  }

  // Register NVIDIA (optional - NVIDIA_API_KEY)
  const nvidiaProvider = createNvidiaProviderFromEnv();
  if (nvidiaProvider) {
    AIProviderRegistry.register(nvidiaProvider);
  }

  // Register Anthropic (optional - ANTHROPIC_API_KEY)
  const anthropicProvider = createAnthropicProviderFromEnv();
  if (anthropicProvider) {
    AIProviderRegistry.register(anthropicProvider);
  }

  const registered = AIProviderRegistry.list();
  if (registered.length === 0) {
    throw new Error('No AI providers configured. Set at least GEMINI_API_KEY.');
  }

  console.warn(`[AIProviderRegistry] Registered providers: ${registered.join(', ')}`);
}
