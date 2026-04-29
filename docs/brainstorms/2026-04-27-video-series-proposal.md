---
title: "Video series — practice-shaped companion to the lab"
type: brainstorm
date: 2026-04-27
participants: [ondrej, claude]
status: revised
revision_note: "Updated 2026-04-27 (same day) after the samples-rebuild plan was approved — see docs/plans/2026-04-27-feat-power-up-the-samples-plan.md. The series demos against The Guide, not the old bone-stock samples."
related:
  - docs/cc-lab-design-system.md
  - content/en/
  - docs/plans/2026-04-24-lab-improvements-plan.md
  - docs/plans/2026-04-27-feat-power-up-the-samples-plan.md
  - docs/brainstorms/2026-04-27-power-up-the-samples-brainstorm.md
---

# Video series — practice-shaped companion to the lab

## Problem statement

The lab teaches well in text. Some of it teaches *better* on video — the four-beat rhythm, double-tap Esc, voicing a goal while pasting a screenshot, watching `/work` tick through a plan, the three iterations of a Ralph Wiggum loop polishing the wrong thing. None of that lives well on a page.

A small video series, recorded in Descript and posted to YouTube, can carry the practice-flavored half of the lab to people who learn by watching, and let the text chapters do what text does best (reference, depth, copy-paste artifacts).

**Demo canvas.** Every demo runs on **The Guide** — the Hitchhiker's-styled knowledge-base sample being rebuilt per `docs/plans/2026-04-27-feat-power-up-the-samples-plan.md`. That plan replaces both bone-stock samples with a Rosé Pine reading app (CRT boot on first run, calm view forever after, EN/CS seeded entries, identical API on python-react and dotnet-core). The Guide is what the participant runs alongside the chapter, and what the camera sees in every episode. The series cannot ship until The Guide's Phase 2 lands — see "Production sequencing" below.

The series has to clear three bars:

1. **Differentiate from saturation.** "Claude Code for beginners 2026" is a saturated genre. Anthropic Academy already runs `Claude Code 101` (12 lectures, ~1 hour) and `Claude Code in Action`. Boris Cherny's own setup site exists. Sabrina Ramonov, Nick Saraev, and others crank SEO-shaped beginner walkthroughs every week. The series cannot be another one of those.
2. **Stay in voice.** No "hey guys, smash that subscribe." No 30-second logo intros. No marketing-language. Peer voice, dry, Heart-of-Gold flavor, same register as the chapters.
3. **Pay for itself.** Every episode either lands a teaching point that text can't, or shows a concrete worked example that the chapter only describes. If an episode reads as a re-narration of the chapter, it's the wrong shape.

## Context

### What's already in the lab

- Ten spine chapters (orientation → first task → teach Claude → iterate → voice → ecosystem → compound → next steps → reference → behind the scenes).
- Three library entries (context engineering, autonomous loops, `/cc-lab-diagnose`).
- Two sample projects being rebuilt as **The Guide** — Hitchhiker's-styled knowledge base, CRT boot on first run, calm Rosé Pine reading view, identical API on python-react and dotnet-core, EN/CS seeded entries. Plan: `docs/plans/2026-04-27-feat-power-up-the-samples-plan.md`. Approved, status `proposed`, in-flight.
- A locked visual identity (Rosé Pine Moon/Dawn, Manrope/JetBrains Mono, blueprint-style hero illustrations).

### What's already on YouTube

- **Anthropic Academy `Claude Code 101`** — polished, comprehensive, free, ~1 hour. The canonical "watch this once" course. Generic, platform-promotional.
- **Anthropic Academy `Claude Code in Action`** — separate course, hands-on examples.
- **Boris Cherny "How the Creator Sets Up His Workflow"** — single setup video; opinions from the source.
- **Every / Avery / Kieran Compound Engineering videos** — workflow-focused, higher-trust source on the loop.
- **Pragmatic Engineer × Boris Cherny** — engineering interview, depth on the build.
- **Sabrina Ramonov, Nick Saraev, etc.** — SEO-first beginner content, surface-level, retention-optimized listicles.

### What's not on YouTube

- **A practice-shaped, opinionated series on a real codebase.** Most existing videos demo a toy todo app or a green-field new project. The lab walks people through a sample that grows with them — the videos can do the same.
- **Honest receipts.** Few creators show what it actually cost in time and money. The lab's "Behind the scenes" chapter is rare territory.
- **Failure modes shown live, not just discussed.** The Ralph Wiggum loop. The agent deleting tests to make them pass. Voice prompts that misfire and how to recover. Most tutorials skip the bad days.
- **Bilingual (EN + CS) practice-grade content.** The Czech market has near-zero high-trust Claude Code content at this depth.
- **Voice-and-multimodal as combined practice.** Most videos show voice *or* paste; the lab teaches "voice the goal, paste the artifact, type the constraint" as one move.

That's the gap. The series fills it.

## Three options to weigh

**Option A — Faithful video companion, episode per chapter (10 episodes).**
Pros: clean mental model, drops into chapter pages 1:1, easy to plan.
Cons: chapter 9 (reference) is unwatchable; chapter 10 (behind the scenes) is meta and short; chapters 1–2 are too thin alone; redundant with text.
Verdict: too literal.

**Option B — Worked-session series (each episode is a real task end-to-end).**
Pros: distinctive, shows what text can't, retention-friendly.
Cons: harder to plan, each episode is its own production lift, less obvious link to the lab structure.
Verdict: good as a *follow-up* season, but too unstructured for the first run.

**Option C — Practice-shaped series following the lab's natural beats (7–9 episodes, hybrid).**
Pros: covers the same arc as the lab without re-narrating it, slots into chapter pages where it lands, leaves room for worked-task episodes inside the structure.
Cons: more design work upfront to map chapters to episodes.
Verdict: **recommended.**

## Chosen approach

A seven-episode main series plus a short trailer and one bonus "receipts" episode. Each episode is 10–15 minutes (compound and harness episodes can stretch to 18). Recorded in Descript with a consistent house format. Embedded at the top of the matching chapter page, plus a `/[locale]/lab/videos` index. EN canonical with CS subtitles for V1; full CS audio is a V2 decision.

### House format (every episode)

A recognizable shape so the series feels like a series, not a playlist of unrelated uploads. Same shape every time:

```
0:00–0:15   Cold open    A concrete pattern interrupt — agent doing the thing.
                         No logo. No "what's up." Dive straight in.
0:15–0:45   Promise      What you'll be able to do by the end. One sentence
                         per outcome. Flash the 3 beats.
0:45–4:00   Beat 1       First teaching point + worked example.
4:00–8:00   Beat 2       Second teaching point + worked example.
8:00–11:00  Beat 3       Third point, often "where it goes wrong."
11:00–12:30 Recap + next One sentence per beat. Link to the chapter. Tease
                         the next episode.
```

Most episodes hit ~12 min. Compound (Episode 6) and Harness (Episode 8) run longer because the worked examples need the room.

### Episode list

| # | Title | Maps to | Length |
|---|---|---|---|
| 0 | The lab in 90 seconds (trailer) | All | 1:30 |
| 1 | Don't Panic. Open Claude. Ship one thing. | Ch 1, 2 | 12 min |
| 2 | Teach Claude your project — make `CLAUDE.md` write itself | Ch 3 | 12 min |
| 3 | Iterate without rewriting — rewind, narrow, plan mode | Ch 4 + library: context engineering | 14 min |
| 4 | Voice, screenshots, paste — three modalities, one prompt | Ch 5 | 11 min |
| 5 | The ecosystem — skills, plugins, MCP, subagents | Ch 6 | 14 min |
| 6 | Compound engineering — one feature, the full loop | Ch 7 | 18 min |
| 7 | Walking away — autonomous loops without the Ralph Wiggum | Library: autonomous loops + auto mode | 11 min |
| 8 | Build a harness — verification without your eyes on every diff | Ch 8 | 16 min |
| 9 | The receipts (bonus) — what it took to build this lab | Ch 10 | 7 min |

That's nine episodes plus a trailer. Total runtime ~115 min — about half the length of `Claude Code 101`, but with original demos, opinionated stance, real codebase.

## Per-episode outlines

### Episode 0 — The lab in 90 seconds (trailer)

**Cold open (0:00–0:08):** Title card "Don't Panic." over Rosé Pine background. Cut.

**Beats (0:08–1:20):** Five-second clips, no narration, captions only — `claude` running, voice dictating, plan mode toggle, /work ticking through tasks, /security-review surfacing a finding, /compound writing a doc. Each clip captioned with the chapter it's from.

**Outro (1:20–1:30):** "Built with Claude Code, on real code. Subtitles EN + CS. Start at episode 1." Link.

This is the cold open for everything else. Same trailer can also live above the lab landing page.

---

### Episode 1 — Don't Panic. Open Claude. Ship one thing.

**Maps to:** Chapter 1 (Before we start), Chapter 2 (Your first task).

**Cold open (0:00–0:15):** Black screen. CRT scan-lines wash. Typed-out terminal: `> initializing sub-etha relay…`. `> infinite improbability drive: stable`. **DON'T PANIC** pulses on. Cuts to the calm Guide reading view in Rosé Pine. Cuts to `claude` opening in a split pane. Title.

**Promise (0:15–0:45):** "By the end of this video: Claude installed, your first feature shipped — a working delete button on this — and the four-beat shape every Claude session uses."

**Beat 1 — Install (0:45–3:00):** Desktop install. CLI install. Don't dwell. Both share the same account. Plan tier matters (Pro / Max / Team / Enterprise — show the matrix from chapter 1). What leaves your machine, briefly.

**Beat 2 — First task (3:00–9:00):** Open `samples/python-react/` (or `samples/dotnet-core/` — show stream switch as a graphic, lead with python-react). The Guide is running on `:5173`. The chapter 2 exercise: **add `DELETE /api/entries/{id}` and a delete button.** Make the prompt. Read the plan. Watch the diff in two files (backend `main.py` + frontend `EntryCard.tsx`). Run it. Click delete on an entry. Watch it disappear. Real loop, real UI feedback. Show the failure mode too — wrong endpoint name, paste the 404, agent fixes in one step.

**Beat 3 — Naming the shape (9:00–11:30):** Describe → plan → diff → run. The four beats. Point at where each beat happened in the just-shown demo. The diff was small; the verification was clicking delete, not pressing `y`.

**Recap + next (11:30–12:00):** "Same shape, every session. Next episode: how to make Claude know your stack the way a senior teammate would."

**Why The Guide makes this episode work:** the cold open sells "this isn't another generic tutorial" in 15 seconds. The first ship is a *visible* feature on a themed app, not `{"ok": true}` in a curl response. Far better TV.

---

### Episode 2 — Teach Claude your project — make `CLAUDE.md` write itself

**Maps to:** Chapter 3.

**Cold open (0:00–0:15):** Bad agent moment on The Guide — Claude proposes a new badge value `"mostly-safe"` (which doesn't exist; the real values are `mostly-harmless | mostly-dangerous | unknown`). Hit `Esc Esc` to rewind. Type `# entries only carry mostly-harmless, mostly-dangerous, or unknown badges — never invent new badge values.` Re-prompt. Claude uses `mostly-harmless`. Title.

**Promise (0:15–0:45):** "By the end: a `CLAUDE.md` you didn't hand-write, the `#` prefix, and you'll know which scope to put what in."

**Beat 1 — `/init` (0:45–4:00):** Pretend the Guide ships without a CLAUDE.md (rename it temporarily for the demo). Run `/init`. Read the proposal critically. Compare with the actual shipped CLAUDE.md (badges, voice constraints, no-AI rule, contributor norms). Show what `/init` got, what it missed, what it added that didn't fit. Refine live.

**Beat 2 — `#` prefix (4:00–7:30):** Drop a rule mid-flow. Watch Claude pick the scope (project for Guide-domain rules, user for editor preferences, local for WIP notes). Show the diff that lands in the right CLAUDE.md.

**Beat 3 — Map not manual (7:30–11:00):** Show what an 800-line CLAUDE.md does to context. The Guide's CLAUDE.md is short on purpose — point to where the deeper docs live (`docs/cc-lab-design-system.md`). Cite Lopopolo's "map not a 1,000-page manual." Trim live.

**Recap + next (11:00–12:00):** "Short, opinionated, links out. Next episode: the three moves that turn three rewrites into one clean diff."

---

### Episode 3 — Iterate without rewriting — rewind, narrow, plan mode

**Maps to:** Chapter 4 + library entry on context engineering.

**Cold open (0:00–0:15):** Hands on keyboard. Esc. Esc. The rewind menu opens. Pick a prior turn. "Branch from here." Title.

**Promise (0:15–0:45):** "Three moves — rewind, narrow scope, plan mode. By the end you'll stop fighting Claude and start steering it."

**Beat 1 — Rewind (0:45–4:00):** Esc Esc. The single most useful keyboard shortcut in the tool. Demo on The Guide: agent rewrites the `<EntryList>` component when you only wanted to add a sort. Esc Esc, narrow the ask, get the small diff. Show four uses: wrong path, better phrasing, branch experiment, surprising diff.

**Beat 2 — Narrow scope (4:00–8:30):** Live demo — wide prompt: "refactor entry filtering to support OR logic across tags, add tests, and migrate to TypeScript strict mode." Fails. Three narrow prompts succeed in less time. Each gets a clean review.

**Beat 3 — Plan mode + context moves (8:30–13:00):** Shift+Tab to plan mode. Plan-only output for "add tag-based OR filtering." `/compact` vs `/clear` — when to reach for which. Reference the four moves and three layers from the context-engineering library entry; link in the description.

**Recap + next (13:00–14:00):** "Rewind, narrow, plan, clear. That's the daily loop. Next episode: typing is the slow path."

---

### Episode 4 — Voice, screenshots, paste — three modalities, one prompt

**Maps to:** Chapter 5.

**Cold open (0:00–0:30):** No narration. Voice into the desktop app: "add a 'Mostly Dangerous' filter button to the tag row in the Guide." Paste a screenshot of the current Guide tag row. Type "use TagFilter.tsx; match the existing chip style." Send. Diff appears across `TagFilter.tsx`. Click the new button on the running site. Filter works. Title.

**Promise (0:30–1:00):** "Voice the messy thought. Paste the artifact. Type the precise reference. Three modalities, one prompt."

**Beat 1 — `/voice` in terminal (1:00–4:00):** Run it. Hold Space. Speak. Edit the transcript before sending. Show tap mode briefly. Note: 20 languages including Czech. Demo a Czech prompt against the Guide's CS entries.

**Beat 2 — Multimodal in desktop (4:00–8:00):** Three places multimodal hits hardest, all on The Guide: drag a hand-sketched layout for a new entry-detail view, drag a stack trace screenshot when the create-entry POST 422s, drag a Figma export for a "premium" entry treatment.

**Beat 3 — The combined pattern (8:00–10:30):** Live demo of voice + paste + type as one move on The Guide. Show why none of the three alone produces what the three together do.

**Recap + next (10:30–11:00):** "Voice carries intent. Paste carries context. Type carries the precise reference. Next episode: extend Claude beyond what ships in the box."

---

### Episode 5 — The ecosystem — skills, plugins, MCP, subagents

**Maps to:** Chapter 6.

**Cold open (0:00–0:15):** The six-surfaces radial diagram from chapter 6 panning across screen. Title.

**Promise (0:15–0:45):** "Install fewer things. Build one of your own. Know what to skip."

**Beat 1 — Skills (0:45–4:30):** Install one (the lab's `/cc-lab-diagnose` is a natural choice — good for embedded plug). Then write one with `skill-creator`. Show the discovery questions. Show the resulting `SKILL.md`. Trigger it.

**Beat 2 — Plugins (4:30–7:00):** `/plugin marketplace add EveryInc/compound-engineering-plugin`, `/plugin install compound-engineering`. Verify with `/plan --help`. This sets up Episode 6 — call that out.

**Beat 3 — MCP (7:00–10:30):** Install chrome-devtools MCP. One worked example on The Guide: open `localhost:5173`, ask "why does the entry list flash on first paint?" Watch Claude inspect, run Lighthouse, report back. Real finding on real code. The moment MCPs stop being abstract.

**Beat 4 — Subagents (10:30–13:30):** `@Explore` on a big repo. Show the context savings — main conversation gets a 2-paragraph summary instead of 20k tokens of file reads.

**Recap + next (13:30–14:00):** "Menu, not checklist. Next episode: the loop that compounds."

---

### Episode 6 — Compound engineering — one feature, the full loop

**Maps to:** Chapter 7. **The showcase episode.**

**Cold open (0:00–0:20):** Five commands flash on screen: `/brainstorm`, `/plan`, `/work`, `/review`, `/compound`. The compound loop diagram. Title.

**Promise (0:20–1:00):** "By the end of this video: one real feature shipped on The Guide through the loop, one `docs/solutions/` doc to show for it. This is the practice that the rest is in service of."

**Pick a real task on The Guide.** Three candidates, in priority order — pick one before recording:
1. **Archive + restore feature.** Mark an entry as archived, hide from default list, restore from a separate view. Touches backend (`PUT /api/entries/{id}` + an `archived` field), frontend (state, filter, restore button). Real shape, ~30 minutes condensed to 15 on screen.
2. **Export to markdown.** New endpoint `GET /api/entries/{id}/export.md` plus a copy-to-clipboard button. Server-heavier, simpler frontend.
3. **Tag-based OR filtering.** Multi-select tags, OR semantics. Touches `<TagFilter />` and the client-side filter. Smaller scope; good if 1 or 2 don't fit the runtime budget.

**Beat 1 — `/brainstorm` (1:00–4:00):** Don't skip to the solution. Let Claude widen the problem. The Guide-specific questions: *should archived entries be searchable? do they keep their tags? what does the locale toggle do with archived?* Most of the value is in the questions it asks back.

**Beat 2 — `/plan` (4:00–7:00):** Read the plan file before accepting. Edit it. Show what an approved plan looks like. Plan-mode-on-disk vs plan-mode-in-conversation — this is the difference.

**Beat 3 — `/work` (7:00–12:00):** Watch tasks tick off. Show small commits. Stop and update the plan when something surprises (e.g., the locale toggle interaction wasn't in the plan) — *don't* power through.

**Beat 4 — `/review` (12:00–14:30):** Claude reads its own output against the plan. Show one drift it catches — the "it compiles but..." class.

**Beat 5 — `/compound` (14:30–16:30):** Write the solutions doc. Show the file. The file that makes the next loop faster.

**Recap + next (16:30–18:00):** "First time saves an hour. Tenth time, half the planning is already written. Next episode: when you can walk away."

---

### Episode 7 — Walking away — autonomous loops without the Ralph Wiggum

**Maps to:** Library entry on autonomous loops, plus auto mode from Chapter 4.

**Cold open (0:00–0:15):** A `/loop` running. Iteration counter ticking. "Stop when typecheck passes or 10 attempts." It hits 8. Green. Cut. Title.

**Promise (0:15–0:45):** "When to walk away. When the agent will polish the wrong thing 30 times in a row. Four checks before you let go of the keyboard."

**Beat 1 — Pre-flight (0:45–4:00):** Mechanical success, bounded scope, harness on, stoppable without loss. Show the four-panel visual from the library entry. If any one is missing, you're not running a loop — you're running a dice roll.

**Beat 2 — Auto mode (4:00–7:00):** Live demo. Auto mode lets Claude take many small actions without per-action approval. Show the difference from bypass — auto keeps guardrails.

**Beat 3 — Ralph Wiggum live (7:00–10:00):** Show three iterations of an agent confidently polishing the wrong thing. Iteration 1 misreads the goal. Iteration 2 "fixes" typecheck by casting to `any`. Iteration 3 invents four wrapper types. Typecheck green throughout. Nothing the type system was supposed to protect actually got protected.

**Recap + next (10:00–11:00):** "Loop is leverage if the harness is on. Without a harness, loop is unmonitored hope. Next episode: build the harness."

---

### Episode 8 — Build a harness — verification without your eyes on every diff

**Maps to:** Chapter 8.

**Cold open (0:00–0:15):** The control-vs-harness diptych from chapter 4. Cut. Title.

**Promise (0:15–0:45):** "By the end: one tracer-bullet test, one `/security-review` run, and one PR auto-reviewed by `claude-code-action`. The posture that makes autonomy actually pay."

**Beat 1 — Tracer bullets (0:45–5:00):** Write the failing end-to-end test for the Guide's `DELETE /api/entries/{id}` endpoint *before* implementing it. Watch the agent iterate to green. Mention Beck's "TDD is a superpower for AI agents" interview. Mention the counterpoint — agents sometimes delete tests; pin them in review.

**Beat 2 — `/security-review` (5:00–9:00):** Run it on a Guide PR. Read findings as a *map of what a reviewer would flag*, not pass/fail. Show one real finding (e.g., the `POST /api/entries` body isn't size-limited; a contributor field that should be sanitized for HTML).

**Beat 3 — `claude-code-action` on a PR (9:00–13:00):** Wire the GitHub Action against the cc-lab repo. Open a Guide PR. Watch `@claude` review against the Guide's CLAUDE.md (badge values, voice constraints, no-AI rule). The fastest way to make every PR get a careful read.

**Beat 4 — `/sandbox` (13:00–15:00):** OS-level filesystem and network sandbox for bash subprocesses. Show auto-allow mode skipping prompts. Mention the lethal trifecta — sandbox kills the *external communication* leg.

**Recap + next (15:00–16:00):** "Tests, scans, sandboxed runs, agent review. The diff becomes a spot-check, not a mandate. Bonus next: the receipts."

---

### Episode 9 (bonus) — The receipts — what it took to build this lab

**Maps to:** Chapter 10 (Behind the scenes).

**Cold open (0:00–0:15):** Big numbers on screen — total session time, total cost at API rates, zero incremental on Max subscription. Cut. Title.

**Promise (0:15–0:45):** "An honest look at hours, dollars, and which patterns from the rest of the series actually scaled when applied to building the series itself."

**Beat 1 — The numbers (0:45–2:30):** Walk the BuildStats data. Six sessions. ~14 hours session time, much unattended. $845 at API rates. Zero on Max.

**Beat 2 — What worked (2:30–5:00):** Plan mode for every chapter. `/work` against approved plans. `/compound` for non-obvious fixes. Honest about what didn't work — show one moment where the agent went sideways.

**Beat 3 — Build your own (5:00–6:30):** The chapter's `/plan` prompt: "write me a Python script that reads my session jsonl files and renders a dashboard." Live-fire the prompt. Show the output. End with the dashboard.

**Outro (6:30–7:00):** "A week of your own sessions, rendered, will tell you more about how *you* work than any case study someone else published. End of series. Read the lab. Build something that compounds."

## Production sequencing — gated on The Guide

The series cannot ship until The Guide is built. The samples-rebuild plan (`docs/plans/2026-04-27-feat-power-up-the-samples-plan.md`) has five phases with hard visual review gates. The series sits on top, with its own per-episode dependencies on which Guide phases must be live.

| Series phase | Depends on Guide phase(s) | Episodes ready to record |
|---|---|---|
| **Pre-production: scripts** | None — write against the planned final state | All 9 + trailer (write speculatively) |
| **Block 1: foundation** | Phases 0–2 (Guide calm view + boot animation, web side complete) | Trailer, Ep 1, Ep 2, Ep 3 |
| **Block 2: feature episodes** | Phases 0–2 + Ep 1's recorded chapter-2 exercise (DELETE) committed | Ep 4, Ep 5, Ep 6, Ep 7 |
| **Block 3: harness + receipts** | Phases 0–4 (full Guide + chapter MDX updates landed) | Ep 8, Ep 9 |

Concretely:

- **Episode 1 cannot record until Guide Phase 2 is approved.** That's when the boot animation works and the calm view is final. Without Phase 2, the cold open doesn't exist.
- **Scripts can be written immediately.** The samples-rebuild plan describes the target end state precisely (component names, API shape, seeded entries, boot lines, file layout). Scripts written against that target state are good to record once Phase 2 lands.
- **The chapter MDX update in Phase 4 of the Guide plan must land before Block 3.** Otherwise Episode 8 demos a `DELETE` exercise that the chapters don't reference.
- **Episode 9 (receipts) can include receipts for both lab AND Guide.** Stronger meta — "here's what it cost to build the lab AND rebuild the samples AND record this series."

**Recommended path:** Write all scripts now (in parallel with Guide work). Block 1 records as soon as Phase 2 lands. Block 2 records during Phases 3–4. Block 3 records after Phase 4 is approved. Total elapsed time depends on Guide cadence; the series itself fits in a few weeks of recording once unblocked.

## Production format (Descript-specific)

**Pre-record:**

- Write the script in Descript first, then "Record into script." The script is the spine; voice tracks the script with light improv.
- Pre-stage every demo: a clean repo, a known-good prompt, a known-good failure. Don't improvise — the cold open is too important.
- Record `freeze`/`vhs` overlays separately for the b-roll where typing isn't the teaching point.

**While recording:**

- Studio Sound on. AI Overdub on for fixing one or two flubbed lines. Filler-word removal auto, but review every cut — sometimes the "uh" is the pause that lands the line.
- Face cam optional. The lab's audience cares about the screen; a small face cam in the corner adds presence without distracting. Off entirely during demo beats.
- Captions burned in for both languages. Auto-generate, then hand-correct.

**Post:**

- Title cards: simple Rosé Pine cards, Manrope display, JetBrains Mono for any code overlays. No animations beyond a 200ms fade. The lab's design system already locks the palette.
- B-roll: terminal recordings dominate. Use VHS for animated terminal sequences (already configured in `scripts/visuals/`), Freeze for stills.
- Chapter markers at every beat — YouTube chapter timestamps double as a table of contents.
- End screens link to the matching lab chapter and the next episode.

## Visual identity

Carry the lab's design system through:

- **Palette:** Rosé Pine Moon for dark scenes, Dawn for light reveals. Dark default.
- **Type:** Manrope for titles, JetBrains Mono for code overlays.
- **Title cards:** flat cards, single-color background, headline + section. Same shape every episode.
- **Spaceship motif:** the chapter heroes are already a series of ten ship illustrations forming one journey. Use them as section dividers — Episode 1's section card is the chapter-1 ship, Episode 8's is the chapter-8 ship. Visual continuity for free.
- **Voice / register:** match the chapters. Short declaratives. Active. No "let's." Imperatives in instructions are fine. Hitchhiker's Guide flavor is welcome but not forced — one Don't Panic per episode max.

## Bilingual strategy

Two paths:

**V1 — EN canonical, CS subtitles for all episodes.** Cheaper, ships fast. Czech subs are hand-corrected, peer-voiced (not direct translation). The lab's `feedback_czech_peer_voice.md` rules apply: reflexive passive over compound passive, informal prepositions, no literal idiom translations.

**V2 — Full CS audio for the most-watched 3–4 episodes.** Decided after V1 lands and the analytics tell us which episodes pull the most Czech viewers. Likely candidates: Episode 1 (broadest funnel), Episode 6 (showcase), Episode 8 (harness, the technical depth Czech audience underserves).

V1 ships in roughly 60–70% of the time of full bilingual recording. V2 is opt-in based on signal.

## Where they live

- **YouTube:** single playlist `claude-code-lab`. Trailer + 9 episodes. Series description links to `cc-lab.ondrejsvec.com`.
- **Lab site:** new `/[locale]/lab/videos` index page. Each episode embedded at the top of its matching chapter page (above the text), with a "skip to text" link for readers.
- **GitHub:** `README.md` gets a videos section under "Spine — ten chapters" with thumbnail + link to playlist.
- **Shorts:** cut the cold opens (each is ≤30s) into vertical 9:16 shorts for Twitter/LinkedIn. Free distribution funnel.

## Anti-goals

- **No "Ultimate Guide" / "10x your productivity" / "Master Claude Code" titling.** Reads as the saturated genre. Episode titles are descriptive — "Don't Panic. Open Claude. Ship one thing." beats "ULTIMATE Beginner's Guide to Claude Code."
- **No 30-second logo intros.** Cold open straight to the screen.
- **No "Hey guys, in this video..." openings.** Dive in. The lab's voice rules apply.
- **No sponsor reads, no "smash subscribe."** Subscribe ask once per episode, terse, in the outro.
- **No toy todo apps.** The samples and the lab itself are the canvas.
- **No re-narrating the chapter.** If an episode reads as "I'm going to read you chapter 4 now," it's wrong shape. Episodes show what text can't.
- **No quiz, badge, completion-tracker overlay.** Same anti-goal as the lab.
- **No multi-tool coverage** (Codex / Cursor / Cline). Same anti-goal as the lab — Claude Code is the spine.

## Open decisions (your call)

1. **Face cam — yes / no?** I'd lean yes-but-small (corner, 200×200), off during demos. Adds presence without distraction. But you might prefer screen-only.
2. **Series name.** Working title is "Claude Code Lab." Could be more distinctive — "The Lab Sessions," "Don't Panic, Ship," "Practice Lab." Worth pairing with the Guide's identity if it lands well.
3. **Episode 6 task.** Three candidates listed in the Episode 6 outline (archive+restore, export to markdown, tag OR filtering). Pick before Block 2 records.
4. **V2 Czech audio threshold.** What watch-time number on a CS-subtitled episode triggers a full CS rerecord? Suggest: 25% of total watch time. Decide before V1 ships so the trigger is mechanical.
5. **Schedule.** Once unblocked: one per week? One every two weeks? Block-record and drip? Suggested cadence: block-record Trailer + Episodes 1–3 right after Guide Phase 2 lands, publish Episode 1 to test, keep recording while V1 streams.
6. **Hosting.** YouTube primary. Mirror to Spaces / Twitter / LinkedIn? Mirror to Czech-specific platforms? V2 question.
7. **Script-writing parallelization.** Write scripts in parallel with Guide work, or wait until Phase 2 lands? Writing now risks small drift if the Guide's final state shifts; writing later compresses the recording window. Suggest: write Episode 1 + Trailer scripts now (highest leverage, lowest drift risk — they reference the cold open and the chapter-2 exercise, both locked in the Guide plan). Defer the rest until Phase 2 lands.

## Why this approach

**What it optimizes for:**

- **Practice, not coverage.** The lab covers; the videos demonstrate. No re-narrating.
- **Honesty.** Failure modes shown live. Receipts. The Ralph Wiggum loop on screen, not described.
- **Voice consistency.** Same register as the chapters, same visual palette, same hero illustrations as section markers.
- **Bilingual without doubling work.** V1 EN-with-CS-subs, V2 selective CS audio after signal.
- **Differentiation by stance, not novelty.** Anthropic 101 is comprehensive; Boris is one-off; Sabrina is SEO. The lab series is opinionated practice on a real codebase by a peer-voiced builder. That stance is the moat.

**What it gives up:**

- Watch-time per episode might be lower than a 1-hour course. Acceptable — retention matters more than length.
- It won't rank #1 for "Claude Code beginner tutorial 2026." Acceptable — the lab's audience is the right 50, not the wrong 5,000.
- Some chapters (9: reference) get no episode. Acceptable — text is the right shape for reference.

**Risks:**

- Burnout on 9 episodes. Mitigation: block-record where possible, ship Episode 1 first to test format before committing to all 9.
- The Compound episode (6) is hard to do well. Mitigation: dry-run the task off camera, then re-run on camera when the path is known.
- Czech subtitles drifting from peer voice. Mitigation: same review pipeline as chapter CS — voice rules in `feedback_czech_peer_voice.md` apply.

## What success looks like

- Trailer + Episode 1 published. CTR > 5%, retention > 50%. (Both above YouTube's average of 23.7%.)
- Three Czech viewers comment, in Czech, asking real questions. Not "thanks for the video" — actual peer engagement.
- One reader cites a video in a blog post or talk. (Same bar as "builders cite the lab.")
- Episode 6 (Compound) becomes the most-watched, indicating the showcase landed.
- One viewer runs `/cc-lab-diagnose` because of Episode 5. Visible in repo plugin install signal.

## Next steps

Pre-blocking work that can happen now, in parallel with Guide phases 0–2:

1. **Decide on Option C** (recommended) vs Option A or B. *Status: locked in (2026-04-27).*
2. **Answer the open decisions** above (face cam, series name, episode 6 task, schedule, script parallelization).
3. **Write Episode 1 + Trailer scripts speculatively** — against the Guide's planned final state from `docs/plans/2026-04-27-feat-power-up-the-samples-plan.md`. ~2–3 hours of work. Stays in this brainstorm or moves to `docs/videos/episode-01-script.md` as a deliverable.
4. **Build the Descript template** — Rosé Pine title cards, lower-thirds, end card, chapter-marker style. One-time setup so every episode looks the same.
5. **Smoke-test the production pipeline** — record a 2-minute throwaway demo to validate Studio Sound, captions, B-roll workflow, export settings. Surface friction before it costs real episode time.

Blocked work, ready when Guide Phase 2 lands:

6. **Record Trailer + Episode 1** (Block 1, foundation).
7. **Publish Episode 1** unlisted on YouTube. Send to 5 trusted readers for feedback before public.
8. **Ship publicly** if format holds. Otherwise iterate on script before recording more.

The next concrete deliverable, if you want it: **Episode 1 + Trailer scripts in full**, written against The Guide's planned final state. Cold open word-for-word, beat-by-beat narration, on-screen action callouts, Descript-ready.
