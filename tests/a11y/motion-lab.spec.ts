import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/motion/paper-depth",
  "/motion/point-line",
  "/motion/instrument",
] as const;

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" || viewport?.width !== 1440,
);

for (const route of routes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route} has no serious accessibility violations in ${theme}`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem("divyum-theme", selectedTheme);
      }, theme);
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter(
        ({ impact }) => impact === "serious" || impact === "critical",
      );
      expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
    });
  }
}
