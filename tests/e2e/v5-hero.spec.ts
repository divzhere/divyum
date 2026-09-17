import { expect, test } from "@playwright/test";

/*
  The living manuscript: at rest the hero is print; with a fine pointer over
  it a 5px marker rides the horizon and the name leans toward it; नमस्ते is
  drawn at the origin; the presence line shows India's clock and, elsewhere,
  the reader's own. Everything is static under reduced motion and without JS.
*/

const identity = (transform: string) =>
  transform === "none" ||
  /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(transform) ||
  /^matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1\)$/.test(
    transform,
  );

test("a pointer over the hero wakes the marker and leans the name; leaving settles it back to print", async ({
  browserName,
  page,
  viewport,
}) => {
  test.skip(
    browserName !== "chromium" || viewport?.width !== 1440,
    "pointer choreography is checked once",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.waitForTimeout(1300);
  const hero = page.locator(".home-hero");
  const marker = page.locator(".hero-marker");
  const firstLine = page.locator(".hero-name-line").first();
  await expect(marker).toHaveCSS("opacity", "0");
  expect(
    identity(await firstLine.evaluate((n) => getComputedStyle(n).transform)),
  ).toBe(true);

  const box = (await hero.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.mouse.move(box.x + box.width * 0.85, box.y + box.height * 0.5);
  await expect(hero).toHaveAttribute("data-awake", "");
  await expect(marker).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      marker.evaluate(
        (n) => new DOMMatrixReadOnly(getComputedStyle(n).transform).e,
      ),
    )
    .toBeGreaterThan(200);
  await expect
    .poll(() => firstLine.evaluate((n) => getComputedStyle(n).transform))
    .not.toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  // The measured geometry stays put: point, horizon and spine are untouched.
  expect(
    identity(
      await page
        .locator(".home-hero .hero-horizon")
        .evaluate((n) => getComputedStyle(n).transform),
    ),
  ).toBe(true);
  await expect(page.locator(".hero-spine")).toHaveCSS(
    "transform",
    "matrix(-1, 0, 0, -1, 0, 0)",
  );

  await page.mouse.move(4, 4);
  await expect(hero).not.toHaveAttribute("data-awake", "");
  await expect(marker).toHaveCSS("opacity", "0");
  await expect
    .poll(() => firstLine.evaluate((n) => getComputedStyle(n).transform))
    .toMatch(
      /^(none|matrix\(1, 0, 0, 1, 0, 0\)|matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1\))$/,
    );
});

test("under reduced motion the hero never wakes", async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 1440, "one reduced-motion pass per engine");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator(".home-hero");
  const box = (await hero.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
  await page.waitForTimeout(150);
  await expect(hero).not.toHaveAttribute("data-awake", "");
  await expect(page.locator(".hero-marker")).toHaveCSS("opacity", "0");
  expect(
    identity(
      await page
        .locator(".hero-name-line")
        .first()
        .evaluate((n) => getComputedStyle(n).transform),
    ),
  ).toBe(true);
});

test("namaste is drawn at the origin, readable, and complete without JavaScript", async ({
  browser,
  baseURL,
  viewport,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const namaste = page.getByRole("img", { name: "Namaste" });
  await expect(namaste).toBeVisible();
  const [word, location] = await Promise.all([
    namaste.boundingBox(),
    page.locator(".hero-location").boundingBox(),
  ]);
  expect(Math.abs(word!.x - location!.x)).toBeLessThanOrEqual(1);
  expect(word!.height).toBeGreaterThan(14);
  expect(word!.width / word!.height).toBeGreaterThan(2);
  await expect(namaste).toHaveCSS("clip-path", "none");

  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport,
  });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(staticPage.getByRole("img", { name: "Namaste" })).toBeVisible();
  await expect(staticPage.locator(".hero-marker")).toHaveCSS("opacity", "0");
  await expect(staticPage.locator(".hero-time-slot")).toHaveText(
    "IST · UTC +5:30",
  );
  await context.close();
});

test("the greeting draws itself inside the arrival budget", async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 375, "one choreography pass per engine");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const timing = await page.locator(".hero-namaste").evaluate((node) =>
    node.getAnimations().map((a) => {
      const t = a.effect!.getTiming();
      return {
        end: Number(t.delay) + Number(t.duration),
        iterations: t.iterations,
      };
    }),
  );
  expect(timing).toHaveLength(1);
  expect(timing[0].end).toBe(1150);
  expect(timing[0].iterations).toBe(1);
});

test("the presence line shows India's clock and the reader's own only when they differ", async ({
  browser,
  baseURL,
  viewport,
}) => {
  test.skip(viewport?.width !== 1440, "one presence pass per engine");
  for (const [timezoneId, expectHere] of [
    ["Europe/London", true],
    ["Asia/Kolkata", false],
  ] as const) {
    const context = await browser.newContext({ baseURL, viewport, timezoneId });
    const page = await context.newPage();
    await page.clock.setFixedTime(new Date("2026-09-17T02:23:00Z"));
    await page.goto("/");
    await expect(page.locator(".hero-time-slot")).toHaveText("07:53 IST");
    if (expectHere) {
      await expect(page.locator(".hero-time-here")).toContainText("03:23 here");
    } else {
      await expect(page.locator(".hero-time-here")).toHaveCount(0);
    }
    await context.close();
  }
});

test("each chapter's point arrives from the origin column as it scrolls in", async ({
  browserName,
  page,
  viewport,
}) => {
  test.skip(
    browserName !== "chromium" || viewport?.width !== 1440,
    "scroll timeline checked once",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const supported = await page.evaluate(() =>
    CSS.supports("animation-timeline", "view()"),
  );
  test.skip(!supported, "scroll-driven animations unavailable");
  const pseudo = (prop: string) =>
    page.evaluate(
      (p) =>
        getComputedStyle(
          document.querySelector('[aria-labelledby="journey-title"]')!,
          "::before",
        ).getPropertyValue(p),
      prop,
    );
  expect(await pseudo("animation-timeline")).toBe("--chapter");
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect.poll(() => pseudo("transform")).toBe("matrix(1, 0, 0, 1, 0, 0)");

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await pseudo("animation-name")).toBe("none");
});
