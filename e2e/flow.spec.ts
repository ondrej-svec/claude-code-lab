import { expect, test } from "@playwright/test";

const password = "test-password";

async function unlock(page: Awaited<ReturnType<typeof test.step>> extends never ? never : Parameters<Parameters<typeof test>[1]>[0]["page"], locale: "en" | "cs" = "en") {
  await page.goto(`/${locale}/login`);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(new RegExp(`/${locale}(/.*)?$`));
}

test.describe("landing and language", () => {
  test("root redirects to login when unauthenticated", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/");
    // Root → /{locale} → /{locale}/login
    await expect(page).toHaveURL(/\/(en|cs)\/login/);
  });

  test("landing h1 visible after unlock", async ({ page }) => {
    await unlock(page, "en");
    await page.goto("/en");
    await expect(page.locator("main h1").first()).toBeVisible();
  });

  test("language switcher toggles locale prefix", async ({ page }) => {
    await unlock(page, "en");
    await page.goto("/en");
    await page.getByRole("link", { name: "cs", exact: true }).click();
    await expect(page).toHaveURL(/\/cs(\?.*)?$/);
  });
});

test.describe("auth flow", () => {
  test("protected routes redirect to /login when unauthenticated", async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto("/en/lab");
    await expect(page).toHaveURL(/\/en\/login/);
  });

  test("wrong password shows an error", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/en/login");
    await page.fill('input[name="password"]', "nope");
    await Promise.all([
      page.waitForURL(/error=invalid/),
      page.click('button[type="submit"]'),
    ]);
    await expect(page.locator("p[role='alert']")).toBeVisible();
  });

  test("correct password unlocks the lab", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/en/login");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).not.toHaveURL(/login/);
  });
});

test.describe("chapter navigation", () => {
  test.beforeEach(async ({ page }) => {
    await unlock(page, "en");
  });

  test("lab index lists all eight chapters", async ({ page }) => {
    await page.goto("/en/lab");
    // Only count cards in the main column, not the left sidebar.
    const chapterCards = page.locator("main a[href*='/en/lab/']");
    await expect(chapterCards).toHaveCount(8);
  });

  test("chapter 1 renders and links to chapter 2", async ({ page }) => {
    await page.goto("/en/lab/before-we-start");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText(/before we start/i);
    // The chapter-navigation footer link specifically (prev/next cards).
    const next = page
      .locator("nav[aria-label='Chapter navigation']")
      .getByRole("link", { name: /your first task/i });
    await expect(next).toBeVisible();
  });

  test("czech chapter renders in Czech", async ({ page }) => {
    await unlock(page, "cs");
    await page.goto("/cs/lab/before-we-start");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /než začneme/i,
    );
  });
});
