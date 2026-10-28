/**
 * Optional AI explanation client.
 * Calls a local/backend API only — never puts NVIDIA_API_KEY in the browser.
 * If VITE_AI_API_URL is unset or the server has no key, local analysis still works.
 */

export interface AiExplainRequest {
  message: string;
  localScore?: number;
  riskLevel?: string;
  indicators?: string[];
}

export interface AiExplainResponse {
  usedAI: boolean;
  explanation: string | null;
  model: string | null;
  error: string | null;
}

/** Backend base URL, e.g. http://127.0.0.1:8000 — no secrets here */
function getAiApiBase(): string {
  const base = import.meta.env.VITE_AI_API_URL as string | undefined;
  return (base || '').replace(/\/$/, '');
}

export function isAiBackendConfigured(): boolean {
  return Boolean(getAiApiBase());
}

export function aiStatusMessage(): string {
  if (!getAiApiBase()) {
    return 'Optional AI backend not configured. Local rule-based analysis only.';
  }
  return 'Optional AI backend URL is set. Explanations load when the server has a valid API key.';
}

/**
 * Request a natural-language explanation for a message already scored locally.
 * Safe to call always: returns usedAI=false on any failure.
 */
export async function explainWithAi(
  req: AiExplainRequest
): Promise<AiExplainResponse> {
  const base = getAiApiBase();
  if (!base) {
    return {
      usedAI: false,
      explanation: null,
      model: null,
      error: 'AI backend URL not set (VITE_AI_API_URL).',
    };
  }

  try {
    const res = await fetch(`${base}/api/ai/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        message: req.message,
        localScore: req.localScore,
        riskLevel: req.riskLevel,
        indicators: req.indicators ?? [],
      }),
    });

    if (!res.ok) {
      return {
        usedAI: false,
        explanation: null,
        model: null,
        error: `AI backend HTTP ${res.status}`,
      };
    }

    const data = (await res.json()) as AiExplainResponse;
    return {
      usedAI: Boolean(data.usedAI),
      explanation: data.explanation ?? null,
      model: data.model ?? null,
      error: data.error ?? null,
    };
  } catch {
    return {
      usedAI: false,
      explanation: null,
      model: null,
      error: 'Could not reach AI backend.',
    };
  }
}
