/**
 * streamdeck-spec.ts — typed declaration of every Stream Deck button.
 *
 * The Stream Deck profile bundle (`.streamDeckProfile`) format is
 * undocumented and risky to generate from scratch. Per the plan's risk
 * register, we ship the *spec* (this file) + *icons* (rendered via
 * render-streamdeck-icons.ts) + a manual-bind walkthrough in
 * docs/recording-setup.md. One-time ~15 minute setup in the Stream Deck
 * app on the recording machine, then export the resulting profile to a
 * .streamDeckProfile for backup.
 *
 * Layout: Stream Deck MK.2 (15 keys, 5×3 grid).
 *
 *   row 1 (top):    APP FOCUS         — five apps, one keystroke each
 *   row 2 (middle): PROMPT INSERTION  — text expansion of canned prompts
 *   row 3 (bottom): OVERLAY TRIGGERS  — toggle OBS source visibility / scene switch
 *
 * Action types map to Stream Deck app actions:
 *   - obs-source-toggle   → OBS Studio plugin: "Source Visibility" (toggle)
 *   - obs-scene-switch    → OBS Studio plugin: "Scene"
 *   - obs-record-toggle   → OBS Studio plugin: "Record" (toggle start/stop)
 *   - text-expansion      → built-in "Text" action
 *   - app-focus           → built-in "Open" action targeting an app
 *   - hyper-key           → built-in "Hotkey Switch" or system shortcut
 */

export type ButtonAction =
  | { kind: "obs-source-toggle"; sourceName: string; sceneName?: string }
  | { kind: "obs-scene-switch"; sceneName: string }
  | { kind: "obs-record-toggle" }
  | { kind: "text-expansion"; text: string }
  | { kind: "app-focus"; appName: string }
  | { kind: "hyper-key"; description: string };

export type Button = {
  /** Stream Deck slot 0..14 (row × 5 + col), top-left = 0. */
  slot: number;
  /** Short label printed on the icon. Keep <= 12 chars. */
  label: string;
  /** Icon style accent. Drives the icon background color. */
  accent: "default" | "teal" | "yellow" | "iris" | "pink";
  /** What the button does when pressed. */
  action: ButtonAction;
  /** Long-form hint shown in docs / Stream Deck button title. */
  hint: string;
};

const slot = (row: number, col: number): number => row * 5 + col;

export const BUTTONS: Button[] = [
  // ─── Row 1 — App Focus ────────────────────────────────────────────────
  {
    slot: slot(0, 0),
    label: "Claude\nDesktop",
    accent: "iris",
    action: { kind: "app-focus", appName: "Claude" },
    hint: "Bring the Claude desktop app to front.",
  },
  {
    slot: slot(0, 1),
    label: "Claude\nCode",
    accent: "iris",
    action: { kind: "app-focus", appName: "Terminal" },
    hint: "Focus the terminal running claude CLI.",
  },
  {
    slot: slot(0, 2),
    label: "IDE",
    accent: "default",
    action: { kind: "app-focus", appName: "Visual Studio Code" },
    hint: "Focus the editor (VS Code or IntelliJ).",
  },
  {
    slot: slot(0, 3),
    label: "Guide",
    accent: "teal",
    action: { kind: "app-focus", appName: "Google Chrome" },
    hint: "Focus the browser tab running The Guide demo.",
  },
  {
    slot: slot(0, 4),
    label: "cc-lab",
    accent: "teal",
    action: { kind: "app-focus", appName: "Google Chrome" },
    hint: "Focus the browser tab on cc-lab.ondrejsvec.com.",
  },

  // ─── Row 2 — Prompt Insertion ────────────────────────────────────────
  {
    slot: slot(1, 0),
    label: "/init\nprompt",
    accent: "default",
    action: {
      kind: "text-expansion",
      text: "/init",
    },
    hint: "Insert /init slash command for chapter 3 demo.",
  },
  {
    slot: slot(1, 1),
    label: "Ch.2\nDELETE",
    accent: "default",
    action: {
      kind: "text-expansion",
      text:
        "Add DELETE /api/entries/{id} and a delete button on each entry card.",
    },
    hint: "Insert the chapter-2 first-task DELETE prompt.",
  },
  {
    slot: slot(1, 2),
    label: "/brain\nstorm",
    accent: "yellow",
    action: { kind: "text-expansion", text: "/marvin:brainstorm " },
    hint: "Insert the compound brainstorm slash command.",
  },
  {
    slot: slot(1, 3),
    label: "/diagnose",
    accent: "default",
    action: {
      kind: "text-expansion",
      text: "/cc-lab-diagnose project",
    },
    hint: "Insert /cc-lab-diagnose project for chapter 9 demo.",
  },
  {
    slot: slot(1, 4),
    label: "/security\nreview",
    accent: "default",
    action: {
      kind: "text-expansion",
      text: "/security-review",
    },
    hint: "Insert /security-review for trust-and-safety demo.",
  },

  // ─── Row 3 — Overlay Triggers + REC ─────────────────────────────────
  {
    slot: slot(2, 0),
    label: "Mode\ncycle",
    accent: "yellow",
    action: {
      // Stream Deck's "Multi Action" cycles between four sub-actions —
      // each one toggles a different mode-badge variant. The setup doc
      // explains the multi-action chain.
      kind: "obs-source-toggle",
      sourceName: "cc-lab mode-badge",
      sceneName: "cc-lab Recording",
    },
    hint: "Toggle mode-badge visibility (cycles state via multi-action).",
  },
  {
    slot: slot(2, 1),
    label: "Dictation",
    accent: "yellow",
    action: {
      kind: "obs-source-toggle",
      sourceName: "cc-lab dictation-indicator",
      sceneName: "cc-lab Recording",
    },
    hint: "Toggle the /voice listening indicator.",
  },
  {
    slot: slot(2, 2),
    label: "Tool\nlower-3",
    accent: "teal",
    action: {
      kind: "obs-source-toggle",
      sourceName: "cc-lab lower-third-tool",
      sceneName: "cc-lab Recording",
    },
    hint: "Toggle the tool-name lower-third overlay.",
  },
  {
    slot: slot(2, 3),
    label: "Compound\nstep",
    accent: "yellow",
    action: {
      kind: "obs-source-toggle",
      sourceName: "cc-lab compound-step-indicator",
      sceneName: "cc-lab Recording",
    },
    hint: "Toggle the compound 5-step indicator (Ep 6 only).",
  },
  {
    slot: slot(2, 4),
    label: "● REC",
    accent: "pink",
    action: { kind: "obs-record-toggle" },
    hint: "Start / stop OBS recording.",
  },
];

export type IconAccent = Button["accent"];

export const ICON_ACCENTS: Record<IconAccent, { bg: string; text: string; border: string }> = {
  default: {
    bg: "#26233a",
    text: "#e0def4",
    border: "rgba(224, 222, 244, 0.18)",
  },
  teal: {
    bg: "#1f3236",
    text: "#9ccfd8",
    border: "rgba(156, 207, 216, 0.40)",
  },
  yellow: {
    bg: "#3a3024",
    text: "#f6c177",
    border: "rgba(246, 193, 119, 0.40)",
  },
  iris: {
    bg: "#2e253b",
    text: "#c4a7e7",
    border: "rgba(196, 167, 231, 0.40)",
  },
  pink: {
    bg: "#3a2230",
    text: "#eb6f92",
    border: "rgba(235, 111, 146, 0.45)",
  },
};
