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
6. Deploy. **No API keys or environment variables required.**

## Future (optional)

- Server-side AI or URL threat-intel can be added later via provider stubs in `src/services/`.
- Keep any API keys on the **server only**, never in the frontend.

## Stack

- React 18 + TypeScript + Vite
- No required external APIs for the demo

## License

Educational / exhibition use.
