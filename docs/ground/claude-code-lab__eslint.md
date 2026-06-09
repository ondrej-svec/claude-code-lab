---
last_grounded: 2026-06-09T00:00:00Z
fingerprint: claude-code-lab__eslint
repo: claude-code-lab
sources_consulted:
  - local:eslint.config.mjs
  - local:.github/dependabot.yml
  - local:package.json
  - "npm:registry.npmjs.org/eslint dist-tags + time"
  - "npm:registry.npmjs.org/eslint-plugin-react latest + time"
  - "npm:registry.npmjs.org/eslint-config-next latest + 16.2.7"
  - "gh:jsx-eslint/eslint-plugin-react#3979"
  - "gh:jsx-eslint/eslint-plugin-react#3972"
  - "gh:vercel/next.js#89764"
  - "gh:vercel/next.js#91702"
  - "gh:vercel/next.js#91710"
  - https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
  - https://eslint.org/docs/latest/use/migrate-to-10.0.0
  - https://eslint.org/blog/2026/02/eslint-v10.0.0-released/
confidence: high
---

## Repo State
- Next.js 16.2.7 (App Router, Turbopack); flat `eslint.config.mjs` composes `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`; `samples/**` ignored. (local:eslint.config.mjs)
- `eslint: ^9` pinned; installed 9.39.4. `eslint-config-next: 16.2.7`. (local:package.json)
- `.github/dependabot.yml` ignores `eslint` semver-major (added 2026-06-09, PR #57). The lift-signal question is what retires that rule. (local)

## ESLint 10 itself
- 10.0.0 GA 2026-02-06; latest 10.4.1 (2026-05-29). `next` dist-tag = 10.0.0-rc.2; `maintenance` = 9.39.4. (npm:eslint time/dist-tags)
- Removed `context.getFilename()` → use `context.filename`; `getPhysicalFilename()` → `physicalFilename`. Also drops legacy `.eslintrc`, `getSourceCode()`, `getCwd()`. Migration guide: https://eslint.org/docs/latest/use/migrate-to-10.0.0 ; release blog: https://eslint.org/blog/2026/02/eslint-v10.0.0-released/

## The blocker (confirmed)
- `eslint-config-next@16.2.7` depends on `eslint-plugin-react@^7.37.0`; peer `eslint: >=9.0.0` (no upper bound — the transitive plugin is the real cap). (npm:eslint-config-next/16.2.7)
- `eslint-plugin-react` latest = 7.37.5 (2025-04-03), unchanged in 14 months. peerDeps cap `eslint: ...^9.7`. `next` dist-tag is stale `7.8.0-rc.0`. No v10-compatible release published. (npm:eslint-plugin-react)
- 7.37.5's React-version auto-detection (`lib/util/version.js`) calls `context.getFilename()` → `TypeError: contextOrFilename.getFilename is not a function` on eslint 10. (issue #3977, opened 2026-02-07, OPEN, no maintainer ETA; next.js #89764, OPEN, labeled "Upstream")

## Q1 — eslint-plugin-react v10 release? Not yet.
- Fix is in-flight, not shipped. PR #3979 "Fix ESLint v10 RuleContext API removal" (follow-up to #3972) — OPEN, `CHANGES_REQUESTED`, needs rebase + test fixes; last activity 2026-05-15. Maintainer (ljharb) declined swapping to `eslint-plugin-import-x`. No published release, no committed date. https://github.com/jsx-eslint/eslint-plugin-react/pull/3979
- No npm version or dist-tag carries the fix yet (verified 2026-06-09).

## Q2 — eslint-config-next v10 support? In-flight, unmerged.
- Next.js PR #91710 "add ESLint v10 support to eslint-config-next" — OPEN, unmerged (created 2026-03-20, last touched 2026-05-26). https://github.com/vercel/next.js/pull/91710
- Tracking issue #91702 closed 2026-03-20 as duplicate of #91710. Core problem: the four bundled plugins (react, import, jsx-a11y, react-hooks) don't declare eslint 10 in peer ranges. eslint-config-next's own peer is already `>=9.0.0` (would permit 10) — it's gated on the transitive plugins. (gh:vercel/next.js#91702, #91710)
- No roadmap statement to drop the legacy react plugin found.

## Q3 — Workaround (use with caution)
- Root cause is React-version *auto-detection*. Hardcoding the version bypasses the `getFilename` call: set `settings: { react: { version: "detect" → "19.0" } }` (pin your actual React major) in the flat config. Sourced but unverified end-to-end here; risk: only fixes the react plugin's detection path — other bundled plugins / `typescript-eslint` may still hit eslint-10 API removals, and you'd be ahead of the supported peer matrix. (WebSearch 2026-06-09; community thread: https://community.vercel.com/t/next-js-error-contextorfilename-getfilename-is-not-a-function-during-pnpm-lint/36460)
- Alternative cited: pnpm `overrides`/`resolutions` to force eslint-10-aware deps (e.g. typescript-eslint 8.59+ falls back when `FlatESLint` is undefined). Brittle, unsupported combination — not recommended for CI gate.
- Recommendation: do NOT adopt a workaround for the CI lint gate. Hold eslint 9.x.

## What lifts the dependabot ignore
1. **Primary signal:** `eslint-plugin-react` publishes a release on the `latest` tag with eslint-10 peer support (PR #3979 merged + cut). Watch https://github.com/jsx-eslint/eslint-plugin-react/pull/3979 and `npm view eslint-plugin-react dist-tags`.
2. **OR** `eslint-config-next` ships a version (Next.js PR #91710 merged) whose transitive plugin set is eslint-10-clean. Watch https://github.com/vercel/next.js/pull/91710 and `eslint-config-next@latest` deps.
3. Verify by bumping eslint to ^10 in a branch and running `pnpm lint` green, then remove the `ignore` block. Both upstreams are OPEN/unmerged as of 2026-06-09 — no action yet.

## Recommended Further Reading
- https://github.com/jsx-eslint/eslint-plugin-react/pull/3979 — the gating fix; merge = green light (signal #1).
- https://github.com/vercel/next.js/pull/91710 — Next.js side; merge = green light (signal #2).
- https://eslint.org/docs/latest/use/migrate-to-10.0.0 — exact removed APIs when you do the bump.
- https://github.com/jsx-eslint/eslint-plugin-react/issues/3977 — upstream issue to subscribe to for ETA chatter.
