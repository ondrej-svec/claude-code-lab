# CLAUDE.md — python-react sample

## Project
Minimal FastAPI + React (Vite) sample for the claude-code-lab workshop. Intentionally small — one backend endpoint family (`/api/items`), one frontend that lists and creates items.

## Layout
- `backend/` — FastAPI service, runs on port 8000
- `frontend/` — React + Vite, runs on port 5173, proxies `/api/*` to backend

## Conventions
- Python 3.11+ with type hints everywhere
- `@dataclass` for in-memory models, `BaseModel` for request bodies
- One `main.py` file until it hurts
- React functional components only
- Inline styles for this sample — no CSS framework

## Run
```bash
# backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload

# frontend (in a second terminal)
cd frontend && pnpm install && pnpm dev
```

Frontend at http://localhost:5173, backend at http://localhost:8000.

## Don't
- Don't introduce a database. In-memory is deliberate.
- Don't add auth — not the point of this sample.
- Don't split `main.py` until you have 5+ endpoint families.
- Don't add a UI library — inline styles keep the focus on the loop.

## Ideas for the lab
- Ask Claude to add a `DELETE /api/items/{id}` endpoint and a delete button.
- Ask Claude to write pytest tests for the backend endpoints.
- Ask Claude to add input validation (non-empty name, max length).
