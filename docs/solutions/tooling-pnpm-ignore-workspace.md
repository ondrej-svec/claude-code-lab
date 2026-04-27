---
date: 2026-04-27
area: tooling
symptom: pnpm install completes in milliseconds with no error, but local node_modules is empty
---

# pnpm install silently no-ops inside a child of a non-workspace repo

## Symptom

You run `pnpm install` from `samples/python-react/frontend/`. pnpm reports `Done in 299ms`. No errors. But `pnpm build` then fails with `Could not resolve 'vite'`, and `samples/python-react/frontend/node_modules/` doesn't exist.

The root of the cc-lab repo has a `pnpm-workspace.yaml` (used to define `ignoredBuiltDependencies` for unrelated reasons). Even though it does NOT list `samples/**` in any `packages:` array, pnpm walks up to it, treats it as the workspace root, and silently refuses to install the child package's deps.

## Fix

```bash
pnpm install --ignore-workspace
```

or equivalently use `npm install`, which doesn't have the workspace-walking behavior.

For the cc-lab samples this is documented in each sample's README. Anyone copying the sample to its own directory outside the cc-lab repo doesn't need the flag.

## Why this happens

pnpm's standard behavior: walk up to find the nearest `pnpm-workspace.yaml`. If found, treat that as the workspace root. Child `package.json` files outside the declared `packages:` glob are not installed and not warned about. The `Done in 299ms` message is misleading — it counts the no-op as success.

## What to look for

- A child directory with a `package.json` and no `node_modules`
- A `pnpm-workspace.yaml` somewhere in a parent directory
- `pnpm install` reporting suspiciously fast completion with no installed-package output

## Related

- The cc-lab `eslint.config.mjs` excludes `samples/**` for the same architectural reason — the samples are standalone, isolated from the cc-lab Next.js app per `AGENTS.md` "trust boundaries".
