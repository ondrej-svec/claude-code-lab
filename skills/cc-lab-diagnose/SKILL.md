---
name: cc-lab-diagnose
description: Diagnose a Claude Code setup against cc-lab patterns. Reads CLAUDE.md, the .claude/ directory, and recent git log, then returns 3-5 actionable observations with quoted evidence, a confidence tag, a copy-paste artifact, and a link to the relevant cc-lab chapter. Activate when the user says "diagnose my setup", "check my Claude Code config", "review my CLAUDE.md", "what am I missing", or invokes /cc-lab-diagnose.
allowed-tools: Read, Glob, Grep, Bash
---

# cc-lab-diagnose

Reads a builder's repo and returns a short, specific diagnosis of their
Claude Code practice. Output is shaped for the lab's voice: no
sycophancy, no generic advice, every observation grounded in evidence
quoted from the user's own files.

## When to activate

- User says "diagnose my setup", "check my Claude Code config",
  "review my CLAUDE.md", "what am I missing", "what would the lab say
  about this repo"
- User invokes `/cc-lab-diagnose` directly
- User asks for an honest read on their `.claude/` directory or hooks

If none of these match, do not activate.

## Boundaries — what this skill does and does not do

**Does:**
- Read the repo at the current working directory
- Quote evidence from real files
- Produce 3-5 observations with copy-paste artifacts
- Link to the relevant cc-lab chapter for each observation
- Report "I can't tell — read this chapter" when signal is too weak

**Does not:**
- Modify any file in the user's repo
- Score, grade, or rate the setup (no L1-L4 maturity ladders, no
  numeric scores)
- Produce more than 5 observations (depth over breadth)
- Comment on patterns it can't quote evidence for
- Praise the setup unprompted (no "great job!" — just observations)
- Recommend new tools, MCPs, or services that aren't already in the
  user's repo or referenced in cc-lab chapters
- Run write-mode commands or anything outside `git`, `rg`, `wc`, file
  reads

## How to run a diagnosis

### 1. Confirm the target

The skill diagnoses the **current working directory** as a Claude Code
project. Before reading anything, confirm:

- The cwd is a git repo (`git rev-parse --is-inside-work-tree`)
- Either `CLAUDE.md` exists, or `.claude/` exists, or both

If neither exists, stop and say so. The diagnosis is for active
Claude Code setups; if there's nothing to read, there's nothing to
diagnose. Suggest [Chapter 3: Teach Claude your project](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project)
as a starting point and exit.

### 2. Gather inputs (read-only)

Read these in order, capping each at a reasonable size:

| Source | How | Cap |
|---|---|---|
| `CLAUDE.md` | `Read` (full file if ≤500 lines, else first 500) | 500 lines |
| `.claude/` tree | `Glob` for everything under `.claude/**/*` | 200 paths |
| Skill files | `Read` first 80 lines of each `.claude/skills/*/SKILL.md` | 80 lines × N |
| Hook config | `Read` `.claude/settings.json` and `.claude/settings.local.json` | full |
| Recent git log | `Bash` — `git log --oneline -30` and `git log -5 --stat` | 30 commits |
| `docs/solutions/` | `Glob` if present, count entries | path count |

If a path doesn't exist, note it and move on. Missing paths are signal,
not error.

### 3. Run the rubric

Read `rubric.md` (this file's sibling). It encodes six observation
categories — context discipline, skill design, hook usage, agent and
command patterns, iteration discipline, knowledge capture. For each
category:

1. Run the heuristic checks listed in the rubric
2. If a heuristic fires, draft an observation with quoted evidence
3. If no heuristic fires but the category is interesting, run an
   LLM-judged read of the relevant files and draft an observation
4. If neither produces evidence-grounded signal, mark the category as
   "I can't tell" and skip it (do not invent observations)

Pick the **3-5 strongest** drafts. Strongest = (a) most evidence-rich,
(b) most actionable, (c) covers different categories where possible.
Drop the rest. Five mediocre observations are worse than three sharp
ones.

### 4. Write the output

Use `output-template.md` (sibling). For each observation, fill in:

- **Title** — 5-9 words, names the pattern, no praise/blame language
- **What I see** — 2-3 sentences with at least one quoted line from
  the user's files, file path included
- **Confidence** — `high` (heuristic match + evidence) /
  `medium` (LLM-judged with evidence) /
  `I can't tell` (signal too weak — read the chapter)
- **Try this** — a copy-paste artifact: a CLAUDE.md addition, a SKILL.md
  scaffold, a Bash command, a prompt. Must be runnable or pasteable as-is.
- **Read more** — exactly one cc-lab chapter link

Wrap with the opening + closing lines from `output-template.md`. No
extra preamble. No "great question!" No closing pep-talk.

### 5. Self-check before returning

Before handing the output back:

- [ ] Every observation quotes at least one line from a real file in
  the user's repo (not made up, not paraphrased away)
- [ ] No observation gives advice the user didn't ask for that lacks
  a copy-paste artifact
- [ ] No observation grades, scores, rates, or ranks the setup
- [ ] No "great", "amazing", "best-in-class", "world-class", "exciting"
  language anywhere
- [ ] At most 5 observations; if you wrote 6+, drop the weakest
- [ ] Each observation links to a real chapter (the chapter manifest
  is in `rubric.md` Appendix A — verify slugs)

If any check fails, fix before returning.

## Rubric design (B1 / Open Q3 resolution)

This skill uses a **hybrid rubric**, layered as:

1. **Heuristic layer** (deterministic, runs first) — file existence,
   line counts, frontmatter shape, commit-message patterns. Fast.
   Produces high-confidence signals when it matches.
2. **LLM-judge layer** (the agent's own reading, runs second) — reads
   actual content (e.g., what does this CLAUDE.md teach the agent vs.
   leave implicit; what loop does this commit sequence show) when
   heuristics aren't enough. Produces medium-confidence signals.
3. **"I can't tell" layer** — when neither produces evidence, the
   skill says so explicitly. The reader gets a chapter link, not a
   guess.

The skill **does not** run external linters, eval harnesses, or judge
the setup against a fixed "correct answer." The rubric encodes
patterns the lab teaches; observations name the gap between what the
repo shows and what the chapter would teach. The reader judges
relevance to their context — the skill reports, doesn't prescribe.

## Validation criteria (B2 / Open Q5 resolution)

This skill v0 ships when:

- **Self-test (Ondrej, B5):** Diagnoses on at least 2 of his own
  active repos (e.g., `Bobo`, `claude-code-lab`). Bar: ≥2 of 5
  observations on each repo are non-trivial and actionable; zero
  observations are wrong (claim a pattern that isn't there) or
  embarrassing (sycophantic, generic, would not survive
  `feedback_content_pipeline_quality.md`).
- **External test (B6):** 2-3 friends run on their own repos with
  consent. Bar: ≥2 of 3 testers find ≥1 observation actionable
  enough to act on the same week. Zero false-positive observations
  across all runs.
- **Negative bar:** if any run produces fluff, generic advice, or
  praise-without-grounding in >20% of observations, send back to B7
  for rubric tightening before re-test.

These bars favor precision over recall. A small skill that says one
true thing per repo beats a verbose skill that says five mostly-true
things.

See `rubric.md` for the full evidence-grounding standards each
observation must pass.

## Anti-patterns this skill must refuse

| Pattern | Why refuse |
|---|---|
| "Your setup is solid! Here are 5 things to consider..." | Sycophancy — violates lab voice |
| "You should add a SLA-tracking MCP" (without evidence the user wants one) | Recommending tools the repo doesn't reference |
| "Your CLAUDE.md is too long" (without quoting it) | Advice without quoted evidence |
| "Score: 7/10" or any maturity-ladder framing | Anti-goal from cc-lab design system |
| "Most teams I see do X" | Generic peer pressure, not specific to this repo |
| "Welcome! Let me take a look at your setup..." | Opening pleasantry / throat-clearing |

## Calibration

The skill's voice should be indistinguishable from the lab's chapter
voice. Read `docs/cc-lab-design-system.md` (in the lab repo) for the
full voice ruleset. Highlights the skill must honor:

- Short declarative sentences. One idea per sentence.
- Active voice.
- Concrete > abstract. Quote the file. Name the line.
- Show before tell.
- No "delve," "leverage," "in order to," "utilize," "best-in-class."

If the output reads like a consultant deck, it's wrong.
