/**
 * capture-web.ts — Playwright-driven web screenshots.
 *
 * Captures pages from the local dev server (localhost:3000) at a fixed
 * viewport, optionally in light and dark modes. Deterministic.
 *
 * Usage:
 *   pnpm dev                                 # in a separate terminal
 *   tsx scripts/capture/capture-web.ts       # run all web shots
 *
 * Each shot entry in `shots` below specifies URL, viewport, theme, output.
 */
import { chromium, type Browser, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

type Theme = "light" | "dark";

type Shot = {
  name: string;
  url: string;
  viewport: { width: number; height: number };
  theme: Theme;
  waitForSelector?: string;
  fullPage?: boolean;
  /** Override the default base URL — used for sample apps on other ports. */
  baseUrl?: string;
};

const REPO_ROOT = join(__dirname, "..", "..");
const OUT_DIR = join(REPO_ROOT, "public", "screenshots");
const BASE_URL = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

const shots: Shot[] = [
  {
    name: "web-lab-index-light",
    url: "/en/lab",
    viewport: { width: 1600, height: 1000 },
    theme: "light",
    waitForSelector: "h1",
  },
  {
    name: "web-lab-index-dark",
    url: "/en/lab",
    viewport: { width: 1600, height: 1000 },
    theme: "dark",
    waitForSelector: "h1",
  },
  {
    name: "sample-guide-calm-view",
    url: "/",
    viewport: { width: 1280, height: 980 },
    theme: "dark",
    waitForSelector: ".entry",
    baseUrl: "http://localhost:5173",
  },
  {
    name: "sample-guide-calm-view-dawn",
    url: "/",
    viewport: { width: 1280, height: 980 },
    theme: "light",
    waitForSelector: ".entry",
    baseUrl: "http://localhost:5173",
  },
];

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(t);
    html.style.colorScheme = t;
  }, theme);
}

async function captureShot(browser: Browser, shot: Shot) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    colorScheme: shot.theme,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  try {
    await setTheme(page, shot.theme);
    const base = shot.baseUrl ?? BASE_URL;
    await page.goto(`${base}${shot.url}`, { waitUntil: "load" });
    if (shot.waitForSelector) {
      await page.waitForSelector(shot.waitForSelector, { timeout: 15_000 });
    }
    // Settle fonts + images. Dev server has HMR websocket so we can't wait
    // for networkidle — give fonts and images a moment instead.
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    const output = join(OUT_DIR, `${shot.name}.png`);
    await mkdir(dirname(output), { recursive: true });
    await page.screenshot({
      path: output,
      fullPage: shot.fullPage ?? false,
      type: "png",
    });
    console.log(`→ ${shot.name} (${shot.theme}) → ${output}`);
  } finally {
    await context.close();
  }
}

async function main() {
  const filter = process.argv[2];
  const targets = filter ? shots.filter((s) => s.name === filter) : shots;
  if (targets.length === 0) {
    console.error(`No shot matched '${filter}'.`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  try {
    for (const shot of targets) {
      await captureShot(browser, shot);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
