/**
 * render-preview.ts — Phase 1 cohesion-test preview renderer.
 *
 * Loads each preview/*.html in headless Chromium at 1920×1080 with
 * deviceScaleFactor 2 (retina) and writes PNG screenshots to
 * public/screenshots/series-*.png. The four output PNGs are the
 * Phase 1 visual review gate per the video-series-identity plan.
 *
 * Usage:
 *   pnpm tsx scripts/streaming/render-preview.ts
 *   pnpm tsx scripts/streaming/render-preview.ts cockpit-full   # one shot
 */
import { chromium, type Browser } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const REPO_ROOT = resolve(__dirname, "..", "..");
const PREVIEW_DIR = join(REPO_ROOT, "scripts", "streaming", "preview");
const OUT_DIR = join(REPO_ROOT, "public", "screenshots");

type Preview = {
  /** File in scripts/streaming/preview/. */
  source: string;
  /** PNG basename written under public/screenshots/. */
  outName: string;
};

const previews: Preview[] = [
  { source: "title-card-ep01.html", outName: "series-titlecard-ep01" },
  { source: "thumbnail-ep01.html", outName: "series-thumbnail-ep01" },
  { source: "cockpit-full.html", outName: "series-cockpit-full" },
  { source: "end-card-ep01.html", outName: "series-endcard-ep01" },
  {
    source: "cockpit-full-with-content.html",
    outName: "series-cockpit-with-content",
  },
];

const VIEWPORT = { width: 1920, height: 1080 } as const;

async function renderOne(browser: Browser, preview: Preview): Promise<void> {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  try {
    const fileUrl = pathToFileURL(join(PREVIEW_DIR, preview.source)).toString();
    await page.goto(fileUrl, { waitUntil: "load" });

    // Settle web fonts (Google Fonts via overlay-palette.css) and remote
    // chapter-ship image fetched from cc-lab.ondrejsvec.com.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("networkidle").catch(() => {
      /* networkidle is best-effort on file:// loads */
    });
    await page.waitForTimeout(400);

    const out = join(OUT_DIR, `${preview.outName}.png`);
    await mkdir(dirname(out), { recursive: true });
    await page.screenshot({
      path: out,
      type: "png",
      fullPage: false,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    });
    console.log(`→ ${preview.outName} → ${out}`);
  } finally {
    await context.close();
  }
}

async function main(): Promise<void> {
  const filter = process.argv[2];
  const targets = filter
    ? previews.filter(
        (p) => p.source.includes(filter) || p.outName.includes(filter),
      )
    : previews;

  if (targets.length === 0) {
    console.error(`No preview matched '${filter}'.`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  try {
    for (const p of targets) {
      await renderOne(browser, p);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
