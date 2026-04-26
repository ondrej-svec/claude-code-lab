# cc-lab freshness skill

A weekly watcher that detects when Anthropic's surface (CHANGELOG,
docs) has shifted, so the lab can absorb new primitives without
relying on Ondrej remembering to check.

This is **v0** — raw delta. The output lists what changed, in a
format that's readable but not lab-shaped. v1 (planned) ingests the
[design system](../../docs/cc-lab-design-system.md) and produces
copy proposals that match the lab's voice.

## What it watches

Configured in [`sources.json`](./sources.json):

- `anthropics/claude-code` CHANGELOG (raw)
- `anthropics/claude-code` README (raw)
- `docs.claude.com` sitemap (filtered to `/en/docs/claude-code`)

That's it. No engineering blog, no Substacks, no broader watch — the
brainstorm's anti-goal is *"changelog wrapper that lags every release
by 6 weeks"* and adding sources before lens-awareness is proven
multiplies noise. v1 may reconsider.

## Manual run

From the lab repo root:

```bash
# Compute delta against the committed snapshot, write output, no commit.
pnpm tsx scripts/freshness/run.ts

# Same, but also overwrite snapshot/current.json so future runs
# diff against this state.
pnpm tsx scripts/freshness/run.ts --update-snapshot

# Same, plus open a GitHub issue with the delta as the body.
pnpm tsx scripts/freshness/run.ts --update-snapshot --open-issue
```

Output lands in `scripts/freshness/output/<timestamp>.md`. The
`output/` directory is gitignored — individual run artifacts are
ephemeral; only `snapshot/current.json` is committed.

## First run / baseline

If `snapshot/current.json` doesn't exist, the first run produces a
"baseline snapshot" report (every URL listed as "new") and writes
the snapshot. Commit the snapshot:

```bash
pnpm tsx scripts/freshness/run.ts --update-snapshot
git add scripts/freshness/snapshot/current.json
git commit -m "chore(freshness): baseline snapshot YYYY-MM-DD"
```

Subsequent runs produce a delta against this baseline.

## Mac mini scheduled run

The launchctl plist [`com.cclab.freshness.plist`](./com.cclab.freshness.plist)
runs `run.ts` weekly (Sunday 18:00 local).

```bash
# One-time install on the Mac mini
cp scripts/freshness/com.cclab.freshness.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.cclab.freshness.plist

# Verify
launchctl list | grep com.cclab.freshness

# Logs
tail -f /tmp/cclab-freshness.out.log
tail -f /tmp/cclab-freshness.err.log

# Uninstall
launchctl unload ~/Library/LaunchAgents/com.cclab.freshness.plist
rm ~/Library/LaunchAgents/com.cclab.freshness.plist
```

The scheduled job runs `run.ts --update-snapshot` (no `--open-issue`).
Ondrej reviews the output file before opening any issue. Auto-merge
is explicitly out of scope per the Subjective Contract.

## Output shape (v0)

```markdown
# Freshness — 2026-04-26

_Fetched at 2026-04-26T18:00:01.234Z._

**Summary:** 1 changed · 0 new · 0 removed

## What changed

### Claude Code CHANGELOG — changed

Source: https://raw.githubusercontent.com/...

**Added:**
- ## 1.4.0
- ### New
- ### Fixed

**Body diff:**

```diff
+ ## 1.4.0
+ - New: voice mode improvements
+ - Fixed: typecheck regression in foo
```
```

For sitemap sources the report lists URL paths added or removed; no
body diff (the sitemap itself isn't human-readable).

## Anthropic Routines as fallback

If Mac mini reliability fails (laptop closed too often, network
flakes, missed scheduled runs), the freshness watch can move to an
[Anthropic Routine](https://docs.claude.com/en/docs/claude-code/routines)
calling the `/cc-lab-freshness` skill. The routine setup is not
provisioned today; revisit at the Phase 4 D6 review if needed.

## v1 plan (not yet built)

When v0 has shipped enough deltas for Ondrej to gauge editing cost,
v1 reasoning lands as a `SKILL.md` at `.claude/skills/cc-lab-freshness/`
that:

- Reads `docs/cc-lab-design-system.md` as system prompt
- Reads `output/<latest>.md` produced by `run.ts`
- Reads the relevant chapters that the delta touches
- Proposes lab-shaped copy patches against specific files
- Stops short of any commit — Ondrej's review is the gate

The Phase 4 D9 exit gate measures: ≥70% of weekly v1 issues need
only light editing. v0 has no such gate; it just needs to detect
changes accurately.
