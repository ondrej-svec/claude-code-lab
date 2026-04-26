# Visual production conventions

Short, opinionated guide for producing visuals that match cc-lab's v3
aesthetic. Phase 2 of the mastery-evolution plan folds this into the
larger `cc-lab-design-system.md`. Until then, this is the source of
truth for visual production.

The non-negotiables: zero manual capture, rose-pine palette, no PII.

## Tooling matrix

| Asset type | Tool | Output | Where |
|---|---|---|---|
| Diagrams (boxes, arrows, flow) | Codex GPT Image 2 via `image-gen` skill | `.png` | `public/visuals/` |
| Static terminal stills | [`freeze`](https://github.com/charmbracelet/freeze) | `.svg` | `public/visuals/` |
| Animated terminal sessions | [`vhs`](https://github.com/charmbracelet/vhs) | `.webm` + poster `.png` | `public/visuals/` |
| Desktop screenshots | `cc-lab-screenshot` skill (computer-use MCP) | `.png` (2× retina) | `public/screenshots/` |
| Mobile screenshots | `cc-lab-screenshot` skill (iOS Simulator preferred) | `.png` | `public/screenshots/` |

Manual capture is a documented fallback only — never the preferred path.

## `freeze` (static terminal)

Config: `scripts/visuals/freeze.config.json`. Theme: `rose-pine-moon`.

```bash
echo '...your terminal text...' | freeze \
  --config scripts/visuals/freeze.config.json \
  --language ansi \
  -o public/visuals/<chapter>-<descriptor>.svg
```

For literal command output, capture it once with `script` or run the
command and pipe its output through `freeze --execute`.

## `vhs` (animated terminal)

Tapes live at `scripts/visuals/<chapter>-<descriptor>.tape`. Sample at
`scripts/visuals/sample.tape`.

```bash
vhs scripts/visuals/<chapter>-<descriptor>.tape
# Output is configured in the tape's `Output` directive.
```

Tape conventions:
- `Set Theme "rose-pine-moon"` — always
- `Set FontFamily "JetBrains Mono"` — always
- `Set FontSize 14` — default; 16 only for hero asks
- `Set Width 1200` — match chapter image standard
- `Set Framerate 30` — smooth without bloat
- Output `.webm` (AV1/VP9). Always pair with a `.poster.png` for the
  `<TerminalCast>` reduced-motion fallback. Generate poster with:
  ```bash
  ffmpeg -i public/visuals/<name>.webm -vframes 1 \
    public/visuals/<name>.poster.png
  ```

## Diagrams (Codex GPT Image 2)

Invoke via the global `image-gen` skill. Hand it the v3 prompt template
(see `image-gen` skill for current template) plus:
- Subject sentence (what the diagram shows)
- 3-7 labeled elements
- Layout hint (radial, horizontal flow, 2×2 grid, etc.)
- Output filename matching the conventions below

Diagrams render in light mode; the `<Diagram>` MDX component handles
theme switching at render time, so the source PNG should be neutral.

## Screenshots (`cc-lab-screenshot` skill)

Install: `bash skills/cc-lab-screenshot/install.sh`.

Invoke with a JSON shot list matching `skills/cc-lab-screenshot/shot-list-schema.md`.
Example: `skills/cc-lab-screenshot/examples/voice-chapter-shots.json`.

State enforced for every shot — full list in
`skills/cc-lab-screenshot/conventions.md`. The non-negotiables:
- Dark mode
- 2× retina
- Notification Center hidden
- No PII (use `cc-lab-demo` test account)
- Terminal prompt sanitized to `~ $`

Filename pattern: `<chapter-or-entry-slug>-<descriptor>.<ext>`.

## MDX components

| Component | Use for | Source file |
|---|---|---|
| `<Screenshot>` | PNG screenshots from `public/screenshots/` | `app/components/screenshot.tsx` |
| `<Diagram>` | Mermaid charts (for inline) or static `<img>` (for v3 PNGs) | `app/components/diagram.tsx` |
| `<TerminalOutput>` | `freeze`-produced static terminal SVGs | `app/components/terminal-output.tsx` |
| `<TerminalCast>` | `vhs`-produced animated terminal recordings | `app/components/terminal-cast.tsx` |

`<TerminalOutput>` accepts an optional `text` prop for the copy-button
affordance — pass the same text the SVG was rendered from.

`<TerminalCast>` requires a `poster` prop (first frame fallback). It
respects `prefers-reduced-motion: reduce` by collapsing to the still.

## Hard fails (always re-do)

- 1× output instead of 2× (screenshots)
- Wrong theme (anything other than rose-pine-moon for terminal)
- PII visible
- Cursor in capture region when not requested
- Caption missing for any published locale
- Manual capture used without explicit fallback documentation

## Lessons from the first end-to-end run (2026-04-26 — voice chapter)

The voice chapter shipped two real Claude desktop screenshots
(`voice-desktop-mic.png`, `voice-multimodal-paste.png`) and one freeze
SVG (`voice-terminal-enabled.svg`). Findings worth folding into the
`cc-lab-screenshot` skill conventions before the next chapter:

**What worked.**
- `screencapture -x <path>` + `sips -c h w --cropOffset y x <path>` is
  the cleanest path to controlled capture + crop. More reliable than
  computer-use's `screenshot` + `save_to_disk` (path retrieval was
  inconsistent in this session).
- `freeze` with `--language ansi` + the project config produces
  publication-ready terminal stills in one shot. Embedded in MDX via
  `<TerminalOutput>` it sits naturally next to dark Claude desktop
  screenshots — the rose-pine palette carries the consistency.
- Computer-use MCP gets the job done for desktop captures, *after* the
  one-time macOS Accessibility + Screen Recording grant.

**What hurt.**
- macOS Accessibility + Screen Recording perms are a one-time human
  step before any computer-use call works. `request_access` returns a
  not-yet-granted error until the user toggles the perms. Document
  this prominently in the cc-lab-screenshot SKILL.md so future runs
  don't blank-stare at the permission panel.
- Claude desktop's slash-command autocomplete fights the `type` tool.
  Typing `/usage` got substituted to `/extra-usage` (a real installed
  skill on this machine), and `Escape` didn't always dismiss the
  dropdown cleanly. **Convention update:** when the prompt text needs
  a slash command, either escape autocomplete deterministically (test
  the sequence on the live machine first) or pick a non-slash
  representative prompt and update the alt text to match. Do not
  pretend the screenshot shows what the chapter promised when it
  doesn't — better honest text in the alt than a misleading shot.
- Voice mic state is fragile. Toggling can leave dictation active
  invisibly and capture stray text into the next typed input. **Always
  zoom on the bottom toolbar** after activation and confirm the icon
  is the right state before capture.
- `sips` SVG → PNG conversion does not always honor ANSI color
  escapes; the magenta `/voice` rendered flat in the preview PNG. The
  browser-rendered SVG honors the colors. Don't trust `sips` previews
  for ANSI-colored output — verify in-browser.

**Path forward.**
- The cc-lab-screenshot skill (`skills/cc-lab-screenshot/`) covers the
  conventions but the SKILL.md section on slash-command autocomplete +
  voice-state verification needs the lessons above folded in before
  the next chapter that uses it.
- The hybrid visual strategy is validated: real screenshots for daily
  surfaces, freeze for terminal artifacts, GPT Image 2 reserved for
  conceptual diagrams. Apply the same split to library entries
  (Phase 5) when their visual asset briefs are written.

## Where the briefs live

Per-chapter shot lists: `scripts/visuals/shot-lists/<chapter>.json`.

Per-chapter tape files: `scripts/visuals/<chapter>-<descriptor>.tape`.

The plan that introduced this whole pipeline:
`../../Bobo/docs/plans/2026-04-26-feat-cclab-mastery-evolution-plan.md`
(out-of-tree; copy of the relevant Visual Asset Briefs section is in
chapter-specific shot list comments).
