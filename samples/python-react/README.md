# The Guide — python-react sample

A small bilingual knowledge-base app, styled as the *Hitchhiker's Guide to the Galaxy*. FastAPI backend, React + Vite frontend, in-memory store. Six seeded entries (three EN, three CS). No API keys, no telemetry, no external services.

This is the python-react variant of the cc-lab samples. The .NET twin lives in `../dotnet-core/`.

## Requirements

- Python 3.11+
- Node 20+ and pnpm (or npm)

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
pnpm install --ignore-workspace   # or: npm install
pnpm dev                          # or: npm run dev
```

Serves http://localhost:5173 — proxies `/api/*` to the backend.

> **Why `--ignore-workspace`?** This sample sits inside the cc-lab monorepo. The flag prevents pnpm from resolving against the parent workspace. If you copy the sample to its own directory, you can drop it.

## Test it

```bash
curl http://localhost:8000/api/entries
# Six seeded entries (3 EN, 3 CS).

curl http://localhost:8000/api/entries?locale=en
# Just the EN entries.

curl http://localhost:8000/api/entries/2
# The Babel Fish.
```

Open http://localhost:5173 — you'll see the Guide. Try the Babel Fish (🐟) toggle in the header to switch between EN and CS entries. Search filters by title and body. Tag chips filter by tag. The form at the bottom adds an entry to the in-memory store (lost on backend restart).

## API shape

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/entries` | Optional `?locale=en\|cs` filter |
| `GET` | `/api/entries/{id}` | 404 if missing |
| `POST` | `/api/entries` | Body: `{title, body, badge, contributor, locale, tags}` |

`PUT` and `DELETE` are not shipped — adding `DELETE` is a chapter exercise. See `CLAUDE.md`.

## Layout

```
.
├── backend/
│   ├── main.py                     # FastAPI app: Entry domain + 3 endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 # Wires it all together
│   │   ├── api.ts                  # Three fetch wrappers
│   │   ├── types.ts                # Entry, EntryInput, Badge, Locale
│   │   ├── styles.css              # Rosé Pine Dawn / Moon CSS variables
│   │   ├── main.tsx
│   │   └── components/
│   │       ├── Badge.tsx           # Mostly Harmless / Dangerous chip
│   │       ├── EntryCard.tsx       # Single entry view
│   │       ├── EntryList.tsx
│   │       ├── LocaleToggle.tsx    # Babel Fish 🐟
│   │       ├── NewEntryForm.tsx
│   │       ├── Search.tsx
│   │       └── TagFilter.tsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts              # Proxies /api to backend
│   └── tsconfig.json
├── CLAUDE.md                       # Per-project context for Claude Code
├── .claudeignore                   # node_modules, .venv, __pycache__, dist
└── README.md
```

## Guide chapters that use this sample

- [Chapter 2 — Your first task](../../content/en/first-task.mdx) — add `DELETE /api/entries/{id}` and a delete button.
- [Chapter 3 — Teach Claude your project](../../content/en/teach-claude-your-project.mdx) — refine `CLAUDE.md` so Claude understands the Entry domain.
