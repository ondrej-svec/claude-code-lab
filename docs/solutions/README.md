# Solutions

Grep-by-symptom archive for non-obvious fixes. The point is recovery time on the second occurrence.

## When to write one

You just fixed something that:

- took more than ~15 minutes to diagnose,
- had a misleading symptom,
- required reading two or more files to figure out,
- or you would not bet on remembering in three months.

Routine bugs do not belong here. The bar is "future-me would be glad I left a breadcrumb."

After solving such a problem, run `/marvin:compound` and let it land a file in this directory.

## File naming

`<area>-<short-symptom>.md` — lowercase, hyphenated, area first so `ls` groups by surface.

Examples:

- `freshness-empty-delta.md`
- `mdx-cs-link-mismatch.md`
- `e2e-flaky-screenshot-diff.md`

## Required sections

Every entry has these four headings, in this order:

```markdown
## Symptom
What the failure looked like — the literal error, the user-visible behaviour, or the failed assertion. Make it greppable.

## Cause
The actual reason. Not "a bug." The mechanism: which file, which assumption, which interaction.

## Fix
The change that resolved it. Cite commit SHA or file path. If the fix is more than a few lines, link the diff.

## How to detect next time
The fastest way to recognise this in the wild — error string, log signature, the one-line check that disambiguates this from look-alikes.
```

Optional `## Notes` section at the end for context that does not fit above (related issues, what you tried that did not work, who else might hit it).

## Example

```markdown
# freshness-empty-delta

## Symptom
`pnpm freshness:run` exits 0 with an empty `output/2026-04-27-delta.json` even though `current.json` clearly diverges from `previous.json`.

## Cause
`scripts/freshness/diff.ts` was filtering on `entry.kind === "release"` but the snapshot writer started emitting `kind: "release-note"` last week.

## Fix
Commit `abc1234` — widen the filter to accept both literals.

## How to detect next time
If `delta.json` is empty but `git diff scripts/freshness/snapshot/` shows real changes, grep `diff.ts` for `kind ===`.
```
