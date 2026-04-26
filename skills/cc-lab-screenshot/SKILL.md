---
name: cc-lab-screenshot
description: Capture desktop and mobile screenshots for cc-lab chapters with consistent state (dark mode, 2× retina, no PII, no notifications) using the computer-use MCP. Activate when the user asks to "take a screenshot for the lab", "capture for cc-lab", "shoot the voice chapter visuals", or hands you a shot list JSON/YAML.
allowed-tools: Read, Write, Bash, mcp__computer-use__*, mcp__claude-in-chrome__*
---

# cc-lab-screenshot

Captures desktop and mobile screenshots for cc-lab chapters at the lab's
v3 visual standard. The skill enforces consistent state across every shot
so visuals never need manual re-takes for cosmetic drift.

## When to activate

- User says "take screenshots for the lab", "capture cc-lab visuals",
  "shoot the {chapter} visuals", "screenshot the diagnostic flow"
- User hands you a shot list (JSON or YAML matching `shot-list-schema.md`)
- An MDX chapter file references a `<Screenshot src="/screenshots/...">`
  target that doesn't yet exist on disk

If none of these match, do not activate.

## How to take a single screenshot

For each shot in the list:

1. **Read the convention rules** from `conventions.md` (this file's sibling).
   Fail loudly if any convention can't be enforced (e.g., notifications
   visible and can't be hidden) — never silently ship a shot that violates
   them.

2. **Bring the target app forward** with `mcp__computer-use__open_application`
   (and `request_access` first if not yet granted).

3. **Set state**: dark mode, 2× retina, hidden notifications, no PII,
   correct window size. The full checklist is in `conventions.md` §State.

4. **Navigate to the target UI** per the shot's `steps` field. Each step
   is one user action (click, type, scroll, key) — execute them in order
   and `wait` between actions if the shot needs a transition to settle.

5. **Capture** with `mcp__computer-use__screenshot`. Crop to the shot's
   `region` (full window, content area, or pixel bbox).

6. **Save** to `public/screenshots/<filename>` (lab repo). Filenames follow
   `<chapter-or-entry-slug>-<descriptor>.<ext>`.

7. **Verify**: re-read the saved file's metadata (dimensions, file size).
   If it looks wrong (e.g., 1× instead of 2×, or wrong dimensions), redo.

8. **Update or emit MDX snippet**. If the user requested an MDX update,
   insert a `<Screenshot>` JSX with `src`, `alt`, `caption` from the shot.
   Otherwise emit the snippet to chat for the user to paste.

## How to take a mobile screenshot

Mobile capture is brittle. Two paths, in preference order:

**iOS Simulator path** (preferred when shot doesn't need real-device UI):
1. Open the iOS Simulator from Xcode (`open -a Simulator`).
2. Set device to iPhone 15 Pro, iOS 18+, dark mode.
3. Drive Claude mobile app via computer-use MCP exactly like a desktop app.
4. Capture with `xcrun simctl io booted screenshot <path> --type=png`
   (preferred over generic screenshot; gives you exact device-frame output).

**QuickTime mirror path** (when real-device UI matters):
1. Connect device via Lightning/USB-C, allow trust.
2. Open QuickTime → New Movie Recording → select device as camera.
3. The device screen shows in a QuickTime window — drive the device
   manually (computer-use can't reach the device); capture the QuickTime
   window region with `mcp__computer-use__screenshot`.

If neither path works for a given shot, **stop and tell the user**.
Do not commit a manual screenshot without flagging the convention break.

## How to read a shot list

A shot list is JSON or YAML matching `shot-list-schema.md`. Top-level
is an array of shots. Each shot has:
- `filename` — output filename, must follow `<slug>-<descriptor>.<ext>`
- `target` — `desktop`, `terminal`, `mobile-ios`, `mobile-android`, `web`
- `app` — app name (`Claude`, `iTerm`, `Safari`, etc.)
- `steps` — ordered list of UI actions to reach the capture state
- `region` — `window`, `content`, or `[x, y, w, h]`
- `caption.en` + `caption.cs` — visible caption (CS may be empty if pending)
- `alt` — accessibility alt text
- `dark_mode` — default `true`; `false` only with explicit reason

## State checklist (always enforce)

Read `conventions.md` §State for the full list. The non-negotiables:
- Dark mode on (matches lab's default reading mode)
- 2× retina output (`screencapture -R` or simctl `--type=png`)
- Notification Center hidden, Do Not Disturb on
- No PII visible: no real account names, no real repo names other than
  `claude-code-lab`, no emails, no tokens, no client work
- Test account `cc-lab-demo` used for any account-bearing UI
- Browser tabs reduced to one (the target tab)
- Terminal prompt sanitized to `~ $` (no host or full path)

## Failure modes — what to do

- **Computer-use MCP request_access denies**: ask the user to approve in
  the system dialog, then retry once. If still denied, stop.
- **App doesn't come forward**: try `open_application` again with the
  full bundle path. If still failing, tell the user — do not screenshot
  the wrong window.
- **Shot looks wrong after capture**: redo it once. If still wrong,
  document what's wrong and ask the user.
- **A convention can't be enforced** (e.g., real PII would show up):
  stop the shot, tell the user, do not ship.

## What this skill does not do

- Does not generate diagrams (use the `image-gen` skill for those)
- Does not generate terminal stills or animations (use `freeze` and `vhs`
  via `scripts/visuals/`)
- Does not edit MDX content beyond inserting a `<Screenshot>` reference
  when explicitly asked
- Does not commit. The user reviews shots before any commit.
