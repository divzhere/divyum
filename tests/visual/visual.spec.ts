import { expect, test } from "@playwright/test";
import { publicRoutes } from "../browser-routes";

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" ||
    ![375, 390, 768, 1280, 1440, 1728].includes(viewport?.width ?? 0),
);

const routes = [
  ...publicRoutes,
  { path: "/journey?thread=technology", snapshot: "journey-technology" },
  ...(process.env.V3_DESIGN_LAB
    ? ["essay", "note", "book"].map((kind) => ({
        path: `/design/v3/reading/${kind}`,
        snapshot: `specimen-${kind}`,
      }))
    : []),
];

for (const route of routes) {
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
