# AGENTS.md Standard

This document defines how Claude Code Lab uses [`AGENTS.md`](../AGENTS.md). The goal is the smallest durable operating surface that helps an agent do correct work and helps the next pair of hands continue without guesswork.

## Why This Exists

The lab teaches harness engineering by being a worked example. The repo has to model what it teaches:

- repo-native context before high-autonomy generation
- progressive disclosure instead of one giant prompt blob
- executable verification as the trust boundary
- repeated cleanup and doc gardening instead of letting drift compound

This aligns with current OpenAI harness-engineering guidance:

- keep `AGENTS.md` short and use it as a table of contents
- treat repository-local docs as the system of record
- encode review, test, and maintenance behavior into the repo instead of relying on chat memory

## What Root `AGENTS.md` Must Do

The root file should stay short enough to be read at the start of every task. It must do five jobs:

1. orient the agent to the repo mission and trust boundaries
2. tell the agent what to read before editing
3. route different task types to the right deeper docs
4. state the verification boundary and completion standard
5. point outward to the real system of record instead of duplicating it

## What Root `AGENTS.md` Must Not Do

Do not turn the root file into:

- a copy of the design system doc, the README, or chapter content
- a place for in-flight task state
- a stale checklist graveyard no one maintains
- a mixed contributor / participant / private dump

If more detail is needed, add or improve a deeper doc and link to it.

## Progressive Disclosure

1. root `AGENTS.md` for repo-wide orientation
2. focused docs in `docs/` for durable rules ([`cc-lab-design-system.md`](cc-lab-design-system.md), [`agent-ui-testing.md`](agent-ui-testing.md), [`visuals.md`](visuals.md))
3. plans in `docs/plans/` for work in flight
4. directory-local READMEs for surfaces with persistent local rules

If a directory keeps needing special instructions, prefer a doc there rather than growing the root file.

## Standard Shape

The preferred shape of the root file in this repo:

1. mission
2. read first
3. task routing
4. repo map
5. language and trust boundaries
6. framework guidance
7. build and test
8. verification boundary
9. done criteria
10. first-time setup
11. maintenance triggers

That shape is intentionally operational. It should help an agent decide the next safe move quickly.

## Maintenance Triggers

Update `AGENTS.md` or a linked doc when any of these happen:

- top-level entry points change (new scripts, renamed dirs, new plugin surfaces)
- trust boundaries shift (anything affecting public-safe / not public-safe)
- the Next.js version changes materially
- contributors repeatedly make the same mistake
- a linked doc stops being the true source of truth

## Review Checklist

When reviewing `AGENTS.md`, check:

- Is it still short enough to read quickly?
- Does it route to the actual sources of truth?
- Do its markdown links stay repo-relative so they work on GitHub and in local clones?
- Does it expose real verification expectations?
- Does it reflect current trust boundaries?
- Does it help a new human or agent find the next safe move?
- Is any critical rule still living only in prompts or chat history?

## Scoring Appendix

The 12 binary checks below are the same rubric `/cc-lab-diagnose project` applies. Each check emits `PASS` or `FAIL — <one-line reason>`. No score, no grade, no percentage.

- **`agents_md_exists`** — a file named `AGENTS.md` exists at the repo root.
- **`map_not_dump`** — the root file reads as orientation and routing, not a manual. Heuristic: under ~180 lines; routes to deeper docs rather than restating them; no design-system copy, no in-flight task state, no stale checklists.
- **`read_first_present`** — explicit "Read First" section telling an agent what to read before editing.
- **`task_routing_present`** — task types routed to the right deeper docs. At least three distinct task areas with at least one linked reference each.
- **`verification_boundary_stated`** — the file names what counts as the trust boundary (`pnpm test`, `pnpm test:e2e`, `pnpm build`, the layered UI workflow, content rendering, etc.).
- **`done_criteria_explicit`** — the file states what "done" means in operational terms, not vibes.
- **`next_safe_move_obvious`** — an agent stopping mid-task has an obvious way to leave the next safe move visible (via plans, prose, or done criteria).
- **`repo_map_matches_reality`** — if a repo map exists, it lists every directory that's actually load-bearing. Missing `content/`, `plugins/cc-lab/`, or similar is FAIL.
- **`links_repo_relative`** — markdown links use repo-relative paths so they work on GitHub and in local clones. Absolute URLs to internal docs are FAIL.
- **`no_chat_only_rules`** — no critical rule lives only in chat or prompt memory. If a session keeps correcting the same thing and it isn't written in the repo, FAIL.
- **`public_private_boundaries_current`** — public-safe boundaries are described and current. The lab is fully public-safe, but the rule against committing keys, telemetry tokens, or private data still applies.
- **`maintenance_triggers_named`** — the file names the events that should trigger an update.

### Known ways to game this (don't)

- **Keeping `AGENTS.md` short by hiding detail in a "linked" doc that doesn't actually exist.** Routing to a broken link is worse than inlining the content. `map_not_dump` PASS + `links_repo_relative` FAIL is a red flag pattern.
- **Claiming `verification_boundary_stated` PASS because the file mentions "test".** The check is looking for a named boundary (Playwright e2e, vitest unit, layered UI workflow), not the string "test".
- **Splitting one overgrown `AGENTS.md` into four overgrown subtree AGENTS.md files.** The shape rule applies to nested files too. A 300-line subtree map is a manual, not a map.
- **Treating FAILs as noise and reviewing them in bulk at the end.** FAILs that cluster on one check are almost always a real pattern the repo needs to fix.

## External References

- OpenAI, "Harness engineering: leveraging Codex in an agent-first world": https://openai.com/index/harness-engineering/
- OpenAI Codex best practices: https://developers.openai.com/codex/learn/best-practices
- Next.js AI Coding Agents guide: https://nextjs.org/docs/app/guides/ai-agents
