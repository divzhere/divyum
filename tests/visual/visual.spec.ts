import { expect, test } from "@playwright/test";
import { publicRoutes } from "../browser-routes";

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" ||
    ![375, 768, 1440].includes(viewport?.width ?? 0),
);

for (const route of publicRoutes) {
  for (const theme of ["light", "dark"] as const) {
    test(`${route.path} matches its ${theme} visual baseline`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem("divyum-theme", selectedTheme);
      }, theme);
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);
      const width = testInfo.project.use.viewport?.width;

      await expect(page).toHaveScreenshot(
        `${route.snapshot}-${width}-${theme}.png`,
        {
          animations: "disabled",
          caret: "hide",
          fullPage: true,
          // Reduced motion renders the complete, static point-and-rule composition.
        },
      );
    });
  }
}
