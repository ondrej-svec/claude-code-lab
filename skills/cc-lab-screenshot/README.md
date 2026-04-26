# cc-lab-screenshot

Captures desktop and mobile screenshots for cc-lab chapters at the lab's
v3 visual standard. Drives the target app via the
[computer-use MCP](https://docs.claude.com/en/docs/computer-use) and
enforces consistent state — dark mode, 2× retina, hidden notifications,
no PII — so visuals never need re-takes for cosmetic drift.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/ondrej-svec/claude-code-lab/main/skills/cc-lab-screenshot/install.sh | bash
```

Or from a clone of the lab repo:

```bash
bash skills/cc-lab-screenshot/install.sh
```

## Use

In Claude Code, invoke the skill explicitly or implicitly:

- "Shoot the voice chapter visuals from `examples/voice-chapter-shots.json`."
- "Take a screenshot for cc-lab — Claude desktop, mic activated, dark mode."
- Hand it a JSON shot list matching `shot-list-schema.md`.

## Files

- `SKILL.md` — instructions Claude reads when activating
- `conventions.md` — the visual contract (state, PII, filename rules)
- `shot-list-schema.md` — the JSON/YAML shape for shot requests
- `examples/voice-chapter-shots.json` — a real shot list

## What it does not do

- Generate diagrams (use `image-gen`)
- Generate terminal stills or animations (use `freeze` and `vhs` via
  `scripts/visuals/`)
- Edit MDX beyond inserting a `<Screenshot>` reference when asked
- Commit. Humans review shots before any commit.

## Reliability notes

The plan that introduces this skill flagged computer-use MCP reliability
as Risk #11. If a shot can't be captured cleanly:

1. Try the documented fallback in `SKILL.md` (e.g., iOS Simulator vs.
   QuickTime mirror for mobile).
2. If still failing, the skill stops and asks the user — never ships
   a manual screenshot without flagging the convention break.

The lab's manual fallback documentation lives at
`docs/screenshots-manual-brief.md` (legacy) — referenced for shape, not
preferred path.
