import { expect, test } from "@playwright/test";

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" || viewport?.width !== 375,
);
test.skip(
  process.env.V3_DESIGN_LAB === "1",
  "run against the normal release build",
);

for (const path of [
  "/design/v3/open-horizon",
  "/design/v3/facing-pages",
  "/design/v3/reading/essay",
  "/design/v3/reading/note",
  "/design/v3/reading/book",
]) {
  test(`${path} is absent from a release build`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]').first(),
    ).toHaveAttribute("content", /noindex/);
    await expect(
      page.getByRole("heading", { name: /Reading specimen/ }),
    ).toHaveCount(0);
  });
}
