import { expect, test, type Page } from "@playwright/test";
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

test("switching to reduced motion finishes an in-flight rule", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const animation = original.apply(this, args);
      if (
        this.classList.contains("hero-horizon") ||
        this.classList.contains("hero-point")
      ) {
        animation.pause();
      }
      return animation;
    };
  });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "paused").length,
      ),
    )
    .toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-point")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-horizon")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)",
  );
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(0);
});

async function recordStartedMotion(page: Page) {
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
}

test("motion respects no-preference from the first frame and on navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await recordStartedMotion(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { startedMotion: string[] }).startedMotion,
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
        () => (window as unknown as { startedMotion: string[] }).startedMotion,
      ),
    )
    .toContain("editorial-reveal");
});

// Give each route its own bounded test instead of sharing one 30-second
// deadline across thirteen navigations, font loads and idle checks.
for (const route of publicRoutes) {
  test(`reduced motion starts no animations on ${route.path}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await recordStartedMotion(page);
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");
    expect(
      await page.evaluate(
        () => (window as unknown as { startedMotion: string[] }).startedMotion,
      ),
    ).toEqual([]);
  });
}
