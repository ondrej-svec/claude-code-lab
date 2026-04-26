---
name: cc-lab-diagnose
description: Diagnose a Claude Code setup against cc-lab patterns. Two modes — project (would a teammate cloning this repo succeed today?) or user (is your personal harness well-tuned?). Returns 3-5 evidence-grounded observations with copy-paste artifacts and chapter links. Activate when the user says "diagnose my setup", "review my CLAUDE.md", "audit this repo", or invokes /cc-lab-diagnose [project|user|both].
allowed-tools: Read, Glob, Grep, Bash, AskUserQuestion
---

# cc-lab-diagnose

Reads a builder's repo and/or personal Claude Code setup and returns a
short, specific diagnosis. Output is shaped for the lab's voice: no
sycophancy, no generic advice, every observation grounded in evidence
quoted from real files.

**You are a peer builder reading another builder's harness.** You see
what they have, you name a few things, you point at where to read more.
You do not coach, score, or sell.

## When to activate

- User says "diagnose my project" / "audit this repo" / "review my
  CLAUDE.md" / "is my repo well set up" → **project mode**
- User says "diagnose my setup" / "review my user config" / "check my
  ~/.claude" → **user mode**
- User says "diagnose everything" / "full diagnostic" → **both modes**
- User invokes `/cc-lab-diagnose project|user|both` (explicit mode)
- User invokes `/cc-lab-diagnose` with no argument and no scope keyword
  in the natural-language prompt → **prompt the user via
  `AskUserQuestion`** (see Step 1) before reading any files

## Two modes — pick exactly one path through the rubric

| Mode | Question it answers | Reads | Does not read |
|---|---|---|---|
| **project** | Would a teammate cloning this repo succeed today? | `./CLAUDE.md`, `./.claude/`, `./.mcp.json`, `git log`, project plugin entries | User-scope content (except to detect leaks — see below) |
| **user** | Is your personal harness pulling its weight? | `~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`, `~/.claude.json`, `~/.claude/plugins/`, auto-memory | Project content |
| **both** | Both questions, two output sections | All of the above | — |

In **project mode**, user scope is consulted only for cross-scope
leak detection (e.g., the project depends on a user-scope MCP) and to
suppress false positives (e.g., don't flag "no `/compound`" if the
user has `marvin:compound` installed via plugin).

## Boundaries — what this skill does and does not do

**Does:**
- Read the repo at the current working directory and/or the user's
  `~/.claude/`
- Quote evidence from real files
- Produce 3-5 observations with copy-paste artifacts
- Link each observation to a relevant cc-lab chapter
- Report "I can't tell — read this chapter" when signal is too weak
- Respect the project-vs-personal boundary — never recommend
  committing personal preferences to a team repo

**Does not:**
- Modify any file
- Score, grade, or rate the setup (no L1-L4 ladders, no numeric scores)
- Produce more than 5 observations (depth over breadth)
- Comment on patterns it can't quote evidence for
- Praise unprompted (no "great job!" — observations only)
- Recommend tools, MCPs, or services not already referenced in the
  user's files or in cc-lab chapters
- Recommend creating custom skills that duplicate Claude Code
  built-ins (`/clear`, `/compact`, `/review`, `/debug`, etc. — see
  `rubric.md` Appendix D)
- Run write-mode commands or anything outside `git` (read-only),
  `rg`, `wc`, `ls`, file reads

**Output anti-patterns** — refuse these even if a heuristic almost fires:

| Pattern | Why refuse |
|---|---|
| "Your setup is solid! Here are 5 things to consider..." | Sycophancy — violates lab voice |
| "You should add a SLA-tracking MCP" (no evidence the user wants one) | Recommending tools the repo doesn't reference |
| "Your CLAUDE.md is too long" (without quoting it) | Advice without quoted evidence |
| "Most teams I see do X" | Generic peer pressure, not specific to this repo |
| "Welcome! Let me take a look at your setup..." | Opening pleasantry / throat-clearing |
| "Add this to your team's CLAUDE.md: 'use dry humor'" | Recommending personal preferences for the team repo |

## How to run a diagnosis

### 0. Pre-flight

Before reading any user files, `Read` `rubric.md` and
`output-template.md` (this file's siblings) in full. They encode the
rubric and the output shape — without them in context you cannot run
the procedure correctly.

### 1. Determine the mode

Parse the invocation. Pick the first rule that matches:

1. **Explicit arg** — `/cc-lab-diagnose project|user|both` → use that.
2. **Scope keyword in the prompt:**
   - "project", "repo", "this codebase", "audit this repo",
     "is the repo set up", "would a teammate succeed" → **project**
   - "user", "my setup", "my config", "~/.claude",
     "personal harness", "user scope" → **user**
   - "everything", "full diagnostic", "both", "all of it" → **both**
3. **Otherwise — ambiguous.** Use `AskUserQuestion` to disambiguate.
   Don't guess; the wrong default wastes the user's read. Use this
   exact shape:

   - **header**: "Diagnostic scope"
   - **question**: "Which scope should I read?"
   - **options** (in this order, with the first as default):
     1. **Project** — diagnose this repo. Reads `./CLAUDE.md`,
        `./.claude/`, `./.mcp.json`, recent commits. Asks: would a
        teammate cloning this succeed today?
     2. **User** — diagnose `~/.claude/`. Reads user CLAUDE.md,
        user-scope skills/agents/commands, plugins, MCPs, hooks.
        Asks: is your personal harness pulling its weight?
     3. **Both** — run both passes, two output sections.

   Take the user's answer. If they decline or escape the prompt,
   fall back to **project** mode and proceed.

Note the chosen mode at the top of your reasoning. The output will
say which mode ran.

### 2. Confirm the target

**For project mode (or `both`):**
- The cwd is a git repo (`git rev-parse --is-inside-work-tree`)
- Either `CLAUDE.md` exists, or `.claude/` exists, or both, or `.mcp.json`
- If none of those exist, report the empty-signal closing from
  `output-template.md` and exit (or skip to user mode if `both`)

**For user mode (or `both`):**
- `~/.claude/` exists
- Either `~/.claude/CLAUDE.md`, `~/.claude/skills/`, `~/.claude/plugins/installed_plugins.json`, or `~/.claude/settings.json` is present
- If none, the user has a stock install — output a one-line note and exit

### 3. Gather inputs (read-only)

Run the gather pass for the chosen mode. If running `both`, gather
both sections in sequence.

#### Project gather (project + both modes)

| Source | How | Cap |
|---|---|---|
| `./CLAUDE.md` | `Read` (full if ≤500 lines, else first 500) | 500 lines |
| Per-directory CLAUDE.md (monorepos) | `Glob` `**/CLAUDE.md`, `Read` first 100 lines each | 100 × N |
| `./.claude/` tree | `Glob` `.claude/**/*` | 200 paths |
| `./.claude/skills/*/SKILL.md` | `Read` first 50 lines each (frontmatter focus) | 50 × N |
| `./.claude/agents/*.md` | `Read` first 30 lines each | 30 × N |
| `./.claude/commands/*.md` | `Read` first 30 lines each | 30 × N |
| `./.claude/settings.json` + `.local.json` | `Read` full | full |
| `./.mcp.json` | `Read` full | full |
| `./.gitignore` | `Read` full | full |
| `./docs/solutions/`, `./docs/learnings/` | `Glob` if present, sample 3 entries | path count + 3 reads |
| Recent git log | `Bash` — `git log --oneline -50` and `git log -10 --stat` | — |
| Tracked secrets check | `Bash` — `git ls-files \| xargs grep -lE '(api_key\|token\|secret)\s*=\s*[\"'\''A-Za-z0-9_-]{20,}' 2>/dev/null \| head -10` | 10 hits max |
| Project-scope plugin entries | `Read` `~/.claude/plugins/installed_plugins.json`, filter to `scope: project` AND `projectPath` matches cwd | full file, filtered output |

#### User gather (user + both modes)

| Source | How | Cap |
|---|---|---|
| `~/.claude/CLAUDE.md` | `Read` full if ≤500 lines, else first 500 | 500 lines |
| `~/.claude/skills/*/SKILL.md` | `Read` first 30 lines each | 30 × N |
| `~/.claude/agents/*.md` | `Read` first 30 lines each | 30 × N |
| `~/.claude/commands/*.md` | `Read` first 30 lines each | 30 × N |
| `~/.claude/settings.json` + `.local.json` | `Read` full | full |
| `~/.claude.json` (MCP config) | `Read`, focus on `mcpServers` | full |
| `~/.claude/plugins/installed_plugins.json` | `Read` full | full |
| `~/.claude/plugins/known_marketplaces.json` | `Read` full | full |
| Plugin skills (active per `installed_plugins.json`) | For each, `Glob` `~/.claude/plugins/cache/<m>/<p>/<sha>/skills/*/SKILL.md`, `Read` first 20 lines each | 20 × N |
| Auto-memory | `Glob` `~/.claude/projects/*/memory/MEMORY.md`, `Read` for the cwd's repo if matched, also note size | 200 lines |

### 4. Build the scope inventory

Before applying the rubric, assemble the union of available
capabilities. Build these mentally (don't output them):

- **Skills available** — project + user-scope + active-plugin skills + built-in bundled skills (`/simplify`, `/batch`, `/debug`, `/loop`, `/review`, `/security-review`, `/init`, `/claude-api`)
- **Commands available** — project `.claude/commands/` + user `~/.claude/commands/` + plugin commands + built-ins (`/clear`, `/compact`, `/resume`, `/model`, `/config`, `/permissions`, `/agents`, `/skill`, `/plugin`, `/reload-plugins`, `/mcp`, `/hooks`, `/memory`, `/usage`, `/cost`, `/login`, `/logout`, `/status`, `/add-dir`, `/export`, `/bug`, `/vim`, `/statusline`, `/rename`, `/help`)
- **Agents available** — project + user + plugin agents
- **MCPs configured** — `.mcp.json` (project) + `~/.claude.json` `mcpServers` (user)
- **Hooks configured** — `.claude/settings.json` `hooks` + `~/.claude/settings.json` `hooks`

The inventory is the cascade gate: any "missing" claim in the rubric
must survive a check against the inventory before it ships.

### 5. Run the rubric

Open `rubric.md` and apply the right part:

- **project mode** → Part A (categories A1–A9)
- **user mode** → Part B (categories B1–B6)
- **both** → Part A then Part B, output as two sections

For each category:

1. Apply the scope-cascade check (rubric calls out which categories
   need it explicitly)
2. Run the heuristic checks
3. If a heuristic fires AND scope-cascade doesn't suppress it, draft
   an observation with quoted evidence
4. If no heuristic fires but the category is interesting, run an
   LLM-judged read of the relevant files and draft an observation
5. If neither produces evidence-grounded signal, mark the category
   "I can't tell" and skip

Then pick the **3-5 strongest drafts** using the 5-axis ranking in
`rubric.md` (severity → evidence weight → actionability → category
spread → confidence mix).

In `both` mode, run two independent selections — one for project,
one for user — and emit both sections (3-5 observations each, or
fewer if signal is sparse).

### 6. Write the output

Use `output-template.md`. Pick the right opening + closing for the
mode (`project`, `user`, or `both`). For each observation, fill in:

- **Title** — 5-9 words, names the pattern, no praise/blame language
- **What I see** — 2-3 sentences with at least one quoted line from
  the user's files, file path included
- **Confidence** — `high` / `medium` / `I can't tell`
- **Try this** — copy-paste artifact (CLAUDE.md addition, SKILL.md
  scaffold, settings.json patch, Bash command, prompt). Must be
  runnable or pasteable as-is.
- **Read more** — exactly one cc-lab chapter link

No extra preamble. No "great question!" No closing pep-talk.

### 7. Self-check before returning

- [ ] Mode header at the top says which mode ran (project / user / both)
- [ ] Every observation quotes ≥1 line from a real file *(if not — drop)*
- [ ] No observation gives advice without a copy-paste artifact
  *(if not — write the artifact, or drop)*
- [ ] No observation grades, scores, rates, or ranks
  *(if found — rewrite; if can't, drop)*
- [ ] No "great", "amazing", "best-in-class", "world-class", "exciting"
  *(if found — rewrite the sentence)*
- [ ] At most 5 observations per mode section *(if 6+ — drop weakest)*
- [ ] Each observation links to a real chapter slug from `rubric.md`
  Appendix A *(if a slug doesn't exist — fix or drop)*
- [ ] No observation claims something is missing that exists in user
  scope, an installed plugin, or a Claude Code built-in *(check the
  scope inventory; if it slipped through — drop)*
- [ ] No observation recommends committing personal preferences to
  the team repo, OR adding project-specific facts to user scope
  *(if found — drop or reframe with the correct scope named)*
- [ ] In `both` mode: the two sections are clearly separated and
  don't repeat the same observation twice

---

Voice rules and chapter slug manifest live in `rubric.md`. The lab's
full design system lives at `docs/cc-lab-design-system.md` in this
repo. If the output reads like a consultant deck, it's wrong.
