/**
 * render-streamdeck-icons.ts — generate per-button PNG icons.
 *
 * Reads the BUTTONS spec, loads streamdeck-icon-template.html in headless
 * Chromium with each button's accent + label as query params, captures a
 * 144×144 PNG (Stream Deck app accepts up to 144×144 and downscales to
 * 72×72 native). Output to scripts/streaming/dist/streamdeck-icons/.
 *
 * Usage:
 *   pnpm tsx scripts/streaming/render-streamdeck-icons.ts
 *   pnpm tsx scripts/streaming/render-streamdeck-icons.ts rec   # one shot
 */
import { chromium, type Browser } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { BUTTONS, ICON_ACCENTS, type Button } from "./streamdeck-spec";

const REPO_ROOT = resolve(__dirname, "..", "..");
const TEMPLATE = join(
  REPO_ROOT,
  "scripts",
  "streaming",
  "streamdeck-icon-template.html",
);
const OUT_DIR = join(
  REPO_ROOT,
  "scripts",
  "streaming",
  "dist",
  "streamdeck-icons",
);
const MANIFEST_OUT = join(OUT_DIR, "manifest.json");

const VIEWPORT = { width: 144, height: 144 } as const;

function iconKindFor(button: Button): string {
  if (button.label.toLowerCase().includes("rec")) return "rec";
  if (button.label.startsWith("/")) return "mono";
  if (button.label.startsWith("Ch.")) return "mono";
  return "default";
}

function iconNameFor(button: Button): string {
  // Stable filename derived from slot + the first ascii-word in the label.
  // Falls back to the button's action kind when the label is symbol-only.
  const slug = button.label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)[0];
  const slotPad = String(button.slot).padStart(2, "0");
  return `slot${slotPad}-${slug ?? button.action.kind}.png`;
}

async function renderOne(browser: Browser, button: Button): Promise<string> {
  const accent = ICON_ACCENTS[button.accent];
  const params = new URLSearchParams({
    label: button.label,
    bg: accent.bg,
    text: accent.text,
    border: accent.border,
    kind: iconKindFor(button),
  });
  const url = `${pathToFileURL(TEMPLATE).toString()}?${params.toString()}`;

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);

    const out = join(OUT_DIR, iconNameFor(button));
    await mkdir(dirname(out), { recursive: true });
    await page.screenshot({
      path: out,
      type: "png",
      omitBackground: true,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    });
    return out;
  } finally {
    await context.close();
  }
}

async function main(): Promise<void> {
  const filter = process.argv[2];
  const targets = filter
    ? BUTTONS.filter(
        (b) =>
          b.label.toLowerCase().includes(filter.toLowerCase()) ||
          iconNameFor(b).includes(filter.toLowerCase()),
      )
    : BUTTONS;

  if (targets.length === 0) {
    console.error(`No button matched '${filter}'.`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const written: { slot: number; label: string; icon: string; action: Button["action"]; hint: string }[] = [];
  try {
    for (const button of targets) {
      const out = await renderOne(browser, button);
      const iconRel = out.slice(OUT_DIR.length + 1);
      written.push({
        slot: button.slot,
        label: button.label,
        icon: iconRel,
        action: button.action,
        hint: button.hint,
      });
      console.log(`→ slot ${String(button.slot).padStart(2, "0")} · ${iconRel}`);
    }
  } finally {
    await browser.close();
  }

  // Write a small manifest.json next to the icons so the recording-setup
  // doc can show a button-by-button table without the user re-deriving it.
  if (!filter) {
    await writeFile(
      MANIFEST_OUT,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          layout: "Stream Deck MK.2 · 5×3",
          buttons: written.sort((a, b) => a.slot - b.slot),
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );
    console.log(`→ ${MANIFEST_OUT}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
