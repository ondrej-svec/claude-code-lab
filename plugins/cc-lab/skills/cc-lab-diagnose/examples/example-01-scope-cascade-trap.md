# Example 01 — Scope cascade trap (regression anchor for v0.1.1)

This is the calibration anchor for the bug fixed in v0.1.1: the v0
rubric only read project scope, so it false-positived "missing" skills
that the user actually had via installed plugins (`heart-of-gold-toolkit`).

## Setup

- Repo diagnosed: `quellis` (Bun + Turbo monorepo, Expo + Next.js)
- User scope: `heart-of-gold-toolkit` plugins installed user-wide,
  including `marvin` (provides `/compound`, `/work`, `/quick-review`)
  and `deep-thought` (provides `/plan`, `/review`, `/brainstorm`)
- Repo state: no project-local `CLAUDE.md`, no `.claude/`, but
  `todos/` directory with 29 entries following a consistent 6-section
  template, mostly produced by `deep-thought:review` invocations

## What v0 returned (the bug)

Three observations. The first (no project-local CLAUDE.md) was sound.
The second was a false positive that violates the cascade rule:

> **2. The todo template is a skill waiting to be extracted**
>
> What I see. Every file in `todos/` follows the same six-section
> shape … `.claude/skills/` does not exist — so each todo gets
> composed from memory, not from a contract.
>
> **Try this.** Pin the shape as a skill so the next
> review-finding-to-todo conversion auto-fires.
> [scaffold for `new-todo-from-review` skill]

The recommendation was to create a skill that already exists in user
scope: `deep-thought:review` writes findings, and `marvin:work` /
`marvin:compound` carry the todo-creation shape. The diagnostic was
ignorant of all of them because v0 never read `~/.claude/`.

## What v0.1.1 must produce on the same repo

The "todo template is a skill waiting to be extracted" observation
should be **dropped** by the scope-cascade rule, because:

- `~/.claude/plugins/cache/heart-of-gold-toolkit/marvin/<sha>/skills/`
  contains `compound`, `work`, `quick-review`, `redteam`, etc.
- The project's todos are produced by these skills already;
  re-defining a project-local skill is not the missing piece.

A correct v0.1.1 output would either:

1. Drop the observation entirely (preferred — the gap doesn't exist),
   OR
2. Reframe as "you have `marvin:work` + `deep-thought:review`
   installed user-wide; the new project `CLAUDE.md` should reference
   them by name so the agent knows the project relies on them."
   (Only when this gap genuinely matters for project onboarding.)

## How the cascade rule maps onto categories

| Rubric category | What got false-positived | Why the cascade rule catches it |
|---|---|---|
| Cat 2 (skill design) | "no project-local skills, recommend creating one" | User scope has 30+ plugin skills — the union is what the agent sees |
| Cat 4 (agent and command) | (would have triggered "no `/review`, no `/compound`") | `deep-thought:review` and `marvin:compound` are user-scope commands |
| Cat 6 (knowledge capture) | (would have triggered "no `docs/solutions/`") | `~/.claude/docs/solutions/` may exist; plugin compound skill captures elsewhere |

## Self-test bar v0.1.1 must clear

Re-running `/cc-lab-diagnose` against `quellis` (with no project
CLAUDE.md and no `.claude/`, plus `heart-of-gold-toolkit` installed
user-wide) must produce:

- **Zero observations** that recommend creating a skill, command, or
  workflow that already exists in user scope
- **At least one observation** that survives — the missing project
  CLAUDE.md is real (Cat 1, project-local concern, doesn't cascade)
- "I can't tell" for categories with no project signal — better than
  inventing observations to hit a count

If a future rubric edit makes this example produce the v0 false
positive again, the edit broke the cascade rule and needs revision.

## How to update this example

When a future run on `quellis` (or any repo with HoG installed)
produces meaningfully different output that's *correct*, update this
file with the new output as the new regression anchor. Don't delete
the v0 bug — keep it as the cautionary tale.

PII status: minimal. `quellis` is a public-facing project name in
Ondrej's portfolio per `project_quellis.md` memory. No client names,
no real account names, no emails. Safe to commit as-is.
