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
      // The hero clock reads 14:09 IST in every baseline.
      await page.clock.setFixedTime(new Date("2026-09-11T08:39:00Z"));
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await page.addInitScript((selectedTheme) => {
        localStorage.setItem("divyum-theme", selectedTheme);
      }, theme);
      await page.goto(route.path);
      await page.evaluate(() => document.fonts.ready);
      if (route.snapshot === "journey-technology") {
        await expect(
          page.getByRole("checkbox", { name: /^Technology/ }),
        ).toBeChecked();
        await expect(page.locator(".journey-chapter")).toHaveCount(6);
      }
      if (route.snapshot === "journey") {
        const travelMaps = page.locator(".journey-travel-map-card img");
        await expect(travelMaps).toHaveCount(2);
        await travelMaps.last().scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            travelMaps.evaluateAll((images) =>
              images.every(
                (image) =>
                  image instanceof HTMLImageElement &&
                  image.complete &&
                  image.naturalWidth > 0,
              ),
            ),
          )
          .toBe(true);
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      if (route.snapshot === "resume") {
        const previews = page.locator('img[src*="divyum-bhumra-resume-page-"]');
        await expect(previews).toHaveCount(2);
        await expect
          .poll(() =>
            previews.evaluateAll((images) =>
              images.every(
                (image) =>
                  image instanceof HTMLImageElement &&
                  image.complete &&
                  image.naturalWidth > 0,
              ),
            ),
          )
          .toBe(true);
      }
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
