import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3103";
const viewports = [
  ["375", 375, 812],
  ["390", 390, 844],
  ["768", 768, 1024],
  ["1024", 1024, 900],
  ["1280", 1280, 900],
  ["1440", 1440, 1000],
  ["1728", 1728, 1117],
] as const;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [["line"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  snapshotPathTemplate: "{testDir}/visual/__screenshots__/{arg}{ext}",
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm start --port 3103",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    ...viewports.map(([name, width, height]) => ({
      name: `chromium-${name}`,
      use: { ...devices["Desktop Chrome"], viewport: { width, height } },
    })),
    ...viewports
      .filter(([name]) => name !== "1280")
      .map(([name, width, height]) => ({
        name: `webkit-${name}`,
        use: { ...devices["Desktop Safari"], viewport: { width, height } },
      })),
  ],
});
