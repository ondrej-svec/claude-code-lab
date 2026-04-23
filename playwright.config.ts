import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `pnpm build && pnpm start -p ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      WORKSHOP_PASSWORD: "test-password",
      COOKIE_SECRET: "test-secret-1234567890abcdef",
    },
  },
});
