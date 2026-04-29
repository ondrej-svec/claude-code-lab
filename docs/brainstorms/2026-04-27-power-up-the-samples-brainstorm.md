---
title: "Power up the samples — The Guide"
type: brainstorm
date: 2026-04-27
participants: [ondrej, claude]
related:
  - docs/plans/2026-04-24-lab-improvements-plan.md
  - docs/cc-lab-design-system.md
  - samples/python-react/
  - samples/dotnet-core/
---

# Power up the samples — The Guide

## Problem Statement

The current samples (`samples/python-react/`, `samples/dotnet-core/`) are bone-stock CRUD: an in-memory list of strings, three hardcoded items ("Onboarding checklist", "Weekly review", "Ship the thing"), inline-styled white-page frontend on the React side, no frontend at all on the .NET side. They show up in only two chapters of the lab (`first-task`, `teach-claude-your-project`) and have zero thematic connection to the cc-lab universe.

Reframed: the samples are pulling double duty *badly*. They need to do **both** of these, and right now they do neither:

1. **Wow on minute one.** A participant runs the sample for the first time and thinks "oh, this is *cool*, I want to make this mine."
2. **Sustain the whole lab.** Every chapter (planning, prompting, subagents, ecosystem, compound) has something natural and meaningful to do *on this sample*. Not just chapter 2 and 3.

The audience is mixed — devs and knowledge-worker-adjacent — so the visible surface must be friendly, but the code surface must have depth. And it should feel like part of the cc-lab universe, not a generic teaching dummy borrowed from a textbook.

## Context

- **Existing samples:** `samples/python-react/` (FastAPI + Vite + React, in-memory item list) and `samples/dotnet-core/` (ASP.NET Core minimal API, in-memory record). Both have a `CLAUDE.md` and a `.claudeignore`. Both are referenced from `content/en/first-task.mdx` and `content/en/teach-claude-your-project.mdx` only.
- **Design system constraints:** Rosé Pine Dawn / Moon palette across the whole project (`docs/cc-lab-design-system.md`). The lab is bilingual EN/CS. The voice is Heart-of-Gold / Hitchhiker's Guide flavored (`~/.claude/CLAUDE.md`).
- **Lab structure:** Nine chapters in `content/en/` — `before-we-start`, `first-task`, `teach-claude-your-project`, `voice-and-interaction`, `iteration-and-control`, `behind-the-scenes`, `ecosystem`, `compound-engineering`, `next-steps`, plus `library/` and `reference.mdx`.
- **Trust boundary:** Samples must run with no API keys, no telemetry, no external services. Public-safe.
- **Prior art:** No previous brainstorms on samples. The 2026-04-24 lab improvements plan does not cover sample redesign. The design system doc references a future `cc-lab-samples` repo name (line 433) — relevant if we later split samples to their own repo.

## Chosen Approach

**Replace both samples with "The Guide" — an electronic-Hitchhiker's-Guide-styled knowledge-base app.**

- **Concept:** A personal knowledge base styled as the actual *Hitchhiker's Guide to the Galaxy* device. Users add and browse short markdown entries about anything. Each entry has a title, body, contributor, timestamp, optional tags, and a "Mostly Harmless / Mostly Dangerous / Unknown" badge.
- **Useful for real:** A small, attractive personal notes app. Not a gag. Slightly funny by association, not by jokes.
- **Bilingual by birthright:** The Guide speaks all tongues. EN/CS seeded entries shipped from day one. The locale toggle is shown as a Babel Fish icon. (Folds the lab's bilingual nature into the sample itself.)
- **Theatrical first-run, calm daily-driver:** First boot plays a CRT-style power-on animation — scan lines, slight green tint, typed-out "DON'T PANIC", then the entries page reveals in Rosé Pine. After dismissing once, the app remembers and shows the calm modern view forever after. (Theatrical = motivation. Calm = usable.)
- **Same backend API on both stacks, different flavor of wow on each front:**
  - `samples/python-react/` — owns the visual frontend. The full theatrical CRT boot, calm reading view, contributor avatars, tag chips. This is where most chapters land.
  - `samples/dotnet-core/` — API-only, but `dotnet run` triggers an ANSI boot sequence in the terminal (typed-out lines, Rosé Pine colors, one entry rendered as a styled box with a "MOSTLY HARMLESS" badge in green). Each stack plays to its medium.
- **Persistence:** In-memory at seed (zero friction on minute one). SQLite is added by participants as a chapter exercise.
- **No AI in the seed app.** Zero API keys required to run. AI features are *added by participants* during the relevant chapters.

## Why This Approach

**What it optimizes for:**

- **First-run delight.** The CRT boot is a moment, and you only get to see it once. Designed to make a participant want to share it.
- **Lab coverage.** The Guide has enough surface (entries, tags, ratings, contributors, search, locales, hooks for badges, MCP for ingestion) that every chapter can land naturally. See the chapter map below.
- **Thematic coherence.** Folds the cc-lab voice into the sample without making it self-referential. Participants get the joke gradually — they don't have to.
- **Useful afterward.** A genuinely small personal notes app. Many participants will keep it open in a tab.
- **Friction-free start.** No API keys, no database, no auth, no setup beyond `pnpm dev` / `dotnet run`.

**What was rejected and why** — see "Key Design Decisions" below for full rationale on each fork.

## Subjective Contract

- **Target outcome:** A participant runs the sample for the first time, sees the boot animation, smiles, and wants to keep going. Reading an entry feels calm and pleasant. The terminal version on .NET feels equally crafted, not an afterthought. Both samples feel like part of the cc-lab universe.
- **Anti-goals:** Not a gag. Not a one-trick pony. Not a Hitchhiker's encyclopedia. Not novelty without utility. Not over-finished — every chapter must have meaningful work to do.
- **References:** The Heart of Gold voice in `~/.claude/CLAUDE.md`. Rosé Pine Dawn / Moon palette already in use in the cc-lab site. The "calm modern reading app" patterns of Reader, Are.na, or a well-designed personal wiki.
- **Anti-references:** GitHub README "TODO list" demos. Bootstrap admin templates. Anything that looks like a tutorial app from 2014. Heavy CSS frameworks (Tailwind admin kits, Material UI). Joke-of-the-day apps that wear thin in five minutes.
- **Tone / taste rules:**
  - Voice in copy: dry, never tedious, never sycophantic. One-line copy per surface, not paragraphs of personality.
  - Visual: gorgeous restraint. Generous typography. Calm palette. The retro CRT moment is *one cinematic beat*, then the calm view earns the rest of the time.
  - Code: small, readable, idiomatic. Both stacks should look like competent senior code, not framework demos.
- **Rejection criteria:**
  - If first-run minute-one demos to a non-dev and they say "huh, okay" instead of "wait, that's cool" — wrong.
  - If the sample after seed is so finished that a chapter has to invent contrived work — wrong.
  - If running it requires *anything* beyond `pnpm install && pnpm dev` (or `dotnet run`) — wrong.
  - If a participant has to read 200 lines to understand what the sample is — wrong.

## Preview And Proof Slice

- **Proof slice:** Build the python-react first-run experience end-to-end. CRT boot animation → reveal entries page → one entry with full styling (title, body, badge, contributor, tag chips). Both EN and CS seeded content visible. No backend changes from current shape (still `/api/entries` GET/POST/DELETE).
- **Required preview artifacts:**
  - HTML/CSS mockup or live preview of the calm reading view (post-boot state).
  - A short screen recording (or VHS cast) of the boot sequence on first run.
  - A still PNG of one rendered entry for the design system doc.
  - For .NET: a terminal screenshot (or freeze still) of `dotnet run` boot sequence.
- **Rollout rule:** Land the python-react proof slice first. Validate the visual feels right. Only then expand to the full feature set on python-react and start the .NET twin. Do not begin chapter rewrites until the React proof slice is reviewed.

## Key Design Decisions

### Q1: What is the sample's central concept? — RESOLVED

**Decision:** "The Guide" — a personal knowledge base styled as the Hitchhiker's electronic Guide.

**Rationale:** Folds the lab's bilingual nature in elegantly (the Guide speaks all tongues). The visual concept (retro electronic device → calm modern reader) has cinematic first-run potential. Has the most natural growth surface for chapters 4–9 (search → tags → MCP entries → subagent-summarized content → plugin to import from web → hooks for "Mostly Harmless" auto-tagging). Useful as an actual notes app, so participants might keep it.

**Alternatives considered:**
- *Babel Fish (translation memo app)* — also bilingual-native, possibly even funnier name, but narrower surface for lab chapters.
- *Pan Galactic Gargle Blaster cocktail codex* — high "show your friend" factor, low practical utility, multi-entity richness was attractive but not enough to overcome the "I would never use this" problem.
- *Restaurant at the End of the Universe (reservation board)* — maximum CRUD surface, but felt like a backend-tutorial demo; theme leaked through copy only, never *was* the concept.
- *Meta-app — a Claude Code companion / session log* — too self-referential, smelled like a brochure for the lab rather than a thing that stands on its own.
- *Workshop notebook (knowledge-work meta)* — useful in the moment but dead the day the lab ends. Failed the "would they keep it" test.
- *Boring SaaS-shaped CRUD with polish only* — failed the "wow" half of the goal.

### Q2: How do the two stacks relate? — RESOLVED

**Decision:** Same backend API shape on both stacks. Python-react owns the visual frontend wow. .NET owns the terminal-side wow (ANSI boot via Spectre.Console or equivalent).

**Rationale:** Each stack plays to its medium. The .NET track stays API-focused without forcing a Blazor or React frontend on every reader. Both stacks expose the same `/api/entries` shape, so chapter exercises that target the API work identically on either side. The terminal boot makes `dotnet run` feel handcrafted — closes the wow gap that pure API responses can't.

**Alternatives considered:**
- *Twin samples — same Guide, two stacks, both visual* — would force a Blazor or React frontend onto the .NET track. More maintenance, more decision-fatigue for .NET-only readers. Rejected.
- *Specialized roles (different apps for different lab chapters)* — interesting but doubles the design effort and forces participants on one stack to constantly switch context. Rejected.
- *Drop .NET entirely, focus everything on python-react* — alienates current .NET-only readers who chose this lab partly for the cross-stack honesty. Rejected.

### Q3: What does minute one feel like? — RESOLVED

**Decision:** Theatrical CRT boot on first run, calm modern reading view forever after. Sample remembers (localStorage on web, file marker on .NET) and shows calm view on subsequent runs. Boot can be re-triggered by deleting the marker — also a teaching moment for chapter 6 (Hooks).

**Rationale:** First-run is a cinematic beat — designed to convert "another tutorial repo" into "wait, that's cool." Daily-driver state must be *useable*, not theatrical, or the personality wears thin. Splitting the two states gets both.

**Alternatives considered:**
- *Full theatrical homage on every run* — would get annoying by run three. Rejected.
- *Modern with retro accents only* — competent but not *cinematic*. Lost the wow ceiling. Rejected.

### Q4: How does The Guide thread through the lab? — RESOLVED

**Decision:** The sample appears in nearly every chapter, with concrete exercises that grow the app meaningfully. Mapping:

| Chapter | What participants do to The Guide |
|---|---|
| `before-we-start` | First boot — see the CRT power-on. Just runs. |
| `first-task` | Add `DELETE /api/entries/{id}` + delete button. Classic first real change. |
| `teach-claude-your-project` | Rewrite the Guide's `CLAUDE.md` so Claude understands its domain (entries, badge rules, voice). The CLAUDE.md becomes a teaching specimen. |
| `voice-and-interaction` | Practice prompting on real small tasks: contributor avatars, refactor entry storage, tag chips. Multiple short loops. |
| `iteration-and-control` | Plan a multi-step feature — full-text search + tag filtering. Use `/plan`, `/checkpoint`, `/rollback`. Add SQLite as part of this work. |
| `behind-the-scenes` | Use a subagent to *generate* Guide entries from a topic ("write five Mostly Harmless entries about TypeScript"). Watch the agent loop. |
| `ecosystem` | Wire MCP — connect a web-fetch MCP, ingest a real Wikipedia article into the Guide. Build a `/guide-add <url>` slash command as the participant's first plugin. |
| `compound-engineering` | Document a learning that came up during Guide work into `docs/solutions/`. Add a hook that auto-stamps each entry with contributor + timestamp on commit. |
| `next-steps` | Take The Guide home — deploy it, add real auth, build a CS-only edition, share it. |

**Rationale:** The mapping turns the sample into the lab's spine — every chapter has something concrete and motivated to do, and each addition makes the Guide better. Participants leave with a real, used, personalized app.

**Alternatives considered:**
- *Use The Guide only in chapters 2–3, leave others to use other examples* — keeps the current scope but wastes the surface area. Rejected.
- *Build a different mini-app per chapter* — variety, but no cumulative payoff. Participants leave with nine half-built things instead of one finished thing. Rejected.

### Q5: Data model — rich or lean at seed? — RESOLVED

**Decision:** Seed with a *moderately* rich model — `Entry { id, title, body (markdown), badge (mostly-harmless | mostly-dangerous | unknown), contributor, created_at, tags[] }`. Tags derived from entries (no separate table at seed).

**Rationale:** Lean enough that the data model is readable in 10 seconds. Rich enough that the visual surface (badge color, tag chips, contributor avatar, timestamp) earns a real frontend on minute one. Adding tags-as-an-entity, contributors-as-users, ratings-as-a-table — these are all chapter exercises.

**Alternatives considered:**
- *Lean (just title + body)* — visual surface too thin to feel polished on first run. Rejected.
- *Maximally rich (entries + tags + ratings + contributors + comments + history)* — too much code to read on day one, no room left for chapter additions. Rejected.

### Q6: Persistence at seed — in-memory or SQLite? — RESOLVED

**Decision:** In-memory at seed. SQLite gets added by participants as a chapter exercise in `iteration-and-control`.

**Rationale:** The transition from "this loses data on restart" to "let's add a real store" is itself a teaching moment — and forces participants to plan a multi-step migration with `/plan`. Shipping SQLite from day one would either require a migration tool on first install (friction) or hide a real lesson.

**Alternatives considered:**
- *SQLite from day one* — more "real," but adds setup friction (migrations) and removes a perfect chapter exercise. Rejected.
- *In-memory forever, no DB chapter* — wastes a teachable transition. Rejected.

### Q7: AI in the seed — yes or no? — RESOLVED

**Decision:** No AI in the seed. The sample runs with zero API keys. AI features are added by participants during chapters `behind-the-scenes` (subagents generate entries) and `ecosystem` (MCP ingests URLs).

**Rationale:** A sample that requires an API key on first run kills momentum dead. Participants who don't have a key yet, or are running offline, get blocked. The "AI gets added later, by you" arc is also a more honest teaching story.

**Alternatives considered:**
- *Ship a tiny demo that uses Claude to generate one entry on first boot, as a teaser* — more wow, but breaks the no-keys-required promise. Rejected.

### Q8: Bilingual approach — UI toggle or content only? — RESOLVED

**Decision:** Both. Seed entries shipped in EN and CS (different content for each — no parallel translation, just locale-appropriate entries). UI strings parallel the lab's locale toggle. Toggle is shown as a Babel Fish icon.

**Rationale:** The Guide speaks all tongues — that's the lore. The locale toggle is a Babel Fish detail that costs almost nothing and earns a smile. Adding a third locale becomes a possible chapter exercise (or a `next-steps` idea).

**Alternatives considered:**
- *EN-only seed* — wastes the bilingual angle and contradicts the lab's identity. Rejected.
- *Parallel translations of the same content* — feels mechanical and tutorial-shaped. The Guide is more interesting if its EN and CS entries are *different* entries. Rejected.

### Q9: First-run UX on the .NET side — what makes terminal "wow"? — RESOLVED

**Decision:** `dotnet run` triggers an ANSI boot sequence (typed-out lines, Rosé Pine palette, "DON'T PANIC" banner) and renders one pre-shaped Guide entry as a styled ANSI box with a green "MOSTLY HARMLESS" badge before starting the API. Subsequent runs (after a `.guide-booted` marker file exists) skip straight to API start with a one-line "Sub-Etha relay online · http://localhost:5100" message. Marker can be deleted to re-experience the boot.

**Rationale:** Closes the wow gap on the terminal side. Uses Spectre.Console (or similar) — established library, no exotic dependencies. The marker-file pattern mirrors the localStorage pattern on the web side, which is a teachable parallel.

**Alternatives considered:**
- *No terminal animation, just print "API running on port 5100"* — fine, but breaks the "both stacks feel handcrafted" promise. Rejected.

## Open Questions

1. **Wikipedia MCP availability** — Chapter `ecosystem` proposes ingesting a real Wikipedia article via MCP. Does a public, no-auth Wikipedia or web-fetch MCP exist that works reliably? **Verify during planning.** Fallback: use a generic web-fetch MCP with a Wikipedia URL.
2. **Spectre.Console vs alternatives for .NET ANSI** — Spectre.Console is the obvious pick, but adds a small dependency to a sample that prides itself on minimal `csproj`. Acceptable tradeoff? **Decide during planning.** Fallback: hand-rolled ANSI escape strings (fewer deps, more code).
3. **Boot animation duration** — How long is too long? Three seconds feels right; five feels long; ten is unforgivable. **Decide during the proof slice — needs visual judgment.**
4. **Markdown rendering on the React frontend** — `react-markdown` adds bundle weight; a tiny custom renderer keeps things lean but limits formatting. **Decide during planning** based on what entries actually need (probably bold, italic, code, links, lists — covered by a tiny renderer).
5. **CS seed entries — who writes them?** Different content per locale means writing fresh CS entries, not translating. Is this OK? **Owner: ondrej** (probably, given the bilingual content discipline).
6. **Repo location** — Stay in `samples/` here, or split out to a `cc-lab-samples` repo (mentioned in the design system as a future name)? **Defer to planning.** Splitting now adds friction; staying in-repo means sample changes ride alongside lab changes (probably right).
7. **Existing chapter content updates** — Chapters 2 and 3 already reference the current samples. Do we update those chapters in the same slice as the sample rebuild, or rebuild samples first and update chapters in a second slice? **Lean toward second slice** — let the samples land and stabilize before rewriting prose around them.
8. **Migration of the existing samples** — Hard delete vs. keep alongside as `samples/legacy-todo/`? **Lean toward hard delete** with a single git tag for archaeology — keeping legacy adds noise.

## Out of Scope

- Real authentication / multi-user support.
- Real production deployment instructions (saved for `next-steps`).
- AI features baked into the seed.
- Heavy UI libraries (Tailwind, MUI, Bootstrap, shadcn/ui in their full form). Rosé Pine via plain CSS variables and one tiny utility lib (clsx-tier) is the bar.
- Test scaffolding shipped at seed. Tests get written during the lab as exercises (`first-task` for the simple case, `iteration-and-control` for harder ones).
- A backend rewrite — keep FastAPI on Python and ASP.NET Core minimal API on .NET. Just expand the surface.
- A third stack (Go / Rust / Node-only). Two is enough; the lab is about Claude Code, not stack diversity.

## Assumption Audit

- ✓ **Bedrock — Both samples currently exist with python-react and dotnet-core stacks.** Verified by reading them.
- ✓ **Bedrock — The lab has nine chapters in `content/en/`.** Verified by `ls`.
- ✓ **Bedrock — Rosé Pine palette is the project's design language.** Verified in `docs/cc-lab-design-system.md` and `~/.claude/CLAUDE.md`.
- ✓ **Bedrock — Lab is bilingual EN/CS.** Verified throughout the project.
- ✓ **Bedrock — No AI in seed = no API keys = frictionless first run.** Logical certainty.
- ? **Unverified — A reliable web-fetch / Wikipedia MCP exists for chapter `ecosystem`.** Captured as Open Question #1.
- ? **Unverified — Spectre.Console is the right tool for .NET ANSI.** Captured as Open Question #2.
- ? **Unverified — Participants will tolerate a 2–3 second CRT boot animation.** Captured as Open Question #3. Mitigation: skip-on-keypress + remember-skipped state.
- ? **Unverified — A theatrical CRT boot can be done in plain CSS without bloating the bundle or hurting Lighthouse.** High confidence (modern CSS animations are cheap), but verify during proof slice.
- ? **Unverified — The .NET sample's terminal "wow" can match the React side's visual wow.** Genuinely uncertain — terminal wow has a lower ceiling than browser wow. Mitigation: design the terminal experience as *its own thing* (concise, crafted, ANSI-elegant) rather than as a "lesser" version of the React one.
- ✗ **Weak — The chapter thread mapping in Q4 is "the right one."** These are *examples* the lab can use, not prescriptions. Each chapter author should feel free to substitute different exercises that hit the same beats.

## Next Steps

- `/plan docs/brainstorms/2026-04-27-power-up-the-samples-brainstorm.md` to turn this into a phased implementation plan. Suggested phases: (1) python-react proof slice — boot animation + one entry rendered; (2) python-react full feature set; (3) .NET twin (API + terminal boot); (4) chapter content updates referencing the new samples.
- Before planning, verify Open Questions #1 (web-fetch MCP) and #2 (Spectre.Console) — both unblock real planning decisions.
- After this brainstorm: candidate for `/marvin:compound` if any genuinely novel pattern emerges from the proof slice (e.g., the localStorage / file-marker first-run pattern might be worth documenting).
