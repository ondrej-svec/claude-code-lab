# CLAUDE.md — The Guide (python-react sample)

## Project

The Guide is a small bilingual knowledge-base app for the cc-lab workshop, styled as the in-universe *Hitchhiker's Guide to the Galaxy*. FastAPI backend, React + Vite frontend, in-memory store, no API keys, no external services.

The sample is **deliberately partial**: chapter exercises grow it. Do not add features outside the requested change.

## Layout

- `backend/main.py` — FastAPI app, Entry domain, in-memory store. Single file.
- `frontend/src/` — React 19 + TypeScript. Components in `components/`. Plain CSS variables, no Tailwind.

## Domain

Every record is an `Entry`:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | int | Server-assigned. |
| `title` | string | Required. Personality OK; gimmicks not. |
| `body` | string | Plain text in Phase 1. Markdown rendering arrives in a later chapter. |
| `badge` | `mostly-harmless` \| `mostly-dangerous` \| `unknown` | Default `unknown` on user-created entries. |
| `contributor` | string | Defaults to "Anonymous" / "Anonymní". |
| `created_at` | ISO 8601 string | Server-assigned. |
| `locale` | `en` \| `cs` | Server respects the value sent by the client. |
| `tags` | string[] | Free-form. Used by the tag-chip filter. |

Endpoints currently shipped:

- `GET /api/entries[?locale=en|cs]`
- `GET /api/entries/{id}`
- `POST /api/entries`

`PUT` and `DELETE` are **deliberately absent** — chapter 2 of the lab adds `DELETE`. Don't add them on a request that doesn't ask for them.

## Conventions

- **Python**: 3.11+, type hints everywhere. `@dataclass` for storage models, Pydantic `BaseModel` for request bodies. One `main.py` file until it really hurts.
- **TypeScript**: strict mode. Functional components only. `useState` / `useEffect` / `useMemo` — no state-management library. Plain `fetch`, no axios.
- **CSS**: pure CSS variables under `:root` and `.dark`, mirroring the cc-lab site's Rosé Pine Dawn / Moon palette. No CSS framework. No utility class library.
- **Fonts**: Manrope (body), Space Grotesk (display), JetBrains Mono (code), all via `@fontsource/*`. No `<link>` to Google Fonts at runtime.
- **Bilingual UI**: every user-facing string lives in a small `Record<Locale, …>` map inside the component that uses it. Don't introduce an i18n library.

## Voice rules (apply to in-app copy and any new strings)

These mirror `docs/cc-lab-design-system.md`:

- Quietly confident, peer-to-peer, no bullshit.
- Forbidden: "let's", "leverage", "exciting", "amazing", "delve", "dive deep".
- One line of copy per surface. UI chrome cannot have personality; entry titles can.
- No decorative emoji. The only emoji currently in use is the Babel Fish (🐟) on the locale toggle, where it is meaningful, not decorative.

## Don't

- Don't introduce a database. In-memory is deliberate.
- Don't add auth. Not the point of this sample.
- Don't add an AI call. The seed must run with **zero API keys**.
- Don't add a CSS framework or UI library. Plain CSS + the Rosé Pine variables in `styles.css`.
- Don't split `main.py` until it has 5+ endpoint families.
- Don't add `PUT` or `DELETE` unprompted — they're chapter exercises.

## Ideas for the lab

(These are exercises participants run during cc-lab chapters. Don't run them unprompted.)

- **Chapter 2 — first task**: add `DELETE /api/entries/{id}` and a delete button on each card.
- **Chapter 3 — teach Claude**: extend this CLAUDE.md so Claude knows the badge rules and voice constraints.
- Add field validation: empty title, max body length, allowed tags.
- Render entry bodies as Markdown.
- Add a `PATCH` endpoint for editing.
- Persist entries to SQLite.
