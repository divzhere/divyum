import { expect, test } from "@playwright/test";

test.skip(
  ({ viewport }) => viewport?.width !== 375,
  "one footer pass per engine",
);

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`the footer returns the horizon to its point with ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/");
    const line = page.locator(".footer-return-line");
    await expect(line).toHaveCount(1);
    const supported = await page.evaluate(() =>
      CSS.supports("animation-timeline", "view()"),
    );
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(page.locator(".footer-return-point")).toBeInViewport();
    if (supported && reducedMotion === "no-preference") {
      await expect
        .poll(() =>
          line.evaluate(
            (element) =>
              new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
          ),
        )
        .toBeLessThan(0.01);
    } else {
      await expect(line).toHaveCSS("transform", "none");
    }
  });
}
