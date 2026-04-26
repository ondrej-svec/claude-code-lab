# Example 02 — Mode separation (regression anchor for v0.2.0)

Calibration anchor for v0.2's mode-aware diagnostic. Captures what
project-mode and user-mode outputs should look like on the same
underlying setup, and why mixing them is a bug.

## Setup

Same as example-01 but with v0.2:
- Repo: `quellis` (Bun + Turbo, Expo + Next.js)
- User scope: `heart-of-gold-toolkit` plugins installed user-wide
  (provides `/compound`, `/work`, `/review`, `/plan`)
- User CLAUDE.md (`~/.claude/CLAUDE.md`) contains a section about
  Quellis development commands (project leak — should live in
  `~/projects/quellis/CLAUDE.md`)
- No `~/projects/quellis/CLAUDE.md`
- `.claude/settings.local.json` exists at quellis root, gitignored
  correctly

## Expected v0.2 behavior

### `/cc-lab-diagnose project` (or default)

Outputs a project-mode diagnosis. Strongest observations:

1. **Quellis has no project-local CLAUDE.md** — high confidence,
   quotes the missing file + the user-scope leak that hosts the
   project facts. Try-this artifact: scaffold for the new project
   CLAUDE.md.
2. **Project depends on user-scope plugins (`/compound`, `/work`)
   without declaring them** — A7 (plugin declarations). Quotes the
   project-scope plugin entry from `installed_plugins.json` and the
   absence of `enabledPlugins` / `extraKnownMarketplaces` in
   `.claude/settings.json`. Try-this: settings.json patch.
3. (Possibly) **MCP-related observation** if quellis declares
   project-required MCPs at user scope.

The v0.1 false positive ("create a new-todo-from-review skill") is
suppressed by the scope cascade — `marvin:work` is in the inventory.

### `/cc-lab-diagnose user`

Outputs a user-mode diagnosis. Strongest observation:

1. **Project-specific rules in your user CLAUDE.md** — high
   confidence, quotes the Quellis-specific lines from
   `~/.claude/CLAUDE.md`, names the project they leak from. Try-this:
   `cat > ~/projects/quellis/CLAUDE.md` script that moves the rules
   to where they belong, then notes "trim ~/.claude/CLAUDE.md."

This is *the same finding from a different angle* as project
observation 1, but the framing is correct for user mode: "you have
project facts in user scope" is a user-scope problem, not a project
gap.

### `/cc-lab-diagnose both`

Two sections. Project pass surfaces "no project CLAUDE.md" + plugin
declaration gap. User pass surfaces "project facts leaking into user
CLAUDE.md." Both observations co-exist because they're the same
problem named correctly from each scope's perspective. The both-mode
closing names that they're the two halves of one fix.

## What v0.2 must NOT produce

- Project-mode advice in a user-mode run, or vice versa
- "Add to your team CLAUDE.md: 'use peer-builder voice'" (personal
  preference recommended for project — anti-pattern)
- "Add to your user CLAUDE.md: 'in Quellis, use `bun --filter ...`'"
  (project facts recommended for user scope — opposite anti-pattern)
- The v0.1 false positive about creating a `new-todo-from-review`
  skill (suppressed by scope cascade)
- Any observation that recommends creating a custom skill that
  duplicates a built-in (no `/clear-context`, no `/review-pr` if
  built-in `/review` covers it)

## How the project-vs-personal boundary maps onto fixes

| If the gap is... | Surfaces in mode | Fix lives in |
|---|---|---|
| Project depends on a user-scope plugin without declaring | project | project `.claude/settings.json` (`extraKnownMarketplaces` + `enabledPlugins`) |
| Project facts in user CLAUDE.md | user | move to project's `CLAUDE.md`; trim user CLAUDE.md |
| Personal voice/style in committed CLAUDE.md | project | move to user `~/.claude/CLAUDE.md`; remove from project |
| Project-specific MCP at user scope | user (cross-scope leak) | move to project's `.mcp.json` |
| Personal hotkey command at project scope | project (cross-scope leak) | move to `~/.claude/commands/` |
| `.claude/settings.local.json` committed | project (hygiene) | git rm + .gitignore |
| Hardcoded secret in `.mcp.json` | project (security, top severity) | rotate the key, switch to `${VAR}` |

The diagnostic emits the observation in the mode whose lens makes the
fix obvious. A reader running both modes sees the same underlying
fact named in two voices, but the fix instruction matches the scope
they're inspecting.

## Self-test bar v0.2 must clear

Re-running `/cc-lab-diagnose project` against `quellis`:
- Zero observations recommend creating skills/commands the user
  already has via plugin or built-in
- Zero observations recommend committing personal preferences to the
  team repo
- At least 2 of 5 observations are actionable in the same session
- The "no project CLAUDE.md" finding includes a runnable scaffold,
  not just "consider adding one"

Re-running `/cc-lab-diagnose user`:
- Zero observations recommend creating user-scope artifacts that
  duplicate plugin functionality
- Zero observations propose adding project-specific facts to user
  CLAUDE.md
- The project-leak observation is named in user-mode framing (not
  "your repo is missing X")

If a future rubric edit makes either run produce v0.1's behavior, the
edit broke the mode boundary and needs revision.

## How to update this example

When a future run produces meaningfully different output that's
*correct*, update this file with the new output as the new regression
anchor. Don't delete the v0 / v0.1 cautionary tales in the other
example files — they're the history.

PII status: `quellis` is a public-facing project name in Ondrej's
portfolio per `project_quellis.md`. No client names, no real account
names, no emails. Safe to commit as-is.
