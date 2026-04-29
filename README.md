# claude-code-lab

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

![claude-code-lab — ten chapters, one practice](public/screenshots/web-lab-index-dark.png)

**→ Live at [cc-lab.ondrejsvec.com](https://cc-lab.ondrejsvec.com)**

A hands-on guide to agentic coding with Claude Code — from install to compound. Bilingual (EN / CS), practice-oriented, with copyable prompts and sample projects you can run through the full loop.

Ten spine chapters teach the path; a small library of depth entries goes further on specific topics; a diagnostic plugin asks how *your* setup measures against the patterns; a freshness skill keeps the lab honest with whatever Anthropic ships next.

## Spine — ten chapters

1. **Before we start** — orientation
2. **Your first task** — first contact
3. **Teach Claude your project** — context
4. **Iteration and control** — craft
5. **Voice and modalities** — voice dictation across surfaces, multimodal context
6. **The ecosystem** — skills, plugins, MCP, hooks
7. **Compound engineering** — brainstorm → plan → work → review → compound
8. **Where to go next** — harness building, autonomy, sandboxing
9. **Reference** — commands, settings, primitives at a glance
10. **Behind the scenes** — stats from building the lab itself

## Library — depth on demand

Chapter-affiliated entries that go further than a chapter could without bloating the path. Three entries shipped:

- **Context engineering as practice** (chapter 4 affinity) — the four moves, three layers of memory, `/compact` recipes, externalize-before-you-forget
- **Autonomous loops — when and when not** (chapter 4 affinity) — the loop that earns its keep vs the Ralph Wiggum loop, pre-flight checklist, harness-as-precondition
- **Using `/cc-lab-diagnose`** (chapter 6 affinity) — what the diagnostic reads, how to interpret an observation, honest limits

Browse at [cc-lab.ondrejsvec.com/en/lab/library](https://cc-lab.ondrejsvec.com/en/lab/library).

## `/cc-lab-diagnose` — the personal-mirror plugin

A Claude Code plugin that reads your repo (or your personal Claude Code config, or both) and returns three to five evidence-grounded observations — each tied to a specific file, a specific quote, and a specific chapter you can read for the missing context. Cross-platform, zero telemetry, runs locally.

```
/plugin marketplace add ondrej-svec/claude-code-lab
/plugin install cc-lab@cc-lab
/cc-lab-diagnose project
```

See the [library entry](https://cc-lab.ondrejsvec.com/en/lab/library/cc-lab-diagnose) for the full walkthrough.

## What's inside this repo

- **`app/`** — public guide site (Next.js 16, Tailwind 4, Rosé Pine theme, dark/light)
- **`content/{en,cs}/`** — chapter MDX (10 chapters × 2 locales)
- **`content/{en,cs}/library/`** — library entry MDX (3 entries × 2 locales)
- **`docs/cc-lab-design-system.md`** — the lens: voice rules, audience, anti-goals, visual conventions, library architecture
- **`plugins/cc-lab/`** — `/cc-lab-diagnose` marketplace plugin (skill + Sonnet judge subagent + bundled chapter knowledge + HTML artifact template)
- **`skills/cc-lab-screenshot/`** — internal screenshot capture skill (computer-use MCP)
- **`.claude/skills/cc-lab-freshness/`** — internal lens-aware freshness skill that watches Anthropic's shipping surface and proposes lab-shaped edits as PRs (runs as an Anthropic Routine on a weekly schedule; see `scripts/freshness/README.md`)
- **`samples/python-react/`** — minimal Python + React sample project
- **`samples/dotnet-core/`** — minimal cross-platform .NET Core sample project
- **`skill/`** — companion Claude Code skill that walks through the lab from your terminal

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The guide is public and needs no runtime environment variables.

## Scripts

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm start        # run built app
pnpm lint         # eslint
pnpm test         # vitest unit
pnpm test:e2e     # playwright e2e
```

## Visuals

Three production paths, each fitting a different shape (see `docs/cc-lab-design-system.md` "Hybrid visual strategy" for the full rules):

- **Conceptual diagrams** (boxes, arrows, flow) — Codex GPT Image 2 via the `image-gen` skill. Helpers: `scripts/visuals/gen-chapter-hero.sh` (chapter heroes, ship-locked) and `scripts/visuals/gen-library-diagram.sh` (library diagrams, no ship).
- **Static terminal stills** — [`freeze`](https://github.com/charmbracelet/freeze) themed rose-pine-moon via `scripts/visuals/freeze.config.json`, rendered as `<TerminalOutput>` MDX.
- **Animated terminal sessions** — [`vhs`](https://github.com/charmbracelet/vhs), themed via `scripts/visuals/vhs.theme.json`, rendered as `<TerminalCast>` MDX.
- **Desktop / mobile screenshots** — `cc-lab-screenshot` skill (computer-use MCP). Manual capture is a documented fallback.

Web index captures regenerate via `scripts/capture/`:

```bash
./scripts/capture/generate-fixtures.py    # rebuild CLI ANSI fixtures
./scripts/capture/capture-cli.sh          # render CLI PNGs
./scripts/capture/capture-web.sh          # render WEB PNGs (needs pnpm dev)
```

## Design

Rosé Pine Dawn (light) / Moon (dark). Manrope body, Space Grotesk display. Lifted from the [Harness Lab](https://github.com/ondrej-svec) design system.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Czech corrections especially welcome.

## Security

See [SECURITY.md](SECURITY.md) — use GitHub private vulnerability reporting, don't file public issues for security bugs.

## License

[MIT](LICENSE) — © 2026 Ondrej Svec.
