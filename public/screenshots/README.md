# Screenshots

Drop real captures into this directory and reference them from chapter MDX files using the Screenshot component:

```mdx
<Screenshot
  src="/screenshots/ch1-install-welcome.png"
  alt="Claude Code desktop app after first sign-in"
  caption="Welcome screen after OAuth. Click 'Open a folder' to start."
/>
```

For light/dark pairs, pass a `darkSrc`:

```mdx
<Screenshot
  src="/screenshots/ch4-plan-mode-light.png"
  darkSrc="/screenshots/ch4-plan-mode-dark.png"
  alt="Claude Code in plan mode showing Shift+Tab indicator"
  caption="Plan mode. Shift+Tab cycles to leave."
/>
```

## Conventions

- File naming: `chN-topic-variant.png` (e.g. `ch6-brainstorm-session.png`).
- Capture at 2x for retina. Images are optimized on serve by Next.js.
- Crop tight — no empty desktop chrome. Focus on the terminal or app region.
- Avoid captures with sensitive info (emails, tokens, private repo names).

## Suggested captures

Prioritized list of screenshots that would most help the guide:

1. Ch 1 `before-we-start` — Claude Code desktop app after successful sign-in
2. Ch 2 `first-task` — a diff being reviewed before accept
3. Ch 3 `teach-claude-your-project` — Claude's output from `/init` with a proposed CLAUDE.md
4. Ch 4 `iteration-and-control` — plan mode active (Shift+Tab indicator visible)
5. Ch 4 `iteration-and-control` — the rewind (Esc Esc) menu
6. Ch 5 `ecosystem` — `/agents` UI listing available subagents
7. Ch 6 `compound-engineering` — a `/brainstorm` session mid-flow
8. Ch 6 `compound-engineering` — `/plan` output saved to `docs/plans/`

