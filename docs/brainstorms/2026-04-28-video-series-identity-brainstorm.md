---
title: "Video series + streaming — identity, overlays, production stack"
type: brainstorm
date: 2026-04-28
participants: [ondrej, claude]
revision_note: "Expanded same day to cover live streaming + Stream Deck + OBS overlay vocabulary as a related second surface, not just recorded videos."
related:
  - docs/brainstorms/2026-04-27-video-series-proposal.md
  - docs/cc-lab-design-system.md
  - docs/plans/2026-04-27-feat-power-up-the-samples-plan.md
  - public/chapters/
  - samples/python-react/frontend/src/components/Boot.tsx
  - samples/dotnet-core/Boot/BootSequence.cs
  - app/globals.css
  - scripts/visuals/vhs.theme.json
---

# Video series — identity + Descript template

## Problem Statement

The series proposal (`docs/brainstorms/2026-04-27-video-series-proposal.md`) is locked at Option C — practice-shaped, 9 episodes + trailer. Recording Block 1 (Trailer + Eps 1–3) is now unblocked because The Guide shipped. Before any script gets written, the **identity** has to be locked: what do all 9 episodes share visually, what does every cold open look like, what does the YouTube thumbnail pattern carry, what reusable Descript template do we record into.

Without an identity locked, every episode is a one-off design exercise, the series doesn't compound, and the production cost per episode stays high. With it locked once, every subsequent episode is a fill-in-the-template job.

## Context

The lab already has a near-complete identity. Anything we add should pull from it, not next to it.

| Asset | Path | Status |
|---|---|---|
| 10 chapter-hero ships (2:1) | `public/chapters/01-before-we-start.png` … `10-behind-the-scenes.png` | Locked |
| Canonical ship | `public/hero.png` | Locked |
| Rosé Pine palette (Moon dark / Dawn light) | `app/globals.css`, `scripts/visuals/vhs.theme.json` | Locked |
| Type stack: Manrope · Space Grotesk · JetBrains Mono | Used in lab + samples | Locked |
| The Guide boot — React (~3.4s) | `samples/python-react/frontend/src/components/Boot.tsx` | Live in app |
| The Guide boot — .NET Spectre (~2.7s) | `samples/dotnet-core/Boot/BootSequence.cs` | Live in app |
| "Don't Panic" pill | `samples/python-react/frontend/src/styles.css:160` (`.app-don-t-panic`) | Live in app |
| Babel Fish 🐟 (only sanctioned emoji) | `samples/python-react/frontend/src/components/LocaleToggle.tsx` | Live in app |
| "Cinematic moments" exception | `docs/cc-lab-design-system.md:208` | Codified |
| `cc-lab.ondrejsvec.com` | Public site | Live |

What's missing for video:
- A motion graphic asset for the boot-style cold open (currently in-app only)
- A title-card composition (ship + episode title) at 16:9
- A lower-third style
- An end-card pattern
- A YouTube thumbnail pattern
- A reusable Descript project template

## Chosen Approach

**Series name:** **Claude Code Lab.** Literal match to site / repo / plugin. Maximum cohesion, zero new naming, optimal SEO for the term that already finds the lab. YouTube playlist title, channel reference, every title card, thumbnail header — all read "Claude Code Lab".

**Cold-open pattern (every episode, ~3 seconds):**
1. Black screen.
2. CRT scan-line wash (200ms).
3. Three typed-terminal lines, JetBrains Mono in Rosé Pine `#9ccfd8` teal, ~420ms each. Lines are episode-specific.
4. **DON'T PANIC** in `#f6c177` yellow, 700ms hold.
5. Cross-fade to the matching chapter-hero ship illustration on Rosé Pine Moon background, episode title in Space Grotesk on top, episode number small in `#9ccfd8`.
6. Hold 800ms. Cut to the actual screen-recording demo.

This is a literal motion-graphic adaptation of `Boot.tsx` and `BootSequence.cs` — viewers who run The Guide see the same shape they see in the videos. Authentic, not theatrical.

**Per-episode boot lines (sketch — refine during scripting):**

| Ep | Title (short) | Line 1 | Line 2 | Line 3 |
|---|---|---|---|---|
| 0 | Trailer | `> initializing sub-etha relay…` | `> infinite improbability drive: stable` | `> the guide is now open` |
| 1 | Open Claude. Ship one thing. | `> initializing sub-etha relay…` | `> improbability drive: stable` | `> the lab is now open` |
| 2 | Teach Claude your project | `> scanning project context…` | `> conventions: 14 found` | `> claude.md is now mapped` |
| 3 | Iterate without rewriting | `> rewinding…` | `> scope narrowed` | `> plan mode armed` |
| 4 | Voice, screenshots, paste | `> sub-etha listening…` | `> visual relay engaged` | `> three modalities online` |
| 5 | The ecosystem | `> skills loaded · plugins online` | `> mcp tunnels open` | `> the agent is now extensible` |
| 6 | Compound engineering | `> brainstorm · plan · work · review` | `> five commands armed` | `> compounding now` |
| 7 | Walking away | `> harness check…` | `> four pre-flights green` | `> you are clear to walk away` |
| 8 | Build a harness | `> tracer rounds: green` | `> security review: clean` | `> the agent is now trusted` |
| 9 | The receipts | `> replaying session logs…` | `> total session time: 14h` | `> the receipts are open` |

These are sketches. Refine during script writing. Czech variants for V2: parallel lines following Boot.tsx's CS strings.

**Title cards:** chapter-hero ship as background (faded to ~35% opacity over Rosé Pine Moon), episode number in `#9ccfd8` small caps Space Grotesk top-left, episode title in Space Grotesk 56pt center, "Claude Code Lab" in Manrope 18pt subtitle below the title, "Don't Panic" pill bottom-right corner using `.app-don-t-panic` style.

**Section dividers (between Promise → Beat 1 → Beat 2 → Beat 3 → Recap):** terminal-style 250ms `> beat 1: install` flash in JetBrains Mono `#9ccfd8`, on a 30%-opacity Rosé Pine Moon strip across the top of the frame. Visible long enough to read, short enough not to interrupt. Same typography as the boot lines.

**Lower-thirds (when naming a tool, chapter, or person):** thin strip across the bottom-left third of the frame, Rosé Pine Moon background at 80% opacity, JetBrains Mono `#9ccfd8` for tool names (`claude`, `/security-review`, `chrome-devtools-mcp`), Manrope `#e0def4` for human-readable names. 4–5s hold, slide in from left.

**End card (last 6–8 seconds):** matching chapter-hero ship still visible (back to ~35% opacity), text overlay: "Next: Ep N+1 · <next title>" in Space Grotesk, then `cc-lab.ondrejsvec.com/lab/<chapter-slug>` in Manrope, then the small Babel Fish 🐟 + "Subtitles · EN · CS". One subscribe ask in Manrope at the very bottom — terse, single line.

**Thumbnails (1920×1080):** matching chapter-hero ship full-bleed, episode title in Space Grotesk 92pt across the top half, episode number in a `#9ccfd8` Rosé Pine pill bottom-left (`Ep 1`), "Don't Panic" pill bottom-right. Same template every episode — only the ship and the title change.

**Descript template (reusable across all episodes):** one Descript project with placeholder slots:
- Cold-open block (drop your screen-recording teaser)
- Boot transition (motion graphic asset, episode-specific 3-line variant)
- Title card (ship + title + ep number)
- Promise section (face cam or screen, 30s)
- Three beat sections, each with section-divider intro
- Recap + next section
- End card (ship + next-ep + chapter URL)

Background music: none for V1. (Tested cheaply later if retention warrants.)

## Why This Approach

**What it optimizes for:**

- **Trust signal first.** Lab readers who land on a video recognize the identity in the first second — same ships, same palette, same boot pattern they already saw running on `:5173`. Cohesion is the moat.
- **Production efficiency via reuse.** The chapter ships, palette, type stack, and boot sequence already exist. The only new design work is the motion-graphic boot transition and the title card composition. Everything else is fill-in-template.
- **Authentic, not theatrical.** The boot in the cold open is what The Guide actually does on first run. Viewers who clone the sample see the same shape. Less "TV intro," more "the lab spilled into video."
- **Series feels like a series.** Same shape every episode lets viewers predict the rhythm — pattern interrupts at the same beats every time. Higher retention than nine bespoke productions.

**What it gives up:**

- **Differentiation against cold YouTube traffic.** A viewer who has never heard of cc-lab won't recognize the cohesion as a feature; the trust signal only fires for the lab's existing audience. Acceptable per the proposal's anti-goal — "the lab wins by being canon for the right 50 readers, not legible to 5,000 wrong ones."
- **Topical novelty per episode.** Every cold open looks similar. A viewer scanning thumbnails may not register why episode 6 differs from episode 3 at a glance. Mitigated by the matching chapter-hero ship — each ship is unique, so thumbnails still read as 9 distinct episodes.
- **Background music as engagement lever.** The lab's voice is calm, not produced. No music keeps the register honest but loses one common YouTube retention tool.

## Subjective Contract

- **Target outcome:** A viewer who has read one chapter recognizes the series identity in the first 2 seconds of any episode and feels "this is the same thing." A viewer who has never seen cc-lab gets enough cohesion that the 9 episodes read as one body of work, not a playlist of unrelated uploads. Both groups feel the calm-blueprint posture the lab already carries — engineered, not ornamental.
- **Anti-goals:** Reads like a generic "Claude Code beginner tutorial" channel. Reads like a marketing asset. Reads like the boot is "an intro animation" rather than "what the lab actually does." Looks busy, padded, or design-flourishy. Has any "smash that subscribe" energy.
- **References:** The lab itself (`/[locale]/lab` chapter pages), the chapter heroes (`public/chapters/`), the running Guide app (`localhost:5173` after `pnpm dev`), the .NET Spectre boot, Anthropic's engineering blog tone (calm, technical, no hype), Boris Cherny's `howborisusesclaudecode.com` (peer voice).
- **Anti-references:** Maven cohort marketing pages, "ship a SaaS in 4 hours" framings, GitHub README "TODO list" demos, AI tool YouTube channels with neon thumbnails and arrow overlays. The shareAI-lab/learn-claude-code manifesto tone.
- **Tone / taste rules:** No "Hey guys", no "Let's", no "amazing", no decorative emoji other than the Babel Fish 🐟 (sanctioned, bilingual signal). One line of subscribe ask per episode, terse. Voice over follows the lab's voice rules — short declaratives, active, peer-to-peer.
- **Rejection criteria:** If the cold open feels "TV-intro" rather than "this is what the lab does," it's wrong. If a viewer can't recognize Episode 7 as cohort-mate of Episode 1 from the first 3 seconds, it's wrong. If thumbnails read as a tutorial-channel grid, the typography or palette has drifted. If the boot lines feel decorative rather than informative about the episode's content, rewrite them. If a viewer recognizes the series before the lab, the funnel is backward.

## Preview And Proof Slice

**Proof slice:** Title card + boot-transition motion graphic + matching ship for **Episode 1**. One static title card mock + one 3-second motion graphic preview. If those land, the rest of the identity follows mechanically.

**Required preview artifacts (gate before recording any episode):**

| Artifact | Tool | Path |
|---|---|---|
| Episode 1 title card, dark | Figma / static PNG | `public/screenshots/series-titlecard-ep01.png` |
| Episode 1 boot transition (3s) | Descript / After Effects export | `public/visuals/series-boot-ep01.mp4` |
| Episode 1 thumbnail | Figma / static PNG | `public/screenshots/series-thumbnail-ep01.png` |
| Episode 1 lower-third example | Static PNG | `public/screenshots/series-lower-third-example.png` |
| Episode 1 end card | Static PNG | `public/screenshots/series-endcard-ep01.png` |

Reviewer: **ondrej**. All five must clear before any recording starts. Failure = back to identity refinement, not script writing.

**Rollout rule:** Pilot with Trailer + Episode 1 only. Publish unlisted. Send to 5 trusted readers for cohesion + trust-signal feedback. Measure retention (target: > 40% at 60s mark, vs YouTube average 23.7%). Only then extend the template to Block 1's remaining episodes.

## Key Design Decisions

### D1: Series name = "Claude Code Lab" — RESOLVED

**Decision:** Literal match to site / repo / plugin. No subtitle, no theme overlay.

**Rationale:** The user prioritized trust-signal-via-cohesion as the identity's primary job. Any deviation from the literal name dilutes that signal. SEO is a free side benefit — "Claude Code Lab" is what people who like the lab already type.

**Alternatives rejected:**
- *"Claude Code Lab — Sessions"* — adds slight distinction at the cost of mild cognitive load. Not worth the trade.
- *"The Lab Sessions"* — punchier on screen but breaks SEO and cohesion.
- *"Don't Panic — Claude Code Lab"* — leans on Hitchhiker's identity, but the lab's voice rules push against themed marketing language. The Hitchhiker's signature lives in *content* (DON'T PANIC pulse, Babel Fish toggle), not in the title.

### D2: Cold open = per-episode boot variant — RESOLVED

**Decision:** Every episode opens with a 2.5–3s typed-terminal sequence (3 episode-specific lines + DON'T PANIC + cross-fade to ship + title). Mirrors the Guide app's actual boot behavior.

**Rationale:** Recurring pattern interrupts at a predictable beat help retention (YouTube data: 55% drop in first 60s; pattern interrupts within the first 5–10s reduce that). Per-episode line variation gives the cold open per-episode signal — each opening tells you what episode you're in. Authenticity: the boot is what The Guide actually does, not a fabricated TV intro.

**Alternatives rejected:**
- *Boot only on Trailer + Ep 1* — preserves the boot as a launch moment but means 8 of 9 episodes have no recurring cold-open signature. Loses the retention asset.
- *Ship-only, no motion* — easiest production, calmest, but undersells the series at the precise moment retention drops hardest.

### D3: Boot lines = unique 3 per episode — RESOLVED

**Decision:** Each episode has its own 3-line boot. Authored alongside the script. Sketch table in the Chosen Approach section is a starting point, not a lock.

**Rationale:** The lines double as a per-episode tease, free from the cold-open demo's burden of carrying topic signal. Compositionally identical (3 lines, same typography, same timing); content varies.

**Alternatives rejected:**
- *Same 3 lines every episode* — strongest continuity but cold open carries less per-episode information. Wastes a 3-second slot.
- *Two fixed + one variable* — half-measure. Either lock or vary; halfway is design indecision.

### D4: Cinematic Moments rule extends to video — RESOLVED (with required design system amendment)

**Decision:** The boot pattern is permitted in video cold opens under an extended scope of the existing rule. Amend `docs/cc-lab-design-system.md:208` "Cinematic moments (deliberate exception)" to add: *"This exception extends to a video-context recurring use of the same boot pattern (cold opens of episodes), provided each episode-context use is short (<3s), narratively meaningful, and uses the same typography and palette as the in-app boot."*

**Rationale:** The original rule was scoped to in-app one-shots. Video reuse is recurring, which on the surface conflicts. But the *spirit* of the rule (cinematic moments serving narrative meaning) covers video opens. Codifying the extension makes the precedent explicit.

**Alternatives rejected:**
- *Don't amend the rule; just do it* — leaves an ambiguous precedent. Future contributors may either deny this kind of motion in other surfaces or stretch the rule too far.
- *Drop the boot from video and use a different pattern* — reduces cohesion, undercuts the trust-signal goal.

### D5: Thumbnails = matching ship + title + ep number, fixed template — RESOLVED

**Decision:** Same template every episode, only the ship and the title change. No facial reactions, no overlays, no arrows, no "vs" framings.

**Rationale:** Cohesion-via-template. Anti-tutorial-channel signal. Each ship is unique enough that 9 thumbnails still read as 9 distinct episodes — the ships do the differentiation work, the template stays static.

**Alternatives rejected:**
- *Per-episode bespoke thumbnails* — better individual click-through possible but breaks the cohesion that's the whole identity goal.
- *Face-cam thumbnails* — common YouTube pattern but reads as the saturated-tutorial genre the proposal explicitly anti-goals.

### D6: Descript template staged, not big-bang — RESOLVED

**Decision:** Build the Descript template in two passes. **Pass 1 (must-have for Ep 1 + Trailer):** cold-open + boot transition + title card + end card. **Pass 2 (refine after Ep 1 publishes):** lower-thirds, beat dividers, thumbnail iteration based on retention data.

**Rationale:** Big-bang template design risks over-engineering before any episode has been measured. Stage-1 covers what every episode must have. Stage-2 lets the data inform the rest. Matches the proposal's "pilot Episode 1 first" rollout rule.

**Alternatives rejected:**
- *Build the full template upfront* — risks designing for assumptions the pilot will invalidate.
- *No template; design per episode* — defeats the production-efficiency case.

### D7: OBS for recording in V1; streaming reuses the same setup in V2 — RESOLVED (revised)

**Decision:** V1 stack = OBS Studio (recording engine) + Stream Deck (live triggers) + Descript (post-edit). OBS records to MP4 with the cockpit + overlays composited live. V2 transition = same OBS scenes, "Go Live" instead of "Start Recording." Zero new tooling at V2.

**Rationale:** Manual overlay placement in Descript at ~30 min per episode doesn't scale across 9 episodes. AI auto-placement isn't reliable enough for V1. Stream Deck wants to be live by design — using it only for prompt insertion in V1 leaves most of its value unused. OBS as a recording tool gives us live overlay placement during recording, with no manual post-step. Same setup carries to V2 without rework.

**Alternatives rejected:**
- *Descript-only V1; OBS deferred to V2* — was the v3 framing. Reversed because manual overlay placement in Descript is tedious, error-prone, and doesn't reuse work for V2.
- *AI auto-placement in post* — Descript's AI features don't cover overlay timestamping; custom Claude-MCP scripts would have variable accuracy and need human review anyway.
- *Skip streaming entirely* — same reason as before; "how I actually work with Claude Code" sessions fill a gap neither the lab nor recorded videos cover.

### D8: OBS Studio chosen (not Streamlabs) — RESOLVED

**Decision:** OBS Studio is the recording AND streaming engine. Streamlabs rejected.

**Rationale:** OBS is lean, free, scriptable (Lua/Python via plugins), minimalist UI, well-documented WebSocket protocol (`obs-websocket v5` bundled in OBS 28+). Scene collections stored as open JSON at `~/Library/Application Support/obs-studio/basic/scenes/`. Streamlabs is "OBS plus marketing-shaped extras" — sub-goal bars, alerts, follower tickers — bundled in. The bundled extras conflict with the lab's voice rules.

**Alternatives rejected:**
- *Streamlabs for faster setup* — speed gain doesn't justify the voice mismatch.
- *Native macOS screen recording (no OBS)* — no live overlay compositing. Loses the whole architecture.
- *Restream / multistream tools* — out of scope (single-platform, YouTube only).

### D9: Overlays = HTML/CSS as OBS browser sources — RESOLVED (revised)

**Decision:** All overlays authored as vanilla HTML/CSS at `scripts/streaming/overlays/<name>.html`. **Loaded directly as OBS browser sources** for both recording (V1) and streaming (V2). Stream Deck buttons toggle source visibility live. Playwright + FFmpeg pipeline renders fallback PNG/MP4 assets for cases where a Descript-side correction is needed in post.

**Rationale:** Browser sources are OBS's native way to consume HTML. The render-then-import workflow (Playwright → PNG → Descript layer) was the right answer when Descript was the sole compositor; now that OBS handles compositing live, the renders become fallback insurance, not the primary path. Single source of truth at `scripts/streaming/overlays/`. Editable by Claude Code. No commercial assets, no drift.

**Alternatives rejected:**
- *Render to PNG/MP4 only, skip browser sources* — works but makes overlay edits a re-render-and-re-import cycle. Browser sources update in OBS the moment the HTML file changes.
- *Native OBS shape/text sources without HTML* — works for trivial overlays but breaks down with custom typography and palette tokens.
- *Buy stream overlays* — every commercial overlay reads as the saturated-streamer tier.

### D10: Stream Deck = full recording control — RESOLVED (revised)

**Decision:** Stream Deck profile during recording covers: app focus (Claude / IDE / browser / Guide tab), text-expansion prompt insertion for the lab's recurring prompts, **live overlay triggers** (toggle dictation indicator, mode badge, lower-third tool, compound step indicator), and OBS scene switching. Same profile carries to V2 streaming.

**Rationale:** Stream Deck was designed for live composition control. Using it for app focus + prompts only leaves its real value untapped. The same buttons that fire overlays during V1 recording fire them during V2 streams — no profile rework at V2.

**Alternatives rejected:**
- *Stream Deck Mobile (iPhone app)* — works as a fallback; physical buttons are faster and tactile.
- *Keyboard shortcuts only* — possible but creates dead-air moments while the human searches for the right key.
- *Voice-triggered overlays (talk to Claude to fire them)* — interesting but adds complexity and breaks the "what's on screen matches what I said" predictability.

### D11: Animation pipeline = HTML/CSS + Playwright primary; AI video for unique segments only — RESOLVED

**Decision:** Animations primarily authored as HTML/CSS, captured via Playwright (`page.video()` / `page.screencast`), converted via FFmpeg to MP4, imported as Descript layers. AI video generation (Veo 3.1 primary, Sora 2 for premium quality) reserved for unique segments where HTML/CSS genuinely can't produce the shot — and used sparingly to keep cohesion with hand-authored visuals.

**Rationale:** The boot transition (the one universal animation) is already authored as HTML/CSS in `Boot.tsx`. Reusing that source via Playwright means "edit the HTML, re-run, get a fresh MP4." Deterministic, cheap, source-controlled. AI video gen is seductive but generally produces visuals that don't cohere with the chapter-ship aesthetic — better to keep as a last-resort tool. User has both Veo 3.1 (Gemini Advanced, $0.03/sec including audio — most affordable) and Sora 2 (ChatGPT Plus/Pro, $0.10–0.30/sec) accounts; pick per-segment when the need arises.

**Alternatives rejected:**
- *AI video gen as primary (Veo or Sora for everything)* — cost-effective at small scale but loses cohesion with the lab's hand-authored visual posture; reads as "this video has AI-generated b-roll" rather than "this is the lab."
- *After Effects / Motion as primary* — more powerful but introduces a tool outside the repo and a skill outside the lab's vanilla-everything posture.

### D12: Imagery extension = Codex GPT Image 2 via existing skill — RESOLVED

**Decision:** Any new still imagery (intermission card art, unique illustrations) uses **Codex GPT Image 2** via the existing `babel-fish:image` skill. Same tool that produced the 10 chapter ships; matches that aesthetic by design.

**Rationale:** The chapter-ship aesthetic is already locked and rendered via this exact path. Using it for new imagery guarantees cohesion. Generation is fast, repeatable, and the skill's locked prompt boilerplate ensures stylistic consistency.

**Alternatives rejected:**
- *Hand-illustrated by a designer* — not in the budget; also unnecessary given the skill works.
- *Different AI image model (Midjourney, FLUX direct)* — would create stylistic drift from the locked chapter-ship style.
- *Stock photography or illustration* — anti-references; the lab uses zero stock visuals.

### D13: Descript API + MCP as a future automation lever — NOTED

**Decision:** Descript ships a public API (beta) with **MCP support**, meaning Claude Code can drive Descript directly — import media, create projects, edit, export — via an MCP connection. Not used in V1 (manual Descript editing for trim/audio/captions is fine for the pilot), but flagged as a meaningful automation lever for V2+.

**Rationale:** Once OBS records the cockpit + overlays + content into a single MP4, Descript's job shrinks to trim, audio polish, captions, export. That workflow is largely mechanical and could be automated via MCP. Worth a follow-up brainstorm once V1 has shipped a few episodes.

**Alternatives rejected:**
- *Use the API in V1 anyway* — premature; the manual workflow needs to be proven first before automating it.
- *Ignore the API entirely* — leaves a meaningful efficiency lever on the table for the long run.

### D14: Cockpit framing — minimalist top + bottom hull — PROPOSED (pending pilot validation)

**Decision (proposed, not yet committed):** The recorded video frame uses a minimalist cockpit treatment — top hull strip (~7%) + bottom hull strip (~7%) + hairline left/right side panels. Face cam slots into the top-left ceiling as a small port (~9% wide) intruding from the top hull. Top hull carries: mode pip · episode label · REC pip. Bottom hull carries: Don't Panic pill · chapter URL · subtitles meta. Dictation indicator and lower-third tool float in the canopy area only when triggered (Stream Deck buttons). Content area = ~88% of frame. Hull lines = hairline off-white-lavender at ~40% opacity, matching the chapter-ship blueprint aesthetic.

**Rationale:** The chapter-ship illustrations show the vessel from outside; the cockpit is the interior view of the same ship. Diegetic, not a costume. Minimalist redesign keeps real-estate cost to ~12% (down from ~25% in the v3 attempt with side consoles). Solves the "overlays sitting over content" problem by giving every overlay a named slot in the hull strips.

**Pending validation:** prototype shown in the artifact (`scripts/streaming/overlays/cockpit.html` to be authored). Final commit waits on (a) higher-fidelity asset pass with proper chapter-ship hull detailing, (b) test render at 1920×1080 in OBS to confirm legibility, (c) one pilot Ep 1 recording with the cockpit live. Any failure of those three sends the cockpit back to redesign. Fallback if cockpit ultimately doesn't land: corrected non-cockpit layouts (Scenes A–G in the artifact).

**Alternatives rejected:**
- *Full cockpit interior with side consoles* — was the v3 prototype. Eats ~25% real estate; terminal canopy too tight on side-by-side layouts. Replaced by minimalist top/bottom version.
- *No cockpit at all; just clean Rosé Pine background* — safer but loses the strongest available distinction signal. Worth attempting before defaulting to the safe option.
- *Ornate flight-deck-style HUD with detailed dashboard panels* — explicit anti-reference. Reads as the saturated-streamer tier the lab anti-references.

### D15: Ship imagery discipline — always actual PNG asset — RESOLVED

**Decision:** Ship imagery in any title card, end card, thumbnail, or ship-bearing overlay uses the actual PNG asset — `public/hero.png` for the canonical ship, `public/chapters/01..10-*.png` for per-chapter ship variants. Never redrawn placeholders. If AI generation is ever used for new ship imagery, `public/hero.png` is the locked reference image — judgment is not the source of truth.

**Rationale:** Even close-but-not-identical drawings drift fast across 9 episodes + a series of streams. Locking the asset locks the identity. The chapter ships were generated through the `babel-fish:image` (Codex GPT Image 2) skill with a locked prompt boilerplate; that locked-prompt discipline carries to any future ship generation.

**Alternatives rejected:**
- *Re-author ship as inline SVG for HTML/CSS overlays* — surfaced via v3 artifact mistake; even when intended as a placeholder, rendered drawings drift from the canonical and create visual inconsistency.
- *Generate fresh ship imagery via AI when needed* — same drift problem unless the canonical hero.png is the locked reference.

## Production stack — Option 3 architecture (OBS for recording + Stream Deck live + Descript for post)

V1 = recorded videos. **OBS Studio is the recording engine, not just the V2 streaming engine.** Stream Deck triggers overlays live during recording. Overlays bake into the recording at the moment they're meaningful, fired by the human who knows the moment. Descript handles only post-edit (trim, audio polish, captions, exports). Same OBS + Stream Deck setup carries to V2 streaming with zero new tooling — V2 just adds "Go Live" to the same scenes.

This was a meaningful re-decision (D7 revised). The earlier framing put OBS in V2 only, with Descript handling overlay placement in V1. Three problems with that:
1. **Manual overlay placement in Descript = ~30 min per episode** of timeline scrubbing. Tedious; doesn't scale across 9 episodes.
2. **AI auto-placement post-recording isn't there yet.** Descript's AI features don't cover overlay timestamping; a custom Claude-MCP script would have variable accuracy and need human review anyway.
3. **The Stream Deck wants to be live.** That's its whole shape. Using it for prompt insertion only in V1, then discovering "oh wait, we should have used it for overlays the whole time" in V2 is rework.

OBS as a *recording* tool (record-to-MP4 instead of stream-to-YouTube) earns its keep in V1 as the only path to live overlay placement without manual post-editing. V2 transition becomes a config change, not a rebuild.

### V1 stack (locked)

| Tool | Role | What it carries |
|---|---|---|
| **OBS Studio** | Recording engine + live scene composition. Cockpit frame is one OBS scene. Overlays are browser sources within that scene, normally hidden. Records to MP4. | Capture · cockpit chrome · live overlay compositing |
| **Elgato Stream Deck** | Physical control layer during recording. App focus (Claude / IDE / browser / Guide tab), prompt insertion via text expansion (≤500 chars per button), **OBS scene/source toggles for overlays**, scene switching. | Live triggers · prompt library · production friction layer |
| **Descript** | Post-edit only. Script-based editing (delete sentence by deleting text), Studio Sound, AI Overdub for fixing flubbed lines, captions, transcript, exports. **No overlay placement** — overlays already baked into the OBS recording. | Trim · polish · captions · export |
| **Claude Code** | Authors everything above. Writes OBS scene collection JSON, Stream Deck profile JSON, overlay HTML/CSS, Playwright render scripts, helper scripts. Drives OBS at runtime via obs-websocket / MCP if installed. | Configuration · iteration · automation |

### Delegation breakdown — what's agentic vs hands-on

| Task | Who |
|---|---|
| Write OBS scene collection JSON (cockpit + 10 overlay browser sources + positions + visibility) | **Claude** — file at `~/Library/Application Support/obs-studio/basic/scenes/cc-lab.json` |
| Write Stream Deck profile JSON (button layout + OBS action mappings) | **Claude** — file at `~/Library/Application Support/Elgato/StreamDeck/ProfilesV2/cc-lab.streamDeckProfile` |
| Author the 10 overlay HTML/CSS source files | **Claude** — `scripts/streaming/overlays/*.html` |
| Build the Playwright render pipeline (PNG + MP4 fallbacks) | **Claude** — `scripts/streaming/render-overlays.ts` |
| Configure obs-websocket connection | **Claude** — config + token setup |
| Install / configure OBS MCP server (if used) | **Claude** + a one-time install confirmation from user |
| Generate scene-collection regenerator script | **Claude** — `scripts/streaming/build-obs-config.ts` |
| Iterate on cockpit / overlays / Stream Deck mappings | **Claude** — re-run scripts, edit JSON, regenerate |
| Install OBS Studio app | **User** — one-time GUI installer (~5 min) |
| Install Elgato Stream Deck app | **User** — one-time GUI installer |
| Plug in camera + mic, tune levels | **User** — ~15 min, hardware-specific |
| Click "Import" twice (OBS scene collection + Stream Deck profile) | **User** — two clicks |
| 60-second dry-run recording with overlay triggers | **User** — practice the buttons |
| Approve preview artifacts before Ep 1 | **User** — visual review gate |

Net: **~85% agentic, ~15% hands-on**. The hands-on parts are one-time setup and physical-hardware tuning that Claude can document but can't perform.

### Why this works (and why the earlier framing was wrong)

The Stream Deck was designed for live overlay control. Using it for app focus + prompt insertion alone in V1 leaves most of its value on the table. OBS scenes are built for live composition — they store cockpit + overlays as one composable unit. Descript's strength is *script-based editing*, not *layer placement* — using it for overlays misallocates its value. Each tool plays to its strength when paired this way.

### Overlay rendering pipeline

HTML/CSS overlay source files at `scripts/streaming/overlays/` remain the **single source of truth**. Consumption is unified:

```
scripts/streaming/overlays/<name>.html
   ├── primary path (V1 + V2):
   │     └── load as OBS browser source (live, real-time)
   │           ├── Stream Deck button toggles visibility
   │           └── overlay bakes into the recording (V1) or stream (V2)
   │
   └── fallback path (rare):
         ├── static: Playwright page.screenshot() → PNG (for use as Descript layer if a recording missed an overlay trigger)
         └── animated: Playwright page.video() → WebM → ffmpeg → MP4 (same fallback)
```

In practice the fallback path is rarely needed because overlays bake in during recording. It exists as insurance for "I forgot to fire the dictation indicator at 4:32" — Descript can drop the missing layer at the right timestamp using the rendered fallback asset.

Pipeline tooling:
- **Playwright** for fallback PNG/MP4 rendering
- **FFmpeg** for WebM → MP4 conversion
- **Render script** at `scripts/streaming/render-overlays.{ts,sh}` — one command per overlay, deterministic output to `public/visuals/overlays/`
- **OBS scene collection generator** at `scripts/streaming/build-obs-config.ts` — regenerates the scene collection JSON from the overlay HTML files

### Imagery and animation — what to use when

A small decision tree for any visual asset that's not already in the lab:

| Asset type | Tool | Why |
|---|---|---|
| Reusable overlays (mode badge, dictation, compound steps, lower-thirds, end card) | HTML/CSS + Playwright | Source-controlled, deterministic, matches lab's vanilla-CSS posture |
| Cold-open boot transition (per episode) | HTML/CSS + Playwright (extending The Guide's Boot.tsx pattern) | The lab already runs this animation; reuse the source, render once per episode |
| Static stills with chapter-ship aesthetic (intermission card art, surprise illustrations) | **Codex GPT Image 2** via `babel-fish:image` skill | Same tool that produced the 10 chapter ships; matches that aesthetic by design |
| Unique animated segments (parallax establishing shot, sci-fi b-roll) — *if needed at all* | **Veo 3.1** ($0.03/sec, audio incl., Gemini Advanced) primary; **Sora 2** ($0.10–0.30/sec, ChatGPT) for premium-quality moments | Last resort. Most identity work doesn't need AI video. Use sparingly to keep cohesion with hand-authored visuals. |

**Anti-temptation:** AI video gen tools are seductive. Most overlays don't need them. The chapter ships + HTML/CSS animations + the boot transition cover ~95% of the identity work. Reach for Veo / Sora only when an HTML/CSS render genuinely can't produce the shot.

### Streaming surface (deferred to V2)

Documented here so the principles aren't lost. The actual work is post-V1.

- **OBS Studio** is the streaming engine when streaming arrives. Same overlay HTML/CSS files load as live browser sources. No drift.
- **Stream Deck** picks up overlay-trigger buttons (push-to-show dictation indicator, scene switching) at that point.
- **20-minute live YouTube sessions** of "how I work with Claude Code daily." Begins after Block 1 of recorded videos publishes — recorded videos earn the stream audience first.
- **Streamlabs and Twitch remain rejected.** Same reasons regardless of when streaming launches.

### Stream Deck as production infrastructure

The Stream Deck is the thing that makes both surfaces *executable solo*. Without it, recording and streaming both require fishing through windows and remembering keyboard shortcuts. With it, every visible action has a button.

Concrete uses (recording):
- **App focus** — single key brings Claude Code to front, IntelliJ to front, the Guide browser tab to front.
- **Prompt insertion** — pre-staged prompts as text-expansion buttons (the chapter-2 DELETE prompt, the Compound Engineering brainstorm prompt, etc.). Tap, paste. Saves "let me find the prompt" moments mid-recording.
- **Scene transitions** — for layouts when the recording switches between full-screen terminal vs split with face cam vs full-screen browser.

Concrete uses (streaming):
- **All of the above**, plus:
- **Show / hide overlay sources** in OBS — toggle the dictation indicator, the "now in plan mode" badge, the "compound loop step indicator," etc.
- **Mute / unmute mic, push-to-talk** — single key for the moments where you want to think out loud vs not.
- **Scene transitions** — going-on-break scene, intro scene, outro scene.

The 500-char text-expansion limit per Stream Deck button is a real constraint for longer prompts. Workarounds exist (Text Blaze plugin, Keyboard Maestro plugin, or chained Multi-Action with multiple Text actions). For the lab's prompts — most fit in 500 chars — the native action is enough.

### Overlay vocabulary (HTML/CSS, single source of truth)

Build overlays as **HTML/CSS browser sources**. Each overlay is one HTML file that:
- Renders correctly as an OBS browser source (live)
- Exports cleanly to a PNG sequence or MP4 for use as a Descript layer (recorded)
- Lives at `scripts/streaming/overlays/<name>.html`
- Uses the same Rosé Pine palette and type stack as the lab and the videos

One overlay vocabulary. Two consumption surfaces. No drift.

**The overlays the series + streams need:**

| Overlay | What it shows | When | Trigger |
|---|---|---|---|
| **Dictation indicator** | Pulsing mic dot + "/voice" text in JetBrains Mono `#9ccfd8`, bottom-left | While dictating into Claude Desktop or `/voice` (which is currently invisible) | Stream Deck button — push-to-show |
| **Mode badge** | Small pill top-right showing current permission mode: `default / acceptEdits / plan / auto` | Whenever permission mode is non-default; useful for streams | Stream Deck button mapped to current mode |
| **Compound step indicator** | Five-step horizontal progress: brainstorm → plan → work → review → compound, current step lit in `#f6c177` | During Compound Engineering demos | Stream Deck buttons (one per step) |
| **Now-recording / Now-streaming pill** | Small "REC" or "LIVE" indicator top-right, only visible when recording | Always when recording or live | Auto-on with OBS scene |
| **Lower-third (tool name)** | Bottom-strip showing tool name in JetBrains Mono + brief description in Manrope | When introducing a tool by name (e.g., "claude-code-action") | Stream Deck button per tool, slides in for 5s |
| **Lower-third (chapter link)** | Same shape, shows current chapter URL `cc-lab.ondrejsvec.com/lab/<chapter>` | When the conversation references a specific chapter | Stream Deck button per chapter |
| **Section divider flash** | 250ms terminal-style `> beat 1: install` flash | Beat transitions in recorded videos | Descript animation cue |
| **Boot transition (cold open)** | The full ~3s boot sequence — typed lines + DON'T PANIC + ship + title | Every recorded episode cold open; can also play at stream start | Pre-rendered for video; played as OBS Media Source for streams |
| **Stream-only "intermission" / "back in 2 min"** | Calm Rosé Pine card with the canonical ship and a typewriter-style countdown | When stepping away during a stream | Stream Deck button → OBS scene |
| **Stream-only "stream ending soon"** | Same shape with end-of-stream messaging | Last 2 minutes of stream | Stream Deck button → OBS scene |

All overlays use the same palette, the same type stack, the same restraint. None borrows the gaming-streamer vocabulary directly — no neon, no pixel-art, no chat alerts, no "+1 follower" pop-ups. Borrowed *spirit* (a physical button-driven control layer, on-screen state indicators) without the *look*.

### Anti-references for streaming

The lab's voice rules apply to streams too — sharper, since live audiences punish marketing language harder than readers do.

- No subscriber-goal bars
- No "+1 sub" alerts with sound effects
- No animated emote walls
- No "starting soon" cards with countdown timers in stylized fonts
- No webcam frame ornaments (chrome borders, RGB glow)
- No background music
- No sponsor placements

The streaming surface should look like the lab spilled into OBS, not like a Twitch streamer's office.

### What "lab spilled into OBS" looks like

- Same Rosé Pine background.
- Same typography.
- Tiny, deliberate overlays — only what serves teaching (mode badge, dictation indicator, compound step indicator).
- Face cam optional, small, in a corner, with no ornament. Off during long thinking moments.
- The chapter-hero ships as scene backgrounds for intro / break / outro screens.
- Stream Deck triggers are the *only* recurring motion — no autoplay loops, no "BRB" sliding banners.

### Stream session shape (the proposed format)

A 20-minute working session, real codebase (cc-lab itself, or a public repo), narrating as you go:

| Block | Length | What |
|---|---|---|
| Cold open | ~30s | Same boot transition as recorded videos — but live-played from an OBS Media Source. Establishes immediate cohesion with recorded series. |
| Brief framing | ~1 min | What we're working on today, in one sentence. No long intro. |
| Live work | ~17 min | Real session — `/brainstorm` or `/plan` or `/work`. Talk through what you're doing. Show the agent. Show the dictation indicator when speaking. |
| Wrap-up | ~1 min | What landed, what didn't, single line about next stream. |
| Outro | ~30s | "Stream ending soon" overlay → end. |

Total ~20 min. Streams every 1–2 weeks once cadence is found. Recorded for VOD on the same channel.

### Cohesive identity across recorded + streaming

Same boot pattern (cold open of every recorded episode AND every stream). Same chapter ships (recorded title cards AND stream "currently on chapter X" overlays). Same palette. Same typography. Same Stream Deck-driven control layer (recording uses fewer buttons; streaming uses the full grid).

A viewer who lands on a stream after watching a recorded episode recognizes the identity in 3 seconds. A viewer who finds a stream first and then a recorded episode does the same.

## Open Questions

To resolve during script writing or pilot production:

1. **Background music — none in V1, revisit?** Default no music. If pilot retention drops at low-stimulus passages (e.g., Beat 2 transition), test a single low-key track in V2.
2. **Face cam — yes-but-small or off?** Carried over from the proposal as Open Decision #1. Lean yes-but-small (corner, 200×200, off during demos), but lock during Ep 1 pilot.
3. **Czech subtitles — burned-in or YouTube CC?** YouTube CC is cheaper (no re-render), more accessible. Burned-in is more cohesive (renders the same on every platform). Test on Ep 1.
4. **End-card subscribe ask — text only, or face cam?** Default text only. Face-cam subscribe ask is the saturated-tutorial pattern the proposal anti-goals. Lock during Ep 1 pilot.
5. **Boot transition — recorded from the actual Guide app, or motion-graphic asset?** Two paths: screen-record `Boot.tsx` running and use as cold-open footage (highest authenticity), or build a Descript / After Effects motion asset that mirrors the boot (more flexible, works at 16:9 with text overlays). Recommend motion asset for flexibility; revisit if it doesn't read as authentic.
6. **Boot lines — final wording.** Sketch table is a starting point. Final wording authored alongside scripts.
7. **CS per-episode boot variants — when authored?** Same time as the EN versions, peer-voiced per `feedback_czech_peer_voice.md`. Don't translate post-hoc.
8. **Stream Deck physical layout — which model + which keys?** MK.2 (15 keys) is enough for V1 if the prompt library stays focused. XL (32 keys) gives room for a chapter row + a tool row + a scene row + a prompt row. **Lean: start with whichever you already own; add a second deck if the layout proves cramped.**
9. **Custom HTML/CSS overlay framework — vanilla or use a tool?** Vanilla HTML/CSS keeps the dependency footprint low and matches `samples/python-react`'s "no framework" posture. Alternatives like Nerd or Die templates are tempting but read as the saturated-streamer tier the lab anti-references. **Lean: vanilla, in `scripts/streaming/overlays/`, mirroring `samples/python-react/frontend/src/styles.css` for palette tokens.**
10. **Stream channel — same as videos or separate?** Same YouTube channel, single playlist for streams (`Claude Code Lab — Live`), VODs auto-published. Separate channel splits the audience.
11. **Stream cadence — when to start?** Defer until Block 1 of recorded videos has shipped. The recorded videos are the trust signal that earns the stream audience. **Reverse order risks streaming to nobody.**
12. **Latency / delay handling on stream** — agent operations sometimes take 30+ seconds. Default: don't fast-forward; let viewers see the wait. The wait is part of the practice. (If retention drops on long thinks, revisit.)

## Out of Scope (deferred or rejected)

**Rejected outright (won't ship in V1, V2, or any future phase):**

- **Animated logo / wordmark sting.** None. The boot transition + title card already carry the identity work. Adding a logo sting reads as channel-branding cruft.
- **Per-section background music cues.** None.
- **Animated transitions between beats beyond the section-divider flash.** None. Hard cuts.
- **A second YouTube channel for Czech audience.** No. Same channel, CS subtitles for V1, audio re-records for V2 trigger per the proposal's threshold.
- **Streamlabs.** OBS Studio is the streaming engine when streaming arrives. Streamlabs's bundled "alerts and goals" voice doesn't match the lab.
- **Any third-party stream overlay marketplace asset.** Overlays are vanilla HTML/CSS authored in `scripts/streaming/overlays/`, matching the lab's no-framework, no-marketing-flourish posture.
- **Twitch as a streaming platform.** YouTube only — same audience as recorded videos, single funnel.
- **Chat-overlay alerts, follower count tickers, sub-goal bars.** Reads as the saturated-streamer tier the proposal's anti-goals already cover.
- **Background music during streams or recorded videos.** None.
- **Concurrent streams to multiple platforms (Restream, etc.).** Single-platform streaming, VOD on the same channel.
- **AI video generation as primary animation tool.** Reserved as last-resort; HTML/CSS + Playwright is primary. AI video reads as AI b-roll and breaks cohesion with the chapter-ship aesthetic.

**Deferred (kept on roadmap, just not in V1):**

- **Live streaming on YouTube** — 20-min "how I work with Claude Code" sessions. Same OBS scenes + Stream Deck profile as V1, "Go Live" instead of "Start Recording." Begins after Block 1 of recorded videos publishes.
- **Multi-channel posting (Spotify Video, Twitter / LinkedIn shorts).** YouTube only at V1; mirror later if signal warrants.
- **Stinger sound effects.** Maybe a single restrained click on the DON'T PANIC pulse — decide during Ep 1 audio pass.
- **Descript API / MCP automation of episode assembly.** Lever exists; not pulled until V1 manual workflow is proven.
- **Czech audio re-records.** Trigger: a CS-subtitled episode hits 25% of total watch time.
- **Cockpit treatment commit.** Currently D14 = proposed. Lock-in waits on pilot Ep 1 with cockpit live; fallback path is non-cockpit corrected layouts.

## Memory Integration

**Contradiction check vs the proposal:** None. This brainstorm sharpens decisions left open in `docs/brainstorms/2026-04-27-video-series-proposal.md` (open decisions #1, #2, #5 partial). No existing decisions reversed.

**Novel pattern worth `/compound`:** "Cinematic Moments rule extends to video" (D4) is a design-system amendment that may apply to future surfaces (e.g., live workshop intros, conference talks). Worth a `docs/solutions/` entry once the amendment lands and we've confirmed the boot transition reads authentically in the pilot.

## Next Steps

V1 = recorded videos using OBS + Stream Deck + Descript. Four artifact families, sequenced.

**A. Visual identity proof slice** (validate cohesion in pixels before any code)
- Episode 1 title card mock (PNG, exported from HTML/CSS source — uses real chapter ship asset)
- Boot transition (3s MP4, captured via Playwright from `Boot.tsx`-derived source)
- Episode 1 thumbnail (PNG)
- Cockpit frame full preview at 1920×1080 (PNG)
- End card (PNG)

**B. Overlay HTML/CSS source + render pipeline + cockpit asset**
- `scripts/streaming/overlays/cockpit-frame.html` (the hull strips + face port placeholder + side panels)
- `scripts/streaming/overlays/dictation-indicator.html`
- `scripts/streaming/overlays/mode-badge.html`
- `scripts/streaming/overlays/compound-step-indicator.html`
- `scripts/streaming/overlays/lower-third-tool.html`
- `scripts/streaming/overlays/lower-third-chapter.html`
- `scripts/streaming/overlays/intermission.html` *(authored now, deployed in V2 streams)*
- `scripts/streaming/overlays/stream-ending-soon.html` *(same)*
- `scripts/streaming/overlays/boot-transition.html` (extends `Boot.tsx` to be standalone)
- One shared `overlays/overlay-palette.css` with Rosé Pine tokens (referencing `app/globals.css`)
- **`scripts/streaming/render-overlays.{ts,sh}`** — Playwright + FFmpeg pipeline. Renders fallback PNGs (static) and MP4s (animated) to `public/visuals/overlays/`. Used as fallback assets in case a Descript-side correction is needed in post.

**C. OBS scene collection + Stream Deck profile** (the live composition layer — locked Option 3)
- **`scripts/streaming/build-obs-config.ts`** — generates OBS scene collection JSON from the overlay HTML files. Outputs to `~/Library/Application Support/obs-studio/basic/scenes/cc-lab.json`.
- **OBS scene collection structure**:
  - One "Recording" scene with: cockpit-frame browser source (always visible) → screen capture (canopy area) → camera feed (face port slot) → 10 overlay browser sources (visibility default off, toggled by Stream Deck)
  - One "Streaming" scene (V2) with the same composition + YouTube ingest config
  - Intro / break / outro scenes for V2 streams
- **`scripts/streaming/build-streamdeck-profile.ts`** — generates Stream Deck profile JSON. Outputs to `~/Library/Application Support/Elgato/StreamDeck/ProfilesV2/cc-lab.streamDeckProfile`.
- **Stream Deck profile structure**:
  - App focus buttons: Claude desktop · Claude Code CLI · IDE · The Guide browser tab
  - Prompt insertion buttons: chapter-2 DELETE prompt · `/init` prompt · Compound brainstorm prompt · `/cc-lab-diagnose` prompt · etc.
  - Overlay toggle buttons: dictation indicator · mode badge cycler (default → acceptEdits → plan → auto) · compound step advancer · lower-third tool name picker · lower-third chapter
  - Scene switch buttons: intro / break / outro (V2-relevant; useful in V1 for pre-roll or on-air pause)
- **Documentation**: `docs/recording-setup.md` — step-by-step user guide for the ~15% manual setup (OBS install, Stream Deck install, hardware plug-in + tune, two `Import` clicks, dry-run).

**D. Descript template + post-edit workflow** (narrowed scope under Option 3)
- Descript custom **layout pack** (Pass 1: cold-open transition slot + title card slot + end card slot) — overlays are no longer part of this; Descript handles only edit + polish.
- One reference Descript project showing the post-edit flow: import OBS recording → trim using script → Studio Sound → captions → export. Documented at `docs/post-edit-flow.md`.

**Recommended order (V1):**

1. **Run `/plan` against this brainstorm** → `docs/plans/2026-04-28-feat-video-series-identity-plan.md`. Plan sequences A → B → C → D → pilot Trailer + Ep 1 with cockpit.
2. **A — proof-slice mocks.** Validate pixels before committing to overlay code. Use real chapter ships from `public/chapters/`. Cockpit at 1920×1080.
3. **B — overlay HTML/CSS + render pipeline + cockpit asset.** Author the HTML, build the Playwright renderer, generate fallback assets.
4. **C — OBS scene collection + Stream Deck profile.** Generate JSON files agentically. User imports both. ~85% Claude / ~15% user.
5. **D — Descript template (narrowed).** Layout pack for cold-open + title-card + end-card slots only.
6. **Pilot recording: Trailer + Ep 1 with cockpit live.** Publish unlisted. Measure retention. 5 trusted readers' feedback. **Cockpit commit decision (D14 → resolved or fallback) happens here.**
7. **Block 2 + 3 of recorded videos** continue rolling.

**Future phase (V2 — kicks in after Block 1 publishes):**

8. **First live stream.** Same OBS scene collection, "Go Live" config. Stream Deck profile already includes the streaming buttons.
9. **Descript MCP automation** opportunity revisited per D13.
10. **Czech audio re-records (V2 trigger)** per the proposal's 25%-watch-time threshold.
