# Recording setup — cc-lab video series

This is the one-time setup walkthrough for the recording machine. It picks
up after Phase 0–2 of
[`docs/plans/2026-04-28-feat-video-series-identity-plan.md`](plans/2026-04-28-feat-video-series-identity-plan.md)
have shipped (overlays authored, OBS scene-collection generator written,
Stream Deck button spec + icons rendered).

The whole flow is ~60 minutes the first time. After that, recording any
new episode is "open OBS, hit Stream Deck REC."

## Before you start

- A Mac (any 2020+ Apple Silicon machine is plenty).
- A USB webcam or the built-in FaceTime HD camera.
- A USB mic or the built-in mic (peak around -12 dB to -6 dB).
- An Elgato Stream Deck MK.2 (15 keys) or XL (32 keys).
- ~5 GB of free disk for OBS recordings.

## 1. Install the apps

```bash
brew install --cask obs            # OBS Studio 28+ (ships obs-websocket v5)
brew install --cask elgato-stream-deck
```

Plug in the Stream Deck. Open the Stream Deck app once so it sees the device.

Open OBS once. macOS will prompt for Camera + Microphone + Screen Recording
permissions — grant all three.

## 2. Regenerate the configs

The OBS scene collection bakes absolute `file://` URLs to overlay HTML
files. They must match this machine's filesystem, so regenerate after
pulling:

```bash
git pull
pnpm install                  # fresh install picks up Playwright
pnpm tsx scripts/streaming/render-overlays.ts          # PNG/MP4 fallbacks
pnpm tsx scripts/streaming/build-obs-config.ts         # OBS scene collection
pnpm tsx scripts/streaming/render-streamdeck-icons.ts  # Stream Deck button icons
```

Outputs land under `scripts/streaming/dist/` (gitignored):

- `cc-lab-obs-scenes.json` — OBS scene collection
- `streamdeck-icons/slot*.png` — 15 button icons
- `streamdeck-icons/manifest.json` — slot-by-slot button reference

## 3. Import the OBS scene collection

In OBS:

1. **Scene Collection → Import** → select
   `scripts/streaming/dist/cc-lab-obs-scenes.json`.
2. **Scene Collection → cc-lab** to activate it.

You should see five scenes in the bottom-left panel:

- `cc-lab Recording` — the V1 recording scene (use this)
- `cc-lab Streaming` — V2 placeholder
- `cc-lab Intro`, `cc-lab Break`, `cc-lab Outro` — V2 scene placeholders

In the Recording scene, the Sources panel shows (top to bottom = topmost first):

- `cc-lab lower-third-chapter` (default-hidden)
- `cc-lab lower-third-tool` (default-hidden)
- `cc-lab mode-badge` (default-hidden)
- `cc-lab dictation-indicator` (default-hidden)
- `cc-lab compound-step-indicator` (default-hidden)
- `cc-lab cockpit-frame` (default-visible)
- `cc-lab Face Cam`
- `cc-lab Screen Capture`

## 4. Wire up the camera and screen capture

Two sources need device assignments — these can't be baked into the JSON
because device UUIDs vary per machine:

### Face cam

1. Click `cc-lab Face Cam` in Sources → cog icon → **Properties**.
2. Set **Device** to your webcam (FaceTime HD Camera or USB cam).
3. Click **OK**. The cam should appear in the bottom-right face cam port.

### Screen capture

1. Click `cc-lab Screen Capture` in Sources → cog icon → **Properties**.
2. Set **Method** to **Display Capture** (or **Window Capture** if you
   want to capture a single window — the IDE, the terminal, or the browser
   tab running The Guide).
3. Pick the display.
4. Click **OK**.

Verify in the OBS preview:

- Hull strips top + bottom render at hairline opacity.
- Face cam sits inside the bottom-right port outline.
- Screen capture fills the canopy area.
- Don't Panic pill bottom-left is yellow.

If the hull lines disappear under YouTube compression later (Phase 5
discovery), increase opacity in
`scripts/streaming/overlays/overlay-palette.css` from 40% → 55% on
`--cc-hull-line` and re-import.

## 5. Enable OBS WebSocket

The Stream Deck will toggle source visibility via OBS WebSocket.

1. **Tools → WebSocket Server Settings**.
2. Check **Enable WebSocket server**.
3. Note the **Server Port** (default 4455).
4. Click **Generate Password** → copy the password to your clipboard
   (do not commit it anywhere).
5. **OK**.

## 6. Set up the Stream Deck profile

Stream Deck profile bundles (`.streamDeckProfile`) have an undocumented
binary format, so the profile is created manually one time. Use the spec
in `scripts/streaming/streamdeck-spec.ts` and the rendered icons under
`scripts/streaming/dist/streamdeck-icons/` as your guide.

### Install the OBS plugin

In Stream Deck app:

1. **More Actions** (right rail icon, "+").
2. Search "OBS" → install **OBS Studio** by Elgato.
3. After install, click the OBS plugin icon in the right rail.
4. Click the gear icon → **Studio Connection** → enter `127.0.0.1:4455`,
   paste the WebSocket password from step 5.
5. Wait for the green dot indicating "Connected."

### Create a new profile

1. **Profiles** dropdown → **New Profile** → name it `cc-lab`.
2. Set as active profile.

### Bind 15 buttons

For each button, drag the action onto the matching grid slot, then set
the icon to the matching PNG file under
`scripts/streaming/dist/streamdeck-icons/`.

Manifest path:
[`scripts/streaming/dist/streamdeck-icons/manifest.json`](../scripts/streaming/dist/streamdeck-icons/manifest.json)
(generated, slot-by-slot reference).

The full mapping:

| Slot | Icon                            | Action type        | Target / payload                                      |
| :--- | :------------------------------ | :----------------- | :---------------------------------------------------- |
| 0    | `slot00-claude.png`             | System → Open      | `/Applications/Claude.app`                            |
| 1    | `slot01-claude.png`             | System → Open      | Terminal app (or your iTerm / Warp / Ghostty)         |
| 2    | `slot02-ide.png`                | System → Open      | `/Applications/Visual Studio Code.app`                |
| 3    | `slot03-guide.png`              | Hotkey Switch      | bind a hotkey to focus the Guide browser tab          |
| 4    | `slot04-cc-lab.png`             | Hotkey Switch      | bind a hotkey to focus the cc-lab browser tab         |
| 5    | `slot05-init.png`               | System → Text      | `/init` (set "Trigger" → Press release)               |
| 6    | `slot06-ch2.png`                | System → Text      | `Add DELETE /api/entries/{id} and a delete button on each entry card.` |
| 7    | `slot07-brain.png`              | System → Text      | `/marvin:brainstorm `                                 |
| 8    | `slot08-diagnose.png`           | System → Text      | `/cc-lab-diagnose project`                            |
| 9    | `slot09-security.png`           | System → Text      | `/security-review`                                    |
| 10   | `slot10-mode.png`               | OBS → Source Visible | scene `cc-lab Recording` · source `cc-lab mode-badge` · action `Toggle` |
| 11   | `slot11-dictation.png`          | OBS → Source Visible | scene `cc-lab Recording` · source `cc-lab dictation-indicator` · action `Toggle` |
| 12   | `slot12-tool.png`               | OBS → Source Visible | scene `cc-lab Recording` · source `cc-lab lower-third-tool` · action `Toggle` |
| 13   | `slot13-compound.png`           | OBS → Source Visible | scene `cc-lab Recording` · source `cc-lab compound-step-indicator` · action `Toggle` |
| 14   | `slot14-rec.png`                | OBS → Record       | action `Toggle`                                       |

For app focus on rows 1.4 and 1.5 (browser tabs): macOS doesn't expose
"focus a specific browser tab" as a Stream Deck action. Two options:

- Use **System → Open** with the literal URL (`https://cc-lab.ondrejsvec.com`)
  — opens or focuses the existing tab in your default browser.
- Bind a Raycast / macOS keyboard shortcut to the tab and use **Hotkey
  Switch** to fire it.

### Export the profile

Once all 15 buttons are bound:

1. **Profiles** dropdown → right-click `cc-lab` → **Export**.
2. Save to `~/Documents/cc-lab.streamDeckProfile`.

This file is your backup. If you ever need to set up another machine,
just import this file instead of repeating the 15-button bind.

## 7. Dry-run

Sanity-check the full stack before recording an episode for real.

1. Open OBS, switch to `cc-lab Recording` scene.
2. Confirm the preview shows: hull chrome, face cam in port, screen
   capture filling the canopy.
3. Press Stream Deck **REC** (slot 14). The record indicator turns red
   in OBS.
4. For 60 seconds:
   - Talk normally. Audio meter should peak around -12 to -6 dB.
   - Press **Mode** (slot 10). Mode badge appears top-left.
   - Press **Dictation** (slot 11). `/voice listening` pip appears
     bottom-left.
   - Press **Tool lower-3** (slot 12). Lower-third overlay replaces the
     centered episode label.
   - Press **Mode** again to hide.
5. Press **REC** to stop.

OBS writes the take to `~/Movies/` by default — find it and watch:

- Hull strips legible.
- Face cam in the right place.
- Each fired overlay appeared and disappeared cleanly.
- No frame drops (check OBS bottom-right after stopping; you want 0
  rendering / encoding lag).

If anything is off, fix it now. The dry-run takes 5 minutes; an episode
re-shoot takes hours.

## Troubleshooting

**"OBS WebSocket plugin in Stream Deck shows red dot."**
Check the Server Port and password match between OBS WebSocket Server
Settings and the Stream Deck OBS plugin's Studio Connection settings.
Restart both apps if needed.

**"Browser sources show 'Failed to load file://...'"**
The OBS scene collection was generated on a different machine.
Run `pnpm tsx scripts/streaming/build-obs-config.ts` again, then in OBS:
**Scene Collection → Import** the regenerated JSON.

**"Hull lines disappear at YouTube compression."**
Discovered post-pilot. Bump
`--cc-hull-line` opacity from 40% → 55% in
`scripts/streaming/overlays/overlay-palette.css`, re-render with
`pnpm tsx scripts/streaming/render-overlays.ts`.

**"OBS records but my voice is too quiet."**
In OBS → Settings → Audio → Mic input, check the Sample Rate (48 kHz),
Mic device, and Mic Filter (add a Gain filter +6 dB if needed).

**"Screen Capture shows a security warning."**
macOS revoked the Screen Recording permission on a system update.
System Settings → Privacy & Security → Screen Recording → toggle OBS
back on, then quit and re-launch OBS.

## What's next

Phase 4 of the plan is the Descript layout pack (manual one-time
authoring in Descript). Phase 5 is the actual Trailer + Episode 1
recording. See
[`docs/plans/2026-04-28-feat-video-series-identity-plan.md`](plans/2026-04-28-feat-video-series-identity-plan.md).
