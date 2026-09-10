import { expect, test } from "@playwright/test";
import { publicRoutes } from "../browser-routes";

test.skip(({ viewport }) => viewport?.width !== 375);

test("the approved hero stays readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByText(
      "I build software and write about technology, artificial intelligence, entrepreneurship, philosophy and consciousness.",
    ),
  ).toBeVisible();
  await expect(page.locator(".hero-point")).toBeVisible();
  await expect(page.locator(".hero-horizon")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Currently" })).toBeVisible();
  await expect(page.locator(".currently-row")).toHaveCount(4);
  await context.close();
});

for (const preference of ["reduce", "no-preference"] as const) {
  test(`motion respects ${preference} from the first frame and on navigation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: preference });
    await page.addInitScript(() => {
      const started: string[] = [];
      Object.assign(window, { startedMotion: started });
      document.addEventListener("animationstart", (event) => {
        started.push(event.animationName);
      });
      const original = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        started.push(this.className.toString());
        return original.apply(this, args);
      };
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    if (preference === "no-preference") {
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as unknown as { startedMotion: string[] }).startedMotion,
          ),
        )
        .toContain("hero-horizon");
      await expect
        .poll(() => page.evaluate(() => document.getAnimations().length))
        .toBe(0);
      await page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Frameworks" })
        .click();
      await expect(
        page.getByRole("heading", { name: "Frameworks", exact: true }),
      ).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              (window as unknown as { startedMotion: string[] }).startedMotion,
          ),
        )
        .toContain("editorial-reveal");
    } else {
      for (const route of publicRoutes) {
        await page.goto(route.path);
        await page.waitForLoadState("networkidle");
        expect(
          await page.evaluate(
            () =>
              (window as unknown as { startedMotion: string[] }).startedMotion,
          ),
        ).toEqual([]);
      }
    }
  });
}
