/**
 * Optional AI provider interface.
 * Current build uses local rule-based analysis only.
 * When a real backend + API key is configured, implement this interface
 * and route through a server-side endpoint (never put API keys in the browser).
 */

import type { AnalysisResult } from '../types';
import { analyseMessage } from './messageAnalyzer';

export interface AiProvider {
  isConfigured(): boolean;
  analyseMessageWithAi?(text: string): Promise<AnalysisResult>;
  statusMessage(): string;
}

/** Default local fallback — always available */
export const localAiFallback: AiProvider = {
  isConfigured: () => false,
  statusMessage: () =>
    'AI provider not configured. Using local rule-based analysis only.',
  analyseMessageWithAi: async (text: string) => analyseMessage(text),
};

/**
 * Future integration point.
 * Example (server-side only):
 *   const res = await fetch('/api/ai/analyse-message', { method: 'POST', body: JSON.stringify({ text }) });
 * API keys must live in server environment variables, never in frontend code.
 */
export function getAiProvider(): AiProvider {
  // In future: check import.meta.env.VITE_AI_ENABLED and call backend
  return localAiFallback;
}
