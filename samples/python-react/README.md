# python-react sample

Minimal FastAPI + React (Vite) sample for the Python / JS track of the claude-code-lab guide.

## Requirements

- Python 3.11+
- Node 20+ and pnpm (or npm)

Check you have both:

```bash
python3 --version
node --version
```

## Run

Two terminals.

**Backend:**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Serves http://localhost:8000.

**Frontend:**

```bash
cd frontend
pnpm install
pnpm dev
```

Serves http://localhost:5173 — proxies `/api/*` to the backend.

## Test it

```bash
curl http://localhost:8000/api/items
# [{"id":1,"name":"Onboarding checklist"}, ...]
```

Open http://localhost:5173 in your browser — you should see the list and an input to add items.

## Layout

```
.
├── backend/
│   ├── main.py                # FastAPI app: /api/items (GET, POST), /api/items/{id} (GET)
│   └── requirements.txt       # fastapi, uvicorn, pydantic
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # List + create form
│   │   └── main.tsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts         # Proxies /api to backend
│   └── tsconfig.json
├── CLAUDE.md                  # Per-project context for Claude Code
└── .claudeignore              # node_modules, .venv, __pycache__, dist
```

## Guide chapters that use this sample

- [Chapter 2 — Your first task](../../content/en/first-task.mdx)
- [Chapter 3 — Teach Claude your project](../../content/en/teach-claude-your-project.mdx)
