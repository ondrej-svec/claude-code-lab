/**
 * render-overlays.ts — Phase 2 fallback asset renderer.
 *
 * Reads scripts/streaming/overlay-manifest.ts and produces a PNG (static
 * overlays) or an MP4 (animated overlays) for each entry under
 * public/visuals/overlays/. The HTML files in scripts/streaming/overlays/
 * are the single source of truth — these PNG/MP4s are fallbacks for cases
 * where OBS browser sources can't be used (rendering into Descript stills,
 * embedding in lab content, archival).
 *
 * Static path:  Playwright headless Chromium → page.screenshot({omitBackground})
 * Animated path: Playwright video recording (WebM) → ffmpeg → MP4 (yuv420p)
 *
 * Usage:
 *   pnpm tsx scripts/streaming/render-overlays.ts
 *   pnpm tsx scripts/streaming/render-overlays.ts dictation-indicator   # one shot
 */
import { chromium, type Browser } from "@playwright/test";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import {
  DEFAULT_VIEWPORT,
  OVERLAYS,
  type OverlayManifestEntry,
} from "./overlay-manifest";

const execFileP = promisify(execFile);

const REPO_ROOT = resolve(__dirname, "..", "..");
const OVERLAY_DIR = join(REPO_ROOT, "scripts", "streaming", "overlays");
const OUT_DIR = join(REPO_ROOT, "public", "visuals", "overlays");

async function settlePage(page: import("@playwright/test").Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle").catch(() => {
    /* file:// loads rarely emit networkidle; ignore. */
  });
  await page.waitForTimeout(200);
}

async function renderStatic(
  browser: Browser,
  entry: OverlayManifestEntry,
): Promise<string> {
  const viewport = entry.viewport ?? DEFAULT_VIEWPORT;
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  try {
    const fileUrl = pathToFileURL(
      join(OVERLAY_DIR, `${entry.name}.html`),
    ).toString();
    await page.goto(fileUrl, { waitUntil: "load" });
    await settlePage(page);

    const out = join(OUT_DIR, `${entry.name}.png`);
    await mkdir(dirname(out), { recursive: true });
    await page.screenshot({
      path: out,
      type: "png",
      omitBackground: true,
      fullPage: false,
      clip: { x: 0, y: 0, width: viewport.width, height: viewport.height },
    });
    return out;
  } finally {
    await context.close();
  }
}

async function renderAnimated(
  browser: Browser,
  entry: OverlayManifestEntry,
): Promise<string> {
  if (!entry.durationMs) {
    throw new Error(
      `Animated overlay '${entry.name}' missing durationMs in manifest.`,
    );
  }
  const viewport = entry.viewport ?? DEFAULT_VIEWPORT;

  // Playwright records WebM into the context's recordVideo dir. We capture
  // into a temp dir, rename to a stable WebM, then ffmpeg to MP4.
  const workDir = await mkdtemp(join(tmpdir(), "cc-lab-overlay-"));
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1, // 1080p source is enough; 2x bloats WebM with no gain
    colorScheme: "dark",
    recordVideo: { dir: workDir, size: viewport },
  });
  const page = await context.newPage();
  try {
    const fileUrl = pathToFileURL(
      join(OVERLAY_DIR, `${entry.name}.html`),
    ).toString();
    await page.goto(fileUrl, { waitUntil: "load" });
    await settlePage(page);

    // Animation is already running by the time we settle. Hold for the
    // declared duration so the recording captures one full loop / playback.
    await page.waitForTimeout(entry.durationMs);

    // Closing the page flushes the WebM; the file is finalised after
    // context.close() resolves.
    const videoHandle = page.video();
    await page.close();
    await context.close();
    if (!videoHandle) {
      throw new Error(`Playwright did not start a video for '${entry.name}'.`);
    }
    const webmPath = await videoHandle.path();

    const mp4Out = join(OUT_DIR, `${entry.name}.mp4`);
    await mkdir(dirname(mp4Out), { recursive: true });
    // -movflags +faststart for web-friendly playback; -an because all
    // overlays are silent.
    await execFileP("ffmpeg", [
      "-y",
      "-i",
      webmPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "slow",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      "-an",
      mp4Out,
    ]);

    return mp4Out;
  } finally {
    // Best-effort cleanup of the temp work dir.
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function renderOne(
  browser: Browser,
  entry: OverlayManifestEntry,
): Promise<void> {
  const start = Date.now();
  const out =
    entry.kind === "animated"
      ? await renderAnimated(browser, entry)
      : await renderStatic(browser, entry);
  const ms = Date.now() - start;
  console.log(`→ ${entry.name.padEnd(28)} ${entry.kind.padEnd(9)} ${out}  (${ms}ms)`);
}

/**
 * Per-episode boot variants. Each entry re-renders boot-transition.html
 * with custom query-param copy and writes to public/visuals/<outName>.mp4.
 * The Phase 2 preview gate calls for series-boot-ep01.mp4 specifically.
 */
type EpisodeBoot = {
  outName: string; // basename under public/visuals/, no extension
  query: string; // appended to boot-transition.html?…
  durationMs: number;
};

const EPISODE_BOOTS: EpisodeBoot[] = [
  {
    outName: "series-boot-ep01",
    // Default copy already matches Ep 1 ("the lab is now open"), but pin
    // it explicitly here so a future tweak to the default doesn't change
    // the per-episode artifact behind our backs.
    query:
      "l1=%3E%20initializing%20sub-etha%20relay%E2%80%A6&l2=%3E%20infinite%20improbability%20drive%3A%20stable&l3=%3E%20the%20lab%20is%20now%20open",
    durationMs: 3000,
  },
];

async function renderEpisodeBoot(
  browser: Browser,
  ep: EpisodeBoot,
): Promise<string> {
  const viewport = DEFAULT_VIEWPORT;
  const workDir = await mkdtemp(join(tmpdir(), "cc-lab-epboot-"));
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: { dir: workDir, size: viewport },
  });
  const page = await context.newPage();
  try {
    const fileUrl = `${pathToFileURL(
      join(OVERLAY_DIR, "boot-transition.html"),
    ).toString()}?${ep.query}`;
    await page.goto(fileUrl, { waitUntil: "load" });
    await settlePage(page);
    await page.waitForTimeout(ep.durationMs);

    const videoHandle = page.video();
    await page.close();
    await context.close();
    if (!videoHandle) {
      throw new Error(
        `Playwright did not start a video for episode boot '${ep.outName}'.`,
      );
    }
    const webmPath = await videoHandle.path();

    const mp4Out = join(REPO_ROOT, "public", "visuals", `${ep.outName}.mp4`);
    await mkdir(dirname(mp4Out), { recursive: true });
    await execFileP("ffmpeg", [
      "-y",
      "-i",
      webmPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "slow",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      "-an",
      mp4Out,
    ]);
    return mp4Out;
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function main(): Promise<void> {
  const filter = process.argv[2];
  const targets = filter
    ? OVERLAYS.filter((o) => o.name.includes(filter))
    : OVERLAYS;

  if (targets.length === 0) {
    console.error(`No overlay matched '${filter}'.`);
    process.exit(1);
  }

  // ffmpeg presence check before launching a browser — fail fast.
  await execFileP("ffmpeg", ["-version"]).catch(() => {
    throw new Error(
      "ffmpeg not found on PATH. Install via `brew install ffmpeg`.",
    );
  });

  const browser = await chromium.launch();
  try {
    for (const entry of targets) {
      try {
        await renderOne(browser, entry);
      } catch (err) {
        console.error(`✗ ${entry.name}: ${(err as Error).message}`);
        throw err;
      }
    }

    // Per-episode boot variants. Skip when filtering to a single overlay
    // that isn't boot-related, otherwise always run.
    const runEpisodeBoots = !filter || filter.includes("boot");
    if (runEpisodeBoots) {
      for (const ep of EPISODE_BOOTS) {
        const start = Date.now();
        const out = await renderEpisodeBoot(browser, ep);
        const ms = Date.now() - start;
        console.log(
          `→ ${ep.outName.padEnd(28)} ${"boot-ep".padEnd(9)} ${out}  (${ms}ms)`,
        );
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
