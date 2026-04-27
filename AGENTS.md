<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Claude Code Lab

A hands-on bilingual (EN / CS) guide to agentic coding with Claude Code — from install to compound. The way this repo is built and maintained is itself part of the lesson: the harness, the freshness skill, the diagnostic plugin, and the bilingual MDX pipeline are all worked examples.

Public site: https://cc-lab.ondrejsvec.com

For the maintenance standard behind this file, see [`docs/agents-md-standard.md`](docs/agents-md-standard.md).

## Read First

Before non-trivial edits:

1. [`README.md`](README.md) — repo orientation, scripts, directory map.
2. [`docs/cc-lab-design-system.md`](docs/cc-lab-design-system.md) — voice rules, audience, anti-goals, hybrid visual strategy, library architecture. The system of record for anything voice, visual, or structural.
3. `node_modules/next/dist/docs/` — before touching framework-sensitive code. Training data may be wrong for Next.js 16. See Framework Guidance above.
4. [`docs/plans/2026-04-24-lab-improvements-plan.md`](docs/plans/2026-04-24-lab-improvements-plan.md) — if a task is already in flight, check whether this plan covers it before starting.

## Task Routing

If you touch these areas, read these files first:

- **Chapter or library MDX content** (`content/{en,cs}/`, `content/{en,cs}/library/`):
  - [`docs/cc-lab-design-system.md`](docs/cc-lab-design-system.md) — voice rules and library architecture
  - EN and CS files must stay in sync. Voice and structural rules live in the design system doc; do not duplicate them here.

- **The `/cc-lab-diagnose` plugin** (`plugins/cc-lab/`):
  - [`plugins/cc-lab/`](plugins/cc-lab/) — skill, judge subagent, chapter knowledge bundle, artifact template
  - [`docs/cc-lab-design-system.md`](docs/cc-lab-design-system.md) — diagnostic voice and observation format

- **Freshness skill** (`.claude/skills/cc-lab-freshness/`, `scripts/freshness/`):
  - [`scripts/freshness/README.md`](scripts/freshness/README.md) — run cadence, output format, PR mechanics
  - `.claude/skills/cc-lab-freshness/` — the skill definition

- **Visuals** (`scripts/visuals/`, `scripts/capture/`):
  - [`docs/cc-lab-design-system.md`](docs/cc-lab-design-system.md) — "Hybrid visual strategy" governs which path applies to which context
  - [`docs/visuals.md`](docs/visuals.md) — production inventory and per-chapter status
  - Conceptual diagrams → `scripts/visuals/gen-chapter-hero.sh` or `gen-library-diagram.sh`
  - Terminal stills → `freeze` + `scripts/visuals/freeze.config.json`
  - Terminal casts → `vhs` + `scripts/visuals/vhs.theme.json`
  - Web captures → `scripts/capture/capture-web.sh` (requires `pnpm dev` running)

- **Debugging recurring problems** (`docs/solutions/`):
  - [`docs/solutions/README.md`](docs/solutions/README.md) — capture format
  - Grep `docs/solutions/` by symptom before starting a debug session
  - After solving a non-obvious problem, run `/marvin:compound` to leave a doc here

- **UI / site code** (`app/`):
  - `node_modules/next/dist/docs/` before any App Router or framework-sensitive change
  - [`docs/agent-ui-testing.md`](docs/agent-ui-testing.md) — layered browser verification workflow
  - Rosé Pine Dawn / Moon theming — do not introduce new design tokens without checking the design system doc

## Repo Map

```
/
├── app/                              # Next.js App Router site
├── content/{en,cs}/                  # Chapter MDX (10 chapters × 2 locales)
├── content/{en,cs}/library/          # Library entry MDX
├── plugins/cc-lab/                   # /cc-lab-diagnose marketplace plugin
├── skills/                           # cc-lab-screenshot capture skill
├── skill/                            # Companion terminal-walk skill
├── .claude/skills/cc-lab-freshness/  # Weekly freshness skill
├── scripts/freshness/                # Freshness runner, sources, snapshots
├── scripts/visuals/                  # image-gen, freeze, vhs config
├── scripts/capture/                  # Web/CLI capture pipeline
├── samples/                          # python-react and dotnet-core samples
├── docs/                             # Design system, plans, reviews, visuals inventory
├── e2e/                              # Playwright e2e tests
└── lib/                              # Shared utilities
```

## Language and Trust Boundaries

- **Participant-facing content** (`content/{en,cs}/`, `content/{en,cs}/library/`): bilingual EN + CS, both first-class. Voice rules live in `docs/cc-lab-design-system.md`.
- **Technical and config files**: English only.
- **Public-safe**: the site, the plugin, and the freshness skill are zero-telemetry and run locally. Nothing in this repo belongs behind auth.
- **Do not commit**: API keys, telemetry tokens, private session data, or anything that is not safe to make public.

## Framework Guidance

Next.js 16 (App Router). Before changing framework-sensitive code:

- Read the version-matched docs in `node_modules/next/dist/docs/` — not training data, not nextjs.org.
- Heed deprecation notices in build output.

The `<!-- BEGIN:nextjs-agent-rules -->` block at the top of this file is the canonical training-data warning. Do not duplicate it elsewhere; if it is auto-managed, leave the markers intact.

## Build and Test

```bash
pnpm dev          # dev server (Turbopack)
pnpm build        # production build
pnpm lint         # eslint
pnpm test         # vitest unit (happy-dom)
pnpm test:e2e     # playwright e2e
```

Visual capture (run from repo root):

```bash
./scripts/capture/generate-fixtures.py   # rebuild CLI ANSI fixtures
./scripts/capture/capture-cli.sh         # render CLI PNGs
./scripts/capture/capture-web.sh         # render web PNGs (needs pnpm dev)
```

## Verification Boundary

A change is not done when the diff looks plausible.

- **Unit + e2e + lint**: `pnpm lint && pnpm test && pnpm test:e2e` must be green.
- **Build**: `pnpm build` must succeed.
- **UI changes**: follow the layered workflow in [`docs/agent-ui-testing.md`](docs/agent-ui-testing.md) — local inspection, Playwright regression for critical flows, human review before complete.
- **Content changes**: both EN and CS MDX must render. If you introduced a new voice or visual rule, update `docs/cc-lab-design-system.md` in the same slice.
- **Plugin changes**: smoke-test `/cc-lab-diagnose project` against a real repo before committing.

## Done Criteria

1. `pnpm lint && pnpm test && pnpm test:e2e` green.
2. `pnpm build` succeeds.
3. UI changes: agent-driven browser loop completed per [`docs/agent-ui-testing.md`](docs/agent-ui-testing.md).
4. Content changes: both locales updated and rendering.
5. Design system doc updated if a new voice, visual, or structural pattern was introduced.
6. The next safe move is obvious — work is fully shipped, or a plan in `docs/plans/` describes where it stopped and what comes next.

## First-time Setup

After cloning, install the project-scoped plugins once. These commands are interactive in Claude Code and run in your terminal:

```text
/plugin marketplace add ondrej-svec/claude-code-lab
/plugin install cc-lab@cc-lab

/plugin marketplace add anthropics/claude-plugins-official
/plugin install chrome-devtools-mcp@claude-plugins-official
```

`cc-lab` ships `/cc-lab-diagnose`. `chrome-devtools-mcp` powers the agent-driven UI verification workflow in [`docs/agent-ui-testing.md`](docs/agent-ui-testing.md). The repo's `.claude/settings.json` already permits both — you only need to install once.

## Maintenance Triggers

Update this file when:

- Top-level entry points change (new scripts, renamed dirs, new plugin surfaces).
- Trust boundaries shift (anything affecting what is or isn't public-safe).
- The Next.js version changes materially.
- Contributors repeatedly make the same mistake that a routing entry here would prevent.
- A linked doc stops being the true source of truth.
