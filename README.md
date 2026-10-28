# ScamShield 360

**Detect. Understand. Respond.**

University cybersecurity exhibition prototype for **DU Cyber Satarkata 1.0**.

ScamShield 360 combines local rule-based scam message & URL analysis (**ScamShield**) with step-by-step incident response guidance (**CyberSahayak**).

## Features

- **Dashboard** — hero, feature cards, demo alerts, quick actions
- **Message Scanner** — local pattern-based risk scoring with explainable indicators
- **URL Analyzer** — structural checks only (never opens URLs)
- **Analysis Report** — printable detailed report
- **CyberSahayak** — curated guidance for 6 common fraud situations + Indian helplines (1930, cybercrime.gov.in)
- **Incident Center** — localStorage-backed incident records & checklist
- **Cyber Safety Learning** — tips + interactive quiz
- **Optional AI explanation** — NVIDIA NIM via a small FastAPI server (not required)

## Important limitations (demo)

- Detection is **local rule-based** (keywords / patterns). It is **not** advanced AI by default.
- No live threat-intelligence database is consulted.
- Absence of indicators does **not** prove safety.
- localStorage is browser/device-specific — not secure cloud storage.
- Never paste real OTPs, passwords or full card numbers.

## Run locally (no API key needed)

```bash
cd scamshield-360
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import the repo in [Vercel](https://vercel.com).
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy. No environment variables required for the API-free build.

## Optional AI explanations (NVIDIA)

Local detection **always works** without any API key.

1. Get a key from [build.nvidia.com](https://build.nvidia.com) — **never commit the key**.
2. Backend:

```bash
cd api
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env → set NVIDIA_API_KEY=...
uvicorn main:app --reload --port 8000
```

3. Frontend (project root):

```bash
cp .env.example .env
# Set only: VITE_AI_API_URL=http://127.0.0.1:8000
npm run dev
```

**Security**

- Real keys live only in `api/.env` (gitignored).
- Frontend may store **backend URL** only (`VITE_AI_API_URL`) — never `NVIDIA_API_KEY`.
- Do **not** put the NVIDIA key in Vercel as `VITE_*` (that exposes it in the browser bundle).
- If the key or server is missing, Message Scanner still shows local scores.

Default model id in `api/.env.example`: `nvidia/nemotron-3-nano-30b-a3b` (confirm exact id on build.nvidia.com).

## Future: threat intelligence

Wire `src/services/threatIntelProvider.ts` to a server-side URL reputation API (e.g. Google Safe Browsing). Keep those keys server-side too.

## Stack

- React 18 + TypeScript + Vite (frontend)
- Optional: FastAPI + NVIDIA Integrate API (explanations only)

## License

Educational / exhibition use.
