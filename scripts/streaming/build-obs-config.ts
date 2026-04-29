/**
 * build-obs-config.ts — generate the OBS scene-collection JSON.
 *
 * Reads scripts/streaming/overlay-manifest.ts and produces a complete
 * OBS scene collection at scripts/streaming/dist/cc-lab-obs-scenes.json.
 *
 * The output is a per-machine artifact: every browser source bakes an
 * absolute file:// URL to the overlay HTML on the local filesystem.
 * Regenerate after pulling on a different machine.
 *
 * Scenes produced:
 *   1. "cc-lab Recording"  — the V1 recording scene with full overlay stack
 *   2. "cc-lab Streaming"  — V2 placeholder, mirrors Recording
 *   3. "cc-lab Intro"      — V2 placeholder, intermission card
 *   4. "cc-lab Break"      — V2 placeholder, intermission card
 *   5. "cc-lab Outro"      — V2 placeholder, stream-ending-soon card
 *
 * Usage:
 *   pnpm tsx scripts/streaming/build-obs-config.ts
 *   pnpm tsx scripts/streaming/build-obs-config.ts --install   # also writes to OBS scenes dir
 */
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { OVERLAYS, type OverlayManifestEntry } from "./overlay-manifest";

const REPO_ROOT = resolve(__dirname, "..", "..");
const OVERLAY_DIR = join(REPO_ROOT, "scripts", "streaming", "overlays");
const DIST_OUT = join(
  REPO_ROOT,
  "scripts",
  "streaming",
  "dist",
  "cc-lab-obs-scenes.json",
);
const OBS_SCENES_DIR = join(
  homedir(),
  "Library",
  "Application Support",
  "obs-studio",
  "basic",
  "scenes",
);

const COLLECTION_NAME = "cc-lab";
const RECORDING_SCENE_NAME = "cc-lab Recording";
const STREAMING_SCENE_NAME = "cc-lab Streaming";
const INTRO_SCENE_NAME = "cc-lab Intro";
const BREAK_SCENE_NAME = "cc-lab Break";
const OUTRO_SCENE_NAME = "cc-lab Outro";

const FACE_CAM_SOURCE = "cc-lab Face Cam";
const SCREEN_CAPTURE_SOURCE = "cc-lab Screen Capture";

// Face cam port slot from cockpit-frame.html: 269×151px bottom-right.
const FACE_CAM_RECT = {
  x: 1920 - 269,
  y: 1080 - 151,
  w: 269,
  h: 151,
};

type ObsSettings = Record<string, unknown>;

type ObsSource = {
  name: string;
  uuid: string;
  id: string;
  versioned_id: string;
  settings: ObsSettings;
  enabled: boolean;
  muted: boolean;
  balance: number;
  volume: number;
  sync: number;
  monitoring_type: number;
  mixers: number;
  filters: unknown[];
  hotkeys: ObsSettings;
  flags: number;
  prev_ver: number;
  private_settings: ObsSettings;
  push_to_mute?: boolean;
  push_to_mute_delay?: number;
  push_to_talk?: boolean;
  push_to_talk_delay?: number;
  deinterlace_mode?: number;
  deinterlace_field_order?: number;
};

type SceneItem = {
  name: string;
  source_uuid: string;
  visible: boolean;
  locked: boolean;
  rot: number;
  pos: { x: number; y: number };
  scale: { x: number; y: number };
  align: number;
  bounds_type: number;
  bounds_align: number;
  bounds: { x: number; y: number };
  scale_filter: string;
  blend_method: string;
  blend_type: string;
  show_transition: { duration: number; id: string };
  hide_transition: { duration: number; id: string };
  private_settings: ObsSettings;
  id: number;
  group_item_backup: boolean;
};

const OBS_BOUNDS_SCALE_INNER = 2;
const OBS_ALIGN_TOP_LEFT = 5; // OBS_ALIGN_TOP (4) | OBS_ALIGN_LEFT (1)
const PREV_VER = 503447552; // OBS 31.0.0 — fine for any 28+ to import

function defaultSourceFields(): Pick<
  ObsSource,
  | "enabled"
  | "muted"
  | "balance"
  | "volume"
  | "sync"
  | "monitoring_type"
  | "mixers"
  | "filters"
  | "hotkeys"
  | "flags"
  | "prev_ver"
  | "private_settings"
  | "push_to_mute"
  | "push_to_mute_delay"
  | "push_to_talk"
  | "push_to_talk_delay"
  | "deinterlace_mode"
  | "deinterlace_field_order"
> {
  return {
    enabled: true,
    muted: false,
    balance: 0.5,
    volume: 1.0,
    sync: 0,
    monitoring_type: 0,
    mixers: 255,
    filters: [],
    hotkeys: {},
    flags: 0,
    prev_ver: PREV_VER,
    private_settings: {},
    push_to_mute: false,
    push_to_mute_delay: 0,
    push_to_talk: false,
    push_to_talk_delay: 0,
    deinterlace_mode: 0,
    deinterlace_field_order: 0,
  };
}

function browserSourceFor(entry: OverlayManifestEntry): ObsSource {
  const url = pathToFileURL(join(OVERLAY_DIR, `${entry.name}.html`)).toString();
  return {
    name: `cc-lab ${entry.name}`,
    uuid: randomUUID(),
    id: "browser_source",
    versioned_id: "browser_source",
    settings: {
      url,
      is_local_file: false,
      local_file: "",
      width: 1920,
      height: 1080,
      fps_custom: false,
      fps: 30,
      shutdown: true,
      restart_when_active: false,
      reroute_audio: false,
      css: "",
    },
    ...defaultSourceFields(),
  };
}

function faceCamSource(): ObsSource {
  return {
    name: FACE_CAM_SOURCE,
    uuid: randomUUID(),
    id: "av_capture_input_v2",
    versioned_id: "av_capture_input_v2",
    settings: {
      // device + device_name are intentionally empty — the user selects
      // their webcam in OBS after import. The plan accepts this as a
      // one-time manual step.
      device: "",
      device_name: "",
      use_preset: true,
      preset: "1280x720",
    },
    ...defaultSourceFields(),
  };
}

function screenCaptureSource(): ObsSource {
  return {
    name: SCREEN_CAPTURE_SOURCE,
    uuid: randomUUID(),
    id: "screen_capture",
    versioned_id: "screen_capture",
    settings: {
      // type 0 = display capture; user picks their display in OBS.
      type: 0,
      display_uuid: "",
      show_cursor: true,
      show_hidden_windows: false,
      show_empty_names: false,
      hide_obs: true,
    },
    ...defaultSourceFields(),
  };
}

function sceneItemFor(opts: {
  source: ObsSource;
  itemId: number;
  visible: boolean;
  pos: { x: number; y: number };
  bounds: { x: number; y: number };
  locked?: boolean;
}): SceneItem {
  return {
    name: opts.source.name,
    source_uuid: opts.source.uuid,
    visible: opts.visible,
    locked: opts.locked ?? false,
    rot: 0.0,
    pos: { x: opts.pos.x, y: opts.pos.y },
    scale: { x: 1.0, y: 1.0 },
    align: OBS_ALIGN_TOP_LEFT,
    bounds_type: OBS_BOUNDS_SCALE_INNER,
    bounds_align: 0,
    bounds: { x: opts.bounds.x, y: opts.bounds.y },
    scale_filter: "disable",
    blend_method: "default",
    blend_type: "normal",
    show_transition: { duration: 0, id: "fade_transition" },
    hide_transition: { duration: 0, id: "fade_transition" },
    private_settings: {},
    id: opts.itemId,
    group_item_backup: false,
  };
}

type SceneSource = ObsSource & { settings: { id_counter: number; custom_size: boolean; items: SceneItem[] } };

function sceneSource(opts: {
  name: string;
  items: SceneItem[];
}): SceneSource {
  const id_counter = opts.items.length
    ? Math.max(...opts.items.map((it) => it.id))
    : 0;
  return {
    name: opts.name,
    uuid: randomUUID(),
    id: "scene",
    versioned_id: "scene",
    settings: {
      id_counter,
      custom_size: false,
      items: opts.items,
    },
    ...defaultSourceFields(),
  };
}

function buildRecordingScene(): {
  scene: SceneSource;
  newSources: ObsSource[];
} {
  // Build the per-overlay browser sources, plus screen-capture + face-cam.
  const overlaySources = OVERLAYS
    // Boot transition is per-cold-open and not a recording scene fixture —
    // it lives in the Intro scene instead.
    .filter((o) => o.name !== "boot-transition")
    // V2 streaming overlays don't belong in the recording scene either.
    .filter((o) => o.name !== "intermission" && o.name !== "stream-ending-soon")
    .map((o) => ({ entry: o, source: browserSourceFor(o) }));

  const screenCap = screenCaptureSource();
  const faceCam = faceCamSource();

  // Layered back-to-front. OBS draws scene items in array order, so the
  // first item is the deepest layer and the last is the topmost.
  // Sort overlays by zOrder ascending; smaller zOrder is deeper.
  const sortedOverlays = [...overlaySources].sort(
    (a, b) => a.entry.zOrder - b.entry.zOrder,
  );

  let nextId = 1;
  const items: SceneItem[] = [];

  // Layer 1 (deepest): screen capture filling the canvas.
  items.push(
    sceneItemFor({
      source: screenCap,
      itemId: nextId++,
      visible: true,
      pos: { x: 0, y: 0 },
      bounds: { x: 1920, y: 1080 },
    }),
  );

  // Layer 2: face cam, positioned into the cockpit face cam port.
  items.push(
    sceneItemFor({
      source: faceCam,
      itemId: nextId++,
      visible: true,
      pos: { x: FACE_CAM_RECT.x, y: FACE_CAM_RECT.y },
      bounds: { x: FACE_CAM_RECT.w, y: FACE_CAM_RECT.h },
    }),
  );

  // Layers 3..n: each overlay browser source, ascending zOrder.
  for (const { entry, source } of sortedOverlays) {
    items.push(
      sceneItemFor({
        source,
        itemId: nextId++,
        visible: entry.defaultVisible,
        pos: { x: 0, y: 0 },
        bounds: { x: 1920, y: 1080 },
      }),
    );
  }

  const scene = sceneSource({ name: RECORDING_SCENE_NAME, items });

  return {
    scene,
    newSources: [
      screenCap,
      faceCam,
      ...sortedOverlays.map((s) => s.source),
    ],
  };
}

function buildPlaceholderScene(name: string, content?: ObsSource): SceneSource {
  const items: SceneItem[] = [];
  if (content) {
    items.push(
      sceneItemFor({
        source: content,
        itemId: 1,
        visible: true,
        pos: { x: 0, y: 0 },
        bounds: { x: 1920, y: 1080 },
      }),
    );
  }
  return sceneSource({ name, items });
}

function buildSceneCollection(): unknown {
  const recording = buildRecordingScene();
  // Streaming scene reuses the recording sources by reference (same UUIDs).
  // OBS treats this correctly — each scene_item gets its own id but the
  // underlying source is shared.
  const streamingItems = recording.scene.settings.items.map((it, idx) => ({
    ...it,
    id: idx + 1,
  }));
  const streaming = sceneSource({
    name: STREAMING_SCENE_NAME,
    items: streamingItems,
  });

  // Intermission and stream-ending-soon sources live in V2 scenes only.
  const intermissionEntry = OVERLAYS.find((o) => o.name === "intermission")!;
  const streamEndingEntry = OVERLAYS.find(
    (o) => o.name === "stream-ending-soon",
  )!;
  const bootEntry = OVERLAYS.find((o) => o.name === "boot-transition")!;

  const intermissionSource = browserSourceFor(intermissionEntry);
  const streamEndingSource = browserSourceFor(streamEndingEntry);
  const bootSource = browserSourceFor(bootEntry);

  const intro = buildPlaceholderScene(INTRO_SCENE_NAME, bootSource);
  const breakScene = buildPlaceholderScene(BREAK_SCENE_NAME, intermissionSource);
  const outro = buildPlaceholderScene(OUTRO_SCENE_NAME, streamEndingSource);

  const sources: ObsSource[] = [
    ...recording.newSources,
    bootSource,
    intermissionSource,
    streamEndingSource,
    recording.scene,
    streaming,
    intro,
    breakScene,
    outro,
  ];

  return {
    name: COLLECTION_NAME,
    version: 2,
    current_scene: RECORDING_SCENE_NAME,
    current_program_scene: RECORDING_SCENE_NAME,
    current_transition: "Fade",
    transitions: [],
    transition_duration: 300,
    groups: [],
    scene_order: [
      { name: RECORDING_SCENE_NAME },
      { name: STREAMING_SCENE_NAME },
      { name: INTRO_SCENE_NAME },
      { name: BREAK_SCENE_NAME },
      { name: OUTRO_SCENE_NAME },
    ],
    sources,
    saved_projectors: [],
    saved_multiview_projectors: [],
    modules: {},
    preview_locked: false,
    scaling_enabled: false,
    scaling_level: 0,
    scaling_off_x: 0.0,
    scaling_off_y: 0.0,
    quick_transitions: [
      { duration: 300, fade_to_black: false, hotkeys: [], id: 1, name: "Cut" },
      { duration: 300, fade_to_black: false, hotkeys: [], id: 2, name: "Fade" },
    ],
  };
}

async function main(): Promise<void> {
  const install = process.argv.includes("--install");

  const collection = buildSceneCollection();
  const json = JSON.stringify(collection, null, 2);

  await mkdir(dirname(DIST_OUT), { recursive: true });
  await writeFile(DIST_OUT, json + "\n", "utf8");
  console.log(`→ wrote ${DIST_OUT}`);

  if (install) {
    const installPath = join(OBS_SCENES_DIR, `${COLLECTION_NAME}.json`);
    await mkdir(OBS_SCENES_DIR, { recursive: true });
    await writeFile(installPath, json + "\n", "utf8");
    console.log(`→ installed to ${installPath}`);
    console.log(
      "  OBS will pick this up on next launch. To activate: OBS → Scene Collection → cc-lab.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
