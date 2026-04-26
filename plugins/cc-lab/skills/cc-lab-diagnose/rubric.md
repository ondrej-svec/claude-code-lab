# cc-lab-diagnose rubric — v0.2

The judging rubric. Two parts:

- **Part A — Project mode** asks: *would a teammate cloning this repo
  succeed today?* Reads project scope (`./CLAUDE.md`, `./.claude/`,
  `./.mcp.json`, git log). Checks user scope only to detect leaks
  (project depends on user-scope artifacts, personal preferences
  committed to the repo).
- **Part B — User mode** asks: *is your personal harness well-tuned?*
  Reads user scope (`~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`,
  installed plugins, `~/.claude.json`).

Every observation must quote at least one line from a real file. If a
category produces no evidence-grounded signal, mark it "I can't tell"
and skip — never invent observations to hit a count.

---

## Scope cascade — the load-bearing rule

Claude Code stacks state across two scopes simultaneously, plus
plugins on top of either:

| Scope | Source | What lives here |
|---|---|---|
| **Project** | `./CLAUDE.md`, `./.claude/`, `./.mcp.json`, `./.claude/settings.json` | Repo-specific contract; team-shared |
| **User** | `~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`, `~/.claude.json` (MCPs), `~/.claude/settings.json`, `~/.claude/plugins/` | Developer's personal harness |

The agent operating in any repo sees the **union** of both, plus
whatever plugins are active. A diagnostic that ignores either scope
false-positives on "missing" patterns the user actually has.

**The cascade rule:** before any heuristic is allowed to claim
"missing" or "absent," check the relevant up-cascade. Project mode
checks user scope and installed plugins for things the project needs
that *don't have to be in the repo* (e.g., the project doesn't need
its own `/compound` if `marvin:compound` is installed). User mode
checks installed plugins for things the user has via plugin so the
diagnostic doesn't suggest reinventing them.

**The boundary rule:** never recommend committing personal
preferences to the team repo. A user CLAUDE.md saying "use dry humor"
is correct in user scope and noise in project scope. Hooks that match
personal style live in user scope; hooks that enforce team policy
live in project scope. MCPs the project depends on go in `.mcp.json`;
MCPs the developer prefers go in `~/.claude.json`.

The two rules together produce three valid observation shapes:

1. **Hard-gap** — pattern is missing in the relevant scope and
   nothing else covers it. Surface as observation.
2. **Cross-scope leak** — pattern exists but in the wrong scope (e.g.,
   project-critical MCP only in user scope; personal preference
   committed to project CLAUDE.md). Surface as observation, name the
   correct scope.
3. **Suppressed** — pattern looks missing in target scope but is
   provided up-cascade. Drop the observation; do not pad the count.

---

# Part A — Project-mode rubric

Run these when diagnosing the cwd repo for team-shareability. The
question this part answers: *if a teammate clones this repo today,
will their Claude Code setup work?*

When the skill provides a **Usage profile** in the brief, treat it as
additional grounded evidence — same evidence-quoting bar as files.
Categories A1-A9 are unchanged; A10 contains usage-only heuristics
that *only* fire when a profile is present.

## A1 — Project memory (CLAUDE.md)

What the lab teaches: a CLAUDE.md that earns its weight is a
**contract, not a tour** — commands + conventions + boundaries.
([Chapter 3: Teach Claude your project](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project))

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `./CLAUDE.md` does not exist AND repo has >5 commits | "no project contract — agent inherits ancestor CLAUDE.md if any, else operates blind" | high |
| `./CLAUDE.md` exists, < 30 lines | "stub contract — likely from `/init`, never extended" | high |
| `./CLAUDE.md` exists, > 800 lines | "mega-CLAUDE.md — attention to specific instructions degrades past ~800 lines" | high |
| No build/test/lint command anywhere in CLAUDE.md (grep for `npm`, `pnpm`, `bun`, `yarn`, `make`, `cargo`, `go test`, `pytest`, `cargo`) | "agent has no committed way to verify its own work" | high |
| No `## ` headings (unstructured prose) | "agent treats as one wall — no signposts" | medium |
| `@<file>` import syntax used | (positive) — modular contract | n/a |
| Multiple CLAUDE.md files (top-level + per-directory) | (positive in monorepo) — only flag if they contradict | n/a |
| Subdirectory CLAUDE.md duplicates top-level content | "drift between top-level and nested — pick one" | medium |

### LLM-judge prompts

- "Read this CLAUDE.md. Is it a *contract* (commands + conventions +
  boundaries the agent must respect) or a *tour* (architecture
  description + history)? Quote the strongest contract sentence and
  the weakest tour sentence."
- "Does this CLAUDE.md teach the agent anything that isn't already
  obvious from reading three or four files in the repo? Quote two
  sentences that earn their weight."

### Evidence requirement

Quote ≥1 line from `./CLAUDE.md` with line number. If the file
doesn't exist, quote `git status` or `find . -name CLAUDE.md` output
showing the absence.

---

## A2 — Project skills, agents, commands

What the lab teaches: skills auto-fire from descriptions, agents are
dispatched explicitly, commands are user-invoked. Project-shipped
ones live in `.claude/skills/`, `.claude/agents/`, `.claude/commands/`
and are committed for the team.
([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem))

**Scope-cascade check (apply first):** assemble the union of skills,
agents, and commands available from project (`.claude/`),
user (`~/.claude/`), plugins (`~/.claude/plugins/cache/<m>/<p>/<sha>/`),
and built-ins. Plugin- and built-in-provided functionality is **not**
a project deficiency — projects don't redefine `/compound` if
`marvin:compound` is installed.

**Project responsibility:** if a custom skill, agent, or command is
project-specific — encodes domain knowledge, runs project-specific
scripts, depends on project files — it belongs in the repo, not user
scope. Flag user-scope artifacts that look project-specific.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/agents/<name>.md` exists, frontmatter lacks `model:` | "subagent will inherit caller's model — likely Opus by accident" | high |
| `.claude/agents/<name>.md` `model:` is `opus` AND name suggests retrieval (`*-locator`, `*-finder`, `*-searcher`) | "Opus on a retrieval agent — Haiku is ~10× cheaper for this work" | high |
| `.claude/skills/<name>/SKILL.md` `description:` < 30 chars | "description too thin for auto-activation matching" | high |
| Skill `description` doesn't say *when* to activate (no triggers) | "skill won't auto-fire on user prompts — Claude can't decide when to load it" | medium |
| Skill `description` > 1500 chars (cap is 1,536) | "description overflowing matcher budget — trim or use `disable-model-invocation`" | medium |
| Project-specific skill present in user scope (`~/.claude/skills/`) but not project (e.g., references project files in description) | "project-specific artifact in user scope — teammates won't have it" | high |
| `.claude/commands/foo.md` exists alongside `.claude/skills/foo/` | "duplicate name — skill takes precedence; the command is dead" | high |
| Custom skill duplicates a built-in (e.g., `.claude/commands/clear-context.md`) | "duplicates built-in `/clear`" | high |

### LLM-judge prompts

- "Read this SKILL.md `description:` line. If a fresh agent saw only
  this, could it decide whether to activate the skill? If not, what's
  missing — a trigger phrase, a domain noun, a verb?"
- "Does this subagent have a clear delegation contract — name what it
  takes in, what it returns, when the parent should call it?"

### Evidence requirement

Quote the actual frontmatter line + filename. For agents missing
`model:`, quote the full frontmatter block to show absence.

---

## A3 — Project hooks

What the lab teaches: "from now on always do X" is a hook, not a
memory. Hooks fire 100% of the time; instructions fire ~80%.
([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem))

**Scope-cascade check:** read both `.claude/settings.json` and
`~/.claude/settings.json` for `hooks` blocks. A project may be fully
covered by user-scope hooks for a single developer, but team-wide
behaviors must live in project scope.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| CLAUDE.md says "always run X" / "from now on Y" / "never Z" with no corresponding hook in `.claude/settings.json` | "automated-behavior phrasing without a hook to enforce it" | high |
| `.claude/settings.json` has no `hooks` block AND no destructive-command guard exists | "`rm -rf` and `git push --force` are not blocked at project level" | medium |
| Hook references a script path that doesn't exist on disk | "hook silently fails — script missing" | high |
| Hook timeout missing or >120s | "hook can stall the session — set explicit timeout (10–60s typical)" | medium |
| Multiple hooks on the same matcher with overlapping behavior | "hook duplication — one matcher firing two equivalent commands" | medium |
| `.claude/hooks/` scripts not gitignored AND contain `#!/usr/bin/env bash` | (positive) — committed hook scripts | n/a |
| Hook uses absolute path to `~` or `/Users/<name>/...` | "hook is non-portable — use `$CLAUDE_PROJECT_DIR`" | high |

### LLM-judge prompts

- "Read this CLAUDE.md. Are there sentences describing automated
  behaviors ('always do X', 'never Y', 'from now on Z') that should
  be hooks? Quote the strongest one."

### Evidence requirement

Quote the CLAUDE.md sentence + the missing hook block, or quote the
hook entry that points at a nonexistent script.

---

## A4 — Project MCPs

What the lab teaches: project-critical MCPs live in `./.mcp.json`,
committed to the repo. Personal-preference MCPs live in user scope.
Secrets via `${VAR}` env expansion, not baked into the file.
([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem))

**Scope-cascade check:** if CLAUDE.md or a skill *references* an MCP
(by name, e.g., "uses the linear MCP"), check whether it's declared
in `./.mcp.json`. If the reference is project-required but the MCP
only lives in user `~/.claude.json`, that's a cross-scope leak.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `./.mcp.json` doesn't exist AND CLAUDE.md / skills reference an MCP by name | "project depends on an MCP that isn't declared — teammates won't have it" | high |
| `./.mcp.json` contains a literal API key or token (not `${VAR}`) | "secret committed in `.mcp.json` — rotate the key, switch to env var" | high (security) |
| `./.mcp.json` MCP type is `sse` (deprecated) | "SSE deprecated — switch to `http` or `stdio`" | medium |
| `./.mcp.json` declares servers with no `description` or comment | "teammates can't tell what each MCP is for" | low |
| `~/.claude.json` has project-specific MCPs (project name in description, project-only Linear workspace, etc.) AND project has no `.mcp.json` | "project-critical MCP only in user scope" | high |
| `.mcp.json` declares >10 servers | "MCP sprawl — most teams need 2–4" | low |

### LLM-judge prompts

- "Read this `.mcp.json`. For each declared server, is the project's
  intent clear from the name + description? Quote the least-clear
  declaration."

### Evidence requirement

Quote the offending line from `.mcp.json` (with secret redacted to
`<REDACTED>` if present). For cross-scope leaks, quote the user-scope
declaration AND the project file that references the MCP.

---

## A5 — Project permissions (rules + modes)

Two related but distinct concerns. **Rules** (allow/deny lists) say
*what's allowed*; **modes** say *how Claude asks before doing it*.
Both shape the user experience and both belong in a well-tuned
project.

### A5a — Permission rules (allow/deny lists)

What the lab teaches: an explicit `permissions` block buys you the
gap between **permission fatigue** (every command prompts → developer
mashes `y`) and **silent damage** (auto-approved `rm -rf` → one bad
invocation nukes the tree). Allowlist read-only patterns; denylist
the irreversibles. The brake without the accelerator is permission
fatigue; the accelerator without the brake is silent damage.
([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem))

#### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/settings.json` has no `permissions` block | "every command will prompt — permission fatigue likely" | medium |
| `permissions.allow` includes `Bash(*)` or `Edit(*)` (wildcards on dangerous tools) | "wildcards on Bash/Edit auto-approve everything — silent damage risk" | high |
| `permissions.deny` is empty or missing | "no destructive-command guard — `rm -rf`, `git push --force` not blocked" | high |
| `permissions.deny` is comprehensive but `permissions.allow` is empty/missing | "the brake is shipped but the accelerator is missing — every safe command still prompts, fatigue likely" | high |
| `permissions.allow` lists frequently-prompted safe patterns (`Bash(ls:*)`, `Bash(rg:*)`, `Bash(git status:*)`, `Read`, `Glob`, `Grep`, the project's build/test commands) | (positive) — flow-preserving allowlist | n/a |
| `permissions.deny` includes `Bash(rm -rf:*)`, `Bash(git push --force:*)`, `Bash(git reset --hard:*)`, `Bash(sudo *)`, `Bash(curl * | sh*)` | (positive) — destructive-command guard | n/a |

#### LLM-judge prompts

- "Read this `permissions` block. Does the allowlist match the
  team's actual workflow (do they really run `Bash(bun test:*)` 50
  times a session)? Or is it copy-pasted defaults?"
- "If the allow list is empty but the deny list is full, what
  happens to the developer's flow on the 50th `Bash(git status)`
  prompt of the day?"

#### Evidence requirement

Quote the `permissions` block (or its absence). For wildcard finds,
quote the exact line. For "brake without accelerator" finds, quote
both the deny list (showing it's substantive) and the missing/empty
allow list.

### A5b — Permission modes

What the lab teaches: Claude Code has five permission modes — **Ask
permissions** (default, prompts before each edit), **Accept edits**
(edits freely, you review the diff), **Plan mode** (read-only think
mode, no destructive ops), **Bypass permissions** (no asking; same
as `--dangerously-skip-permissions`; settings-gated), **Auto mode**
(classifier-driven, asks only on ambiguous ones; settings-gated). The
mode is project-level config (`defaultMode` in `permissions`) and a
runtime toggle (Shift+Tab cycles, `--permission-mode <mode>` sets at
launch).
([Chapter 4: Iteration and control](https://cc-lab.ondrejsvec.com/en/iteration-and-control))

A team-shared project benefits from a deliberate `defaultMode` in
`.claude/settings.json` so a fresh clone starts in the right posture.

#### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/settings.json` has no `permissions.defaultMode` | "every teammate starts in `default` (ask-on-everything) — fine for risky repos, friction for read-heavy work" | low (sometimes correct) |
| `permissions.defaultMode: "bypassPermissions"` committed at project level | "bypass committed as team default — guardrails removed for everyone, including teammates who won't expect it" | high |
| `permissions.defaultMode: "auto"` set without `permissions.allow`/`deny` block | "auto mode without rules — the classifier alone is the only safety; pair with allow/deny" | medium |
| CLAUDE.md mentions plan mode or specific permission posture but `.claude/settings.json` has no `defaultMode` | "voice says one mode; config says default — drift" | medium |
| `permissions.defaultMode: "acceptEdits"` for a project where the team reviews PRs (most projects) | (positive) — fast loop with PR review as the safety net | n/a |
| `permissions.defaultMode: "plan"` set at project level | "plan as default — only fits projects where exploration dominates execution" | low (rare but valid) |

#### LLM-judge prompts

- "Read CLAUDE.md and `.claude/settings.json` together. Is the
  team's permission posture stated anywhere — should they default to
  ask-on-everything, accept-edits, plan, auto? Quote where it's
  stated, or note the absence."

#### Evidence requirement

Quote the `defaultMode` line (or its absence) AND any CLAUDE.md
sentences about permission posture. The observation must show the
gap or alignment between the two.

---

## A6 — Project hygiene (gitignore, secrets, drift)

What the lab teaches: `.claude/settings.local.json` is gitignored for
a reason — it holds per-developer overrides. Committing it is a
textbook smell. Secrets in committed files are the highest-severity
finding.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/settings.local.json` exists AND is tracked by git | "`.local.json` committed — should be gitignored per team convention" | high |
| `.gitignore` does not include `.claude/settings.local.json` | "no gitignore entry — next teammate will commit theirs" | medium |
| `.env` or `.env.local` tracked by git | "`.env` committed — likely contains secrets" | high (security) |
| Tracked file matches `^[A-Z_]+=[^$].{20,}` (heuristic for hardcoded long secrets) | "possible hardcoded secret in tracked file" | medium |
| `.claude/` directory exists but `.gitignore` doesn't reference it at all (no `# Claude Code` block) | "team intent unclear — what's committed vs personal?" | low |

### LLM-judge prompts

- "Look at the `.claude/` tree and the `.gitignore`. Is the team's
  intent clear about what's committed (team policy) vs gitignored
  (personal)? Or is it ambiguous?"

### Evidence requirement

Quote the offending tracked filename + a redacted snippet (`<REDACTED>`
in place of the secret value).

---

## A7 — Plugin declarations (team plugins)

What the lab teaches: if a project relies on a plugin's skills, hooks,
or MCPs, the project's `.claude/settings.json` should declare the
marketplace and enable the plugin so teammates get prompted to install
it on first session.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| Project-scope plugin entry in `~/.claude/plugins/installed_plugins.json` (`scope: project`, `projectPath` matches cwd) AND `.claude/settings.json` has no `enabledPlugins` block | "you have a project plugin installed but it's not declared in repo settings — teammates won't get it" | high |
| `.claude/settings.json` has `enabledPlugins` but corresponding marketplace is not in `extraKnownMarketplaces` | "enabled plugin without marketplace declared — teammate install will fail" | high |
| CLAUDE.md / skills reference a plugin's command (e.g., `/compound`, `/work`) AND no project plugin declaration covers it | "project depends on a user-scope plugin — teammates may not have it" | medium |

### Evidence requirement

Quote the project plugin entry from `installed_plugins.json` AND the
relevant section (or absence) from `.claude/settings.json`.

---

## A8 — Knowledge capture

What the lab teaches: solved problems become reusable artifacts.
Captures are useful when grep-able by symptom + named file paths +
verifier. Dead captures are titled by feature, no symptoms.
([Chapter 7: Compound engineering](https://cc-lab.ondrejsvec.com/en/compound-engineering))

**Scope-cascade check:** if `~/.claude/docs/solutions/` or a plugin's
compound skill (`marvin:compound`, `deep-thought:learn`) is in use,
project-level absence of `docs/solutions/` may be fine — the team
captures elsewhere. Flag only when neither captures.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `docs/solutions/` exists with >0 entries AND CLAUDE.md does not reference it | "captures exist but CLAUDE.md doesn't tell the agent to grep them — dead text" | high |
| `docs/solutions/` exists, sample 3 entries — none have a "Symptom" or "How to detect next time" section | "captures aren't grep-able by future-symptom — won't fire on recurrence" | medium |
| `docs/solutions/` last entry is > 90 days old AND repo had >50 commits since | "knowledge capture stopped — debugging now happens un-archived" | medium |
| No `docs/solutions/`, no plugin compound skill, AND repo has >100 commits | "no visible knowledge-capture surface" | low (sometimes culture, not config) |

### Evidence requirement

Quote the filename + first heading of a sampled solution doc. For
"missing symptom" claims, quote the actual structure of the file.

---

## A9 — Iteration discipline (visible in git)

What the lab teaches: small atomic commits, the loop runs through
git, never work >15 min uncommitted.
([Chapter 4: Iteration and control](https://cc-lab.ondrejsvec.com/en/iteration-and-control))

### Heuristics

Run `git log --oneline -50` and `git log -10 --stat`.

| Check | Signal | Confidence |
|---|---|---|
| ≥3 of last 10 commit subjects start with "wip"/"WIP" | "WIP commits in main history — checkpoint discipline weak" | high |
| Median inter-commit gap during active sessions > 60 min | "long gaps suggest fighting context loss between commits" | medium |
| Last 10 commit subjects are mostly single words ("fix", "update", "final") | "uninformative subjects — context lost from history" | high |
| Average files-changed per commit > 30 across last 10 | "big-batch commits — review/revert harder" | medium |
| `git status` shows >10 modified files uncommitted right now | "long uncommitted state — risk of lost work" | medium |
| Commits include conventional-commit prefixes (`feat:`, `fix:`, `docs:`) AND scope (`feat(auth):`) | (positive) — readable history | n/a |

### Evidence requirement

Quote commit hashes + subjects for any pattern referenced. Specific
like `8b2a93f — plan(cclab): session checkpoint`, not "your commits."

---

## A10 — Usage signals (from session profile)

Only run this category when the skill brief includes a **Usage
profile** section. Skip it entirely (no observation, no "I can't
tell") if the profile is missing or marked unavailable.

What the lab teaches: a harness is judged by what it *does*, not what
it *contains*. Skills that never fire, agents that never get
dispatched, permission prompts that repeat — these are config-level
findings the file pass alone can't see. The profile is bounded
evidence: facts and counts only, never raw user prompts. Quote from it
the same way you quote from `CLAUDE.md` — by section name and figure.

**Boundary:** the profile is project-bound and time-bound. An
observation here must reference both — name the window
(*"in the last 30 days"* / *"across the last 12 sessions"*) so the
reader can tell what era you're judging. Don't extrapolate to "you
never use X" from "you didn't use X this month."

**Cross-scope cascade still applies.** If the profile shows a skill
"installed but never invoked" but it's a built-in or plugin skill the
user has no reason to run on this repo, that's not a finding — it's
noise. A10 fires when there's a *gap* between something the
project's setup invites (CLAUDE.md tells the agent to use it; the
skill's description matches the work happening in this repo) and
what the profile shows actually happens.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| Skill or command is in scope inventory, profile shows 0 invocations in window AND CLAUDE.md references it by name | "CLAUDE.md tells the agent to use `/X`; profile shows 0 invocations in <window> — instruction not landing" | high |
| Subagent is in scope inventory with description matching work happening in window (per tool histogram) AND profile shows 0 dispatches | "agent `<name>` matches the work but isn't being reached for — naming or activation gap" | medium |
| Profile permission events show ≥3 prompts on the same Bash shape (e.g. `Bash(rg)×5`) AND `.claude/settings.json` `permissions.allow` doesn't cover that shape | "repeated prompts on `<shape>` — `permissions.allow` gap" | high |
| Profile hook errors > 0 with named hook AND that hook is declared in `.claude/settings.json` | "`<hook>` failing in window — silent breakage in the harness" | high |
| Profile's Bash first-token histogram shows `cat`/`head`/`tail`/`sed` ≥5 entries | "Bash-as-Read antipattern recurring — agent missed Read tool affordance" | medium |
| Profile shows ≥3 retry-after-error pairs on the same tool (same tool fails, immediately retried) | "recurring failure-retry loop on `<tool>` — environmental or instruction issue" | medium |
| Profile shows sidechain ratio < 5% AND ≥3 subagents are in scope inventory | "subagents installed, almost all work happens on the main thread — context bloat risk" | low |
| Profile shows sidechain ratio > 70% | "main thread mostly delegates — verify the parent still tracks results" | low |
| Profile shows stopReason histogram with ≥2 `refusal` or `error` events on the main thread | "sessions ending in refusal/error — investigate the prompt or permission posture" | medium |
| Profile shows Edit-without-Read events ≥1 (Edit-before-Read on same path within session) | "Three Laws violation — Edit fired without prior Read of the same file" | high (if cited in CLAUDE.md) / medium (if not) |

### LLM-judge prompts

- "Read the usage profile's *Skills / commands invoked* section
  alongside the project's CLAUDE.md. Of the skills/commands the
  CLAUDE.md mentions by name, which appear in the invoked list and
  which don't? Quote both: the CLAUDE.md sentence inviting the
  capability, and the profile line showing zero invocations."
- "Read the usage profile's *Permission events* section. If a Bash
  shape is triggering repeated prompts, does `.claude/settings.json`
  `permissions.allow` cover it? Quote the profile's prompt count and
  the absent allow-list pattern."

### Evidence requirement

Quote both: a line from the profile (with section name) AND a line
from a real file (CLAUDE.md, settings.json, an agent definition)
showing the gap. The profile alone is not enough — usage observations
must point at *what the user can change*, which lives in files.

Example evidence shape for the "try this" artifact:
- Cite the profile section: `Profile · Skills/commands invoked: /compound — installed, 0 invocations in window`
- Cite the file gap: `CLAUDE.md:88 — "after solving a non-trivial bug, run /compound"`
- Artifact: a settings.json hook patch, a CLAUDE.md tightening, a
  permission-allow line — same shape as any other observation's
  artifact.

---

# Part B — User-mode rubric

Run these when diagnosing the developer's personal `~/.claude/` setup.
The question this part answers: *is your harness pulling its weight?*

## B1 — User memory (`~/.claude/CLAUDE.md`)

What the lab teaches: user CLAUDE.md is for **personal preferences** —
voice, tone, default behaviors across projects. Not for project-specific
facts (those belong in the relevant repo's CLAUDE.md).

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `~/.claude/CLAUDE.md` doesn't exist | "no user-global preferences — every session starts from defaults" | low |
| `~/.claude/CLAUDE.md` > 600 lines | "user CLAUDE.md too large — splits between cross-project habits and what should be in `~/.claude/skills/`" | medium |
| `~/.claude/CLAUDE.md` mentions specific project names, repos, or stacks ("we use Drizzle", "in the Quellis monorepo") | "project-specific facts in user scope — should live in that project's CLAUDE.md" | high |
| `~/.claude/CLAUDE.md` contains hard rules (`always run X`, `never Y`) instead of style preferences | "rules belong in hooks; user CLAUDE.md is for tone" | medium |

### LLM-judge prompts

- "Read this user CLAUDE.md. Of the rules and conventions stated,
  which are universal-personal-preference (apply across all your
  projects) and which are leaking from a specific project?"

### Evidence requirement

Quote the project-specific line + the project name it implies.

---

## B2 — Plugin hygiene

What the lab teaches: installed plugins should be at the right scope,
without stale entries pointing at deleted projects, without duplicate
versions in cache.

### Heuristics

Read `~/.claude/plugins/installed_plugins.json`.

| Check | Signal | Confidence |
|---|---|---|
| Entries with `scope: project` whose `projectPath` no longer exists on disk | "stale project-plugin entries — clean up with `/plugin uninstall`" | high |
| Same `<plugin>@<marketplace>` appears with multiple versions across entries | "duplicate plugin versions — one is unused" | medium |
| `~/.claude/plugins/cache/` size > 1GB | "plugin cache bloat — `claude plugin update` rewrites; old SHAs accumulate" | low |
| Marketplace in `known_marketplaces.json` with `autoUpdate: true` from non-trusted source | "third-party marketplace auto-updating — review trust" | medium |

### Evidence requirement

Quote the offending entry from `installed_plugins.json` (with paths
truncated to relevant suffix).

---

## B3 — User skills, agents, commands

What the lab teaches: user-scope skills/agents/commands are for
**cross-project habits** — patterns you want available everywhere,
not specialized to one repo.

**Scope-cascade check:** if a skill in `~/.claude/skills/` is
project-specific (references a specific repo, runs project-specific
scripts), it belongs in that project's `.claude/skills/`, not user
scope. Flag the leak.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| User-scope skill has `description:` referencing a specific project name or stack | "project-specific skill in user scope — move to that project's `.claude/skills/`" | high |
| User-scope skill `description:` < 30 chars | "description too thin for auto-activation matching" | high |
| User-scope skill duplicates a built-in (e.g., `~/.claude/commands/clear-context.md`) | "duplicates built-in `/clear`" | high |
| User-scope agent missing `model:` | "subagent inherits caller's model — likely Opus by accident" | high |
| > 20 user-scope skills + commands | "skill proliferation — likely overlap and discovery friction" | low |

### Evidence requirement

Quote the SKILL.md filename + the project-specific phrase from its
description.

---

## B4 — User MCPs

What the lab teaches: user-scope MCPs (in `~/.claude.json`) are for
cross-project tools (personal Linear, Things 3, Gmail). Project-shared
MCPs go in the project's `.mcp.json`.

### Heuristics

Read `~/.claude.json` top-level `mcpServers` and per-project
`projects.<path>.mcpServers`.

| Check | Signal | Confidence |
|---|---|---|
| MCP in `mcpServers` (user-global) whose name implies a specific project ("acme-database", "quellis-stripe") | "project-specific MCP at user scope — should be in that project's `.mcp.json`" | high |
| MCP with literal API key in `env` | "secret in user-scope MCP config — switch to keychain or `${VAR}`" | high |
| > 8 servers in `mcpServers` | "MCP sprawl at user scope — most builders need 2–4 personal tools" | low |

### Evidence requirement

Quote the offending MCP entry (with secrets redacted).

---

## B5 — User hooks

What the lab teaches: user hooks are for **personal-style automations**
that you want everywhere — log compaction events, ping Pushover when a
long task finishes, switch terminal title on `SessionStart`.
Team-policy hooks belong in project scope.

### Heuristics

Read `~/.claude/settings.json` `hooks` block.

| Check | Signal | Confidence |
|---|---|---|
| User hook references a project-specific script path (`/Users/.../my-project/scripts/...`) | "user hook tied to one project — extract to that project's `.claude/hooks/`" | high |
| > 15 user hooks | "user-scope hook soup — review which still earn their keep" | medium |
| Hook with timeout missing or > 120s firing on `PreToolUse` | "user hook can stall every tool call — set explicit timeout" | medium |
| Hook script path doesn't exist | "user hook silently fails — script missing" | high |

### Evidence requirement

Quote the hook entry + the missing script path or project path.

---

## B6 — Auto-memory state

What the lab teaches: auto-memory's `MEMORY.md` index loads in every
session (first 200 lines / 25KB). Topic files load on demand. The
index should stay tight; topic files do the heavy lifting.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `~/.claude/projects/<encoded>/memory/MEMORY.md` doesn't exist for the cwd's repo | "auto-memory not yet primed for this repo" | low |
| `MEMORY.md` > 25KB | "MEMORY.md exceeds 25KB load cap — bottom is silently dropped" | high |
| `MEMORY.md` last-modified > 60 days ago AND repo had >50 commits since | "memory frozen — auto-memory disabled or curation stopped" | medium |
| Topic files exist but `MEMORY.md` doesn't reference them | "topic files unreachable — index misses them" | medium |

### Evidence requirement

Quote the `MEMORY.md` size or the missing reference to a topic file.

---

# Selection — picking the final 3-5 observations

After running the appropriate part(s), you'll have a candidate pool.
Pick 3-5 by:

1. **Severity** — security findings (committed secrets, wildcard
   permissions on Bash) come first. Hygiene smells (committed
   `.local.json`) second. Voice/style observations last.
2. **Evidence weight** — observations quoting 2+ lines from real
   files beat observations quoting 1.
3. **Actionability** — observations whose copy-paste artifact the
   user could apply this same session beat observations that say
   "consider X."
4. **Category spread** — prefer 3 observations across 3 categories
   over 3 observations in the same category.
5. **Confidence mix** — 1-2 high + 1-2 medium + 0-1 "I can't tell" is
   healthy. All-high reads as harsh; all-medium reads as wishy-washy.

If you can't get 3 evidence-grounded observations after running the
target rubric, return only what you have plus the sparse-signal
closing from `output-template.md`.

---

# What every observation must include

| Field | Format | Anti-pattern |
|---|---|---|
| Title | 5-9 words, names the pattern | "Great context discipline overall!" |
| What I see | 2-3 sentences with ≥1 quoted line + filename | "Your setup could be tighter." |
| Confidence | `high` / `medium` / `I can't tell` | (omitting it) |
| Try this | Copy-pasteable artifact (CLAUDE.md addition / SKILL.md scaffold / Bash one-liner / settings.json patch / prompt) | "Consider thinking about..." |
| Read more | Single chapter link | (multiple links — too many handles) |

---

# Voice rules

Inherited from `docs/cc-lab-design-system.md` in the lab repo.

- Short declarative sentences. One idea per sentence.
- Active voice.
- Concrete beats abstract. Quote the file. Name the line.
- No "delve," "leverage," "in order to," "utilize," "best-in-class."
- No emoji as decoration. No hashtags ever.
- No throat-clearing ("It's worth noting that...").
- No praise without grounding.
- No maturity-ladder framing ("score 7/10", "level 2 of 4").
- No recommending things the user already has via plugin or built-in.
- No recommending committing personal preferences to the team repo.

---

# Appendix A — Chapter slug manifest

The diagnostic links only to slugs that exist in the lab. As of
2026-04-26:

| Slug | EN title | Used by category |
|---|---|---|
| `before-we-start` | Before we start | — |
| `first-task` | Your first task | — |
| `teach-claude-your-project` | Teach Claude your project | A1, B1 |
| `iteration-and-control` | Iteration and control | A5b (permission modes), A9, A10 (workflow shape, retry patterns) |
| `voice-and-interaction` | Voice and modalities | — |
| `ecosystem` | The ecosystem | A2, A3, A4, A5a, A7, A10 (dead skills/agents/commands, hook errors, permission gaps), B2, B3, B4, B5 |
| `compound-engineering` | Compound engineering | A8, B6 |
| `next-steps` | Where to go next | — |
| `reference` | Reference | — |
| `behind-the-scenes` | Behind the scenes | — |

Link format: `https://cc-lab.ondrejsvec.com/en/<slug>` for EN,
`https://cc-lab.ondrejsvec.com/cs/<slug>` for CS.

---

# Appendix B — Evidence-quoting standards

When quoting from a user's file:

- **Inline quotes** (under 5 words) — backticks: `like this`
- **Single-line quotes** — blockquote with filename:
  ```
  > `CLAUDE.md:42` — "Always commit before /clear."
  ```
- **Multi-line quotes** — fenced code block with filename + line range:
  ```
  CLAUDE.md:42-45
  Always commit before /clear.
  Run tests after every meaningful change.
  Never work >15 min uncommitted.
  ```
- **Commit subjects** — short hash + subject in backticks:
  `8b2a93f — plan(cclab-mastery): session checkpoint`

Never paraphrase the user's words and present them as quotes.

---

# Appendix C — Confidence calibration

| Tag | When to use |
|---|---|
| `high` | A heuristic fired AND ≥1 supporting line quoted. The pattern is named in the rubric and the evidence is visible. |
| `medium` | LLM-judge prompt produced an observation grounded in quoted evidence, but no heuristic fires explicitly. The reader could reasonably disagree. |
| `I can't tell` | Neither heuristic nor LLM-judge produced grounded signal. Output is the chapter link + "spend a session, re-run." |

Never use `high` without quoted evidence. Never use `low` (it's not a
useful shade).

---

# Appendix D — Built-in commands the diagnostic must not duplicate

The skill must **not** recommend creating custom skills/commands that
duplicate these:

- `/clear`, `/compact`, `/resume`, `/init` — context + session lifecycle
- `/model`, `/config`, `/permissions` — runtime knobs
- `/agents`, `/skill`, `/plugin`, `/reload-plugins` — extension management
- `/mcp`, `/hooks`, `/memory` — introspection
- `/usage`, `/cost`, `/login`, `/logout`, `/status` — meta
- `/add-dir`, `/export`, `/bug`, `/vim`, `/statusline`, `/rename` — utility
- Bundled skills: `/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`, `/review`, `/security-review`

If a custom skill in the user's setup duplicates one of these, that's
an A2/B3 observation candidate.
