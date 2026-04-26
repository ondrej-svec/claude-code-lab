# Screenshot conventions for cc-lab

These rules are the visual contract. Every shot the lab ships honors
them. The `cc-lab-screenshot` skill enforces them; humans verify on
review.

## State (always enforce)

Before any capture:

- [ ] **Theme**: dark mode (matches lab's default reading mode)
- [ ] **Resolution**: 2× retina (Mac default on Apple Silicon)
- [ ] **Notification Center**: hidden
- [ ] **Do Not Disturb / Focus**: on
- [ ] **Wallpaper**: solid neutral (not personal photo) — desktop captures only
- [ ] **Cursor**: outside the capture region unless the shot needs it
- [ ] **Window size**: target app at 1440×900 nominal (2880×1800 captured)
- [ ] **Menu bar**: hidden where possible (full-screen target app)
- [ ] **Browser tabs**: only the target tab open
- [ ] **Terminal prompt**: sanitized to `~ $` — no hostname, no full path
- [ ] **Browser URL bar**: real lab URL (`cc-lab.ondrejsvec.com`) or
      `localhost:3000` only — no tokens, no query strings with PII

## PII rules (never break)

- ❌ Never: real account names other than `cc-lab-demo`
- ❌ Never: real client names (Aibility, Seyfor, others)
- ❌ Never: real email addresses
- ❌ Never: API tokens, even partial
- ❌ Never: repo names other than `claude-code-lab` and `cc-lab-samples`
- ❌ Never: Slack/Discord avatars of real people
- ✅ Use: the test account `cc-lab-demo` for anything account-bearing
- ✅ Use: synthetic project names (`hello-claude`, `voice-demo`)

## Filename convention

Pattern: `<slug>-<descriptor>.<ext>`

- `<slug>` = chapter or library entry slug (e.g., `voice`, `diagnose`,
  `context-engineering`)
- `<descriptor>` = short kebab-case description (e.g., `desktop-mic`,
  `wispr-flow-menu`, `output-example`)
- `<ext>` = `png` for screenshots, `svg` for `freeze` stills, `webm`
  for `vhs` casts

Examples:
- `voice-desktop-mic.png`
- `voice-mobile-dictation.png`
- `diagnose-output-example.svg`
- `diagnose-running.webm`

Light/dark variants append `-light` / `-dark`:
- `voice-desktop-mic-dark.png` (default)
- `voice-desktop-mic-light.png` (only when both modes shipped)

## Caption + alt rules

**Caption** — visible text under the figure. Short. Active voice. Tells
the reader what to notice. Bilingual EN+CS.
- Good: "Press mic. Speak. Watch the prompt fill."
- Bad: "Screenshot of the Claude desktop app showing the microphone button."

**Alt** — for screen readers. Describes the visible content
literally enough that a non-sighted reader gets the same information
the visible reader does. EN only is fine if the chapter has both.
- Good: "Claude desktop app with the microphone button highlighted and
  transcribed text 'Add a /usage command' in the prompt area."
- Bad: "A screenshot."

## Storage

- Screenshots → `public/screenshots/`
- `freeze` stills → `public/visuals/`
- `vhs` casts → `public/visuals/`
- Source `.tape` files → `scripts/visuals/`
- Shot list JSON/YAML → `scripts/visuals/shot-lists/<chapter>.json`

## Aesthetic alignment

Match the v3 visual character of the existing 9 chapters:
- Calm, not demo-style flourishy
- Neutral framing, no decorative drop shadows beyond the component's
  built-in soft shadow
- Rose-pine-moon palette where the shot involves themed terminal output
  (use the same theme `vhs` and `freeze` are configured with)

## Hard fails (re-shoot required)

- 1× output instead of 2×
- Light mode when dark requested
- Any PII visible
- Notification visible
- Wrong window captured
- Cursor in capture when not requested
- Terminal prompt unsanitized
- Caption missing for the chapter's published locales

If any of these happens after commit, file a follow-up to re-shoot.
