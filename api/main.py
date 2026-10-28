"""
ScamShield 360 — optional AI explanation API.

- Uses NVIDIA Integrate chat completions (OpenAI-compatible).
- API key from environment only — never hardcode.
- If NVIDIA_API_KEY is missing, endpoints return usedAI=false (no crash).
- Do not commit .env or real keys to the public repo.
"""

from __future__ import annotations

import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "").strip()
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-nano-30b-a3b").strip()
NVIDIA_INVOKE_URL = os.getenv(
    "NVIDIA_INVOKE_URL",
    "https://integrate.api.nvidia.com/v1/chat/completions",
).strip()

ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]

app = FastAPI(
    title="ScamShield 360 AI API",
    description="Optional LLM explanations for local rule-based scan results. No keys in the browser.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class ExplainRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)
    localScore: int | None = Field(default=None, ge=0, le=100)
    riskLevel: str | None = None
    indicators: list[str] = Field(default_factory=list)


class ExplainResponse(BaseModel):
    usedAI: bool
    explanation: str | None = None
    model: str | None = None
    error: str | None = None


SYSTEM_PROMPT = """You are a cyber-safety assistant for users in India (ScamShield 360).
Given a suspicious message and optional local rule-based risk signals, explain briefly:
1) Why it may be risky (or why signals are weak).
2) What the user should do next (safe steps only).
Rules:
- Be concise (max ~180 words).
- Do not claim 100% certainty or official certification.
- Never ask the user for OTP, PIN, password, or full card numbers.
- Prefer official channels: helpline 1930, https://cybercrime.gov.in/
- If the message looks benign, say so calmly and still advise independent verification when unsure.
"""


def _build_user_content(body: ExplainRequest) -> str:
    parts = []
    if body.localScore is not None:
        parts.append(f"Local risk score: {body.localScore}/100")
    if body.riskLevel:
        parts.append(f"Local risk level: {body.riskLevel}")
    if body.indicators:
        parts.append("Local indicators: " + ", ".join(body.indicators[:20]))
    parts.append("Message:\n" + body.message.strip())
    return "\n".join(parts)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "aiConfigured": bool(NVIDIA_API_KEY),
        "model": NVIDIA_MODEL if NVIDIA_API_KEY else None,
    }


@app.post("/api/ai/explain", response_model=ExplainResponse)
async def explain(body: ExplainRequest) -> ExplainResponse:
    if not NVIDIA_API_KEY:
        return ExplainResponse(
            usedAI=False,
            explanation=None,
            model=None,
            error="AI not configured (NVIDIA_API_KEY missing on server).",
        )

    payload = {
        "model": NVIDIA_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_content(body)},
        ],
        "temperature": 0.3,
        "max_tokens": 512,
        "stream": False,
    }
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(NVIDIA_INVOKE_URL, headers=headers, json=payload)
        if r.status_code >= 400:
            return ExplainResponse(
                usedAI=False,
                explanation=None,
                model=NVIDIA_MODEL,
                error=f"NVIDIA API error (HTTP {r.status_code}).",
            )
        data = r.json()
        content = (
            data.get("choices", [{}])[0]
            .get("message", {})
            .get("content")
        )
        if not content:
            return ExplainResponse(
                usedAI=False,
                explanation=None,
                model=NVIDIA_MODEL,
                error="Empty model response.",
            )
        return ExplainResponse(
            usedAI=True,
            explanation=str(content).strip(),
            model=NVIDIA_MODEL,
            error=None,
        )
    except httpx.TimeoutException:
        return ExplainResponse(
            usedAI=False,
            explanation=None,
            model=NVIDIA_MODEL,
            error="NVIDIA API timeout.",
        )
    except Exception:
        return ExplainResponse(
            usedAI=False,
            explanation=None,
            model=NVIDIA_MODEL,
            error="Failed to reach AI provider.",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
