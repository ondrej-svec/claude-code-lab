# cc-lab-diagnose rubric

The judging rubric. Six categories, each with heuristic checks that run
first and LLM-judge prompts that run if no heuristic fires. Every
observation must quote at least one line from the user's actual files.

If a category produces no evidence-grounded signal, mark it
"I can't tell" and skip — never invent observations to hit a count.

---

## Scope cascade — read this before any "missing" claim

Claude Code inherits state from **two scopes simultaneously**:

| Scope | Source | What lives here |
|---|---|---|
| **Project** | `./CLAUDE.md`, `./.claude/` | Repo-specific memory, hooks, skills |
| **User** | `~/.claude/CLAUDE.md`, `~/.claude/{skills,agents,commands,hooks}/`, `~/.claude/plugins/` | Global memory, user-installed skills + plugin marketplaces |

The agent operating in any repo sees the **union** of both.

**The cascade rule:** before any heuristic in this rubric is allowed
to claim "missing" or "absent," check whether the pattern exists in
user scope. If yes, suppress the claim — the project doesn't need to
redefine what's already provided.

Concrete examples of the trap this rule prevents:

| What the heuristic might claim | Why it's wrong |
|---|---|
| "No skill captures todo creation" | User has `marvin` (provides `/work`) and `deep-thought:plan` installed — todos are produced from those, not a project-local skill |
| "No `/compound` workflow" | `marvin:compound` is installed user-scoped — compounding works fine |
| "No review skill" | `deep-thought:review`, `marvin:quick-review` are installed |
| "No hooks" | `~/.claude/settings.json` may carry hooks that fire in every project |
| "No knowledge capture" | `~/.claude/docs/solutions/` exists, or a plugin's compound skill captures elsewhere |

Two outcomes when scope-cascade catches a false positive:

1. **Drop the observation entirely** — the gap doesn't exist; nothing
   to say. Don't pad the count.
2. **Reframe as "exists in user scope; project doesn't reference it"**
   — only when the gap genuinely matters (e.g., the project
   `CLAUDE.md` contradicts a user-scope skill, or onboarding
   documentation would benefit from naming the user-scope dependency).
   This output is rare; default is option 1.

The skill must apply this rule to **every category below** that could
trigger a "missing" claim — explicitly: skill design (Cat 2), hook
usage (Cat 3), agent and command patterns (Cat 4), knowledge capture
(Cat 6). Context discipline (Cat 1) and iteration discipline (Cat 5)
are project-local concerns and don't cascade.

---

## Category 1 — Context discipline

What the lab teaches: a CLAUDE.md that earns its weight, sessions that
end on purpose, context budget watched on the way up not after the
crash. ([Chapter 3: Teach Claude your project](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project),
[Chapter 4: Iteration and control](https://cc-lab.ondrejsvec.com/en/iteration-and-control))

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `CLAUDE.md` does not exist | "no project memory yet" — observation candidate | high |
| `CLAUDE.md` exists, < 20 lines | "minimal project memory — likely under-using context" | high |
| `CLAUDE.md` exists, > 400 lines | "long project memory — candidate for splitting / linking" | high |
| `CLAUDE.md` exists, no headings (no `^## `) | "unstructured project memory — agent will treat as one wall" | medium |
| `CLAUDE.md` mentions a stack but no commands | "describes what but not how" | medium |
| `git log --grep "/clear\|/compact\|context"` returns 0 hits across 100 commits | "no visible session-management practice" | low (commits aren't the only signal) |

### LLM-judge prompts (run only if heuristics don't already produce a clear observation)

- "Read this CLAUDE.md. What does it teach the agent that the agent
  couldn't infer from the code alone? Quote two lines that earn their
  weight, and one line that doesn't."
- "Looking at the last 10 commits, what does this builder's iteration
  loop look like — small atomic commits, batch commits, WIP commits,
  long uncommitted gaps?"

### Evidence requirement

Every observation in this category must include either (a) a quoted
line from `CLAUDE.md` with the line number, or (b) a quoted commit
subject with the commit short-hash. Generic "your context discipline
could be tighter" with no quote is forbidden.

---

## Category 2 — Skill design

What the lab teaches: skills are small, named, frontmatter-shaped,
single-purpose. The frontmatter `description` is the activation
contract. ([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem),
[Chapter 7: Compound engineering](https://cc-lab.ondrejsvec.com/en/compound-engineering))

**Scope-cascade check (apply before any heuristic):** assemble the
union of available skills from project (`.claude/skills/`), user
(`~/.claude/skills/`), and installed plugins
(`~/.claude/plugins/cache/<marketplace>/<plugin>/<sha>/skills/`). Any
"missing skill" claim must survive a check against that union.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/skills/` doesn't exist | "no custom skills" — observation candidate IF other signal suggests skills would help | high |
| Skills exist but no `SKILL.md` per skill | "skills missing the activation contract" | high |
| `SKILL.md` files lack `name:` or `description:` frontmatter | "frontmatter incomplete — agent can't auto-load" | high |
| `description:` field < 30 chars | "description too thin to drive auto-activation" | high |
| `description:` field doesn't say *when* to activate | "skill won't auto-fire on user requests" | medium |
| > 5 skills with no apparent boundary between them | "skills proliferating — likely overlap" | medium |
| Skill has > 800 lines in SKILL.md | "skill too large — split into multiple skills" | medium |

### LLM-judge prompts

- "Read this SKILL.md. Could a fresh agent decide whether to activate
  it from the description alone? If not, what's missing?"
- "Compare the skills in `.claude/skills/`. Are there any that should
  be merged, or any that should be split?"

### Evidence requirement

Quote the actual `description:` line from the SKILL.md, with the
filename. Quote the line count if size is the issue.

---

## Category 3 — Hook usage

What the lab teaches: hooks turn intentions into harness behavior.
"From now on do X" is a hook, not a memory. ([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem))

**Scope-cascade check (apply before any heuristic):** read both
project `.claude/settings.json` and user `~/.claude/settings.json` for
hook definitions. A project may inherit comprehensive hooks from user
scope; "no hooks" is only true when both scopes are empty.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/settings.json` or `settings.local.json` doesn't exist | "no harness config — likely defaults only" | medium (not always wrong) |
| Settings file exists, no `hooks` block | "no hooks configured" — surface only if CLAUDE.md mentions automated behaviors that should be hooks | medium |
| CLAUDE.md says "always run X" / "from now on Y" / "before each commit Z" | "automated-behavior phrasing without a hook to enforce it" | high |
| Hook block has hooks but they all just `echo` | "hooks present but empty — placeholder pattern" | medium |
| `permissions` block missing or `allow: []` | "every command will prompt — permission fatigue likely" | medium |

### LLM-judge prompts

- "Read this CLAUDE.md. Are there any sentences that describe
  behaviors that should be hooks rather than instructions to the
  agent?"

### Evidence requirement

Quote either (a) the line from CLAUDE.md that describes an automated
behavior, or (b) the actual `hooks:` block from settings.json.

---

## Category 4 — Agent and command patterns

What the lab teaches: subagents specify model. Slash commands live in
`.claude/commands/`. MCPs are configured deliberately, not by accident.
([Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem))

**Scope-cascade check (apply before any heuristic):** assemble the
union of available agents and commands from project, user
(`~/.claude/agents/`, `~/.claude/commands/`), and installed plugins.
Plugin-provided commands (e.g., `/compound`, `/work`, `/plan`) cover
many use-cases that look "missing" at the project level.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `.claude/commands/` exists with > 0 entries | (positive) — note as a strength only if asked | n/a |
| `.claude/agents/` exists with subagent specs | check each: does it specify `model:`? | high if missing |
| Subagent file lacks `model:` frontmatter | "subagent will inherit caller's model — likely Opus by accident" | high |
| `.mcp.json` references unfamiliar servers without notes | "MCPs configured but no rationale documented" | low |

### LLM-judge prompts

- "Read these subagent specs. Do any of them spec a model that's
  obviously wrong for the agent's job (e.g., Opus for a one-shot
  grep)?"

### Evidence requirement

Quote the agent filename + the missing or incorrect `model:` line.

---

## Category 5 — Iteration discipline

What the lab teaches: small atomic commits, the loop runs through git,
checkpoints every 5-10 minutes, never work >15 min uncommitted.
([Chapter 4: Iteration and control](https://cc-lab.ondrejsvec.com/en/iteration-and-control),
[Chapter 7: Compound engineering](https://cc-lab.ondrejsvec.com/en/compound-engineering))

### Heuristics

Run `git log --oneline -30` and `git log -10 --stat` to gather data.

| Check | Signal | Confidence |
|---|---|---|
| ≥3 of last 10 commit subjects start with "WIP" or "wip" | "WIP commits in main history — checkpoint discipline weak" | high |
| Average files-changed per commit > 20 across last 10 | "big-batch commit pattern — review/revert harder" | medium |
| Last 10 commit subjects are all single words ("update", "fix") | "uninformative commit subjects — context lost from history" | high |
| `git status` shows >10 modified files uncommitted (only if user is currently mid-session) | "long uncommitted state — risk of lost work" | medium |
| Last 30 commits span >90 days but show flurry-then-silence pattern | "infrequent sessions — may benefit from /handoff practice" | low |

### LLM-judge prompts

- "Read these last 10 commit subjects. What loop pattern does this
  show — small focused steps, batch dumps, fix-the-fix cycles?"

### Evidence requirement

Quote the commit hash + subject for each commit referenced in the
observation.

---

## Category 6 — Knowledge capture

What the lab teaches: solved problems become reusable artifacts.
`/compound`, `docs/solutions/`, `docs/learnings/`, memory entries.
([Chapter 7: Compound engineering](https://cc-lab.ondrejsvec.com/en/compound-engineering))

**Scope-cascade check (apply before any heuristic):** before claiming
"no knowledge capture surface," check `~/.claude/docs/solutions/`,
`~/.claude/memory/`, plugin-provided compound skills (e.g.,
`marvin:compound`), and any other user-scope knowledge stores. A
builder using a compound skill captures elsewhere — this is fine;
don't pretend the project must hold the artifacts.

### Heuristics

| Check | Signal | Confidence |
|---|---|---|
| `docs/solutions/` doesn't exist AND `docs/learnings/` doesn't exist AND no `.claude/memory/` | "no visible knowledge-capture surface" | medium |
| `docs/solutions/` exists with 0 entries | "knowledge-capture set up but unused" | high |
| `docs/solutions/` exists with > 0 entries but most are < 50 lines | "captures may be too thin to be reusable" | medium |
| Filenames in solutions/ are dated and descriptive | (positive — the lab pattern) | n/a |
| `git log --grep="compound\|learn\|solution" --oneline -50` returns hits | check whether commits added or only renamed/cleaned | medium |

### LLM-judge prompts

- "Read 2-3 entries from `docs/solutions/`. Do they capture *why* the
  fix worked (so future-you can recognize the same problem), or only
  *what* the fix was?"

### Evidence requirement

Quote the filename + first heading of the solution doc. If the doc is
shallow, quote the line that's missing the "why."

---

## How to pick the final 3-5 observations

After running all six categories, you'll have 0-12 candidate
observations. Pick the 3-5 strongest by:

1. **Evidence weight** — observations that quote 2+ lines from real
   files beat observations that quote 1.
2. **Actionability** — observations whose copy-paste artifact the user
   could apply this same session beat observations that say
   "consider X."
3. **Category spread** — prefer 3 observations across 3 categories
   over 3 observations in the same category. The reader gets a wider
   read.
4. **Confidence mix** — 1-2 high-confidence + 1-2 medium-confidence +
   0-1 "I can't tell" is a healthy distribution. All-high reads as
   harsh; all-medium reads as wishy-washy.

If you can't get 3 evidence-grounded observations after running all
six categories, return only what you have plus a closing note: "Your
repo doesn't show enough signal yet for a fuller diagnosis. Spend a
session on it, then re-run."

---

## What every observation must include

| Field | Format | Anti-pattern |
|---|---|---|
| Title | 5-9 words, names the pattern | "Great context discipline overall!" |
| What I see | 2-3 sentences with ≥1 quoted line + filename | "Your setup could be tighter." |
| Confidence | `high` / `medium` / `I can't tell` | (omitting it) |
| Try this | Copy-pasteable artifact (CLAUDE.md addition / SKILL.md scaffold / Bash one-liner / prompt) | "Consider thinking about..." |
| Read more | Single chapter link | (multiple links — too many handles) |

---

## Voice rules (inherited from `docs/cc-lab-design-system.md`)

- Short declarative sentences. One idea per sentence.
- Active voice.
- Concrete beats abstract. Quote the file. Name the line.
- No "delve," "leverage," "in order to," "utilize," "best-in-class."
- No emoji as decoration. No hashtags ever.
- No throat-clearing ("It's worth noting that...").
- No praise without grounding ("you have a great setup!" — only if
  followed by quoted evidence).

If the output drifts from these, redraft.

---

## Appendix A — Chapter slug manifest

The diagnostic can only link to slugs that exist in the lab. Verify
against `lib/chapters.ts` if in doubt. As of 2026-04-26:

| Slug | EN title |
|---|---|
| `before-we-start` | Before we start |
| `first-task` | Your first task |
| `teach-claude-your-project` | Teach Claude your project |
| `iteration-and-control` | Iteration and control |
| `voice-and-interaction` | Voice and modalities |
| `ecosystem` | The ecosystem |
| `compound-engineering` | Compound engineering |
| `next-steps` | Where to go next |
| `reference` | Reference |
| `behind-the-scenes` | Behind the scenes |

Link format: `https://cc-lab.ondrejsvec.com/en/<slug>` for EN,
`https://cc-lab.ondrejsvec.com/cs/<slug>` for CS. The skill defaults
to EN; if the user's CLAUDE.md is predominantly in another language
the skill can offer the CS link instead.

---

## Appendix B — Evidence-quoting standards

When quoting from a user's file:

- **Inline quotes** (under 5 words) — use backticks: `like this`
- **Single-line quotes** — use a blockquote with the filename:
  ```
  > `CLAUDE.md:42` — "Always commit before /clear."
  ```
- **Multi-line quotes** — use a fenced code block with the filename
  and a line range:
  ```
  ```
  CLAUDE.md:42-45
  Always commit before /clear.
  Run tests after every meaningful change.
  Never work >15 min uncommitted.
  ```
  ```
- **Commit subjects** — short hash + subject in backticks:
  `8b2a93f — plan(cclab-mastery): session checkpoint`

Never paraphrase the user's words and present them as quotes. Either
quote exactly or describe in your own voice.

---

## Appendix C — Confidence calibration

| Tag | When to use |
|---|---|
| `high` | A heuristic fired AND you can quote ≥1 supporting line. The pattern is named in the rubric and the evidence is visible. |
| `medium` | The LLM-judge prompt produced an observation grounded in quoted evidence, but no heuristic explicitly fires. The reader could reasonably disagree. |
| `I can't tell` | Neither heuristic nor LLM-judge produced grounded signal. Output is the chapter link plus "spend a session, re-run." |

Never use `high` without evidence. Never use `low` (it's not a useful
shade — either the evidence is there or it isn't).
