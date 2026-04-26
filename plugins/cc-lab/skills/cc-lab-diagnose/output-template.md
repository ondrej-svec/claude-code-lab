# cc-lab-diagnose output template — v0.2

The exact shape the skill returns. Three openings (one per mode),
three closings (default / sparse / empty), one per-observation block.
Fill in the slots; don't add preamble; don't add closing pep-talk.

---

## Opening (verbatim — pick by mode)

### Project mode

```
# cc-lab diagnosis (project) — <repo-name> (<YYYY-MM-DD>)

Three to five observations from your `CLAUDE.md`, `.claude/`, `.mcp.json`,
and recent commits. Each one quotes the file it's reading. None of them
score, grade, or rank your setup.
```

### User mode

```
# cc-lab diagnosis (user) — ~/.claude (<YYYY-MM-DD>)

Three to five observations from your user CLAUDE.md, user-scope
skills/agents/commands, plugins, MCPs, and hooks. Each one quotes the
file it's reading. None of them score, grade, or rank your setup.
```

### Both mode

```
# cc-lab diagnosis (project + user) — <repo-name> (<YYYY-MM-DD>)

Two sections. The project pass asks whether a teammate cloning
`<repo-name>` could succeed today. The user pass asks whether your
personal `~/.claude/` is pulling its weight. Each observation quotes
the file it's reading. None of them score, grade, or rank.
```

`<repo-name>` = basename of cwd. `<YYYY-MM-DD>` = today.

If fewer than 3 observations are evidence-grounded for a given
section, drop the "to five" and say "two observations" or "one
observation" honestly. If zero, skip that section's observations and
use the empty-signal closing.

---

## Headline (always second — right after the opening)

A 2-4 sentence read of what matters most. Lead with the single most
load-bearing finding, then add the second and (if relevant) third.
Voice rules apply — no "your setup is overall solid" framing, no
hedging, no "things to consider." Just name the load-bearing
findings in declarative sentences.

The headline is *not* a summary of every observation. It's the
reader's two-second answer to "if I only fix one thing, what is it?"
followed by one or two more if they have the bandwidth.

### Shape

```
**Headline.** <Sentence naming the most load-bearing finding, with
its severity if relevant.> <Second sentence, second finding.>
<Optional third sentence — only if a third finding genuinely matters
at the same severity tier.>
```

### Examples

Single-mode (project):
```
**Headline.** Quellis has no project CLAUDE.md, so every teammate's
agent inherits the parent `Bobo/CLAUDE.md` for the wrong project.
The deny list is comprehensive but the allow list is empty —
permission fatigue forms within a session.
```

Single-mode (user):
```
**Headline.** Sixteen entries in your user `permissions.allow` embed
plaintext database passwords and AWS keys — security finding,
rotate before anything else. After that, three retrieval agents
silently inherit Opus despite your CLAUDE.md saying never to.
```

Both-mode (one headline covers both passes):
```
**Headline.** Highest severity: your user `permissions.allow` ships
sixteen entries with plaintext credentials — rotate this session.
Project-side, quellis has no CLAUDE.md and the project-scope plugin
isn't declared, so teammates fail on first session. Both fixes
have copy-paste artifacts below; the rest can wait a week.
```

### When the signal is sparse

If the diagnosis only produces 1-2 observations, write a one-sentence
headline that names what's actually there:

```
**Headline.** One finding worth your time: the project CLAUDE.md
inherits from `Bobo/` and describes the wrong project. The rest of
the harness is too sparse to read confidently — re-run after a few
sessions of work.
```

If zero observations are evidence-grounded, skip the headline and
go straight to the empty-signal closing.

---

## Section headers (only used in `both` mode)

```
---

## Project pass — `<repo-name>`

[3-5 project-mode observations]

---

## User pass — ~/.claude

[3-5 user-mode observations]
```

In single-mode runs, no section header is needed — the opening is
enough.

---

## Per-observation block

Repeat 3-5 times per section, numbering 1 through N. Use H2 (`##`)
for the title. Each observation has bolded labels for the five fields.

```
## <N>. <Title — 5-9 words, names the pattern>

**What I see.** <2-3 sentences with ≥1 quoted line from the user's
files and the filename. Active voice. Concrete. Don't editorialize —
report.>

**Confidence.** `<high | medium | I can't tell>`

**Try this.**

<copy-pasteable artifact in a code block — a CLAUDE.md addition, a
SKILL.md scaffold, a settings.json patch, a Bash one-liner, a prompt.
Must be runnable or pasteable as-is.>

**Read more.** [<Chapter N: Title>](https://cc-lab.ondrejsvec.com/en/<slug>)
```

---

## Calibration examples (project + user)

### Project-mode observation example

```
## 1. CLAUDE.md describes loop discipline but no hooks enforce it

**What I see.** Your `CLAUDE.md:42` says "always commit before /clear"
and `CLAUDE.md:48` says "run tests after every meaningful change."
Both are good rules — but `.claude/settings.json` has no `hooks`
block, so the harness won't enforce them. They live as instructions
to the agent, which means they fire when the agent remembers and
lapse when it doesn't.

**Confidence.** `high`

**Try this.** Add a `Stop` hook that warns on uncommitted changes:

\`\`\`json
// .claude/settings.json (committed — team-wide policy)
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "git -C \"$CLAUDE_PROJECT_DIR\" diff --quiet HEAD || echo '⚠ uncommitted changes — checkpoint before ending'",
        "timeout": 10
      }]
    }]
  }
}
\`\`\`

**Read more.** [Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem)
```

### User-mode observation example

```
## 1. Project-specific rules in your user CLAUDE.md

**What I see.** Your `~/.claude/CLAUDE.md:73` says "in the Quellis
monorepo, use `bun --filter @quellis/web dev`." That's a project fact,
not a personal preference — it'll fire on every project you open,
which is noise everywhere except quellis. The actual repo at
`~/projects/quellis/` has no `CLAUDE.md` to host this fact natively.

**Confidence.** `high`

**Try this.** Move the project facts to where they belong:

\`\`\`bash
# at the project root
cat > /Users/ondrejsvec/projects/quellis/CLAUDE.md <<'EOF'
# CLAUDE.md — quellis

## Commands
- Dev (web):    bun --filter @quellis/web dev
- Migrations:   bun --filter @quellis/web db:migrate
- Lint:         bunx biome check .
EOF

# then trim ~/.claude/CLAUDE.md to keep only cross-project habits
\`\`\`

**Read more.** [Chapter 3: Teach Claude your project](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project)
```

### "I can't tell" observation example (rare but valid)

```
## 3. Hook discipline — I can't tell

**What I see.** Your `.claude/settings.json:1-3` is `{"permissions":{}}` —
nothing else. No hooks block, no env, no model. The repo has 80
commits but I can't see whether the team agreed not to use hooks or
whether the file just hasn't been touched.

**Confidence.** `I can't tell`

**Try this.** If you want hooks, the next session is a fine time —
[Chapter 6](https://cc-lab.ondrejsvec.com/en/ecosystem) walks the
shape. If you don't, ignore this and re-run after another 50 commits.

**Read more.** [Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem)
```

---

## What to do next (always second-to-last, before the closing)

The reader has six observations. They need an order. This section is
the prioritized close: which fixes belong in *this session*, which
in *this week*, and which can compound over time.

Three time buckets, in this exact order:

```
---

## What to do next

**This session (15-30 min):**

1. **<Action>** (#<observation-number-or-tag>, <severity-or-reason>) — <one-line why-this-first.>
2. **<Action>** (...) — ...

**This week (1-2 hours total):**

3. **<Action>** (...) — ...
4. **<Action>** (...) — ...

**When you have time (compounds over sessions):**

5. **<Action>** (...) — ...
```

### Bucket assignment rules

- **This session.** Security findings (committed secrets, plaintext
  credentials in allow lists, public API keys in tracked files),
  hard blockers for teammates (no project CLAUDE.md when teammates
  are about to clone), wildcard permissions on dangerous tools.
  Bucket cap: 1-2 actions. More than that and "this session" stops
  being honest.
- **This week.** Hygiene fixes that compound (allow list pairing
  with deny list, gitignore drift, plugin declarations for
  teammates), correctness gaps the user can fix in <30 min each.
  Bucket cap: 2-3 actions.
- **When you have time.** Things that compound but don't bite right
  now (auto-memory priming, knowledge-capture grep references in
  CLAUDE.md, agent model audit on agents you use rarely). Bucket
  cap: 1-2 actions.

### Cross-references

Each action references the observation that contains its evidence
and the copy-paste artifact. Use `(#1, security)` / `(#project-2)` /
`(#user-3)` style — short, scannable, the reader can jump back.

### Voice rules (specific to this section)

- Each action starts with a verb in the imperative: "Rotate the
  credentials," "Drop a project CLAUDE.md," "Pair the allow list."
- Never write "consider doing X." Write "do X" — the artifact is
  already in the observation.
- Never invent new actions. Every line in this section maps to an
  existing observation. If you find yourself adding action #6 with
  no observation behind it, drop it.
- Never use severity scores ("8/10") or maturity ladders. Use
  "security finding," "blocking onboarding," "compounding,"
  "personal preference."

### Examples

Single-mode (project, three observations):
```
---

## What to do next

**This session (10 min):**

1. **Drop a project CLAUDE.md** (#1, blocking onboarding) — paste
   the scaffold above, ~5 min. Without it the agent reads `Bobo`'s
   contract for the wrong project every session.

**This week (30 min):**

2. **Pair the brake with the accelerator** (#2) — patch the
   `.claude/settings.json` permissions block; the deny-only shape
   trains every developer to mash `y`.

**When you have time:**

3. **Declare the plugin for teammates** (#3) — only matters when
   you're onboarding a collaborator, but the patch is small.
```

Both-mode (six observations, with severity sort):
```
---

## What to do next

**This session (20 min):**

1. **Rotate the credentials** (#user-1, security) — every value in
   your user allow list is plaintext on disk. Run the `jq` strip,
   then rotate.
2. **Drop the project CLAUDE.md** (#project-1) — teammates can't
   succeed without it; the scaffold above is ready to paste.

**This week (45 min):**

3. **Pair the brake with the accelerator** (#project-2) — patch the
   project permissions block.
4. **Patch the three agent files** (#user-2) — three `sed` commands,
   30 seconds. Stops the silent Opus inheritance.

**When you have time:**

5. **Declare the plugin for teammates** (#project-3) — only matters
   when you're onboarding a collaborator.
6. **Prime your auto-memory for quellis** (#user-3) — the next
   session is a fine place to start; one `/learn` pass.
```

When the diagnosis has only 1-2 observations, the section can shrink
to a single bucket. Don't pad to fill three buckets — keep the
shape honest.

---

## Closing (verbatim — pick by signal)

### Default closing (3+ observations shipped, single mode)

```
---

That's the read. None of these are scores. None of them are advice
without an artifact. If one of them lands and the other two don't,
that's a good outcome — the chapter links are there if you want
the longer version.
```

### Both-mode closing (3+ each section)

```
---

That's both reads. Project findings are about team-shareability —
what a teammate cloning the repo would hit. User findings are about
your personal harness — what compounds across every repo you touch.
The two surfaces have different jobs; don't blur them.
```

### Sparse-signal closing (1-2 observations in this section)

```
---

That's all <repo-name | ~/.claude> currently shows. Spend a session
on it, then re-run — the diagnostic gets sharper as your setup gets
denser.
```

### Empty-signal closing (0 observations possible)

For project mode:
```
---

This repo doesn't have enough Claude Code signal yet to diagnose
specifically. No `CLAUDE.md`, no `.claude/`, no `.mcp.json`.
[Chapter 3: Teach Claude your project](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project)
walks the first pass. Re-run after one session of work.
```

For user mode:
```
---

Your `~/.claude/` is close to a stock install. No user CLAUDE.md, no
user-scope skills, no installed plugins. That's fine — the lab
recommends starting with project-scope work and adding user-scope
artifacts only when patterns repeat across projects. Re-run when you
have a few sessions of cross-project habit to encode.
```

---

## What never appears in the output

- "Welcome!" / "Hello!" / "Let me take a look..."
- "Great question!" / "Solid setup!" / "Nice work overall!"
- "I noticed..." (use "I see" or just state the fact)
- "You should consider..." (replace with the artifact)
- "There are several things you could do..." (pick one and ship it)
- Numeric scores, percentages, letter grades, maturity levels
- Emoji as decoration (the H1 chapter heading uses none — neither
  does this output)
- Hashtags
- More than 5 observations per section (cut to the strongest 5)
- Generic closing pep-talk ("hope this helps!" / "happy hacking!")
- Cross-mode pollution: project advice in a user-mode run, or
  vice versa
- Personal-preference recommendations for the team repo (e.g., "add
  'use dry humor' to your CLAUDE.md") — that belongs in user scope

---

## Czech variant

If the user's CLAUDE.md is predominantly Czech, or the user explicitly
asks for the diagnosis in Czech, the skill can output Czech text per
`feedback_czech_peer_voice.md` rules:

- Reflexive passive over compound passive
- Informal prepositions in peer contexts
- No literal idiom translations
- Czech NBSP after single-character prepositions (`v`, `k`, `s`, `z`,
  `o`, `a`, `i`, `u`)

The Czech project-mode opening:

```
# cc-lab diagnostika (projekt) — <repo-name> (<YYYY-MM-DD>)

Tři až pět pozorování z tvého `CLAUDE.md`, `.claude/`, `.mcp.json` a
posledních commitů. Každé cituje soubor, ze kterého čte. Žádné z nich
tvůj setup neznámkuje, neřadí ani neoceňuje.
```

The Czech user-mode opening:

```
# cc-lab diagnostika (uživatel) — ~/.claude (<YYYY-MM-DD>)

Tři až pět pozorování z tvého uživatelského CLAUDE.md, skillů, pluginů,
MCP a hooků. Každé cituje soubor, ze kterého čte. Žádné z nich tvůj
setup neznámkuje, neřadí ani neoceňuje.
```

The Czech closing:

```
---

To je čtení. Žádné známky. Žádné rady bez konkrétního artefaktu.
Když jedno z pozorování sedne a dvě další ne, to je dobrý výsledek —
odkazy na kapitoly jsou tu, kdyby tě zajímala delší verze.
```

If the user's setup is bilingual, default to EN. The skill is not a
translator — it's a diagnostic. One language per run.
