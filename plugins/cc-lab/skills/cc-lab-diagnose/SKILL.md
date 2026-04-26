---
name: cc-lab-diagnose
description: Diagnose a Claude Code setup against cc-lab patterns. Two modes — project (would a teammate cloning this repo succeed today?) or user (is your personal harness well-tuned?). When invoked without an explicit mode arg or scope keyword, asks via AskUserQuestion before reading any files. Returns 3-5 evidence-grounded observations grounded in cc-lab chapter knowledge, with copy-paste artifacts and chapter links. Activate when the user says "diagnose my setup", "review my CLAUDE.md", "audit this repo", or invokes /cc-lab-diagnose [project|user|both].
allowed-tools: Read, Glob, Grep, Bash, AskUserQuestion, Task
---

# cc-lab-diagnose

Reads a builder's repo and/or personal Claude Code setup and returns a
short, specific diagnosis. The skill is the **orchestrator** — it
resolves the mode, prompts the user when ambiguous, gathers state, and
dispatches to the `cc-lab-judge` subagent which holds the actual
chapter knowledge. The judge returns the diagnosis; the skill prints it.

The two-stage shape exists for one reason: a diagnostic that only
runs rules produces a checklist. A diagnostic backed by an agent
that has read every cc-lab chapter produces a peer review.

## When to activate

- User says "diagnose my project" / "audit this repo" / "review my
  CLAUDE.md" / "is my repo well set up" → **project mode**
- User says "diagnose my setup" / "review my user config" / "check my
  ~/.claude" → **user mode**
- User says "diagnose everything" / "full diagnostic" → **both modes**
- User invokes `/cc-lab-diagnose project|user|both` (explicit mode)
- User invokes `/cc-lab-diagnose` with no argument and no scope keyword
  → **prompt the user via `AskUserQuestion`** before reading any files

## Two modes

| Mode | Question it answers | Reads |
|---|---|---|
| **project** | Would a teammate cloning this repo succeed today? | `./CLAUDE.md`, `./.claude/`, `./.mcp.json`, `git log`, project plugin entries |
| **user** | Is your personal harness pulling its weight? | `~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`, `~/.claude.json`, plugins, auto-memory |
| **both** | Both questions, two output sections | All of the above |

In **project mode**, user scope is consulted only for cross-scope
leak detection and to suppress false positives (don't flag "no
`/compound`" if the user has it via plugin).

## Boundaries

**Does:**
- Resolve mode (arg → keyword → AskUserQuestion → fallback to project)
- Gather repo and/or user state, read-only
- Build the scope inventory from project + user + plugins + built-ins
- Dispatch `cc-lab-judge` via the Task tool with the gathered state
- Print the judge's response (typically 3-5 observations)

**Does not:**
- Modify any file
- Score, grade, or rate
- Form observations on its own — that's the judge's job
- Edit or post-process the judge's output (other than displaying it)

## How to run a diagnosis

### 1. Determine the mode — ask before doing anything else

**Before reading any files (yes — even rubric.md), resolve the mode.**
This is the first action of every run. The mode determines what the
rest of the skill does; getting it wrong wastes the user's read.

Decide as follows, in this exact order:

#### 1a. Did the user pass an explicit arg?

If the invocation is `/cc-lab-diagnose project`, `/cc-lab-diagnose
user`, or `/cc-lab-diagnose both` — use that mode and proceed to Step 2.

#### 1b. Is there a scope keyword in the user's natural-language prompt?

If the user typed something like "audit my repo", "review my user
setup", or "diagnose everything" before invoking the skill, that
keyword resolves the mode:

| Keyword in prompt | Mode |
|---|---|
| "project", "repo", "this codebase", "audit this repo", "would a teammate succeed" | **project** |
| "user", "my setup", "my config", "~/.claude", "personal harness" | **user** |
| "everything", "full diagnostic", "both", "all of it" | **both** |

If a keyword matches, use that mode and proceed to Step 2.

#### 1c. Otherwise — ASK. Do not default.

This includes the cold-start case where the user just typed
`/cc-lab-diagnose` with no args and no surrounding chat. **That is
the canonical case where you must ask** — not the case where you
default. There's no information to default *from*.

Call `AskUserQuestion` with this exact shape:

- **header**: `"Diagnostic scope"`
- **question**: `"Which scope should I read?"`
- **options** (in this order, Project listed first):
  1. **Project** — diagnose this repo. Reads `./CLAUDE.md`,
     `./.claude/`, `./.mcp.json`, recent commits. Asks: would a
     teammate cloning this succeed today?
  2. **User** — diagnose `~/.claude/`. Reads user CLAUDE.md,
     user-scope skills/agents/commands, plugins, MCPs, hooks.
     Asks: is your personal harness pulling its weight?
  3. **Both** — run both passes, two output sections.

Take the user's answer literally. **Only fall back to project mode
if `AskUserQuestion` itself fails or returns nothing** — not because
the cold-start invocation "feels like project mode" or because
defaulting feels efficient. Asking is the work.

### 2. Pre-flight reads

Now that the mode is resolved, `Read` `rubric.md` and
`output-template.md` (this file's siblings) so you understand the
rubric the judge will apply and the output shape the judge will
produce.

### 3. Confirm the target exists

**For project mode (or `both`):**
- The cwd is a git repo (`git rev-parse --is-inside-work-tree`)
- Either `CLAUDE.md`, `.claude/`, `.mcp.json` exists
- If none, return the empty-signal closing from `output-template.md`

**For user mode (or `both`):**
- `~/.claude/` exists with at least one of `CLAUDE.md`, `skills/`,
  `plugins/installed_plugins.json`, `settings.json`
- If none, return the empty-signal closing for user mode

### 4. Gather inputs (read-only)

Run the gather pass for the chosen mode. The judge will read what
you find — your job is to surface paths and ensure files exist; the
judge does the deep reads.

#### Project gather (project + both modes)

| Source | How |
|---|---|
| `./CLAUDE.md` (and per-directory CLAUDE.md in monorepos) | `Glob` + verify exists |
| `./.claude/` tree | `Glob` `.claude/**/*` (cap 200 paths) |
| `./.claude/skills/*/SKILL.md` paths | `Glob` |
| `./.claude/agents/*.md` paths | `Glob` |
| `./.claude/commands/*.md` paths | `Glob` |
| `./.claude/settings.json` + `.local.json` | verify exists |
| `./.mcp.json` | verify exists |
| `./.gitignore` | verify exists |
| `./docs/solutions/`, `./docs/learnings/` | `Glob` if present |
| Recent git log | `Bash` — `git log --oneline -50` and `git log -10 --stat` |
| Tracked secrets check | `Bash` — `git ls-files \| xargs grep -lE '(api_key\|token\|secret)\s*=\s*[\"'\''A-Za-z0-9_-]{20,}' 2>/dev/null \| head -10` |
| Project-scope plugin entries | `Read` `~/.claude/plugins/installed_plugins.json`, filter |

#### User gather (user + both modes)

| Source | How |
|---|---|
| `~/.claude/CLAUDE.md` | verify exists |
| `~/.claude/skills/*/SKILL.md` paths | `Glob` |
| `~/.claude/agents/*.md` paths | `Glob` |
| `~/.claude/commands/*.md` paths | `Glob` |
| `~/.claude/settings.json` + `.local.json` | verify |
| `~/.claude.json` (MCP config) | verify |
| `~/.claude/plugins/installed_plugins.json` | `Read` |
| `~/.claude/plugins/known_marketplaces.json` | `Read` |
| Plugin skills (active per `installed_plugins.json`) | `Glob` per plugin path |
| Auto-memory | `Glob` `~/.claude/projects/*/memory/MEMORY.md`, identify cwd's repo |

### 5. Build the scope inventory

Assemble the union of available capabilities (don't output it; pass
it to the judge):

- **Skills available** — project + user-scope + active-plugin skills + built-in bundled skills (`/simplify`, `/batch`, `/debug`, `/loop`, `/review`, `/security-review`, `/init`, `/claude-api`)
- **Commands available** — project + user + plugin commands + built-ins (`/clear`, `/compact`, `/resume`, `/model`, `/config`, `/permissions`, `/agents`, `/skill`, `/plugin`, `/reload-plugins`, `/mcp`, `/hooks`, `/memory`, `/usage`, `/cost`, `/login`, `/logout`, `/status`, `/add-dir`, `/export`, `/bug`, `/vim`, `/statusline`, `/rename`, `/help`)
- **Agents available** — project + user + plugin agents
- **MCPs configured** — `.mcp.json` (project) + `~/.claude.json` `mcpServers` (user)
- **Hooks configured** — both `settings.json` `hooks` blocks

### 6. Dispatch `cc-lab-judge`

Call the Task tool with:

- **subagent_type:** `cc-lab-judge`
- **description:** "cc-lab diagnostic (`<mode>` mode) on `<repo-name>`"
- **prompt:** A self-contained brief containing:
  - The chosen mode (`project` / `user` / `both`)
  - The cwd basename (for the output header)
  - Today's date (`YYYY-MM-DD`)
  - The list of file paths your gather pass produced, organized by
    rubric category — make the agent's life easy by pre-grouping
  - The scope inventory (from Step 5)
  - Explicit instruction to read
    `${CLAUDE_PLUGIN_ROOT}/knowledge/` chapters before judging, and
    to apply `${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/rubric.md`
    using the right Part (A for project, B for user)
  - A reminder to return only the final markdown output (opening +
    3-5 observations + closing), nothing else

Example dispatch prompt shape:

```
Run a cc-lab diagnostic in <mode> mode on the repo "<repo-name>" 
(today is <YYYY-MM-DD>).

I've already gathered the following paths — read them as needed:

PROJECT (if applicable):
- ./CLAUDE.md (exists / missing)
- ./.claude/skills/<name>/SKILL.md, ...
- ./.claude/agents/<name>.md, ...
- ./.claude/settings.json
- ./.mcp.json
- ./.gitignore
- Recent git log: <attached output>
- Tracked secrets check: <attached output>

USER (if applicable):
- ~/.claude/CLAUDE.md (exists / missing)
- ~/.claude/skills/<name>/SKILL.md, ...
- [etc.]

SCOPE INVENTORY:
- Skills available: [list]
- Commands available: [list]  
- MCPs configured (project): [list]
- MCPs configured (user): [list]
- Plugins active in this project: [list]

Read ${CLAUDE_PLUGIN_ROOT}/knowledge/ chapters relevant to the mode,
read ${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/rubric.md (use Part 
A for project, Part B for user, both for both), then return the 
diagnostic markdown using ${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/output-template.md.

Return only the final markdown — opening + 3-5 observations + 
closing. Don't include reasoning or summary.
```

### 7. Print the judge's response

The judge returns markdown. Print it as your final response. Do not
edit, summarize, or annotate. The judge ran the rubric, ran the
self-check, and produced the output — your job is to deliver it.

If the judge returns something that obviously violates the contract
(no observations, includes scoring, refuses to run), surface that to
the user and offer to retry. Don't paper over it.

---

## Why this skill is thin

The skill is short on purpose. The hard knowledge work — applying
chapter content to the user's specific files — is in the
`cc-lab-judge` agent. The skill handles the conversation: mode
resolution, gathering, dispatch.

If you find yourself adding rubric logic to this file, stop. That
goes in `rubric.md` and the agent reads it. If you find yourself
adding chapter content to this file, stop. That's bundled in
`${CLAUDE_PLUGIN_ROOT}/knowledge/`.

The lab's full design system lives at
`${CLAUDE_PLUGIN_ROOT}/knowledge/cc-lab-design-system.md`. The agent
has read it. So have you, conceptually — the skill's voice rules
match the agent's. If your prompts to the agent ever read like a
consultant deck, the chain breaks at the source.
