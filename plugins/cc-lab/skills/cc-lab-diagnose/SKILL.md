---
name: cc-lab-diagnose
description: Diagnose a Claude Code setup against cc-lab patterns. Two modes — project (would a teammate cloning this repo succeed today?) or user (is your personal harness well-tuned?). When invoked without an explicit mode arg or scope keyword, asks via AskUserQuestion before reading any files. Returns 3-5 evidence-grounded observations grounded in cc-lab chapter knowledge, with copy-paste artifacts and chapter links. Activate when the user says "diagnose my setup", "review my CLAUDE.md", "audit this repo", or invokes /cc-lab-diagnose [project|user|both].
allowed-tools: Read, Glob, Grep, Bash, AskUserQuestion, Task
---

# cc-lab-diagnose

Reads a builder's repo and/or personal Claude Code setup and returns a
short, specific diagnosis. The skill is the **orchestrator** — it
resolves the mode, prompts the user when ambiguous, gathers state,
asks `cc-lab-session-analyzer` to summarize how the project's prior
sessions actually unfolded, and dispatches to the `cc-lab-judge`
subagent which holds the chapter knowledge. The judge returns the
diagnosis; the skill prints it.

The three-stage shape (gather → analyze → judge) exists for one
reason: a diagnostic that only runs rules over config files produces
a checklist. A diagnostic that also reads how the harness is
*actually used*, backed by an agent that has read every cc-lab
chapter, produces a peer review.

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

| Mode | Question it answers | Reads | Session profile |
|---|---|---|---|
| **project** | Would a teammate cloning this repo succeed today? | `./CLAUDE.md`, `./.claude/`, `./.mcp.json`, `git log`, project plugin entries | yes — analyzer summarizes recent sessions for this cwd |
| **user** | Is your personal harness pulling its weight? | `~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`, `~/.claude.json`, plugins, auto-memory | no — user-mode signal is config, not per-project usage |
| **both** | Both questions, two output sections | All of the above | yes for the project pass only |

In **project mode**, user scope is consulted only for cross-scope
leak detection and to suppress false positives (don't flag "no
`/compound`" if the user has it via plugin).

## Boundaries

**Does:**
- Resolve mode (arg → keyword → AskUserQuestion → fallback to project)
- Gather repo and/or user state, read-only
- Build the scope inventory from project + user + plugins + built-ins
- Dispatch `cc-lab-session-analyzer` (project mode and `both` mode
  only) to produce a usage profile of recent sessions for this cwd
- Dispatch `cc-lab-judge` via the Task tool with the gathered state
  *plus* the usage profile when present
- Print the judge's response (typically 3-5 observations)

**Does not:**
- Modify any file
- Score, grade, or rate
- Form observations on its own — that's the judge's job
- Edit or post-process the judge's or analyzer's output (other than
  passing the profile through to the judge and displaying the judge's
  final markdown)
- Run the session analyzer in user mode (sessions are per-project;
  user-mode diagnosis is about config, not project-bound usage)

## When not to run

- **No git repo in cwd** — Step 3 enforces this; project mode is
  meaningless without a history to read against.
- **Multi-user machines** — if `~/.claude/` belongs to a different
  OS user than the one running `claude`, user mode and `both` mode
  read another user's config. Don't run user mode in shared
  environments.
- **Inside a subagent context** — this skill dispatches its own
  subagents (analyzer + judge). Invoking it from inside a `Task`
  produces nested dispatches; that path is untested and likely to
  trip context limits.
- **When the user only wants a quick file review** — if the user
  asks "what does my CLAUDE.md say?", read the file directly. This
  skill is for grounded diagnosis, not file recall.

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

### 6. Dispatch `cc-lab-session-analyzer` (project / both mode only)

In **user mode**, skip this step entirely — the user-mode rubric
reads config, not per-project session activity. Set `usage_profile =
None` and proceed to Step 7.

In **project** or **both** mode, call the Task tool with:

- **subagent_type:** `cc-lab-session-analyzer`
- **description:** "cc-lab session profile on `<repo-name>`"
- **prompt:** A self-contained brief containing:
  - The cwd absolute path (the analyzer derives the encoded sessions
    directory from it — do not pre-encode it for the analyzer)
  - The window: `"default"` unless the user passed an override
    (default = last 30 days OR last 20 sessions, whichever is smaller)
  - The scope inventory from Step 5 (so the analyzer can flag
    installed-but-never-invoked skills, agents, commands)
  - Today's date (`YYYY-MM-DD`)
  - A reminder that the analyzer's output is the fixed-shape usage
    profile and nothing else — no preamble, no commentary

Capture the analyzer's markdown output verbatim as `usage_profile`.
If the analyzer returns the empty-window profile (no sessions found
in window), keep that empty profile — it's a real signal, not a
failure. Pass it through to the judge unchanged.

**Contract-violation checklist.** Set `usage_profile = None` and
continue to Step 7 *only* when the analyzer's response meets one of
these conditions:

1. Response contains no `# Usage profile` heading at all.
2. Response is plain prose with no section headers.
3. The analyzer explicitly refuses to run.

Any other output — including a sparse profile, a profile missing one
or two sections, or a profile with empty rows — passes through
unchanged to the judge. The judge's A10 rubric handles sparse
profiles; the orchestrator must not second-guess them. When you do
fall back, surface the reason to the user (one sentence) before
continuing.

### 7. Dispatch `cc-lab-judge`

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
  - The usage profile from Step 6, inlined verbatim under a clearly
    labeled `## Usage profile` section in the brief — or the literal
    string `_usage profile not available (user mode or analyzer
    failed)_` if `usage_profile` is None
  - Explicit instruction to read
    `${CLAUDE_PLUGIN_ROOT}/knowledge/` chapters before judging, and
    to apply `${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/rubric.md`
    using the right Part (A for project, B for user, A10 only when
    a usage profile is present)
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

## Usage profile

[Inline the analyzer's full markdown output here, OR write the 
literal string: _usage profile not available (user mode or 
analyzer failed)_]

Read ${CLAUDE_PLUGIN_ROOT}/knowledge/ chapters relevant to the mode,
read ${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/rubric.md (use Part 
A for project, Part B for user, both for both; apply A10 only when a 
usage profile is present), then return the diagnostic markdown using 
${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/output-template.md.

The full output shape, in order: opening → **What's working** (1-3 
evidence-grounded strengths, or honestly skipped) → headline (2-4 
sentences naming the load-bearing findings) → section headers (in 
both mode) → 3-5 observations per section → "What to do next" with 
three time buckets → closing.

Always also render an HTML artifact alongside the markdown using 
${CLAUDE_PLUGIN_ROOT}/skills/cc-lab-diagnose/template.html and write 
it to ./cc-lab-diagnosis-<repo>-<YYYY-MM-DD>.html in the user's cwd. 
Reference the HTML path at the top of the markdown response so the 
user knows it's there.

Return only the final markdown. Don't include reasoning or a 
summary of what you did.
```

### 8. Print the judge's response

The judge returns markdown. Print it as your final response. Do not
edit, summarize, or annotate. The judge ran the rubric, ran the
self-check, and produced the output — your job is to deliver it.

If the judge returns something that obviously violates the contract
(no observations, includes scoring, refuses to run), surface that to
the user and offer to retry. Don't paper over it.

---

## Validate before returning

Before printing the judge's response, confirm:

1. At least one observation contains a quoted line with a filename.
2. In project / both mode, the dispatch prompt to the judge included
   a `## Usage profile` section (either the analyzer's profile or
   the literal `_usage profile not available_` string).
3. No file in the cwd was modified during the run *except* the
   diagnostic HTML artifact (`cc-lab-diagnosis-<repo>-<date>.html`)
   the judge writes as its visual output. The skill never writes;
   the analyzer never writes; the judge writes exactly that one
   HTML file and nothing else. Any other file change is a violation.
4. The output contains no scores, grades, or numerical ratings. If
   the judge produced any, surface the violation rather than print it.
5. In project / both mode, `usage_profile` is either a valid markdown
   profile or the literal `_usage profile not available_` — never
   silently empty.

---

## Common rationalizations — and why they fail

| Shortcut | Why it fails | The cost |
|---|---|---|
| Running the analyzer in user mode | Sessions are per-cwd. User-mode diagnosis is about `~/.claude/` config — there is no "user-scope session transcript." Analyzing the current project's sessions in user mode would attribute a project's usage to the user's harness. | False observations tied to the wrong project's usage; reader can't tell scope from the headline |
| Defaulting to project mode on cold-start instead of asking | The user typed `/cc-lab-diagnose` with no args. That's not evidence of intent — it's the *absence* of evidence. Project mode reads cwd; the user may want user-mode or both. | Wrong scope diagnosis; the user reads it without noticing the scope mismatch |
| Post-processing the judge's output to "clean it up" | The judge ran the rubric, applied confidence calibration, and selected 3-5 findings under explicit voice rules. Editing its output overrides a deliberate evidential decision. | Observations drift from the rubric; reproducibility breaks; voice fragments |
| Skipping the analyzer because "the project looks new" | The analyzer's empty-window output is itself a signal. A project with config but no sessions reads differently than a project with sessions but no config. | The judge loses a real category of observation; new-project diagnoses read as if the project were active |
| Inlining JSONL parsing here to "save a Task dispatch" | The privacy floor only holds when one well-bounded actor sees the raw transcripts. Pulling parsing into the orchestrator means user-prompt content enters the skill's context. | Privacy floor breaks; transcripts leak into the orchestrator's logs and into the judge's brief |

---

## Why this skill is thin

The skill is short on purpose. The two pieces of hard work happen
elsewhere: `cc-lab-session-analyzer` reads transcripts and emits a
fixed-shape usage profile (facts only, no opinions), and
`cc-lab-judge` reads chapter content + the user's files + the
profile and forms observations. The skill handles the conversation:
mode resolution, gathering, dispatch.

If you find yourself adding rubric logic to this file, stop. That
goes in `rubric.md` and the judge reads it. If you find yourself
adding chapter content to this file, stop. That's bundled in
`${CLAUDE_PLUGIN_ROOT}/knowledge/`. If you find yourself adding
JSONL parsing or session-shape knowledge to this file, stop. That
lives in `cc-lab-session-analyzer.md`.

The lab's full design system lives at
`${CLAUDE_PLUGIN_ROOT}/knowledge/cc-lab-design-system.md`. The judge
has read it. So have you, conceptually — the skill's voice rules
match the judge's. If your prompts to the judge ever read like a
consultant deck, the chain breaks at the source.
