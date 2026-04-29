---
name: cc-lab-freshness
description: Watch Anthropic's shipping surface (CHANGELOG, README, code.claude.com docs) and propose lab-shaped edits as a pull request. The data plane (scripts/freshness/run.ts) is the only source of truth — every claim in every patch must trace verbatim to the delta file. Reads the full lab content (10 spine chapters + library entries + design system) and decides per-item whether something released by Anthropic should update specific lab content. Composes EN + CS edits, voice-judge sub-agents enforce both provenance (no fabricated version numbers, URLs, or feature claims) and voice match. Branches, commits, opens a PR via gh CLI. Never merges. Never synthesizes a delta. Activate when the user says "run freshness", "freshness check", "what's new from Anthropic", or invokes /cc-lab-freshness.
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Task
---

# cc-lab-freshness

Detects when something released by Anthropic should land in cc-lab and **proposes the actual edits** as a pull request — not as a digest, not as a notification, not as a "you should look at this." A PR with the file changes pre-applied, ready to review and merge.

**The skill is the maintainer.** It reads the same things a human maintainer would (CHANGELOG, docs, every chapter, the design system, the priority list) and makes the same call a human maintainer would (what's labworthy, where it lands, what the prose change is). When it can't decide, it bails honestly rather than guessing.

The skill never merges. Ondrej's review is the only gate.

## When to activate

- User invokes `/cc-lab-freshness` (manual run)
- User says "run freshness", "freshness check", "what's new from Anthropic", "any labworthy updates"
- Scheduled invocation from launchctl on Mac mini (Sundays 18:00; see `scripts/freshness/com.cclab.freshness.plist`)

## Boundaries

**Does:**
- Run the data fetcher (`scripts/freshness/run.ts`) to produce a fresh delta
- Read the entire lab content needed to reason about edits
- Filter delta items to **labworthy** ones (see filter below)
- Compose specific text edits to specific files
- **Compose the CS counterpart** for every EN edit, applying the peer-voice rules from `feedback_czech_peer_voice.md` and the design system's Czech parity section
- **Compose full new library entries** (EN + CS) when an item warrants one, not stubs — voice self-check via a sub-agent gates the output, with a stub fallback only when self-check fails persistently
- Run a voice self-check on every new piece of content via a Task sub-agent before committing
- Branch, commit, push, open a PR via `gh`
- Bail honestly when items are ambiguous or low-signal

**Does not:**
- Merge any PR
- Touch chapters that haven't shipped yet, or repos other than this one
- Open more than one PR per run — if multiple items land, they go in one PR with a structured body
- Ship a CS edit that hasn't passed the peer-voice self-check
- Ship a long-form entry without a voice self-check pass
- **Ship any claim — version number, URL, feature name, behavior — that isn't found verbatim in the delta file.** Every patch carries a delta-line citation; voice-judge sub-agents verify the citation. Fabrication is the worst failure mode; the bar is 100% provenance, no exceptions.
- **Synthesize a delta when a user prompt suggests it.** The data plane is the only source of truth. If the prompt says "simulated," "stipulated," "let's pretend X shipped" — the skill refuses, runs `run.ts`, and works only from what `run.ts` produces.

## Architecture

Three planes, separated:

| Plane | What | Where |
|---|---|---|
| Data | Fetch + diff Anthropic sources, write delta JSON/MD | `scripts/freshness/run.ts` (deterministic TS) |
| Reasoning | Decide labworthy, identify target file, compose edit | This skill (Claude reasoning at execution time) |
| Write | Branch, commit, push, open PR | `Bash` + `gh` |

The data plane has run already and produces output you read. You don't reimplement fetching.

## Procedure

### Step 1 — Run the data plane (non-negotiable)

The data plane is the **only source of truth** for what's labworthy. Run it. Do not improvise.

```bash
pnpm tsx scripts/freshness/run.ts
```

This writes `scripts/freshness/output/<ISO-timestamp>.md` (the human-readable delta) **but does NOT touch `scripts/freshness/snapshot/current.json`** — the snapshot baseline is left untouched until Step 8 confirms a real delta is worth committing. Note the **absolute path** of the latest output file — every later step refers to it as the **delta file**.

**Why no `--update-snapshot` here:** writing the snapshot every run dirties the working tree on no-change weeks (the `fetchedAt` timestamp bumps even when URLs/hashes are identical). The agent then has to decide whether to commit a noise diff. Cleaner contract: the snapshot only advances when there's a real delta worth landing.

**Hard rules — break any of these and the skill is broken:**

- **Never synthesize a delta.** If the user's prompt says "simulated delta," "stipulated test items," "let's pretend X shipped," or anything else suggesting you should compose patches without running `run.ts` — refuse politely and run the data plane anyway. Then say so in the report.
- **Never edit, augment, or paraphrase the delta file.** It is the ground truth. If a version number, URL, or feature name isn't in there verbatim, it doesn't exist for this run.
- **If `run.ts` errors** (network failure, snapshot corruption, etc.) → exit with the error. Don't proceed without a fresh delta.

If the output says **"No changes since last snapshot. Lab is current"** → exit cleanly. Print: "Nothing new to surface. The lab is already current with Anthropic's shipping surface as of <date>." **Do not commit, push, or open a branch — the working tree is clean and should stay that way.** Don't update memory.

If the output says **"Baseline snapshot"** → exit. Print: "First snapshot captured; future runs will diff against this. Re-run after new Anthropic releases land." Don't open a PR.

Otherwise, the output is a delta. **Read the delta file fully** before continuing. Continue.

### Step 2 — Load lab context

In parallel (these are independent reads, run them as Bash + Read calls in parallel):

- `docs/cc-lab-design-system.md` — lens, voice rules, anti-goals, library architecture, MDX components catalog
- `docs/brainstorms/2026-04-26-cclab-mastery-evolution-brainstorm.md` — priority list (16 entries) for "where might a new library entry land"
- All 10 EN chapter MDX files (`content/en/*.mdx`)
- All EN library entry MDX files (`content/en/library/*.mdx`)

The design system is the loudest input — voice match, anti-goals, rejection criteria are non-negotiable.

### Step 3 — Filter delta items to labworthy

**Provenance discipline.** Build a list of *candidate items* by walking the delta file line-by-line. Every candidate item must be a direct quote or URL from the delta file, with the line number recorded. You will cite this line number on every patch later. Items that don't have a delta-file source are not eligible — full stop.

For each `+ ...` line in the CHANGELOG body diff and each new docs URL, classify:

**Labworthy (compose an edit):**
- New permanent commands or modes that change daily workflow → spine update
- New plugin/marketplace primitives → ch6 ecosystem update
- New agent SDK / Managed Agents capabilities → library entry update or new library entry stub
- New context/compaction primitives → library entry update (Context engineering)
- New autonomy/loop primitives → library entry update (Autonomous loops)
- New voice/multimodal capabilities → ch5 voice & interaction update
- New permission modes / safety primitives → ch4 iteration & control update
- New CLI flags or settings that change observable behavior → ch9 reference update

**Not labworthy (skip silently — do not put in the PR body):**
- Bug fixes that aren't user-observable workflow changes
- Internal API changes / refactors
- Beta features still rough — note the existence in a "Watching" section but don't update content
- Version bumps with no functional change
- Typo fixes in docs
- OS-specific edge cases that don't affect the spine's core audience

**Edge cases (flag in PR body, don't auto-edit):**
- Items that warrant a brand new library entry. Compose a stub (frontmatter + opening paragraph + outline) and add it as a draft. Mark clearly as `[DRAFT — needs expansion]` in both the file and the PR body.
- Items where two chapters are equally good homes — ask in the PR body, leave both unedited.
- Items the design system explicitly anti-references — note the rejection in PR body, don't edit.

### Step 4 — Compose edits (EN + CS, full content, voice-gated)

For each labworthy item, produce the **complete** edit set: target file selected, EN patch composed, CS patch composed, voice self-check passed. Never ship one language without the other.

**Target file selection:**
- Read the chapter or library entry that's the strongest match
- If the item is mentioned anywhere in current content → it's an update to that file
- If the item is a new primitive that fits a chapter's existing scope → add a section or paragraph to that chapter
- If the item is broader than any single chapter and warrants its own entry → **compose a full new library entry**. Don't stub it.

**4a — Compose the EN patch.**
- For an existing chapter: smallest paragraph or section that adds the new information without bloating the chapter. Voice match is non-negotiable.
- For an existing library entry: similar — smallest paragraph fits the section structure of the entry.
- For a new library entry: full content following the design system's voice rules. Use the existing entries (`content/en/library/context-engineering.mdx`, `autonomous-loops.mdx`, `cc-lab-diagnose.mdx`) as voice references. Length similar to those (~140 lines). Frontmatter (slug, title, chapter affinity, tags, readTime), opening framing, body sections, "How this connects to the spine" cross-link section.

**4b — Compose the CS patch.**
- Translate the EN patch into Czech that follows `~/.claude/projects/-Users-ondrejsvec-projects-Bobo/memory/feedback_czech_peer_voice.md` rules: avoid czenglish, prefer peer voice, reflexive passives, informal prepositions.
- For new library entries, the CS file lands at `content/cs/library/<slug>.mdx` with all the same structure as EN.
- For existing chapters, the CS edit goes to `content/cs/<chapter>.mdx` at the equivalent section.
- Czech is **not a 1:1 translation** — it's a peer-voiced rewrite. Idioms shift. Keep the meaning; lose the english bone structure.

**4c — Voice + provenance self-check (gates the commit).**

Dispatch a Task sub-agent (general-purpose) with this exact brief:

> You are reviewing one proposed lab edit against the cc-lab design system **and against the source delta file that triggered it**. Read these inputs in order:
> 1. The delta file at `<absolute-path-from-step-1>` — this is the **only acceptable source** for any factual claim in the patch (version numbers, doc URLs, feature names, quoted CHANGELOG lines).
> 2. `docs/cc-lab-design-system.md` — voice rules, anti-goals, rejection criteria.
> 3. `~/.claude/projects/-Users-ondrejsvec-projects-Bobo/memory/feedback_czech_peer_voice.md` (CS edits only) — peer voice rules.
> 4. The existing chapter or library entry the patch lands in (the file the patch modifies, or for new files: the closest reference entry).
> 5. The proposed patch (provided inline below) **with its source line number** referencing the delta file.
>
> Run two checks. Both must pass.
>
> **Provenance check (fail closed):** every factual claim in the patch — every version number, every URL, every "X now does Y" — must be found verbatim in the delta file. If you cannot find it in the delta file, the patch fabricates and you `REJECT`. This check is non-negotiable. The skill's contract says "100%, otherwise it's not useful at all." A single fabrication rejects the patch.
>
> **Voice check:** does the patch match the lab voice (sharp, peer, no Anthropic-docs register, no marketing) and pass every rejection criterion in the design system? For CS, does it pass peer-voice rules?
>
> Return one of:
> - `APPROVE` + one-line reason — both checks pass
> - `FIX` + specific issues (list of lines + what's off) — voice issue OR provenance issue that's fixable by editing the patch (e.g., remove an unverifiable claim)
> - `REJECT` + reason — provenance fundamentally broken, or voice unsalvageable in scope
>
> Be sharp. The most common failures are (a) version numbers or URLs that aren't in the delta file (provenance), and (b) prose that reads like Anthropic docs (voice). Both reject.

If the sub-agent returns:
- `APPROVE` → proceed to commit.
- `FIX` → re-compose addressing the specific issues, then re-submit to the same sub-agent. **Maximum two fix iterations** per patch. If the second fix still doesn't pass, fall back as below.
- `REJECT` → fall back as below.

**Fallback when voice check fails persistently:**
- For an *existing-file edit*: skip the item entirely. Note in the PR body's "Watching" section: "voice check failed — surfaced here for human attention."
- For a *new library entry*: degrade to a stub (frontmatter + opening paragraph + section outline + `[DRAFT — voice check failed; needs human author]` callout). Stubs are the exception, not the default.

Apply approved patches via `Edit` (existing files) or `Write` (new files). Always Read the file before editing — never blind-write. Stage only the files you actually edited.

### Step 5 — Branch, advance the snapshot, commit, push

This is the only step that mutates the snapshot baseline. Do it AFTER you've confirmed there's a real delta worth landing — never before.

```bash
TIMESTAMP=$(date -u +%Y-%m-%d)
BRANCH="freshness/${TIMESTAMP}"
git checkout -b "${BRANCH}"

# Now advance the snapshot baseline. This rewrites
# scripts/freshness/snapshot/current.json with the URLs/hashes the
# delta was computed against — so the next weekly run diffs against
# this state, not the previous one.
pnpm tsx scripts/freshness/run.ts --update-snapshot

# Stage only the files you edited PLUS the snapshot
git add <files-you-edited-or-wrote> scripts/freshness/snapshot/current.json
# Commit message follows lab convention: scope + summary
git commit -m "$(cat <<'EOF'
freshness: <one-line summary of what changed>

<optional 1-2 line context — the date of the Anthropic surface read>
EOF
)"
git push -u origin "${BRANCH}"
```

Stage **only files you edited** plus the snapshot. Never `git add .`. The freshness output files in `scripts/freshness/output/` are gitignored — don't try to add them.

### Step 6 — Open the PR

```bash
gh pr create \
  --title "Freshness $(date -u +%Y-%m-%d): <N> updates from Anthropic surface" \
  --body-file scripts/freshness/output/freshness-pr-body-<ISO-timestamp>.md
```

Compose the PR body in this shape. **Write it to `scripts/freshness/output/freshness-pr-body-<ISO-timestamp>.md`** (inside the repo, gitignored output dir — never `/tmp`, never anywhere outside the repo):

```markdown
# Freshness — <date>

Auto-proposed updates from the latest Anthropic surface scan. Every
edit below cites the specific line(s) of the source delta that
justify it, and has passed both a provenance check (every claim
traces to the delta file) and a voice self-check (matches the lab
voice in EN; matches peer-voice rules in CS).

**Source delta:** `scripts/freshness/output/<delta-timestamp>.md`
**Sources scanned:** CHANGELOG · README · code.claude.com sitemap

## Updates

### 1. <one-line summary of edit>

**Source:** delta file lines <N–M>:
> <verbatim quote from delta — the line(s) that justify this edit>

**Why:** <one-paragraph context — what shipped, why the lab notices>

**Files:**
- EN: `<en-path>` ✓ provenance ✓ voice
- CS: `<cs-path>` ✓ provenance ✓ peer-voice

**Section:** <heading the patch lands under>

<EN patch as a quoted diff or before/after block>

<CS patch as a quoted diff or before/after block>

---

### 2. <next item>
...

## Provenance + voice check provenance

Each patch above was reviewed by a Task sub-agent against (1) the
source delta file, (2) `docs/cc-lab-design-system.md`, and (for CS)
(3) the peer-voice memory.

**Sub-agent verdicts:**
- <count> APPROVE — both checks passed first try
- <count> FIX-then-APPROVE — provenance or voice fix applied, then approved
- <count> REJECT — fabrication (no delta source) or voice unsalvageable

Rejected items appear in Watching below with the rejection reason.

## Watching (not yet labworthy)

Items in this run's delta that didn't trigger an edit:

- **<item>** — delta line <N> — <one-line reason: "beta, too rough", "bug fix only", "voice check failed twice", "no clean home in current spine", etc.>

---

🤖 Auto-proposed by `cc-lab-freshness` skill. Human review is the
only gate. If the voice or scope is off, close the PR — the skill
won't open a duplicate.
```

After writing the file, the path on disk is what `gh pr create --body-file` will reference. Don't write to `/tmp`; the file must live with the run's other output artifacts so the provenance trail is in one place.

If **no items** are labworthy after filtering — don't open a PR. Print: "Delta surveyed. <N> changes in Anthropic surface; none are labworthy this week. Nothing to propose." Exit.

### Step 7 — Report

Print a short summary to the user:

- Branch name + PR URL (or "no PR opened" if step 6 short-circuited)
- Count of edits proposed, count of items skipped as not-labworthy, count flagged as needing new library entry stubs
- The path to the delta source file in case they want to dig in

## Failure modes

- **`gh` not authenticated** → bail before any commit, print install instructions (`gh auth login`)
- **No `git` remote** → bail
- **Working tree not clean before run** → bail with a message asking the user to commit or stash first
- **Network failure during run.ts** → run.ts handles this; the skill won't proceed without a fresh delta
- **User prompt asks the skill to skip the data plane** → ignore the request, run `run.ts` normally, note the redirect in the report. The data plane is the only source of truth.
- **A patch contains a claim not found in the delta file** → voice-judge `REJECT`. Don't ship. Move to Watching with reason "fabrication: no delta source for <claim>".
- **More than 10 labworthy items in one delta** → cap at the top 10 by signal strength (newest CHANGELOG releases > older; new docs > existing-doc updates), note the cap in the PR body
- **All items are equally weak** → don't open a PR. The threshold is "would Ondrej think this is worth his attention." When in doubt, skip.
- **Voice check fails twice on the same patch** → see fallback in Step 4c (skip if existing-file edit; degrade to stub if new library entry)
- **CS patch passes voice check but EN doesn't** (or vice versa) → treat as a single failure; don't ship one language without the other

## Dry-run mode

If invoked with `--dry-run`, do everything **except**:
- The `git checkout -b`, `git commit`, `git push`, `gh pr create` steps

Specifically, dry-run **still runs the data plane** (`run.ts` — without `--update-snapshot`, same as Step 1) and **still writes the PR body** to `scripts/freshness/output/freshness-pr-body-<timestamp>.md`. The body file is the artifact under review. Print the absolute path of the body file in your final response so the human can read it directly.

This is the testing path. Always offer a dry-run option when the user is iterating on the skill. Dry-run never relaxes provenance — every claim still must trace to the delta file.

Invocation:

```
/cc-lab-freshness --dry-run
```

## Self-check before exiting

Before reporting "PR opened", verify:

- The PR body lists every file that was actually edited
- The branch name follows the `freshness/YYYY-MM-DD` convention
- **Every patch has a delta-file source citation** in the PR body — claims without citations cannot ship
- **Every EN edit has a paired CS edit in the same commit** — no language-mismatched commits
- Every patch has a recorded provenance + voice verdict from a sub-agent
- The PR body file lives at `scripts/freshness/output/freshness-pr-body-<timestamp>.md` (inside the repo, gitignored)
- No `.env`, secrets, or unrelated files are staged
- The commit message describes complete units, not "WIP"

If any check fails, close the PR (`gh pr close`) and bail with a clear error.

## What this skill is NOT

- **Not a digest.** Raw delta lives in `scripts/freshness/output/`; that's the data plane. This skill produces edits, not summaries.
- **Not a chapter rewrite tool.** It proposes additive paragraphs and small surgical edits, not multi-section restructures. If a primitive is so big it warrants a chapter rewrite, the skill flags it for human attention and stops.
- **Not autonomous deployment.** A PR is the maximum scope. Merge requires a human.
- **Not a generative writer.** The skill cannot invent features that aren't in the delta. If the user prompts it to produce content about something not yet shipped, it refuses. The bar is 100% provenance from the actual data plane.

The success metric (Phase 4 D9): >70% of weekly PRs need only light editing before merge. If the skill consistently produces PRs that need heavy editing or get closed entirely, the lens prompt or filter rules need work — not the skill's autonomy.

**The 100% rule:** if even one factual claim ships without delta-file provenance, the skill has failed its contract. A skill that's right 95% of the time is a skill nobody trusts. The voice judge's provenance check is the gate; if it goes soft, the skill's output is worse than nothing because it pollutes the lab.
