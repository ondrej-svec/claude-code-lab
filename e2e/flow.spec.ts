import { expect, test } from "@playwright/test";

const password = "test-password";

test.describe("landing and language", () => {
  test("root redirects to /en and shows landing", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(en|cs)$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("language switcher toggles locale prefix", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "cs", exact: true }).click();
    await expect(page).toHaveURL("/cs");
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
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/error=invalid/);
    await expect(page.getByRole("alert")).toBeVisible();
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
    await page.goto("/en/login");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
  });

  test("lab index lists all eight chapters", async ({ page }) => {
    await page.goto("/en/lab");
    const chapterLinks = page.locator("a[href*='/en/lab/']");
    await expect(chapterLinks).toHaveCount(8 * 2);
  });

  test("chapter 1 renders and links to chapter 2", async ({ page }) => {
    await page.goto("/en/lab/before-we-start");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /before we start/i,
    );
    const next = page.getByRole("link", { name: /your first task/i });
    await expect(next).toBeVisible();
  });

  test("czech chapter renders in Czech", async ({ page }) => {
    await page.goto("/cs/login");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.goto("/cs/lab/before-we-start");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /než začneme/i,
    );
  });
});
