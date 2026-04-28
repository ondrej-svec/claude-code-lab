---
title: "feat: video series identity, cockpit, OBS production stack, pilot Ep 1"
type: plan
date: 2026-04-28
status: in_progress
brainstorm: docs/brainstorms/2026-04-28-video-series-identity-brainstorm.md
confidence: medium
phase: 2
last_shipped_at: 2026-04-28
last_shipped_commit: e3c0fe4
---

# feat: video series identity + cockpit + OBS stack + pilot

Build the production identity and stack for the recorded video series — visual proof slice, HTML/CSS overlay vocabulary + Playwright render pipeline, OBS scene collection JSON, Stream Deck profile JSON, narrowed Descript template, then pilot Trailer + Episode 1 with the cockpit live to validate or fall back.

## Problem Statement

The series proposal (`docs/brainstorms/2026-04-27-video-series-proposal.md`) locked Option C — practice-shaped, 9 episodes + trailer. The identity brainstorm (`docs/brainstorms/2026-04-28-video-series-identity-brainstorm.md`) locked Option 3 — OBS for recording with Stream Deck live triggers, Descript for post-edit only, HTML/CSS overlays as OBS browser sources. Block 1 of recording (Trailer + Eps 1–3) is unblocked because The Guide shipped on 2026-04-28.

Nothing concrete exists yet to record into:

- No high-fidelity title-card or thumbnail mockup at 1920×1080 to verify cohesion in pixels.
- No HTML/CSS overlay source files; no render pipeline; no fallback PNG/MP4 assets.
- No OBS scene collection JSON; no Stream Deck profile JSON; no recording-setup doc.
- No Descript layout pack with the four required slots (cold-open transition · title card · end card placeholder).
- No cockpit asset — D14 is proposed, validation requires a real pilot.

Without these, "record Episode 1" is an unscoped multi-week task. With them, every subsequent episode is a fill-in-the-template job. This plan delivers the artifacts in the right order with explicit visual review gates so that drift is caught early and the pilot rule (Trailer + Ep 1 unlisted → 5 trusted readers → retention measure → commit-or-fallback) can run cleanly.

## Target End State

When this plan is done:

- **`scripts/streaming/overlays/`** contains the 8 overlay HTML/CSS source files (cockpit-frame, dictation-indicator, mode-badge, compound-step-indicator, lower-third-tool, lower-third-chapter, intermission, stream-ending-soon) plus boot-transition.html and a shared `overlay-palette.css` referencing the lab's locked Rosé Pine tokens.
- **`scripts/streaming/render-overlays.ts`** runs Playwright + FFmpeg and outputs fallback assets to `public/visuals/overlays/` for every overlay (PNG static + MP4 animated where applicable).
- **`scripts/streaming/build-obs-config.ts`** generates a complete OBS scene collection at `~/Library/Application Support/obs-studio/basic/scenes/cc-lab.json` containing: one Recording scene with the cockpit + canopy capture + face cam input + 10 overlay browser sources (default-hidden), one Streaming scene placeholder (V2), three placeholder support scenes (intro / break / outro for V2).
- **`scripts/streaming/build-streamdeck-profile.ts`** generates a Stream Deck profile at `~/Library/Application Support/Elgato/StreamDeck/ProfilesV2/cc-lab.streamDeckProfile` with: app-focus row, prompt-insertion row, overlay-trigger row, scene-switch row.
- **`docs/recording-setup.md`** documents the ~15% manual user setup (OBS + Stream Deck install, hardware plug-in, mic/cam tune, two `Import` clicks, dry-run).
- **`docs/post-edit-flow.md`** documents the narrowed Descript flow (import OBS recording → trim → Studio Sound → captions → export).
- **A Descript custom layout pack** is authored and saved by the user, importable into any Descript project.
- **`public/screenshots/series-titlecard-ep01.png`**, **`series-thumbnail-ep01.png`**, **`series-endcard-ep01.png`**, **`series-cockpit-full.png`** preview artifacts exist and are reviewed.
- **`public/visuals/series-boot-ep01.mp4`** boot transition exists and is reviewed.
- **`docs/cc-lab-design-system.md`** has the "Cinematic moments" rule extended to cover recurring video cold opens (D4 amendment).
- **The Trailer + Episode 1** are recorded into OBS, post-edited in Descript, published unlisted on YouTube, sent to 5 trusted readers, retention measured at the 60s mark.
- **D14 (cockpit) is resolved** — either committed (cockpit becomes the locked treatment for all 9 episodes) or fallback chosen (corrected non-cockpit layouts from the brainstorm's Scenes A–G). Decision recorded in the brainstorm doc.
- **`pnpm lint && pnpm test && pnpm test:e2e && pnpm build`** green at the cc-lab repo root throughout (this plan's surfaces are additive; nothing in `app/` or `samples/` is touched).

## Scope and Non-Goals

**In scope:**

- All four artifact families (A: identity proof slice · B: overlays + render pipeline + cockpit · C: OBS scene collection + Stream Deck profile · D: narrowed Descript template).
- The setup documentation (`recording-setup.md`, `post-edit-flow.md`).
- The design system amendment for "Cinematic moments" extended to video.
- The pilot Trailer + Episode 1 recording, post-edit, unlisted publish, retention measurement.
- The D14 commit-or-fallback decision based on the pilot.

**Explicitly out of scope (deferred to V2 or separate plans):**

- **Live streaming on YouTube.** OBS scene collection includes the placeholder Streaming scene, but no streaming config (YouTube ingest URL, stream key, etc.) is wired up. Out of scope per D7.
- **OBS streaming-specific scenes (intro / break / outro).** Authored as placeholders in the scene collection but not designed in detail. V2 work.
- **Stream Deck overlay-trigger buttons for streaming-only overlays** (intermission, stream-ending-soon). Buttons exist in the profile but route to OBS scenes that aren't styled yet.
- **Episodes 2–9 production.** Block 2 + Block 3 of the recorded series follow Block 1 once the pilot lands; that's a separate plan informed by retention data.
- **Czech audio re-records.** Trigger is post-Block-1 watch-time signal; not in V1 scope.
- **Descript MCP automation of episode assembly (D13).** Lever exists; not pulled until V1 manual workflow is proven.
- **The cockpit ship illustration (full hull line-art at chapter-ship fidelity).** The current cockpit prototype uses simplified hull lines; if D14 commits at the pilot review, a higher-fidelity refresh is a follow-up plan, not this one.
- **AI video generation (Sora / Veo) for unique segments.** Reserved per D11 for cases where HTML/CSS can't deliver. Not used in V1.
- **Retention iteration of overlays based on YouTube analytics.** Pass 2 of the Descript template is post-pilot; this plan covers Pass 1 only.
- **Episode-script writing.** Trailer + Ep 1 scripts are produced *during* this plan as part of the pilot recording, but the script-writing process for Eps 2–9 is a separate effort (and partially covered by the proposal brainstorm's per-episode outlines).

## Proposed Solution

### High-level architecture

V1 stack (locked in the brainstorm):

```
OBS Studio        — recording engine + live scene composition
                    cockpit hull · canopy screen capture · face cam input · 10 overlay browser sources
Stream Deck       — physical control layer during recording
                    app focus · prompt insertion · overlay triggers · scene switching
Descript          — post-edit only (no overlay placement)
                    trim · Studio Sound · AI Overdub · captions · transcript · exports
HTML/CSS overlays — single source of truth at scripts/streaming/overlays/
                    loaded as OBS browser sources (primary) + Playwright-rendered PNG/MP4 (fallback)
```

V2 transition (post-pilot, separate plan): same OBS scene collection + Stream Deck profile, with "Go Live" config added. Zero new tooling.

### Cockpit treatment (D14 — proposed, validation in pilot)

v3 simplest version, locked from the v5 mockup:

- **Top hull strip** (~5% height): mode pip (left) · centered episode label · REC pip (right). Antenna spire above center. When a tool lower-third is active, the centered text temporarily shows the tool name + brief.
- **Bottom hull strip** (~5% height): "Don't Panic" pill (left) · dictation pip when `/voice` is active · spacer · chapter URL (right of center). Width minus the face cam panel.
- **Face cam panel**: rounded-rectangle inset into bottom-right of hull, ~14% wide, 16:9 aspect ratio. Matches chapter-ship "terminal panel inset INTO the side of the hull" pattern. Live indicator pip in the corner of the cam panel.
- **Side hairlines**: single panel-line tick mid-height on each side. Otherwise empty.
- **Antenna spire**: thin centered line + 2.5px ball at top, mirroring the chapter-ship antenna.

All hull lines hairline off-white-lavender (`#e0def4` at ~40% opacity). No fills, no glow, no neon. Content area = ~85% of frame.

### Overlay rendering pipeline

```
scripts/streaming/overlays/<name>.html
   ├── primary path (V1 + V2):
   │     └── load as OBS browser source (live, real-time)
   │           └── Stream Deck button toggles visibility
   │
   └── fallback path (rare):
         ├── static: Playwright page.screenshot() → PNG
         └── animated: Playwright page.video() → WebM → ffmpeg → MP4
```

Render script `scripts/streaming/render-overlays.ts`:
- Reads the overlay HTML files
- Spawns headless Chromium via Playwright at 1920×1080, viewport 1920×1080, deviceScaleFactor 2 for retina
- For static overlays: `page.screenshot({ path: '...png', omitBackground: true })`
- For animated overlays: starts `page.video({ size: { width: 1920, height: 1080 } })`, waits the animation duration, stops, converts WebM → MP4 via ffmpeg (`ffmpeg -i in.webm -c:v libx264 -pix_fmt yuv420p out.mp4`)
- Outputs to `public/visuals/overlays/`

### OBS scene collection structure

Generated by `scripts/streaming/build-obs-config.ts` from the overlay HTML files. The script reads the overlay manifest (a `scripts/streaming/overlay-manifest.ts` module declaring per-overlay metadata) and produces a complete OBS scene collection JSON.

Recording scene composition (z-order, top to bottom):
1. **REC indicator browser source** (top-most when active)
2. **Lower-third overlay** (when active, sits in top hull center via OBS positioning)
3. **Mode badge browser source** (top hull left)
4. **Dictation indicator browser source** (bottom hull left)
5. **Compound step indicator browser source** (top of canopy when Ep 6 active)
6. **Cockpit frame browser source** (the hull lines + face cam port + bottom hull text)
7. **Face cam video capture** (sized + positioned into the cockpit face panel slot)
8. **Screen capture** (the canopy area, terminal/browser content)

OBS WebSocket integration assumed (bundled in OBS 28+). The build script can either write JSON directly to disk (cold path) or apply via WebSocket if OBS is running (hot path, used during iteration).

### Stream Deck profile structure

Generated by `scripts/streaming/build-streamdeck-profile.ts`. Layout for an MK.2 (15 keys, 5×3 grid). XL fallback uses 32 keys with extra room.

Row 1 (top, 5 keys) — **App focus**:
- `Claude Desktop` · `Claude Code CLI` · `IDE (IntelliJ / VS Code)` · `Browser → The Guide tab` · `Browser → cc-lab tab`

Row 2 (middle, 5 keys) — **Prompt insertion** (text expansion):
- `/init` prompt · Chapter-2 DELETE prompt · Compound `/brainstorm` prompt · `/cc-lab-diagnose project` · `/security-review`

Row 3 (bottom, 5 keys) — **Overlay triggers + scene switching**:
- Mode cycler (cycles default → acceptEdits → plan → auto) · Dictation toggle · Lower-third tool picker · Compound step advance · REC toggle

XL extras (rows 4–6 if XL): per-tool lower-third presets · per-chapter lower-third presets · scene switches (intro / break / outro for V2).

### Narrowed Descript template

Pass 1 layout pack with three slots:
- **Cold-open transition slot** — drop the boot MP4 here (first 3s of every episode)
- **Title card slot** — drop the title-card PNG here (next 2s)
- **End card slot** — drop the end-card PNG here (last 6–8s of every episode)

The body of the episode (5–18 min depending on episode) is the OBS recording dropped on the timeline, trimmed using Descript's script-based editor. Overlays are already baked in by OBS — Descript handles only trim + audio + captions + export.

### Pilot recording flow

After Phases 1–4 land, Phase 5 records the Trailer + Episode 1:

1. Open OBS, switch to Recording scene
2. Press Stream Deck "REC" → OBS starts recording
3. Cold open: per-episode boot already in OBS as a browser-source-overlay; press Stream Deck "Boot transition" to fire it (or trigger via a scene transition)
4. Record the demo, firing overlays via Stream Deck buttons as relevant moments arrive
5. End card: similar; press Stream Deck "End card" or transition to a dedicated end-card scene
6. Press REC again to stop → OBS writes MP4 to `~/Movies/cc-lab-ep01-takeN.mp4`
7. Open the MP4 in Descript using the layout pack
8. Trim using script-based editor (delete sentences = delete clips), Studio Sound, captions
9. Export → `~/Movies/cc-lab-ep01-final.mp4`
10. Upload to YouTube as unlisted, send to 5 trusted readers
11. After 7 days: pull retention data, evaluate against the > 40% at 60s mark threshold

### D14 cockpit commit-or-fallback gate

After pilot publishes:
- **If retention > 40% AND visual review passes** → commit cockpit. D14 → resolved. Lock the cockpit asset for Eps 2–9. Update brainstorm doc.
- **If retention < 40% OR visual review flags the cockpit** → fall back. D14 → "rejected at pilot." Re-record Trailer + Ep 1 using corrected non-cockpit layouts (Scenes A–G from the brainstorm). Update brainstorm doc.

The fallback path is real, not theatrical. The corrected non-cockpit layouts are already designed (see brainstorm's "Corrected scenes" section). Switching to fallback is replacing the cockpit-frame browser source in OBS with no-op (transparent) and adjusting the face-cam OBS source position from "in cockpit slot" to "free-floating bottom-right." ~30 minutes of OBS reconfiguration; no overlay HTML changes needed.

## Subjective Contract

**Target outcome:** A reader who has watched any cc-lab content recognizes the series identity in the first 2 seconds of any episode. Cohesion with the lab is *felt*, not performed — same Rosé Pine, same chapter ships (real, not redrawn), same Heart-of-Gold restraint, same JetBrains Mono / Manrope / Space Grotesk type stack the lab uses everywhere. The cockpit, if it lands, reads as "the lab spilled into video." If the cockpit doesn't land, the fallback layouts still read as cohesive — just less distinctive.

**Anti-goals:**
- Reads like a generic Claude Code beginner channel
- Reads like a marketing asset
- Reads like the boot or cockpit is "an intro animation" rather than "what the lab actually does"
- Looks busy, padded, design-flourishy
- Has any "smash that subscribe" energy
- Saturated-streamer aesthetic (neon HUDs, sub-goal bars, follower tickers, glitch effects)
- Cockpit reading as a costume rather than a designed instrument

**References:**
- The lab itself (`/[locale]/lab` chapter pages)
- The chapter heroes (`public/chapters/01..10-*.png`) — locked aesthetic
- The running Guide app (`localhost:5173` after `pnpm dev`) — palette, typography, restraint
- The .NET Spectre.Console boot (`samples/dotnet-core/Boot/BootSequence.cs`) — for terminal-side identity continuity
- Anthropic's engineering blog tone (calm, technical, no hype)
- Boris Cherny's `howborisusesclaudecode.com` (peer voice)

**Anti-references:**
- Maven cohort marketing pages
- "Ship a SaaS in 4 hours" framings
- GETREKT Labs / Nerd or Die / Own3D / StreamSpell sci-fi overlay packs (every commercial sci-fi overlay product)
- Twitch streamer dashboards
- Sora-generated video b-roll without strict reference imagery
- AI video-gen with default prompts (drifts off-aesthetic)

**Tone / taste rules:**
- All on-screen copy follows `docs/cc-lab-design-system.md` voice rules (no "let's", no "leverage", no "amazing", no decorative emoji other than the Babel Fish 🐟 in the bottom hull subtitles meta — sanctioned, bilingual signal).
- One line of copy per surface. UI chrome cannot have personality; chapter ships and boot lines can.
- No background music in V1 recorded videos (decision deferred to post-pilot review).
- Hull line-art = hairline off-white-lavender at ~40% opacity. No exceptions, no fills, no glow.
- Face cam panel = rounded-rectangle, 16:9 inside the panel, sized ~14% of frame width.

**Representative proof slice (Phase 1 gate):**
- Episode 1 title card mockup at 1920×1080, exported as PNG.
- Cockpit frame mockup at 1920×1080, exported as PNG, with placeholder face cam + sample terminal canopy content.
- One animated overlay rendered: dictation indicator MP4 (3s loop).

These three artifacts are the cohesion test. If they read as lab-shaped, the rest of the implementation can proceed. If they don't, redesign before any code goes in.

**Required preview artifacts (gate before each phase progresses):**

| Phase | Artifact | Tool | Path |
|---|---|---|---|
| 1 | Ep 1 title card | HTML/CSS + Playwright | `public/screenshots/series-titlecard-ep01.png` |
| 1 | Ep 1 thumbnail | HTML/CSS + Playwright | `public/screenshots/series-thumbnail-ep01.png` |
| 1 | Cockpit full preview | HTML/CSS + Playwright | `public/screenshots/series-cockpit-full.png` |
| 1 | Ep 1 end card | HTML/CSS + Playwright | `public/screenshots/series-endcard-ep01.png` |
| 2 | Boot transition | HTML/CSS + Playwright video | `public/visuals/series-boot-ep01.mp4` |
| 2 | Dictation indicator | HTML/CSS + Playwright | `public/visuals/overlays/dictation-indicator.{png,mp4}` |
| 2 | Mode badge | HTML/CSS + Playwright | `public/visuals/overlays/mode-badge.png` |
| 2 | Lower-third tool example | HTML/CSS + Playwright | `public/visuals/overlays/lower-third-tool-example.png` |
| 3 | OBS scene collection screenshot (loaded into OBS) | macOS Screenshot | `public/screenshots/series-obs-scenes.png` |
| 3 | Stream Deck profile screenshot (loaded into Stream Deck app) | macOS Screenshot | `public/screenshots/series-stream-deck-profile.png` |
| 4 | Descript template screenshot (with three slots populated by placeholder assets) | macOS Screenshot | `public/screenshots/series-descript-template.png` |
| 5 | Pilot Trailer + Ep 1 final MP4s | OBS + Descript | `~/Movies/cc-lab-trailer-final.mp4`, `~/Movies/cc-lab-ep01-final.mp4` |

**Reviewer for all preview artifacts:** Ondrej. Failure to pass review sends the work back to planning, not to the next phase.

**Rollout rule:** No public publishing until pilot Trailer + Ep 1 are unlisted, sent to 5 trusted readers, and retention is measured. D14 commit-or-fallback decision is recorded in the brainstorm doc before any Block 2 work begins.

**Rejection criteria (any one of these sends work back to planning):**
- A non-builder sees minute one of Ep 1 and says "another tutorial channel" instead of "wait, this looks different."
- The cockpit reads as a costume rather than a designed instrument.
- Any overlay sits over content text in a way that obscures it.
- A chapter ship in any visual is anything other than the actual `public/chapters/<n>-<slug>.png` asset.
- Setup needs anything beyond OBS install + Stream Deck install + plug-in cam/mic + two `Import` clicks.
- The pilot retention falls below 40% at 60s mark.
- Any rejected anti-reference pattern (neon, sub-goal bars, follower tickers, etc.) appears in the build.

## Implementation Tasks

### Phase 0 — Pre-work (one-time setup, documentation)

- [x] **Update `docs/cc-lab-design-system.md`** — add the "Cinematic moments → video extension" amendment per D4. New paragraph immediately after the existing Cinematic moments section, codifying that the boot exception extends to recurring video cold opens scoped to ≤3s, narratively meaningful, same typography and palette as the in-app boot.
- [x] **Update `.claude/settings.json` allow list** — confirm or extend `permissions.allow` to cover `playwright *`, `ffmpeg *`, `node scripts/streaming/*`, and any obs-cli / streamdeck-cli commands needed during render iteration. Test by running a small Playwright command after the change.
- [ ] **User: install OBS Studio.** macOS: `brew install --cask obs` or download from obsproject.com. Confirm version ≥ 28 (bundled obs-websocket v5 required).
- [ ] **User: install Elgato Stream Deck app.** Download from elgato.com. Plug in the Stream Deck; confirm app sees the device.
- [ ] **User: connect camera + microphone.** Plug in webcam, plug in mic. In macOS System Settings → Privacy & Security → Camera/Microphone, grant access to OBS and Stream Deck.
- [ ] **User: tune mic gain and webcam exposure.** In OBS: add a Video Capture Device source for the webcam, an Audio Input Capture for the mic. Speak normally and confirm audio peaks around -12dB to -6dB. Adjust webcam exposure if it's blown-out or too dark.

**Phase 0 exit criteria:** Design system amendment landed. Settings.json updated and tested. OBS + Stream Deck installed and seeing devices. Mic and cam tuned to normal levels. ondrej reviews and confirms.

### Phase 1 — Visual identity proof slice (artifact family A)

- [x] **Create `scripts/streaming/` directory structure** — `scripts/streaming/overlays/`, `scripts/streaming/preview/`, top-level placeholder for renderer. Add a `scripts/streaming/README.md` describing the directory layout and the V1 vs V2 path.
- [x] **Author `scripts/streaming/overlays/overlay-palette.css`** — shared CSS variables mirroring `app/globals.css` Rosé Pine Moon tokens. Include `--cc-bg`, `--cc-text`, `--cc-text-strong`, `--cc-accent-pink`, `--cc-accent-yellow`, `--cc-accent-teal`, `--cc-accent-cyan`, `--cc-hull`, `--cc-hull-soft`, plus type stack variables.
- [x] **Author `scripts/streaming/preview/title-card-ep01.html`** — Episode 1 title card at 1920×1080. **Shipped composition** (revised from v1 vertical-stacked stub): two-zone magazine cover. Ship in left ~57% (full opacity, contained); vertical hairline divider at ~x=1110; right ~38% holds eyebrow `—— CLAUDE CODE LAB`, two-line title `Open Claude. / Ship one thing.` at 88px Space Grotesk weight 600, URL `cc-lab.ondrejsvec.com / lab / first-task` in JetBrains Mono small caps. Top + bottom hairline frames inset 88px. Slate `001 — FIRST TASK` top-left, locator `EP 01 · 09` top-right. Don't Panic pill bottom-right.
- [x] **Author `scripts/streaming/preview/thumbnail-ep01.html`** — Episode 1 thumbnail at 1920×1080. **Shipped composition** (revised from v1 horizontal-stacked stub): cinema letterbox bars top + bottom (72px each, hairline borders). Active stage 46/54 split — ship contained left, title right. Title `Open Claude. / Ship one thing.` at 124px Space Grotesk weight 700 in two lines. `—— FIRST TASK` annotation tag with leading hairline above title, 220px underline below. Top bar holds eyebrow + slate ticks `001 / 009`; bottom bar holds Ep 01 teal pill + Don't Panic yellow pill.
- [x] **Author `scripts/streaming/preview/cockpit-full.html`** — full cockpit frame at 1920×1080 with placeholder content in the canopy. Top hull strip (54px) + bottom hull strip (54px, width minus the 269px face cam panel) + face cam panel rounded-rect inset bottom-right (~14% wide, 16:9 aspect) with subtle 135° gradient + LIVE pip. Antenna spire centered top, side panel ticks at midheight (y=540). Mock canopy: `claude --resume` session showing the chapter-2 DELETE prompt + agent reply. Hull lines at hairline `rgba(224, 222, 244, 0.4)`.
- [x] **Author `scripts/streaming/preview/end-card-ep01.html`** — end card at 1920×1080. **Shipped composition** (revised from v1 stacked stub): two-zone with ship LEFT (chapter-3, 78% opacity) and title RIGHT. Hairline trajectory line connects ship to title zone. Title `Teach Claude / your project` at 72px Space Grotesk weight 600 in two lines, right-aligned. Eyebrow `—— NEXT · EP 02`, URL `cc-lab.ondrejsvec.com / lab / teach-claude-your-project`. Bottom 200px three-cell flight-log meta strip: SUBTITLES (🐟 EN · CS) · CADENCE (New episode every two weeks) · CONTINUE (cc-lab.ondrejsvec.com). Slate `002 — UP NEXT` top-left, locator `CONTINUE → EP 02` top-right.
- [x] **Author `scripts/streaming/render-preview.ts`** — minimal Playwright script that loads each `preview/*.html` in headless Chromium at 1920×1080, takes a 2x retina screenshot, writes to `public/screenshots/series-<name>.png`. Uses a config object listing each preview file → output path.
- [x] **Run preview renderer** — `pnpm tsx scripts/streaming/render-preview.ts`. Outputs:
  - `public/screenshots/series-titlecard-ep01.png`
  - `public/screenshots/series-thumbnail-ep01.png`
  - `public/screenshots/series-cockpit-full.png`
  - `public/screenshots/series-endcard-ep01.png`
- [x] **Visual review gate** — ondrej reviews all four PNGs at full resolution. If any reads as off-aesthetic (cockpit reads as costume, ship overlap, text legibility issues, rejected pattern leakage), iterate the HTML/CSS, re-render, re-review. **HARD GATE: Phase 2 does not start until all four pass review.** ✓ Approved 2026-04-28 after iteration: title-card / thumbnail / end-card recomposed for clarity (ship + title in distinct zones, no overlap), and `--cc-bg-ship-match: #1a1a31` token introduced so the chapter PNG bg merges seamlessly with the page bg.

**Phase 1 exit criteria:** ✓ All four preview PNGs at 1920×1080 in `public/screenshots/`, reviewed by ondrej, approved 2026-04-28. Overlay palette CSS authored. Preview renderer script working. Shipped in commit `e3c0fe4`.

### Phase 1 → Phase 2 handoff (read this first when restarting)

The v3 compositions land what the v1 task descriptions sketched. The deltas worth carrying forward — these are now the locked conventions for any video surface that combines a chapter PNG with text:

**Token additions in `scripts/streaming/overlays/overlay-palette.css`:**

- `--cc-bg-ship-match: #1a1a31` — the actual bg color of the AI-generated chapter PNGs (sampled from corner pixels). The Rosé Pine Moon spec calls for `#232136`, but the chapter ships drifted ~14% darker during AI generation. **Use `--cc-bg-ship-match` (not `--cc-bg`) as the page background of any video surface where a chapter PNG sits on the page**, so the ship's rectangle merges seamlessly. This is a deliberate, scoped deviation from the spec — kept narrow to video previews.
- `.ship-feather` utility class — applies two crossed `linear-gradient` masks via `mask-composite: intersect`, fading the outer 6% of each PNG edge into transparency. Belt-and-suspenders for sub-pixel variation. Add `class="ship-feather"` to any chapter `<img>` over a contrasting bg.

**Composition principles (locked, derived from the v3 redesign):**

- **No overlap.** Ship and title each get their own zone with breathing room. Title text never sits over the ship's terminal panel or busy linework. Hairline dividers, slate markers, and trajectory lines are the connective tissue — meaningful, never cluttered.
- **Asymmetric two-zone layout.** Ship-left ~50–57%, title-right ~43–50%. Vertical hairline divider between zones (1px, `var(--cc-hull-line)`). Top + bottom hairline frames inset ~80–88px from edges.
- **Recurring framing chrome.** Slate marker top-left (`<num> — <label>` in JetBrains Mono small caps with a teal tick), locator top-right (episode position or continuation cue). Both at 13px, letter-spacing 0.32–0.34em.
- **Type sizes that fit.** Title card `Open Claude. Ship one thing.` at 88px on 2 lines. Thumbnail at 124px on 2 lines for YouTube small-size readability. End card `Teach Claude your project` at 72px on 2 lines (longer string).
- **Annotation pattern.** `—— LABEL` (leading hairline + JetBrains Mono small caps) for eyebrows / annotations, in `var(--cc-teal)`. Underlines below titles where it ties the block together.

**Files Phase 2 inherits:**

| File | Status |
|---|---|
| `scripts/streaming/overlays/overlay-palette.css` | shipped — Rosé Pine Moon tokens + ship-match bg + `.ship-feather` utility |
| `scripts/streaming/preview/title-card-ep01.html` | shipped reference for magazine-cover composition |
| `scripts/streaming/preview/thumbnail-ep01.html` | shipped reference for cinema-letterbox composition |
| `scripts/streaming/preview/cockpit-full.html` | shipped reference for cockpit chrome layout — **inputs the Phase 2 cockpit-frame.html spec** |
| `scripts/streaming/preview/end-card-ep01.html` | shipped reference for departure-card composition |
| `scripts/streaming/render-preview.ts` | shipped renderer — Phase 2's `render-overlays.ts` follows the same pattern but adds animation video capture |
| `public/screenshots/series-{titlecard,thumbnail,cockpit-full,endcard}-ep01.png` | shipped, approved, committed |

**Cockpit dimensions to carry into Phase 2's `cockpit-frame.html`:**

- Frame 1920×1080. Top hull strip y=0..54 (54px = ~5%). Bottom hull strip y=1026..1080. Canopy y=54..1026 (972px).
- Face cam panel: bottom-right, 269px × 151px (16:9), border-radius 12px on top-left corner only, subtle 135° gradient bg, hairline border on top + left edges.
- Antenna spire: centered, 1.5px wide × 28px tall, 5px ball at top, inside the top hull strip at y=6..34.
- Side hull ticks: 38px wide × 1px hairline at y=540 each side.
- Bottom hull strip width = 1920 − 269 = 1651px (truncated by face cam panel).
- Hull color: `rgba(224, 222, 244, 0.4)` for lines; `rgba(42, 39, 63, 0.62)` for hull-strip backdrops.

**Phase 2 starts here.** Read this section, then proceed.

### Phase 2 — Overlay HTML/CSS source + render pipeline + cockpit asset

- [ ] **Author `scripts/streaming/overlays/cockpit-frame.html`** — production cockpit asset (transparent background; only hull lines, top + bottom hull strip backgrounds at low opacity, antenna spire, side panel ticks, face cam port outline). Loads `overlay-palette.css`. Renders at 1920×1080. The face cam slot is a transparent cutout — OBS positions the actual webcam source into this region.
- [ ] **Author `scripts/streaming/overlays/dictation-indicator.html`** — pulsing dot + `/voice listening` label in JetBrains Mono yellow `#f6c177`. CSS animation: subtle pulse (2s loop, opacity 0.7 → 1.0). Sized to fit in the bottom hull strip. Transparent background.
- [ ] **Author `scripts/streaming/overlays/mode-badge.html`** — pill-style indicator showing the current permission mode. CSS supports four states via data attribute: `default`, `acceptEdits`, `plan`, `auto`. Each state has a different color (default = muted, acceptEdits = teal `#9ccfd8`, plan = yellow `#f6c177`, auto = cyan `#9ccfd8` with cyan glow). Sized to fit in top hull strip.
- [ ] **Author `scripts/streaming/overlays/compound-step-indicator.html`** — five steps (`brainstorm · plan · work · review · compound`) in a horizontal pill row. Active step highlighted in `#f6c177`. CSS supports a data attribute that sets which step is active. Sized to sit at top of canopy when triggered.
- [ ] **Author `scripts/streaming/overlays/lower-third-tool.html`** — JetBrains Mono tool name (`#9ccfd8`) + Manrope brief description (`#908caa`). Sized to replace the centered episode label in the top hull strip. Tool name and description supplied via URL query params (so a single HTML file serves all tools, parameterized at OBS browser-source URL level).
- [ ] **Author `scripts/streaming/overlays/lower-third-chapter.html`** — same structure as lower-third-tool, but for chapter URLs. Shows `cc-lab.ondrejsvec.com/lab/<chapter-slug>` with the chapter name underneath.
- [ ] **Author `scripts/streaming/overlays/intermission.html`** — V2 streaming overlay. Calm Rosé Pine card with the canonical hero ship (`/hero.png`), "Back in 2 min" label, typewriter-style countdown placeholder (the actual countdown logic is V2 work; this is just the visual template).
- [ ] **Author `scripts/streaming/overlays/stream-ending-soon.html`** — V2 streaming overlay. Same calm card with "Stream ending soon" message and a soft fade.
- [ ] **Author `scripts/streaming/overlays/boot-transition.html`** — extends `Boot.tsx` to be standalone HTML (no React). CSS-only animation: scan-line wash → 3 typed lines (~420ms each) → DON'T PANIC pulse → cross-fade to black (or to the title card via OBS scene transition). Lines are query-param-driven so each episode's boot has its own three lines.
- [ ] **Author `scripts/streaming/overlay-manifest.ts`** — TypeScript module declaring metadata for each overlay: name, type (static vs animated), default-visible (for OBS), positioning (top-hull-left, top-hull-center, etc.), animation duration if animated.
- [ ] **Author `scripts/streaming/render-overlays.ts`** — full Playwright + FFmpeg render script. Reads `overlay-manifest.ts`, iterates each overlay:
  - Static overlays: launch headless Chromium, navigate to `file:///.../<name>.html`, `page.screenshot({ path, omitBackground: true })`.
  - Animated overlays: same but use Playwright's video recording API (`page.video()` with size 1920×1080), wait the manifest-declared duration, stop, ffmpeg-convert WebM → MP4 with `libx264`, `pix_fmt yuv420p`.
  - Outputs to `public/visuals/overlays/<name>.{png,mp4}`.
- [ ] **Run render-overlays** — generate the full asset set. Visual spot-check each output PNG/MP4.
- [ ] **Author `scripts/streaming/preview/cockpit-full-with-content.html`** — variant of cockpit-full.html that overlays a real terminal recording (use a still from a Guide demo). Confirms hull doesn't fight legibility of code. Render to `public/screenshots/series-cockpit-with-content.png`.
- [ ] **Visual review gate** — ondrej reviews:
  - All overlay PNGs at full resolution
  - Boot transition MP4 (open in QuickTime, watch full 3s)
  - Cockpit-with-content PNG (terminal legibility check)
  - Confirms no rejected patterns (neon, glow, etc.) leaked in
  
  **HARD GATE: Phase 3 does not start until review passes.**

**Phase 2 exit criteria:** All 9 overlay HTML files authored. Render pipeline working end-to-end. All fallback PNGs/MP4s in `public/visuals/overlays/`. Boot transition MP4 reviewed. Cockpit-with-content legibility confirmed.

### Phase 3 — OBS scene collection + Stream Deck profile (artifact family C)

- [ ] **Research obs-websocket connection** — confirm OBS 28+ ships `obs-websocket v5` bundled. In OBS: Tools → WebSocket Server Settings → enable, set port (default 4455), generate auth token. Save token securely (do not commit).
- [ ] **Author `scripts/streaming/build-obs-config.ts`** — generates the OBS scene collection JSON. Reads `overlay-manifest.ts`. Outputs to `~/Library/Application Support/obs-studio/basic/scenes/cc-lab.json`. Scene structure:
  - **"cc-lab Recording"** scene with sources (top z-order to bottom):
    - Each overlay browser source pointing to the local HTML file (file:// URL), default-hidden except cockpit-frame
    - Face cam Video Capture Device (positioned into the cockpit face panel slot)
    - Display Capture / Window Capture for the canopy area (positioned to fill the canopy minus hull strips)
  - **"cc-lab Streaming"** placeholder scene (V2)
  - **"cc-lab Intro"** placeholder scene (V2)
  - **"cc-lab Break"** placeholder scene (V2 — uses intermission browser source)
  - **"cc-lab Outro"** placeholder scene (V2 — uses stream-ending-soon browser source)
- [ ] **User: import OBS scene collection** — in OBS: Scene Collection → Import → select `cc-lab.json`. Set as active. Confirm all sources load without errors. Check that browser sources show the overlay HTML (cockpit hull lines should be visible immediately).
- [ ] **User: position face cam source** — drag the Video Capture Device source into the cockpit face panel slot (~14% wide, bottom-right of frame). Lock the source position.
- [ ] **User: position screen capture source** — drag the Display Capture / Window Capture into the canopy area (between the hull strips). Lock the source position.
- [ ] **Author `scripts/streaming/build-streamdeck-profile.ts`** — generates Stream Deck profile JSON. Outputs to `~/Library/Application Support/Elgato/StreamDeck/ProfilesV2/cc-lab.streamDeckProfile`. Layout (15-key MK.2):
  - Row 1: app focus buttons (5)
  - Row 2: prompt insertion buttons (5)
  - Row 3: overlay triggers + REC toggle (5)
  - Each button has icon (placeholder PNG with text label), action (OBS websocket call OR text-expansion OR app-focus shortcut), and label
- [ ] **Author Stream Deck profile button icons** — small 144×144 PNG icons for each button. Use simple text labels in the lab's type stack (Manrope/Space Grotesk) on Rosé Pine Moon background. Generated via a Playwright script `scripts/streaming/render-streamdeck-icons.ts` that takes a list of `{name, label}` objects and produces an icon per item.
- [ ] **User: import Stream Deck profile** — in Stream Deck app: Profiles → Import → select `cc-lab.streamDeckProfile`. Set as active. Confirm icons load.
- [ ] **Configure OBS WebSocket connection in Stream Deck** — in Stream Deck app: install OBS Studio plugin (Stream Deck Marketplace, official). Configure connection to obs-websocket using the saved token. Test by pressing one of the overlay-trigger buttons; confirm OBS toggles the source visibility.
- [ ] **Author `docs/recording-setup.md`** — step-by-step user guide for the entire setup: OBS install + Stream Deck install + hardware plug-in + import scene collection + import profile + configure WebSocket + dry-run. Include screenshots and trouble-shooting common issues.
- [ ] **User: dry-run recording** — open OBS Recording scene. Press REC on the Stream Deck. Talk for 60 seconds, fire each overlay button at least once. Stop. Open the resulting MP4. Confirm:
  - Cockpit hull lines visible
  - Face cam in correct position
  - Each fired overlay appeared at the right time
  - Audio levels reasonable
  - No frame drops
- [ ] **Capture preview screenshots** — `public/screenshots/series-obs-scenes.png` (OBS scene collection loaded), `public/screenshots/series-stream-deck-profile.png` (Stream Deck app showing the profile).
- [ ] **Visual review gate** — ondrej reviews the dry-run MP4 + the two preview screenshots. **HARD GATE: Phase 4 does not start until review passes.**

**Phase 3 exit criteria:** OBS scene collection imported and working. Stream Deck profile imported and triggering overlays via WebSocket. Dry-run recording produces a clean MP4. Setup doc complete.

### Phase 4 — Descript template + post-edit flow (artifact family D, narrowed)

- [ ] **User: open Descript and create a new layout pack** — in Descript: Templates → Create New. Name it "Claude Code Lab".
- [ ] **User: author the three slot scenes**:
  - **Cold-open scene**: 3-second placeholder with the boot transition MP4 from `public/visuals/series-boot-ep01.mp4` as the background, fade to black at the end.
  - **Title card scene**: 2-second hold of `series-titlecard-ep01.png` (or a parameterized version using the layout pack's media-replacement feature, so future episodes substitute their own title card).
  - **End card scene**: 6-second hold of `series-endcard-ep01.png`.
- [ ] **Save the layout pack** — Templates → Save. Confirm the pack appears in the Layout Packs panel.
- [ ] **User: export the layout pack as a shareable JSON** (if Descript supports this) — for backup and team-sharing in future. If Descript doesn't support layout-pack export, document the manual recreate-from-instructions flow in `docs/post-edit-flow.md`.
- [ ] **Author `docs/post-edit-flow.md`** — documents the narrowed Descript flow:
  1. Open Descript, start a new project from the "Claude Code Lab" layout pack
  2. Drop the OBS recording MP4 onto the timeline between the cold-open and end-card slots
  3. Use script-based editor: paste the script, delete unwanted sentences (clips delete with text)
  4. Run Studio Sound on audio
  5. Run AI Overdub on any flubbed lines (optional)
  6. Generate captions; hand-correct any errors
  7. Export → MP4 1920×1080 H.264, 10 Mbps target bitrate
  8. Upload to YouTube as unlisted, send to 5 trusted readers
- [ ] **Capture preview screenshot** — `public/screenshots/series-descript-template.png` showing the layout pack with all three slots populated.
- [ ] **Visual review gate** — ondrej reviews the layout pack (open it in Descript, confirm slots work, drop a placeholder body recording, scrub the timeline). **HARD GATE: Phase 5 does not start until review passes.**

**Phase 4 exit criteria:** Descript layout pack created and saved. Post-edit flow documented. Preview screenshot captured.

### Phase 5 — Pilot recording: Trailer + Episode 1 + retention measurement

- [ ] **Write Trailer script** — 90-second trailer per the proposal brainstorm. Cold-open lines from the per-episode boot lines table (Trailer variant). Five-second clips, no narration, captions only. End slate with subscribe ask + `cc-lab.ondrejsvec.com` URL. Save to `docs/scripts/trailer.md`.
- [ ] **Write Episode 1 script** — full 12-minute script with cold open, promise, three beats (install / first task / four-beat shape recap), recap+next. Demo: DELETE on The Guide. Use the proposal brainstorm's Ep 1 outline as the structure. Save to `docs/scripts/ep01.md`.
- [ ] **Record Trailer** — open OBS Recording scene. Read trailer script. Fire overlays per the script's overlay cues. Save to `~/Movies/cc-lab-trailer-take1.mp4`.
- [ ] **Record Episode 1** — same flow, longer. ~12 min on the clock. May take 2–3 takes; keep the best one. Save to `~/Movies/cc-lab-ep01-takeN.mp4`.
- [ ] **Post-edit Trailer in Descript** — apply the layout pack, drop the recording, trim, Studio Sound, captions, export to `~/Movies/cc-lab-trailer-final.mp4`.
- [ ] **Post-edit Episode 1 in Descript** — same flow. Export to `~/Movies/cc-lab-ep01-final.mp4`.
- [ ] **Upload both to YouTube as unlisted** — in YouTube Studio: upload, set visibility = Unlisted, add to a "Claude Code Lab" playlist (also unlisted), enable captions (auto-generated; hand-correct in Descript export if available).
- [ ] **Send to 5 trusted readers** — email/Slack 5 people Ondrej trusts to give honest feedback. Include both URLs (trailer + Ep 1). Ask three questions: (a) does it feel cohesive with the lab? (b) does the cockpit add or distract? (c) where does retention break?
- [ ] **Wait 7 days** — let viewers watch and respond.
- [ ] **Pull retention data from YouTube Analytics** — for both trailer and Ep 1, capture: avg view duration, retention curve, drop-off at 60s mark, drop-off at 5min mark.
- [ ] **D14 commit-or-fallback decision** — based on retention data + reader feedback:
  - **Commit cockpit (D14 → resolved):** retention > 40% at 60s AND ≥3/5 readers say "cockpit adds." Lock cockpit treatment for Eps 2–9. Update brainstorm doc D14 status to "resolved." Schedule a follow-up plan for cockpit hi-fi line-art refinement (post-V1).
  - **Fall back (D14 → rejected at pilot):** retention < 40% OR ≥3/5 readers say "cockpit distracts." Re-record Trailer + Ep 1 using corrected non-cockpit layouts (Scenes A–G from the brainstorm). Update brainstorm doc D14 status to "rejected at pilot." Adjust OBS scene collection to remove cockpit-frame source.
- [ ] **Visual + analytics review gate** — ondrej reviews retention + reader feedback + decision rationale. **Decision recorded in `docs/brainstorms/2026-04-28-video-series-identity-brainstorm.md` under D14 status update before Block 2 work begins.**
- [ ] **(If commit) Make Trailer + Ep 1 public** — change YouTube visibility to Public. Embed Trailer at `/[locale]/lab/videos/index` (new lab page; small content addition, not a chapter rewrite).
- [ ] **(If fallback) Re-record Trailer + Ep 1 without cockpit** — same OBS setup, cockpit-frame browser source disabled. Repeat post-edit + publish unlisted + 5-reader feedback. If second pilot also fails, escalate to a separate brainstorm.

**Phase 5 exit criteria:** Trailer + Ep 1 published (or in fallback retest). D14 commit-or-fallback decision recorded. Retention data captured. Reader feedback synthesized.

### Phase 6 — Hand-off + future-phase plan stubs

- [ ] **Write follow-up plan stub for Block 2 + 3 (Eps 2–9)** — `docs/plans/YYYY-MM-DD-feat-video-series-block-2-3-plan.md`. Status: `proposed`. Lists the 8 remaining episodes to record. Cadence target: every 2 weeks. Per-episode tasks are minimal (apply the layout pack, write script, record, edit, publish) since the heavy lifting of identity + stack is done.
- [ ] **Write follow-up plan stub for V2 streaming** — `docs/plans/YYYY-MM-DD-feat-video-series-v2-streaming-plan.md`. Status: `proposed`. Lists the V2 work: OBS streaming config, YouTube ingest, first live stream. Confidence: low (depends on V1 retention).
- [ ] **Update `docs/visuals.md`** — add the video-series visual entries with their per-phase status and per-asset paths (cockpit-frame.html, overlays, etc.).
- [ ] **Run `/cc-lab-diagnose project`** — smoke-test the diagnostic plugin against the rebuilt repo to make sure nothing broke.
- [ ] **Update memory** — `~/.claude/projects/-Users-ondrejsvec-projects-claude-code-lab/memory/project_video_series_initiative.md`: record D14 outcome (committed or fallback), block 2 plan path, V2 plan path.
- [ ] **Open PR** — one PR for all of Phase 0–4 + the Phase 5 documentation/scripts (the actual recordings live outside the repo; only their reference paths and the publication record are committed). Label: `video-series`, `lab-content`, `visual`. Description references this plan and the brainstorm.

**Phase 6 exit criteria:** Follow-up plan stubs exist. Diagnostic clean. Memory updated. PR opened.

## Acceptance Criteria

1. `scripts/streaming/overlays/` contains 9 overlay HTML files + `overlay-palette.css` (cockpit-frame, dictation-indicator, mode-badge, compound-step-indicator, lower-third-tool, lower-third-chapter, intermission, stream-ending-soon, boot-transition).
2. `scripts/streaming/render-overlays.ts` runs end-to-end and produces matching PNG/MP4 fallbacks in `public/visuals/overlays/`.
3. `scripts/streaming/build-obs-config.ts` produces a valid OBS scene collection JSON that imports cleanly into OBS 28+ and shows all sources without errors.
4. `scripts/streaming/build-streamdeck-profile.ts` produces a valid Stream Deck profile that imports cleanly and triggers OBS source toggles via WebSocket.
5. All preview artifacts in `public/screenshots/series-*.png` and `public/visuals/series-boot-ep01.mp4` exist and are reviewed.
6. `docs/recording-setup.md` and `docs/post-edit-flow.md` are written, complete, and accurate enough that a fresh user could follow them end-to-end.
7. `docs/cc-lab-design-system.md` has the "Cinematic moments → video extension" amendment.
8. Trailer + Episode 1 are recorded, post-edited, and uploaded as unlisted YouTube videos.
9. 5 trusted readers have received the unlisted URLs and provided feedback.
10. YouTube Analytics retention data is captured for both trailer and Ep 1.
11. D14 (cockpit) commit-or-fallback decision is recorded in the brainstorm doc.
12. `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` green at repo root throughout (no regressions).
13. Follow-up plan stubs exist for Block 2 + 3 and V2 streaming.
14. `/cc-lab-diagnose project` runs clean against the updated repo.

## Decision Rationale

Inherited from the brainstorm (D1–D15 with full rationale). Plan-level decisions surfaced here:

### P1: Sequence A → B → C → D → pilot (not parallel)

**Decision:** Phases 1–5 run sequentially with hard visual review gates between each. No parallelism between phases.

**Rationale:** Each phase produces inputs for the next (preview mocks → overlay HTML → OBS scene collection → Descript template → pilot). Parallelizing would mean discovering a Phase-1 visual issue while Phase 2 is already half-built — wasted overlay code. Sequential with gates catches drift early when it's cheap.

**Alternatives rejected:**
- *Parallel A + B (mocks + overlay HTML at the same time)* — overlay HTML depends on the mock-validated cockpit and palette decisions. Saves time only if Phase 1 review is rubber-stamp; risks rework if it isn't.
- *Skip Phase 1 mocks; go straight to overlay HTML* — most likely path to discovering "the cockpit reads as a costume" only after we've coded 9 overlay files.

### P2: User-facing setup ≤ 15% of total work

**Decision:** All hands-on user steps are: install OBS + Stream Deck (one-time), plug in cam/mic + tune (one-time), import OBS scene collection (one click), import Stream Deck profile (one click), 60-second dry-run (once), record + post-edit Trailer + Ep 1 (the actual creative work).

**Rationale:** User said "maximum delegation." Honoring that means everything else is Claude-authored: scene collection JSON, Stream Deck profile JSON, overlay HTML, render pipeline, build scripts, docs. ~85% agentic / ~15% user is the right ratio per the brainstorm.

**Alternatives rejected:**
- *User configures OBS scenes manually via GUI* — possible but takes ~2 hours and hard to reproduce. Worse: any tweak later means redoing the GUI work. Scripted JSON is repeatable.
- *User authors overlays* — defeats the delegation goal entirely.

### P3: Pilot decides D14, not pre-pilot review

**Decision:** D14 (cockpit) commit-or-fallback decision is gated on actual pilot retention + reader feedback, not on Phase 1 visual review.

**Rationale:** Phase 1 visual review can catch obvious failures (cockpit reads as costume, ship overlap, etc.) but can't predict viewer reaction to 12 minutes of cockpit-framed content. Only a real pilot tells us if the cockpit *helps* or *distracts* over a full episode. The fallback path is explicit and cheap (~30 min OBS reconfiguration), so committing the pilot to the cockpit treatment is low-risk.

**Alternatives rejected:**
- *Pre-pilot lock based on Phase 1 review* — overconfidence in static mocks predicting moving-picture viewer experience.
- *No pilot; just commit and ship Eps 2–9* — pilots-with-fallback are how the brainstorm structured it; bypassing skips the whole validation point.

### P4: Block 2 + 3 are a separate plan, not this one

**Decision:** Eps 2–9 production is a follow-up plan, not a continuation of this one.

**Rationale:** This plan is about *making the first episode possible*. Once the identity + stack land, recording Eps 2–9 is mechanical (apply layout pack, write script, record, edit, publish) and the per-episode work is small. Separate plans for separate work; let retention data from the pilot inform Block 2's cadence and any tweaks.

**Alternatives rejected:**
- *Include all 9 episodes in this plan* — bloats the plan and assumes pilot success without data.

### P5: V2 streaming is a separate plan

**Decision:** V2 streaming work is a separate plan, post-Block-1.

**Rationale:** Same reasoning as P4 — V2 is a different surface with its own validation needs (live audience, latency handling, cadence). The OBS scene collection authored here includes V2 placeholder scenes so V2 starts from a good foundation, but the actual V2 design (which streams happen when, what content, how often) needs its own brainstorm + plan.

## Constraints and Boundaries

**Architectural:**
- All overlays must be vanilla HTML/CSS — no framework dependencies (no React, no Vue). Matches the lab's vanilla-everything posture and lets browser sources load instantly without JS bundling.
- The OBS scene collection JSON and Stream Deck profile JSON must be regenerable from the manifest — no manual hand-edits that diverge from `overlay-manifest.ts`.
- All ship imagery references the actual `cc-lab.ondrejsvec.com/hero.png` or `/chapters/<n>-<slug>.png` URLs (per D15). Never redrawn.
- No new top-level repo directories beyond `scripts/streaming/`. Sub-directories under `scripts/streaming/` are fine.

**Voice / editorial:**
- All on-screen copy follows `docs/cc-lab-design-system.md` voice rules.
- Bilingual EN+CS support: boot lines have CS variants from day one; lower-third copy can be EN-only in V1 with CS via subtitles.
- No marketing language. No "smash subscribe." No "in this video, we'll learn..."

**Visual:**
- Rosé Pine Moon palette only for the cockpit hull and overlays. Dawn (light mode) is not supported in V1 video — videos are dark-only.
- Manrope (body), Space Grotesk (display), JetBrains Mono (code/terminal/hull) — no other fonts.
- No drop shadows beyond `--shadow-soft`. No gradient overlays except inside the face cam panel (subtle 135deg gradient is acceptable and matches the chapter-ship aesthetic).
- No animated backgrounds. The cockpit boot transition is the only sanctioned animation per D4 amendment.

**Trust / privacy:**
- Zero API keys in any committed file.
- The Stream Deck profile and OBS scene collection JSON do not commit OBS WebSocket auth tokens — those are user-local. The build scripts read tokens from environment variables.
- Recordings (`~/Movies/cc-lab-*-takeN.mp4`, `~/Movies/cc-lab-*-final.mp4`) are not committed to the repo.
- Faces of trusted readers in feedback are not surfaced publicly.

**Operating:**
- All tasks must keep `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` green at the repo root.
- The new `scripts/streaming/` directory follows the same patterns as `scripts/visuals/` and `scripts/capture/` — TypeScript, deterministic, documented.

## Assumptions

| Assumption | Status | Evidence / Verification |
|---|---|---|
| OBS Studio 28+ ships obs-websocket v5 bundled | Verified | OBS official docs (since OBS 28 released 2022) |
| Playwright `page.video()` API records HTML/CSS animations cleanly at 1920×1080 | Unverified | Need to test during Phase 2 first overlay render. Mitigation: fallback to screen-recording the page via OS-level tools (QuickTime macOS Screen Recording) if Playwright video has artifacts. |
| ffmpeg is installed on Ondrej's macOS | Likely verified | Installed via Homebrew is standard for macOS dev; if not, `brew install ffmpeg` covers it. Phase 2 first task confirms. |
| Stream Deck OBS Studio plugin (official) supports source-visibility-toggle actions | Verified | Documented at elgato.com Stream Deck OBS Studio plugin; widely used. |
| OBS browser sources can load `file://` URLs from `scripts/streaming/overlays/` | Verified | OBS browser source supports both http(s) and file URLs. |
| The chapter ship images at `cc-lab.ondrejsvec.com/chapters/*.png` are publicly accessible | Verified earlier this session | Confirmed via curl HEAD on hero.png and chapter-1 ship. |
| OBS scene collection JSON format is stable across patch versions | Likely verified | OBS scene collection format has been stable through 28.x and 30.x. |
| Stream Deck profile JSON format is documented and stable | Unverified | Elgato hasn't published an official spec. Need to inspect an existing exported profile to reverse-engineer the format during Phase 3. **Mitigation:** if the format is opaque, fall back to using Stream Deck CLI commands to programmatically configure buttons. |
| Descript supports custom layout packs on Ondrej's plan | Verified | Descript help docs confirm layout-pack creation on paid plans (Pro tier and above). Ondrej is on Pro per session context. |
| YouTube Analytics provides retention data within 7 days for low-view videos | Verified | YouTube standard reporting includes retention curves; 7 days is sufficient even at low view counts (≥10 views typically gives the curve). |
| Trusted readers will respond within 7 days | Unverified — judgment call | Mitigation: send reminder at day 4; if fewer than 3 respond by day 7, extend the window or send to additional readers. |
| The cockpit reads as cohesive in moving video (not just static mock) | Unverified — this is the pilot test | Mitigation: the pilot rule with explicit fallback path is the mitigation. |
| OBS records at full quality without dropping frames on Ondrej's hardware | Unverified | Phase 0 dry-run is the verification. Mitigation: lower OBS recording bitrate or resolution if drops occur. |

**Unverified assumptions become explicit phase-zero verification tasks where applicable** (Playwright video, Stream Deck profile JSON format, ffmpeg presence, OBS recording quality).

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cockpit reads as costume in real video, not blueprint | Medium | High (pilot fails, Block 1 delayed) | Explicit fallback path to corrected non-cockpit layouts. Pilot rule with retention + reader feedback. ~30 min OBS reconfiguration, no overlay rewrites. |
| Playwright video recording produces artifacts unsuitable for production use | Medium | Medium (forces a different render path) | Phase 2 first overlay tests this. Fallback: OS-level screen recording (QuickTime macOS) or pre-rendered MP4 via After Effects (rejected unless absolutely necessary — adds external tool). |
| Stream Deck profile JSON format isn't well-documented | Medium | Medium (slows Phase 3 setup) | Inspect an existing exported profile to reverse-engineer. If still opaque, fall back to streamdeck-cli or accept manual button configuration as a one-time user step (~30 min). |
| OBS scene collection JSON breaks on patch update | Low | Medium (manual repair needed) | Pin OBS major version in `docs/recording-setup.md`. Include "if OBS auto-updates and the scene collection breaks, run `pnpm tsx scripts/streaming/build-obs-config.ts` to regenerate" as an explicit recovery step. |
| Pilot retention < 40% even with cockpit removed (fallback also fails) | Low | High (Block 1 paused, brainstorm revisited) | If second pilot also fails, escalate to a separate brainstorm. Likely culprits: episode-1 script issues, cold-open pacing, voice/audio quality. None of these are identity issues; they're production-quality issues that the next plan would address. |
| Descript layout pack doesn't support media-replacement parameterization | Low | Low (per-episode asset swaps need manual updates) | Acceptable in V1 — 9 episodes × ~2 min of manual asset placement is negligible. Document the manual flow in `post-edit-flow.md`. |
| User struggles with OBS / Stream Deck setup despite docs | Low | Medium (slows Phase 3) | `docs/recording-setup.md` includes screenshots and a troubleshooting section. Phase 3 dry-run catches issues before Phase 5. |
| `cc-lab.ondrejsvec.com/chapters/*.png` URLs change or break | Low | Medium (visual breaks) | Use absolute URLs in source files. Add a `scripts/streaming/sync-chapter-ships.ts` script that copies chapter ships to `public/visuals/overlays/ships/` for offline use as a fallback. (Out of scope for V1 unless the issue arises.) |
| Cockpit hull lines render too faint at YouTube compression | Medium | Medium (cockpit invisible after upload) | Phase 5 first take is the test. If lines disappear under compression, increase opacity from ~40% to ~55% in `cockpit-frame.html` and re-render. Visible in OBS preview before recording. |
| Lower-third in top hull conflicts with episode label (both want the center) | Resolved by design | — | D14 cockpit caption explicitly accepts that lower-third *replaces* the centered episode label while active, then reverts. One slot, two uses. Conscious tradeoff. |
| AI Overdub on Descript drifts from ondrej's voice | Low | Low (use it sparingly) | Use Overdub only for fixing single flubbed words. Re-record full sentences instead of AI-replacing them. |
| YouTube auto-captions are inaccurate for technical terms (`Claude`, `MCP`, `/voice`) | Medium | Low (subtitle quality issue) | Hand-correct captions in Descript before export. Document common technical-term corrections in a `docs/captions-glossary.md` (out of scope V1; acceptable for V1 to hand-correct per-episode). |
| Trusted readers don't include any cold-traffic perspectives | Medium | Medium (signal is biased toward lab-aware audience) | Aim for at least 1 of 5 readers being someone who hasn't seen the lab before. Acceptable for V1 — the lab's audience is the right 50, not the wrong 5,000. |
| The Ep 1 demo (DELETE on The Guide) doesn't read clearly on screen | Low | Medium (Ep 1 needs re-record) | Phase 5 dry-run script-read confirms. If the DELETE demo is too dense for 12 minutes, split into two beats or simplify. |

## References

- **Brainstorm:** `docs/brainstorms/2026-04-28-video-series-identity-brainstorm.md` — full decisions D1–D15, subjective contract, scene mockups, all rationale.
- **Companion brainstorm:** `docs/brainstorms/2026-04-27-video-series-proposal.md` — overall arc, episode list, audience.
- **Samples plan (predecessor):** `docs/plans/2026-04-27-feat-power-up-the-samples-plan.md` — The Guide is the demo canvas for Ep 1; that work is now shipped.
- **Lab improvements plan:** `docs/plans/2026-04-24-lab-improvements-plan.md` — the design discipline foundation.
- **Design system:** `docs/cc-lab-design-system.md` — palette, fonts, voice, visual constraints, ship spec, Cinematic moments rule.
- **Existing video-adjacent infrastructure:** `scripts/visuals/`, `scripts/capture/`, `scripts/freshness/` — reference patterns for how the new `scripts/streaming/` should look.
- **The Guide samples:** `samples/python-react/`, `samples/dotnet-core/` — the demo canvas for Ep 1's DELETE exercise.
- **Boot animation source:** `samples/python-react/frontend/src/components/Boot.tsx` (React version), `samples/dotnet-core/Boot/BootSequence.cs` (Spectre.Console version) — the exact pattern the cold-open boot transition mirrors.
- **Locked ship references:** `public/hero.png` (canonical), `public/chapters/01..10-*.png` (per-chapter).
- **OBS WebSocket:** [github.com/obsproject/obs-websocket](https://github.com/obsproject/obs-websocket) — protocol reference.
- **Playwright video API:** [playwright.dev/docs/videos](https://playwright.dev/docs/videos) — for the render pipeline.
- **Memory:** `~/.claude/projects/-Users-ondrejsvec-projects-claude-code-lab/memory/project_video_series_initiative.md` — current state of the initiative.

## Notes for `/work`

- **Phase ordering is strict.** Each phase has a hard visual review gate. Do not start Phase N+1 without Phase N's gate passing.
- **Phase 0 is non-trivial** for the user (installs + hardware setup). Schedule a single ~30-minute session to clear all of Phase 0 in one sitting.
- **Phase 1 is the cohesion test.** If the four preview PNGs don't read as lab-shaped, escalate to brainstorm refinement before any overlay code goes in.
- **Phase 2 starts with a Playwright video API smoke test** (one animated overlay) before authoring all 9 overlays. If the video API has artifacts, route to fallback rendering early.
- **Phase 3 has the most user interaction** (importing OBS scene collection, Stream Deck profile, configuring WebSocket connection, dry-run). Schedule a ~60-minute session.
- **Phase 4 is mostly user-side** in Descript. Claude can document the flow but can't author the layout pack directly until Descript MCP integration is wired (D13, V2).
- **Phase 5 is the actual creative work.** Don't rush it. The retention test only fires once per pilot; if Trailer + Ep 1 are rough, they undersell the architecture.
- **The fallback path for D14 is real, not theatrical.** If the cockpit fails the pilot, executing the fallback is ~30 minutes of OBS reconfiguration. No overlay code changes needed. Don't double down on a failing cockpit out of sunk-cost.
- **If any phase blocks on a real unknown (Playwright video artifacts, Stream Deck JSON format, OBS recording quality), escalate by surfacing the blocker explicitly and proposing 2–3 mitigation paths.** Don't silently work around.
- **The pilot decision is the only true gate at the end.** Everything else is process. Be honest about retention numbers and reader feedback when reviewing D14.
