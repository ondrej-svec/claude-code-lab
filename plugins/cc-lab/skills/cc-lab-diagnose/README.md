# cc-lab-diagnose

A Claude Code skill that reads your repo and/or your personal
`~/.claude/` setup and gives you 3-5 specific observations about how
well-tuned your harness is. Each observation quotes a real line from
your files. None of them score, grade, or rank.

It's the diagnostic the lab wishes existed when it was being written.

## Two modes

| Mode | Question it answers | Reads |
|---|---|---|
| **project** (default) | Would a teammate cloning this repo succeed today? | `./CLAUDE.md`, `./.claude/`, `./.mcp.json`, recent git log, project plugin entries |
| **user** | Is your personal harness well-tuned? | `~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`, `~/.claude.json` (MCPs), installed plugins, auto-memory |
| **both** | Both questions, two output sections | Everything above |

Project mode is the default — it's the more common need. The
distinction matters because the rubric for "is this team-shareable?"
is different from "is your personal config sharp?" — and the
diagnostic refuses to recommend committing personal preferences to a
team repo, or putting project-specific facts in your user CLAUDE.md.

## Install

In any Claude Code session — macOS, Linux, or Windows:

```
/plugin marketplace add ondrej-svec/claude-code-lab
/plugin install cc-lab@cc-lab
```

That's it. The skill auto-activates on phrasings like "diagnose my
setup" once installed.

To update: `/plugin update cc-lab`. To remove: `/plugin uninstall cc-lab`.

### Shell-install fallback

If you'd rather not use the plugin marketplace, the legacy installer
still works:

```bash
curl -fsSL https://raw.githubusercontent.com/ondrej-svec/claude-code-lab/main/plugins/cc-lab/skills/cc-lab-diagnose/install.sh | bash
```

It drops the skill into `~/.claude/skills/cc-lab-diagnose`. Re-run to
update; `rm -rf ~/.claude/skills/cc-lab-diagnose` to remove. This path
is macOS/Linux only — Windows users should use the plugin marketplace
above.

## Use

Open Claude Code in any of your active repos. Then:

| To run | Say (or invoke) |
|---|---|
| Project mode (default) | "diagnose my project" / "audit this repo" / `/cc-lab-diagnose` / `/cc-lab-diagnose project` |
| User mode | "diagnose my setup" / "review my user config" / `/cc-lab-diagnose user` |
| Both modes | "diagnose everything" / "full diagnostic" / `/cc-lab-diagnose both` |

The skill returns a markdown document — 3-5 observations per section,
each grounded in a quoted line from your files.

## What it returns

Markdown structured as:

1. **Opening** — names the mode and date
2. **Headline** — 2-4 sentences naming the load-bearing findings.
   Reader's two-second answer to "if I only fix one thing, what is
   it?"
3. **Observations** (3-5 per mode section) — each with five fields:
   - **Title** — names the pattern (5-9 words)
   - **What I see** — 2-3 sentences quoting your actual files
   - **Confidence** — `high` / `medium` / `I can't tell`
   - **Try this** — copy-paste artifact you can apply this session
   - **Read more** — one cc-lab chapter link
4. **What to do next** — prioritized action list in three time
   buckets (this session / this week / when you have time), each
   action mapped to an observation
5. **Closing** — short tail commentary on the read

## Pairs well with (optional)

- [`babel-fish:visualize`](https://github.com/ondrej-svec/heart-of-gold-toolkit) —
  if installed, run it on the diagnosis output to render a richer
  visual artifact (mindmap / structured doc) for review or sharing.
- [`marvin:share-html`](https://github.com/ondrej-svec/heart-of-gold-toolkit) —
  if installed, publish the diagnosis as a browser-shareable URL
  via your local share server.

Neither is required. The cc-lab plugin is self-contained — these
are bonus pairings if you already have heart-of-gold-toolkit
installed.

## Categories

**Project mode** (9 categories): project memory (CLAUDE.md), project
skills/agents/commands, hooks, MCPs, permissions, hygiene
(gitignore + secrets), plugin declarations, knowledge capture,
iteration discipline.

**User mode** (6 categories): user memory, plugin hygiene, user-scope
skills/agents/commands, user MCPs, user hooks, auto-memory state.

## What it doesn't do

- Modify any file (read-only)
- Score, grade, or rank your setup
- Praise without grounding ("great job!" — never)
- Recommend tools your repo doesn't already reference
- Recommend creating skills that duplicate Claude Code built-ins
  (`/clear`, `/compact`, `/review`, `/debug`, etc.)
- Recommend committing personal preferences to your team repo, or
  putting project-specific facts in your user CLAUDE.md
- Run anything outside `git`, `rg`, `wc`, `ls`, file reads
- Phone home — no telemetry, no aggregate-data collection

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
[`docs/cc-lab-design-system.md`](../../../../docs/cc-lab-design-system.md)
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
under `plugins/cc-lab/skills/cc-lab-diagnose/`. Same MIT license as the lab.
