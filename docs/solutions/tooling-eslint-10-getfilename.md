# tooling-eslint-10-getfilename

## Symptom
`pnpm lint` crashes immediately after `eslint` is bumped 9 → 10:

```
ESLint: 10.4.1
TypeError: Error while loading rule 'react/display-name': contextOrFilename.getFilename is not a function
    at resolveBasedir (.../node_modules/.pnpm/eslint-plugin-react@7.37.5_.../lib/util/version.js)
```

In CI the `quality` job fails at the Lint step in ~20s and `e2e` then skips. Build and unit tests are unaffected — it is lint-only. Manifests as a red ✗ on any dependabot PR that bundles the `eslint` major (e.g. the dev-dependencies group).

## Cause
ESLint 10 (GA 2026-02-06) removed the long-deprecated `context.getFilename()` (replaced by `context.filename`). The flat config (`eslint.config.mjs`) composes `eslint-config-next/core-web-vitals` + `/typescript`, which pull `eslint-plugin-react@^7.37.0` **transitively**. That plugin is stuck at `7.37.5` (unchanged since 2025-04-03), is peer-capped at `eslint ^9.7`, and its React-version auto-detection still calls `getFilename()`. So eslint 10 loads the plugin, the removed API is hit, and lint throws before checking a single file.

`eslint-config-next@16.2.7`'s own eslint peer is already `>=9.0.0` — Next is **not** the blocker; the transitive `eslint-plugin-react` is the real cap.

## Fix
Hold `eslint` at `^9` (installed 9.39.4). `.github/dependabot.yml` carries an `ignore` rule for eslint semver-major so the dev-dependencies group stops re-proposing the unmergeable bump every Monday (added in PR #57, 2026-06-09). The rest of that group shipped fine separately via #56 — TypeScript 6, @types/node 25, @playwright/test 1.60 (with the CI image bumped to `v1.60.0-noble` in lockstep), vitest/coverage 4.1.8, happy-dom, tsx, @tailwindcss/postcss.

To lift the block when upstream catches up:
1. Watch for **either** `eslint-plugin-react` shipping a `latest`-tagged release with eslint-10 peers (PR [jsx-eslint/eslint-plugin-react#3979](https://github.com/jsx-eslint/eslint-plugin-react/pull/3979); check `npm view eslint-plugin-react dist-tags`) **or** `eslint-config-next` shipping eslint-10 support (PR [vercel/next.js#91710](https://github.com/vercel/next.js/pull/91710)). Both OPEN/unmerged as of 2026-06-09.
2. Branch-bump `eslint` to `^10`, run `pnpm lint` — must be green.
3. Remove the `ignore` block from `.github/dependabot.yml`.

## How to detect next time
`getFilename is not a function` (or any `context.<removed-api> is not a function`) during lint = an ESLint plugin calling an API that the installed ESLint major deleted — almost always because eslint was bumped ahead of a transitive plugin's peer support. The one-line check before any eslint major bump: compare `npm view <plugin> peerDependencies.eslint` against the target eslint major for each bundled plugin (`eslint-plugin-react`, `-import`, `-jsx-a11y`, `-react-hooks`).

## Notes
- **Unverified workaround — do NOT use for the CI gate:** pin `settings.react.version` to a literal (e.g. `"19.0"`) instead of `"detect"` in the eslint config to bypass the auto-detection path. Only fixes the react plugin; other bundled plugins may still hit eslint-10 removals, and it puts you ahead of the supported peer matrix. Source: https://community.vercel.com/t/next-js-error-contextorfilename-getfilename-is-not-a-function-during-pnpm-lint/36460
- ESLint 10 migration guide (the removed APIs): https://eslint.org/docs/latest/use/migrate-to-10.0.0
- Full grounded briefing with all sources: `docs/ground/claude-code-lab__eslint.md`
