/**
 * Placeholder for a future server-side AI provider.
 * Current build uses local rule-based analysis only — no external API.
 */

import type { AnalysisResult } from '../types';
import { analyseMessage } from './messageAnalyzer';

export interface AiProvider {
  isConfigured(): boolean;
  statusMessage(): string;
  analyseMessageWithAi?(text: string): Promise<AnalysisResult>;
}

export const localAiFallback: AiProvider = {
  isConfigured: () => false,
  statusMessage: () =>
    'AI provider not configured. Using local rule-based analysis only.',
  analyseMessageWithAi: async (text: string) => analyseMessage(text),
};

export function getAiProvider(): AiProvider {
  return localAiFallback;
}
