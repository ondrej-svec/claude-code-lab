---
title: "chore: act on cc-lab-diagnose project findings"
type: plan
date: 2026-04-27
status: in_progress
brainstorm: null
confidence: high
---

# chore: act on cc-lab-diagnose project findings

Apply the five evidence-grounded action items from today's `/cc-lab-diagnose project` run against this repo.

Diagnosis artifact: `cc-lab-diagnosis-claude-code-lab-2026-04-27.html` (in repo root). Tailnet share: https://ondrejs-mac-mini.tailbc79e3.ts.net/s/cc-lab-diagnosis-claude-code-lab-2026-04-27--2026-04-27--e3f1daf8/

## Problem statement

Yesterday's harness install (`marvin:harness-up` → commit `0b87e53`) shipped a comprehensive deny list and an `enabledPlugins` declaration but left five gaps that the lab's own diagnostic flagged today:

1. No `permissions.allow` block — every read-only tool prompts (permission fatigue).
2. No `extraKnownMarketplaces` — `enabledPlugins: true` does not auto-prompt teammates to install on first clone.
3. No `permissions.defaultMode` — every clone starts in ask-on-everything posture.
4. No `.gitignore` entry for `.claude/settings.local.json` — works by luck, not policy.
5. No `docs/solutions/` surface and no AGENTS.md route to it — knowledge capture for debugging is absent.

The repo ships `/cc-lab-diagnose`. A repo that ships a diagnostic should pass its own diagnostic.

## Target end state

- A teammate cloning today gets prompted to install both project plugins on first session, lands in `acceptEdits` mode, and runs `git status` / `pnpm test` without permission prompts.
- `.claude/settings.local.json` cannot drift into the repo even if a contributor's global gitignore is silent.
- `docs/solutions/` exists with a README that explains the format, and `AGENTS.md` Task Routing routes debugging work to it.
- A re-run of `/cc-lab-diagnose project` does not flag findings #1–#5.

## Scope and non-goals

**In scope:**
- `.claude/settings.json` — add `permissions.allow`, `permissions.defaultMode`, `extraKnownMarketplaces`.
- `.gitignore` — add `.claude/*.local.json`.
- `docs/solutions/README.md` — new file (template + capture rules).
- `AGENTS.md` — add one Task Routing entry for `docs/solutions/`.

**Out of scope:**
- Adding hooks to enforce "do not commit secrets" (the deny list already covers the dangerous shell commands; the verification doctrine handles the policy).
- Backfilling solution entries from old debugging sessions — let new ones land naturally.
- Touching `cc-lab-judge`'s `extraKnownMarketplaces` artifact shape in the diagnostic itself (the judge's output was structurally wrong; that's a plugin-side fix, separate plan).

## Proposed solution

One commit per logical surface, three commits total:

1. **Settings tightening** — `.claude/settings.json` gets `allow`, `defaultMode`, `extraKnownMarketplaces`.
2. **Gitignore anchor** — `.gitignore` gets `.claude/*.local.json`.
3. **Solutions surface** — `docs/solutions/README.md` + AGENTS.md routing entry.

Trunk-based: each commit lands on `main` directly, in order, after lint passes.

### Correction from the judge's diagnosis

The judge's `Try this` artifact for #2 used an array of `{name, url}` objects:
```json
"extraKnownMarketplaces": [
  { "name": "ondrej-svec/claude-code-lab", "url": "https://github.com/..." }
]
```

The actual schema (verified against `~/projects/Bobo/quellis/.claude/settings.json:59-66` and the user's own `~/.claude/settings.json`) is an **object map keyed by marketplace name**, with each value carrying a `source` sub-object:

```json
"extraKnownMarketplaces": {
  "cc-lab": {
    "source": { "source": "github", "repo": "ondrej-svec/claude-code-lab" }
  },
  "claude-plugins-official": {
    "source": { "source": "github", "repo": "anthropics/claude-plugins-official" }
  }
}
```

The marketplace **name** (the object key) must match the name in `.claude-plugin/marketplace.json` of the source repo. For `cc-lab` that's verified: `./.claude-plugin/marketplace.json` declares `"name": "cc-lab"`. For the official marketplace, the name is `claude-plugins-official` (verified against `~/.claude/plugins/known_marketplaces.json`).

## Implementation tasks

Tasks are dependency-ordered. Each `[ ]` becomes a checkbox the executor ticks as it ships.

### Phase 1 — settings.json (BLOCKED — needs human edit)

The `/marvin:work` agent attempted both Write and Edit against `.claude/settings.json` and was denied by the harness as a self-modification action. The plan authorizes the change but the harness guardrail sits above the plan. A human edit (or an explicit one-shot bypass) is required.

- [ ] **Human action**: paste the corrected JSON below into `.claude/settings.json`.
- [ ] Add `permissions.defaultMode: "acceptEdits"` inside the existing `permissions` block.
- [ ] Add `permissions.allow` block with the lab's actual workflow surface: `Read`, `Glob`, `Grep`, `Bash(git status*)`, `Bash(git log*)`, `Bash(git diff*)`, `Bash(git fetch*)`, `Bash(pnpm lint*)`, `Bash(pnpm test*)`, `Bash(pnpm test:e2e*)`, `Bash(pnpm build*)`, `Bash(pnpm dev*)`, `Bash(pnpm install*)`, `Bash(rg *)`, `Bash(find *)`, `Bash(ls *)`, `Bash(./scripts/*)`.
- [ ] Add top-level `extraKnownMarketplaces` object map with `cc-lab` and `claude-plugins-official` keys, each with a `source` sub-object pointing at the GitHub repo. Use the corrected schema from the section above, not the judge's array shape.
- [ ] Verify the JSON parses: `python3 -c 'import json; json.load(open(".claude/settings.json"))'`.
- [ ] Restart Claude Code (or `/reload-plugins`) and confirm `git status` runs without prompting.
- [ ] Commit: `chore(harness): pair allow list, set defaultMode, register marketplaces`.

### Phase 2 — gitignore — SHIPPED (commit `1bce88b`)

- [x] Append two lines after the existing `.claude/worktrees/` block in `.gitignore`.
- [x] Verify `git check-ignore .claude/settings.local.json` still returns the path.
- [x] Commit: `chore(harness): anchor .claude/*.local.json in gitignore`.

### Phase 3 — solutions surface — SHIPPED (commit `20bdb60`)

- [x] Create `docs/solutions/README.md` with purpose, file naming, required sections, and an example.
- [x] Add Task Routing entry to `AGENTS.md` between "Visuals" and "UI / site code".
- [x] Verify `wc -l AGENTS.md` ≤ 180 (now 153).
- [x] Commit: `feat(docs): add solutions surface + AGENTS.md routing entry`.

### Phase 4 — verify — DONE for shipped surfaces

- [x] `pnpm lint && pnpm test && pnpm test:e2e` green (lint clean, 16 unit tests, 6 e2e).
- [x] Push: `git push origin main` (commits `1bce88b`, `20bdb60`).
- [ ] Re-run `/cc-lab-diagnose project` after Phase 1 lands. Save the new HTML next to today's for diff.

## Acceptance criteria

| Criterion | How to verify |
|---|---|
| Allow list pairs the deny list | `jq '.permissions.allow \| length' .claude/settings.json` returns ≥ 13 |
| `defaultMode` set | `jq -r '.permissions.defaultMode' .claude/settings.json` returns `acceptEdits` |
| Marketplaces registered with correct shape | `jq '.extraKnownMarketplaces' .claude/settings.json` returns an object with `cc-lab` and `claude-plugins-official` keys, each with a `source` sub-object |
| `.gitignore` anchors local settings | `grep -c '\.claude/\*\.local\.json' .gitignore` returns 1 |
| Solutions surface exists and is routed | `ls docs/solutions/README.md` exists; `grep -c 'docs/solutions/README.md' AGENTS.md` returns ≥ 1 |
| AGENTS.md still under 180 lines | `wc -l < AGENTS.md` returns ≤ 180 |
| Lab still builds and tests pass | `pnpm lint && pnpm test && pnpm test:e2e` exit 0 |
| Diagnostic re-run is clean | `/cc-lab-diagnose project` produces no observation matching the five original findings |

## Assumptions

| Assumption | Status | Evidence |
|---|---|---|
| `extraKnownMarketplaces` schema is `{<name>: {source: {source, repo}}}` | Verified | `~/projects/Bobo/quellis/.claude/settings.json:59-66`, user's own `~/.claude/settings.json` |
| `defaultMode` belongs inside `permissions` | Verified | Same files, line 3 in quellis |
| Marketplace name `cc-lab` matches the marketplace.json `name` field | Verified | `./.claude-plugin/marketplace.json` line 2 |
| Marketplace name `claude-plugins-official` is correct | Verified | `~/.claude/plugins/known_marketplaces.json` |
| `acceptEdits` is the right default for this repo | Verified | All edits land via PR or trunk-based commit; CI (`pnpm lint && test && test:e2e`) is the safety net |
| The lab's existing tests will still pass | Unverified — Phase 4 task | Config-only changes, but lint runs on settings format, e2e is unrelated |
| Adding a Task Routing entry won't push AGENTS.md over 180 lines | Verified by math | Current 148 lines + ~5-line block = 153 lines |

## Risk analysis

| Risk | Mitigation |
|---|---|
| Wrong marketplace name → install prompt fails on first clone | Schema verified against two reference repos; smoke-test by deleting both plugins from user scope and re-running Claude Code in this dir |
| `acceptEdits` surprises a contributor who expected ask-on-everything | Document the choice in the AGENTS.md Maintenance Triggers block; first-session prompt still surfaces because of `enabledPlugins` flow |
| Allow list too narrow → still prompts | Keep it tight to start; widen reactively when a real prompt fires that wasn't covered |
| Allow list too wide → silent damage on a covered surface | Deny list is the floor; allow list only covers safe verbs (`status`, `log`, `diff`, `lint`, `test`, `build`, `dev`, `install`) and read tools |
| `extraKnownMarketplaces` change requires Claude Code restart | Phase 1 task list includes the restart step |
| Solutions README sits empty for weeks | Acceptable — the surface is plumbing; entries land when they land. The freshness skill already proves this pattern works for an adjacent capture loop |

## References

- Diagnosis source: `cc-lab-diagnosis-claude-code-lab-2026-04-27.html` (repo root)
- Diagnosis tailnet share: https://ondrejs-mac-mini.tailbc79e3.ts.net/s/cc-lab-diagnosis-claude-code-lab-2026-04-27--2026-04-27--e3f1daf8/
- Yesterday's harness install: commit `0b87e53` — `chore(harness): install AGENTS.md doctrine + project plugin scope`
- The 12 PASS/FAIL rubric: [`docs/agents-md-standard.md`](../agents-md-standard.md)
- Schema reference for settings.json: `~/projects/Bobo/quellis/.claude/settings.json`, `~/.claude/settings.json`
