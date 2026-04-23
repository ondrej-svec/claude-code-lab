# scripts/capture/

Three capture families. All shots land in `public/screenshots/` and are
referenced from chapter MDX via the `<Screenshot>` component.

| Family | Tool | Autonomous? | Use for |
|---|---|---|---|
| **CLI** | `freeze` + ANSI fixtures | yes | Claude-in-terminal moments |
| **WEB** | Playwright | yes (needs dev server) | Guide UI, README hero |
| **DESK** | macOS manual capture | no (needs Ondrej) | Claude Code desktop app UI |

## One-time setup

```bash
brew install charmbracelet/tap/freeze          # for CLI shots
brew install --cask font-jetbrains-mono        # so ●, →, ✓ render correctly
pnpm install                                   # Playwright for WEB shots
pnpm exec playwright install chromium          # first run only
```

## CLI captures

Fixtures live under `sessions/` as ANSI-colored text files. They're
deterministic — the same fixture renders the same PNG on any machine with the
same `freeze` version and font.

```bash
./scripts/capture/generate-fixtures.py         # regenerate .ansi from source
./scripts/capture/capture-cli.sh               # render all fixtures → PNGs
./scripts/capture/capture-cli.sh ch2-plan-output  # render just one
```

**Edit content in `generate-fixtures.py`, not in the `.ansi` files** — those
are generated outputs. The generator handles width padding for bordered
boxes and keeps ANSI codes consistent.

Shared freeze config is in `freeze.json` — theme (`rose-pine-moon`), window
chrome, padding, font. Changing it re-renders every shot uniformly.

## WEB captures

Playwright-driven. Requires `pnpm dev` running in a separate terminal.

```bash
pnpm dev                              # terminal 1
./scripts/capture/capture-web.sh      # terminal 2 — renders all web shots
./scripts/capture/capture-web.sh web-lab-index-light   # single shot
```

Password gate auto-unlocks via `WORKSHOP_PASSWORD` from `.env.local` (or
`CAPTURE_PASSWORD` env). Light/dark variants are captured separately via
`colorScheme` emulation.

Add new shots to the `shots[]` array in `capture-web.ts`.

## DESK captures

Manual. See `docs/screenshots-manual-brief.md` for the numbered brief — one
entry per shot with exact steps, target filename, and caption.

Phase R research confirmed Anthropic has published no reusable UI imagery
for the redesigned desktop app (see `docs/screenshots-phase-r-inventory.md`),
so all DESK shots require manual capture.

## Regenerating after chapter content changes

When a chapter changes a moment a screenshot illustrates:

1. Edit the matching entry in `generate-fixtures.py` (CLI) or add to
   `shots[]` (WEB).
2. Rerun the relevant capture script.
3. Commit the regenerated PNG alongside the MDX change.

Output filenames are stable (`chN-topic.png`), so MDX references don't
need to change — the committed PNG replaces the old one.

## Aesthetic rules (from the plan's subjective contract)

- Window chrome is uniform across all shots (same corners, shadow, font).
- Rosé Pine palette throughout — no bright whites in dark mode, no raw
  black in light mode.
- Captions ≤ 15 words.
- Alt text is semantic, not decorative.
- No sensitive data, real emails, tokens, real repo names other than
  `claude-code-lab`.
- No pre-April-14 desktop UI.
