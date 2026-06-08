# scripts/streaming/

Production assets for the Claude Code Lab video series.

The single source of truth for all on-screen chrome — title cards,
end cards, thumbnails, the cockpit frame, and the live overlays — is
plain HTML/CSS authored in this directory. Two consumers read those
files:

- **OBS browser sources** (live, real-time during recording / streaming)
- **Playwright renders** (PNG/MP4 fallback assets in `public/visuals/overlays/` and `public/screenshots/`)

One vocabulary, two consumption surfaces, no drift.

## Layout

```
scripts/streaming/
├── overlays/                   # production overlay HTML/CSS (Phase 2 onward)
│   ├── overlay-palette.css     # shared Rosé Pine Moon tokens + type stack
│   ├── cockpit-frame.html      # the hull strips + face cam port + antenna
│   ├── boot-transition.html    # 3s cold-open, parameterised by query string
│   ├── dictation-indicator.html
│   ├── mode-badge.html
│   ├── compound-step-indicator.html
│   ├── lower-third-tool.html
│   ├── lower-third-chapter.html
│   ├── intermission.html       # V2 streaming overlay
│   └── stream-ending-soon.html # V2 streaming overlay
│
├── preview/                    # Phase 1 cohesion-test artifacts
│   ├── title-card-ep01.html
│   ├── thumbnail-ep01.html
│   ├── cockpit-full.html       # cockpit chrome + mock canopy content
│   └── end-card-ep01.html
│
├── render-preview.ts           # Phase 1: Playwright → public/screenshots/series-*.png
├── render-overlays.ts          # Phase 2: Playwright + ffmpeg → public/visuals/overlays/
├── overlay-manifest.ts         # Phase 2: per-overlay metadata + region rects + zOrder
├── build-obs-config.ts         # Phase 3a: OBS scene-collection JSON generator
├── streamdeck-spec.ts          # Phase 3a: typed Stream Deck button declaration
├── streamdeck-icon-template.html # Phase 3a: Playwright source for icon rendering
├── render-streamdeck-icons.ts  # Phase 3a: 144×144 icon PNGs via Playwright
└── dist/                       # gitignored — per-machine build outputs
    ├── cc-lab-obs-scenes.json
    └── streamdeck-icons/
        ├── manifest.json
        └── slot00..14-*.png
```

## Per-machine vs portable artifacts

The OBS scene collection bakes absolute `file://` URLs to the overlay
HTML, so `dist/cc-lab-obs-scenes.json` is per-machine — regenerate on
each recording machine after `git pull`. Stream Deck icons are
deterministic from `streamdeck-spec.ts`; reproduce locally rather than
commit. Together that's why `dist/` is gitignored.

The Stream Deck profile bundle (`.streamDeckProfile`) is **not** generated
here — its format is undocumented and risky. Instead,
[`docs/recording-setup.md`](../../docs/recording-setup.md) walks the user
through a one-time manual button bind in the Stream Deck app, then
suggests exporting the result to `~/Documents/cc-lab.streamDeckProfile`
as a personal backup.

## V1 vs V2 path

V1 records the series via OBS, edits in Descript, publishes to YouTube.
V2 adds live streaming to the same channel using the same OBS scenes
and the same Stream Deck profile — only the recording-vs-streaming
config differs.

Everything in this directory is authored once for V1 and reused
verbatim for V2. Streaming-specific overlays (`intermission.html`,
`stream-ending-soon.html`) are authored in V1 but only deployed in V2.

## Voice and visual rules

All overlays follow `docs/cc-lab-design-system.md`:

- Rosé Pine Moon palette only. Dark mode only for video.
- Manrope (body), Space Grotesk (display), JetBrains Mono (code/hull).
- Hull lines: hairline off-white-lavender `#e0def4` at ~40% opacity.
- No gradients except inside the face cam panel.
- No animated backgrounds; the boot transition is the sole sanctioned
  motion per the D4 design-system amendment.
- One line of copy per surface. UI chrome cannot have personality;
  ships and boot lines can.

## Plan

This work is sequenced in
`docs/plans/2026-04-28-feat-video-series-identity-plan.md`. Phases 1–4
land the artifacts; Phase 5 is the pilot Trailer + Episode 1 recording
that validates the cockpit (D14) and unlocks Block 2.

## Background brainstorm

`docs/brainstorms/2026-04-28-video-series-identity-brainstorm.md`
holds the locked decisions D1–D15 with full rationale.
