# cc-lab-diagnose

A Claude Code skill that reads your repo and gives you 3-5 specific
observations about your Claude Code setup. Each observation quotes a
real line from your files. None of them score, grade, or rank.

It's the diagnostic the lab wishes existed when it was being written.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/ondrej-svec/claude-code-lab/main/skills/cc-lab-diagnose/install.sh | bash
```

Or, if you've cloned the repo:

```bash
bash skills/cc-lab-diagnose/install.sh
```

The installer drops the skill into `~/.claude/skills/cc-lab-diagnose`.
Re-run to update. `rm -rf ~/.claude/skills/cc-lab-diagnose` to remove.

## Use

Open Claude Code in any of your active repos. Then either:

- Say "diagnose my setup" / "check my Claude Code config" / "review
  my CLAUDE.md" / "what am I missing" — the skill auto-activates from
  these phrasings.
- Or invoke `/cc-lab-diagnose` directly.

The skill reads `CLAUDE.md`, the `.claude/` tree, and your last 30
commits. It returns a markdown document — 3-5 observations, each one
grounded in a quoted line from your repo.

## What it does

| | |
|---|---|
| Reads | `CLAUDE.md`, `.claude/skills/*/SKILL.md`, `.claude/settings.json`, `.claude/agents/`, `.claude/commands/`, `git log --oneline -30`, `docs/solutions/` |
| Returns | A markdown doc with 3-5 observations, each with quoted evidence, a confidence tag, a copy-paste artifact, and a chapter link |
| Categories | Context discipline, skill design, hook usage, agent and command patterns, iteration discipline, knowledge capture |

## What it doesn't do

- Modify any file in your repo (read-only)
- Score, grade, or rank your setup
- Praise without grounding ("great job!" — never)
- Recommend tools your repo doesn't already reference
- Run anything outside `git`, `rg`, `wc`, file reads
- Phone home — no telemetry, no aggregate-data collection in v0

## When the output is sparse

If your `CLAUDE.md` is empty or `.claude/` is missing entirely, the
diagnostic will say so honestly and point you at
[Chapter 3 of cc-lab](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project)
rather than invent observations.

## Why "I can't tell" is a valid output

If a category has no evidence — no heuristic match, no LLM-judged
signal — the skill marks it "I can't tell" and skips it. Forcing
observations to hit a count produces fluff. Better three sharp
observations than five mostly-true ones.

## Calibration

The skill's voice should match the lab's chapter voice — short
sentences, active, concrete, no marketing language. If the output
ever drifts into consultant-deck territory, it's a bug; file an issue.

The skill is calibrated against
[`docs/cc-lab-design-system.md`](../../docs/cc-lab-design-system.md)
in the lab repo. The rubric and output template are in this skill's
sibling files (`rubric.md`, `output-template.md`).

## Privacy

Everything stays local. The skill reads files in your cwd, runs `git`
read-only commands, and produces text output to your terminal. No
network calls (other than the LLM API call your Claude Code session
already makes). No file uploads. No data leaves your machine via
this skill.

## License + source

Source lives in the [claude-code-lab repo](https://github.com/ondrej-svec/claude-code-lab)
under `skills/cc-lab-diagnose/`. Same license as the lab.
