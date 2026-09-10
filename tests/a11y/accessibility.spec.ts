import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicRoutes } from "../browser-routes";

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" || viewport?.width !== 1440,
);

for (const route of publicRoutes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route.path} has no serious accessibility violations in ${theme} theme`, async ({
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
      const blocking = results.violations.filter(
        ({ impact }) => impact === "serious" || impact === "critical",
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  }
}
