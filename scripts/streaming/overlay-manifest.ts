/**
 * overlay-manifest.ts — declarative metadata for every overlay HTML file.
 *
 * Source of truth for both render-overlays.ts (Playwright fallback assets)
 * and build-obs-config.ts (OBS scene-collection JSON). Each entry maps one
 * HTML file under scripts/streaming/overlays/ to its render mode, default
 * OBS visibility, and OBS positioning region.
 *
 * Voice and visual rules: docs/cc-lab-design-system.md.
 */

/**
 * Where in the frame the overlay sits, when OBS positions it.
 *
 * The cockpit-frame is the only "full-frame" overlay (1920×1080 transparent
 * background with hull strips painted in place). Every other overlay is
 * a smaller asset that OBS layers into a specific region.
 */
export type OverlayRegion =
  | "full-frame"
  | "top-hull-left"
  | "top-hull-center"
  | "top-hull-right"
  | "bottom-hull-left"
  | "bottom-hull-right"
  | "canopy-top"
  | "canopy-center";

export type OverlayKind = "static" | "animated";

export type OverlayManifestEntry = {
  /** File basename in scripts/streaming/overlays/, without extension. */
  name: string;
  /** Static = single PNG fallback. Animated = MP4 fallback via WebM. */
  kind: OverlayKind;
  /** Where OBS positions the source. */
  region: OverlayRegion;
  /** Whether OBS should default this source to visible at scene load. */
  defaultVisible: boolean;
  /**
   * For animated overlays only — total duration in milliseconds the
   * Playwright recorder captures before stopping.
   */
  durationMs?: number;
  /**
   * Render at the natural overlay size or the full frame. The cockpit-frame
   * paints hull lines across the whole frame; smaller overlays render at
   * their content's natural box. Defaults to full-frame for simplicity —
   * OBS rescales as needed.
   */
  viewport?: { width: number; height: number };
  /**
   * OBS z-order layer. Higher values render on top. Sources in the OBS
   * scene-collection JSON are drawn back-to-front, so this number is what
   * the build script sorts by — higher first becomes the topmost item.
   *
   * Layering convention (top to bottom of the visible stack):
   *   100 — REC indicator / lower-thirds (rare; layered above hull)
   *    80 — mode-badge, dictation-indicator (sit in hull strips)
   *    70 — compound-step-indicator (canopy-top)
   *    60 — cockpit-frame (the hull lines + face cam port outline)
   *    40 — face cam capture (over screen capture, into face cam slot)
   *    20 — screen capture (deepest visible layer)
   */
  zOrder: number;
  /** One-line description for docs and Stream Deck button hints. */
  blurb: string;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * OBS positions every overlay browser source at (0,0) with size 1920×1080
 * because each overlay is a 1920×1080 transparent canvas with content
 * absolutely-positioned inside. These rects are informational metadata
 * only — useful for docs, Stream Deck button hints, and verifying the
 * overlay's content actually lands in its declared region.
 */
export const REGION_RECTS: Record<OverlayRegion, Rect> = {
  "full-frame":         { x:    0, y:    0, width: 1920, height: 1080 },
  "top-hull-left":      { x:    0, y:    0, width:  300, height:   54 },
  "top-hull-center":    { x:  560, y:    0, width:  800, height:   54 },
  "top-hull-right":     { x: 1620, y:    0, width:  300, height:   54 },
  "bottom-hull-left":   { x:    0, y: 1026, width:  400, height:   54 },
  "bottom-hull-right":  { x: 1251, y: 1026, width:  400, height:   54 },
  "canopy-top":         { x:  460, y:   72, width: 1000, height:   80 },
  "canopy-center":      { x:  560, y:  440, width:  800, height:  200 },
};

/** Default render viewport when an entry doesn't override it. */
export const DEFAULT_VIEWPORT = { width: 1920, height: 1080 } as const;

export const OVERLAYS: OverlayManifestEntry[] = [
  {
    name: "cockpit-frame",
    kind: "static",
    region: "full-frame",
    defaultVisible: true,
    zOrder: 60,
    blurb: "Hull strips, antenna, side ticks, face cam port outline.",
  },
  {
    name: "dictation-indicator",
    kind: "animated",
    region: "bottom-hull-left",
    defaultVisible: false,
    durationMs: 2200,
    zOrder: 80,
    blurb: "Pulsing /voice listening pip, fires while dictation active.",
  },
  {
    name: "mode-badge",
    kind: "static",
    region: "top-hull-left",
    defaultVisible: false,
    zOrder: 80,
    blurb: "Permission mode pill — default · acceptEdits · plan · auto.",
  },
  {
    name: "compound-step-indicator",
    kind: "static",
    region: "canopy-top",
    defaultVisible: false,
    zOrder: 70,
    blurb: "Five-step pill row for Ep 6 compound walkthrough.",
  },
  {
    name: "lower-third-tool",
    kind: "static",
    region: "top-hull-center",
    defaultVisible: false,
    zOrder: 100,
    blurb: "Tool name + brief, replaces episode label while active.",
  },
  {
    name: "lower-third-chapter",
    kind: "static",
    region: "top-hull-center",
    defaultVisible: false,
    zOrder: 100,
    blurb: "Chapter URL + name, replaces episode label while active.",
  },
  {
    name: "intermission",
    kind: "static",
    region: "full-frame",
    defaultVisible: false,
    zOrder: 90, // V2 streaming scene only — covers everything when active
    blurb: "V2 streaming break card, hero ship + Back in 2 min.",
  },
  {
    name: "stream-ending-soon",
    kind: "static",
    region: "full-frame",
    defaultVisible: false,
    zOrder: 90,
    blurb: "V2 streaming wind-down card.",
  },
  {
    name: "boot-transition",
    kind: "animated",
    region: "full-frame",
    defaultVisible: false,
    durationMs: 3000,
    zOrder: 100, // sits over everything during the cold open
    blurb: "3s cold-open — scan wash, three typed lines, DON'T PANIC pulse.",
  },
];

/**
 * Resolve an overlay entry by name, throwing if missing. Used by callers
 * that hard-reference a specific overlay (e.g. cockpit-frame in OBS scene
 * composition).
 */
export function getOverlay(name: string): OverlayManifestEntry {
  const entry = OVERLAYS.find((o) => o.name === name);
  if (!entry) {
    throw new Error(`Unknown overlay '${name}' — check overlay-manifest.ts.`);
  }
  return entry;
}
