import { expect, test } from "@playwright/test";

test.describe("landing and language", () => {
  test("root redirects to a locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(en|cs)$/);
  });

  test("landing renders an h1", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("main h1").first()).toBeVisible();
  });

  test("language switcher toggles locale prefix", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "cs", exact: true }).click();
    await expect(page).toHaveURL(/\/cs(\?.*)?$/);
  });
});

test.describe("chapter navigation", () => {
  test("lab index lists all chapters", async ({ page }) => {
    await page.goto("/en/lab");
    const chapterCards = page.locator("main a[href*='/en/lab/']");
    await expect(chapterCards).toHaveCount(10);
  });

  test("chapter 1 renders and links to chapter 2", async ({ page }) => {
    await page.goto("/en/lab/before-we-start");
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText(/before we start/i);
    const next = page
      .locator("nav[aria-label='Chapter navigation']")
      .getByRole("link", { name: /your first task/i });
    await expect(next).toBeVisible();
  });

  test("czech chapter renders in Czech", async ({ page }) => {
    await page.goto("/cs/lab/before-we-start");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /než začneme/i,
    );
  });
});
