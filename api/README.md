# ScamShield 360 — optional AI API

Explains local scan results using NVIDIA Integrate chat API.

## Security

- Put your real key **only** in `.env` (this folder).
- Never commit `.env`. Never paste keys into GitHub, chat, or frontend `VITE_*` vars.
- If a key was ever pasted in public chat or a repo, **revoke it** on [build.nvidia.com](https://build.nvidia.com) and create a new one.

## Setup

```bash
cd api
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:

```
NVIDIA_API_KEY=paste_new_key_here
NVIDIA_MODEL=nvidia/nemotron-3-nano-30b-a3b
```

Use a **text** model id from the NVIDIA catalog (not an image-only demo unless you need screenshots).

## Run

```bash
uvicorn main:app --reload --port 8000
```

- Health: http://127.0.0.1:8000/health  
- Explain: `POST /api/ai/explain`

## Frontend

In project root `.env`:

```
VITE_AI_API_URL=http://127.0.0.1:8000
```

Then `npm run dev`. Message Scanner will request an explanation only when this URL is set.
