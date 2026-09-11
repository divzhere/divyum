import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicRoutes } from "../browser-routes";

test.skip(({ browserName }) => browserName !== "chromium");

for (const route of [...publicRoutes, { path: "/journey?thread=technology" }]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route.path} has no accessibility violations in ${theme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem("divyum-theme", selectedTheme);
      }, theme);
      await page.goto(route.path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(50);

      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations,
        JSON.stringify(results.violations, null, 2),
      ).toEqual([]);
    });
  }
}
