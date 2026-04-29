# Agent UI Testing

Claude Code Lab is a Next.js site you regularly verify visually in two locales (EN / CS) across light and dark themes. This doc defines the layered workflow for that verification — written for the coding-agent era.

Default stack:

1. agent-driven exploratory inspection in the local dev server
2. Playwright regression for the critical flows you do not want to break
3. human review before treating the change as complete

This is the repo's safe-by-default recommendation. Unrestricted browser autonomy in your normal authenticated browser is not the default workflow.

## 1. Repeatable browser regression — Playwright

Use Playwright when you need a stable check that a previously working flow still works.

Best use cases:

- the lab-index chapter list and chapter count
- the library index and individual library entries
- locale switching (EN ↔ CS)
- theme switching (Rosé Pine Dawn ↔ Moon)
- any flow you do not want to regress silently

In this repo:

```bash
pnpm test:e2e
```

Tests live in [`e2e/`](../e2e/). When fixing a UI bug, prefer the smallest useful failing Playwright test before the fix, then keep it as the regression boundary.

These tests answer: **did we break something that used to work?**

## 2. Agent-driven exploratory inspection — chrome-devtools-mcp

For fast feedback while building. Required plugin:

```text
/plugin marketplace add anthropics/claude-plugins-official
/plugin install chrome-devtools-mcp@claude-plugins-official
```

The repo's `.claude/settings.json` permits the relevant tool surface on install.

Workflow:

1. Start the dev server: `pnpm dev`.
2. Open a fresh page via the chrome-devtools MCP tools (`new_page`, `navigate_page`).
3. Walk through the change — chapter or library page renders in EN and CS, theme toggle, mermaid diagrams, terminal stills and casts, internal links.
4. Use `take_screenshot`, `list_console_messages`, and `list_network_requests` to confirm there are no surprises.
5. Capture a representative screenshot under `docs/reviews/` named `<context>-<date>-<locale>-<viewport>.png` if the change is non-trivial.

Best use cases:

- visual inspection of a new MDX primitive
- interaction sanity checks before committing
- catching console errors and 404s on linked assets
- confirming both locales render identically

These checks answer: **what looks broken or suspicious right now?**

## Safe-by-default boundary

Do not treat unrestricted browser autonomy in a normal authenticated browser as the default. Prefer:

- the local dev server in an isolated profile
- explicit human review before merging
- executable Playwright regression for the flows that matter
- screenshot evidence in `docs/reviews/` for visual changes

## Rule of thumb

- exploratory agent inspection is great for discovery
- Playwright is great for regression protection
- console and network inspection catch a different class of issues
- human review is the final trust boundary
- unrestricted computer use is an advanced capability, not the default recommendation

## Related

- [`AGENTS.md`](../AGENTS.md) — Verification Boundary section names this workflow as the trust boundary for UI changes.
- [`docs/cc-lab-design-system.md`](cc-lab-design-system.md) — visual rules and the hybrid visual strategy that any UI change must respect.
- `docs/reviews/` — capture log for visual diffs and copy-edit review notes.
