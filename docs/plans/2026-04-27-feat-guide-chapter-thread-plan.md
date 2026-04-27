---
title: "feat: thread The Guide through chapters 4–9 (lab spine)"
type: plan
date: 2026-04-27
status: proposed
brainstorm: docs/brainstorms/2026-04-27-power-up-the-samples-brainstorm.md
parent: docs/plans/2026-04-27-feat-power-up-the-samples-plan.md
confidence: low
---

# feat: thread The Guide through chapters 4–9 (lab spine)

## Status

**Proposed — blocked.** The 2026-04-24 lab improvements plan currently bans broad chapter rewrites. This stub exists so the brainstormed exercises aren't lost. Pick this up after the lab-improvements plan unblocks chapter additions, or after a deliberate decision to lift that constraint for The Guide thread.

## Why this exists

The brainstorm and the parent plan defined The Guide as a sample that **threads through every chapter** of the lab — turning what was a bone-stock CRUD demo into a real narrative spine. Phase 1–4 of the parent plan rebuilt the samples and updated only the chapters that already referenced them (`first-task`, `teach-claude-your-project`). Chapters 4–9 still use whatever exercises they had before.

This plan captures the **shape** of the chapter thread so it's ready to execute when the chapter-rewrite ban lifts.

## Proposed exercises (per-chapter)

| Chapter | What participants do to The Guide |
|---|---|
| `voice-and-interaction` | Practice prompting on real small Guide tasks: contributor avatars, refactor entry storage, tag chips. Multiple short loops. The sample's `CLAUDE.md` already teaches the domain — so the prompts can be brief. |
| `iteration-and-control` | Plan a multi-step feature — full-text search + tag filtering on the backend (move it off the client). Use `/plan`, `/checkpoint`, `/rollback`. Add SQLite persistence as part of the same arc — the migration moment becomes its own teaching beat. |
| `behind-the-scenes` | Use a subagent to *generate* Guide entries from a topic. Example: `Task("research and write five Mostly Harmless entries about TypeScript runtime errors")`. Watch the agent loop, discuss what it actually did. |
| `ecosystem` | Wire MCP — install a web-fetch MCP (or use chrome-devtools-mcp already installed) and ingest a real Wikipedia article into the Guide. Then build a `/guide-add <url>` slash command as the participant's first plugin. |
| `compound-engineering` | Document a learning that came up during Guide work into `docs/solutions/`. Add a hook (pre-commit or pre-tool-use) that auto-stamps each entry with contributor + timestamp on insert. |
| `next-steps` | Take The Guide home — deploy it (Vercel for the React frontend, any host for FastAPI), add real auth, build a CS-only edition, share with friends. Dropping the in-memory store for SQLite or Postgres is a natural exit beat. |

## Constraints inherited from the parent plan

- Both EN and CS chapter MDX must be updated in lockstep.
- Voice rules from `docs/cc-lab-design-system.md`.
- Visual artifacts must use the established capture pipelines (`freeze`, `vhs`, Playwright, `image-gen` skill).
- The samples already ship with the surface area to support every exercise above. **No further sample rebuild is required for any of these chapters.** Chapter additions are pure MDX + visuals work.

## Open questions

1. **Web-fetch MCP for the `ecosystem` exercise** — Decision deferred from the parent plan. Pick: (a) install a generic web-fetch MCP into `enabledPlugins`, (b) use `chrome-devtools-mcp` (already installed) for the fetch step, or (c) a participant-added backend `POST /api/entries/from-url` endpoint using Python `urllib`. The third option keeps the brainstorm's "no setup friction" promise; the first two are more direct to "MCP" as a teaching point.
2. **SQLite migration** — does the `iteration-and-control` chapter teach the migration as a multi-step plan (`/plan` exercise), or as a single prompt? The plan-driven version is more in keeping with the chapter's theme.
3. **Subagent generation** — does the `behind-the-scenes` chapter use the project's own agents (`docs/skills/`-defined ones) or general-purpose Task spawns? The first is more dogfooding-correct; the second is more universal.

## Acceptance criteria (when this plan is later picked up)

- All six chapters above gain a "Practice: continue your sample" section that uses The Guide.
- Both EN and CS chapter MDX updated.
- New visual artifacts (per chapter) follow the existing capture pipelines.
- `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` green at the cc-lab repo root.
- The narrative arc holds: a participant who follows the lab in order sees their copy of The Guide grow, chapter by chapter, into a real personal notes app.

## Out of scope

- Any further changes to the seed samples (already finalized in the parent plan).
- Renaming or restructuring existing chapters.
- Any new chapter (the lab keeps its current 9-chapter spine).
- Translation of seeded entries between EN and CS — they stay locale-appropriate per Decision D6 in the brainstorm.
