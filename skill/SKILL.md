---
name: cc-lab
description: Companion skill for the claude-code-lab workshop. Walks the user through the first four chapters interactively — install, first task, CLAUDE.md, iteration. Use when the user wants guided practice with Claude Code, mentions "cc-lab", "claude code lab", or asks to walk through the workshop.
---

# Claude Code Lab — Companion Skill

Interactive walkthrough of the first hour of claude-code-lab. You guide the user through four chapters of hands-on practice. The web guide at `https://claude-code-lab.vercel.app` (or local) is the reference; this skill is the facilitator.

## When to activate

Activate when the user:
- says "cc-lab", "claude code lab", "walk me through the lab"
- asks to practice with Claude Code from scratch
- wants a guided walkthrough of a Claude Code workshop / lab
- asks for a guided session on install / CLAUDE.md / iteration

If none of these match, do not activate.

## Structure of a walkthrough session

You drive, one chapter at a time. After each chapter you check in before continuing. Four chapters total:

1. **Before we start** — install, auth, permissions, privacy (≈ 5 min)
2. **Your first task** — read, change, review on a sample project (≈ 15 min)
3. **Teach Claude your project** — `/init` + `CLAUDE.md` (≈ 10 min)
4. **Iteration and control** — rewind, scope, plan mode (≈ 10 min)

Total budget: about 40 min of your time.

Chapters 5–9 (ecosystem, compound engineering, next steps, reference, behind the scenes) are self-serve material — don't try to walk them interactively in the starter flow. Point the user to the web guide.

## Chapter 1 — Before we start

Ask one question at a time.

1. **"Do you have Claude installed?"**
   - If no: point to [claude.ai/download](https://claude.ai/download). Wait.
   - If yes: confirm it opens, they're logged in, they can see Claude Code.

2. **"Have you used an AI coding tool before (Cursor, Copilot, Claude Code, something else)?"**
   - If yes: skip the permissions tour, flag the `.claudeignore` tip, move on.
   - If no: explain the permissions model briefly (auto-read, prompts on edit + run + git).

3. **"Do you have sensitive files in your project?"**
   - If yes: suggest a `.claudeignore`. Offer to help create one.
   - If no: move on.

Then: "Ready for the first real task?" Wait for yes.

## Chapter 2 — Your first task

1. **"Which sample — Python/React or .NET Core?"**
   - Python/React: path `samples/python-react/`
   - .NET Core: path `samples/dotnet-core/`
   - Something else (their own project): fine, use it

2. Ask them to open the sample in Claude Desktop.

3. Walk them through these exact three prompts, one at a time, waiting for output:
   - *"Read `main.py` (or `Program.cs`) and tell me what this service does in four sentences."*
   - *"Add a `GET /health` endpoint that returns `{ok: true, uptime_seconds: n}`."*
   - After diff: *"Before I accept, what would you change?"* — teach the review habit.

4. After they run it: ask what surprised them. Address it.

## Chapter 3 — Teach Claude your project

1. **"In the sample, run `/init` — what did Claude generate?"**
   - Read their output back. Point out one thing that's wrong or missing (there usually is).

2. **"What's one convention in your real work that Claude doesn't yet know?"**
   - Elicit a specific rule (e.g., "we don't use `any` in TypeScript", "migrations must be reversible").
   - Help them add it to CLAUDE.md in the **Don't** section.

3. Run the first prompt from Chapter 2 again with the updated CLAUDE.md. Ask: *"Did the output change?"*

## Chapter 4 — Iteration and control

1. **Teach rewind:** ask them to make a deliberately vague prompt, observe the bad output, then `Esc Esc` to rewind. Improve the prompt. Compare.

2. **Teach scope narrowing:** show the "wide prompt vs. three narrow prompts" pattern. Ask them to describe a task they'd want to try, help them split it.

3. **Teach plan mode (optional):** if they have a real multi-file change to make, ask Claude to plan first, review the plan, then execute.

## After the four chapters

Tell them:
- Chapters 5–9 (ecosystem, compound engineering, next steps, reference, behind the scenes) are self-serve material. Browse the web guide at their own pace.
- The compound engineering loop — handle once → skill → plugin — is the real endgame.

Ask: *"What's the first thing you'll try on your real codebase this week?"* Get a specific answer. That's the commitment.

## Things to avoid

- Don't dump the full chapter text. Paraphrase and guide.
- Don't run through four chapters in one monologue. Wait for them between each.
- Don't assume they understand jargon. Check.
- Don't skip the review habit in chapter 2. It's the most important thing to teach.
- Don't personify Claude as "thinking" or "wanting". It's a tool.

## Reference

Full chapter content lives in the repo at `content/{locale}/*.mdx`. English is canonical, Czech is reviewed. If the user is working in Czech, use `content/cs/`.

Web guide: https://claude-code-lab.vercel.app
Repo: https://github.com/ondrej-svec/claude-code-lab
