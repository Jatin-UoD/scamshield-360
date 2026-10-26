/**
 * Optional URL reputation / threat-intelligence provider interface.
 * Current build uses local structural analysis only.
 * Real providers (e.g. Google Safe Browsing, VirusTotal, etc.) must be called
 * from a backend so API keys are never exposed in the browser.
 */

import type { AnalysisResult } from '../types';
import { analyseUrl } from './urlAnalyzer';

export interface ThreatIntelProvider {
  isConfigured(): boolean;
  checkUrlReputation?(url: string): Promise<{
    malicious: boolean | null;
    sources: string[];
    details?: string;
  }>;
  statusMessage(): string;
}

export const localThreatFallback: ThreatIntelProvider = {
  isConfigured: () => false,
  statusMessage: () =>
    'Threat-intelligence provider not configured. Using local structural URL analysis only. Absence of local indicators does NOT prove a URL is safe.',
  checkUrlReputation: async () => ({
    malicious: null,
    sources: [],
    details: 'No external reputation data available in this demo build.',
  }),
};

export function getThreatIntelProvider(): ThreatIntelProvider {
  // Future: if backend endpoint exists, return a real implementation
  return localThreatFallback;
}

/** Convenience: run local analysis (and later merge with reputation if available) */
export async function analyseUrlWithOptionalIntel(url: string): Promise<AnalysisResult> {
  const local = analyseUrl(url);
  const provider = getThreatIntelProvider();
  if (!provider.isConfigured() || !provider.checkUrlReputation) {
    return local;
  }
  // Placeholder for future merge logic
  return local;
}
