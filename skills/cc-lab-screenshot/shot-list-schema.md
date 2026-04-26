# Shot list schema

A shot list is a JSON or YAML array. Each element is a single shot. The
`cc-lab-screenshot` skill consumes the list and produces one file per
entry under `public/screenshots/` (or `public/visuals/`).

## Schema (JSON Schema-style)

```jsonc
[
  {
    // Output file. Required. Must follow conventions.md §Filename.
    "filename": "voice-desktop-mic.png",

    // What to capture. Required.
    "target": "desktop", // desktop | terminal | mobile-ios | mobile-android | web

    // App name. Required for desktop/terminal/mobile.
    "app": "Claude",

    // Ordered UI actions to reach capture state. Required.
    // Each step is one user action; the skill executes them in order.
    "steps": [
      { "action": "open_app", "name": "Claude" },
      { "action": "wait", "ms": 600 },
      { "action": "click", "target": { "label": "New chat" } },
      { "action": "type", "text": "Add a /usage command" },
      { "action": "click", "target": { "label": "Microphone" } },
      { "action": "wait", "ms": 800 }
    ],

    // What region to capture. Required.
    // - "window": active window only
    // - "content": app's content area (no chrome)
    // - [x, y, w, h]: pixel bounding box (use sparingly)
    "region": "window",

    // Captions. EN required. CS may be empty if translation is pending.
    "caption": {
      "en": "Press mic. Speak. Watch the prompt fill.",
      "cs": "Stiskni mikrofon. Mluv. Sleduj, jak se prompt vyplňuje."
    },

    // Accessibility alt text. Required.
    "alt": "Claude desktop app with microphone activated mid-dictation, transcribed text 'Add a /usage command' in the prompt area.",

    // Default true. Set false only with reason.
    "dark_mode": true,

    // Optional: explicit reason if dark_mode is false.
    "dark_mode_reason": null,

    // Optional: target chapter the shot is for. Used for organization
    // and for inserting <Screenshot> JSX into MDX if requested.
    "chapter": "voice-and-interaction",

    // Optional: if true, the skill inserts a <Screenshot> ref into the
    // chapter MDX at the position marked `<!-- screenshot: <filename> -->`.
    "insert_into_mdx": true
  }
]
```

## Step actions

| Action | Fields | Effect |
|---|---|---|
| `open_app` | `name` | `mcp__computer-use__open_application` |
| `wait` | `ms` | sleep |
| `click` | `target.label` or `target.bbox` | locate + click |
| `type` | `text` | keystrokes |
| `key` | `combo` (e.g. `cmd+n`) | shortcut |
| `scroll` | `direction`, `amount` | mouse wheel |
| `screenshot` | (none — implicit at end) | overrides default end-of-steps capture |

## Validation rules

The skill rejects a shot list if any of:
- `filename` missing or doesn't match the pattern in `conventions.md`
- `target` not one of the allowed values
- `caption.en` missing or empty
- `alt` missing or shorter than 16 characters
- `region` not `window`, `content`, or a 4-tuple of integers
- `dark_mode: false` with no `dark_mode_reason`
- A `step.action` not in the table above

## Examples

See `examples/` (siblings to this file) for real shot lists.
