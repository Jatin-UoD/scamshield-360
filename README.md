# ScamShield 360

**Detect. Understand. Respond.**

University cybersecurity exhibition prototype for **DU Cyber Satarkata 1.0**.

ScamShield 360 combines local rule-based scam message & URL analysis (**ScamShield**) with step-by-step incident response guidance (**CyberSahayak**).

## Features

- **Dashboard** — scan stats, recent activity, tip of the day
- **Message Scanner** — local pattern-based risk scoring with explainable indicators
- **URL Analyzer** — structural checks only (never opens URLs)
- **Analysis Report** — printable detailed report
- **CyberSahayak** — curated guidance for 6 common fraud situations + Indian helplines (1930, cybercrime.gov.in)
- **Incident Center** — localStorage-backed incident records & checklist
- **Cyber Safety Learning** — tips + interactive quiz

## Important limitations (demo)

- Detection is **local rule-based** (keywords / patterns). It is **not** advanced AI.
- No live threat-intelligence database is consulted.
- Absence of indicators does **not** prove safety.
- localStorage is browser/device-specific — not secure cloud storage.
- Never paste real OTPs, passwords or full card numbers.

## Run locally

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
6. Deploy. No environment variables required for the current API-free build.

## Future API integration

- **AI provider**: implement server endpoint (e.g. `/api/ai/analyse-message`). Keep API keys in **server** env vars only. Wire `src/services/aiProvider.ts`.
- **Threat intel**: implement server endpoint for URL reputation. Wire `src/services/threatIntelProvider.ts`.
- Frontend already falls back to local analysis when providers are not configured.

## Stack

- React 18 + TypeScript + Vite
- No required external APIs or paid services for the demo

## License

Educational / exhibition use.
