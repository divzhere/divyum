import { expect, test } from "@playwright/test";

/*
  The signature composition: one origin (--horizon-start) for the second name
  line, the point, and the presence block; the rule runs beneath the caps; the
  clock and spine join the arrival without extending it.
*/

const wide = ({ viewport }: { viewport: { width: number } | null }) =>
  viewport?.width !== 1440;
const phone = ({ viewport }: { viewport: { width: number } | null }) =>
  viewport?.width !== 375;

async function heroGeometry(page: import("@playwright/test").Page) {
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(() => {
    const rect = (selector: string) =>
      document.querySelector(selector)!.getBoundingClientRect();
    const words = document.querySelectorAll("[data-name-word]");
    const second = words[1].getBoundingClientRect();
    // Baseline of the second line: a zero-height inline probe placed at the
    // end of the word sits exactly on its baseline.
    const probe = document.createElement("span");
    probe.style.cssText =
      "display:inline-block;width:0;height:0;vertical-align:baseline";
    words[1].append(probe);
    const baseline = probe.getBoundingClientRect().top;
    probe.remove();
    const fontSize = parseFloat(getComputedStyle(words[1]).fontSize);
    return {
      secondLeft: second.left,
      baseline,
      fontSize,
      point: rect(".home-hero .hero-point"),
      horizon: rect(".home-hero .hero-horizon"),
      location: rect(".hero-location"),
      time: rect(".hero-time"),
      hero: rect(".home-hero"),
    };
  });
}

test("the point sits at the corner of the second name line and the rule beneath its caps", async ({
  page,
  viewport,
}) => {
  test.skip(
    wide({ viewport }),
    "composition measured once, on the wide layout",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const g = await heroGeometry(page);
  expect(Math.abs(g.point.left - g.secondLeft)).toBeLessThanOrEqual(4);
  expect(Math.abs(g.location.left - g.secondLeft)).toBeLessThanOrEqual(4);
  expect(Math.abs(g.time.left - g.secondLeft)).toBeLessThanOrEqual(4);
  // The horizon underlines BHUMRA: 1px to 0.08em below the baseline, never cutting it.
  expect(g.horizon.top - g.baseline).toBeGreaterThanOrEqual(1);
  expect(g.horizon.top - g.baseline).toBeLessThanOrEqual(g.fontSize * 0.08);
  expect(Math.abs(g.point.top + 4.5 - (g.horizon.top + 0.5))).toBeLessThan(1.5);
  expect(g.point.width).toBe(9);
});

test("on a phone the origin returns to the first column", async ({
  page,
  viewport,
}) => {
  test.skip(phone({ viewport }), "phone composition");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const g = await heroGeometry(page);
  expect(Math.abs(g.point.left - g.hero.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(g.secondLeft - g.hero.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(g.location.left - g.hero.left)).toBeLessThanOrEqual(1);
  expect(g.horizon.top - g.baseline).toBeGreaterThanOrEqual(1);
  expect(g.horizon.top - g.baseline).toBeLessThanOrEqual(g.fontSize * 0.08);
});

test("the margin spine is decorative, reads bottom-up and appears only on wide screens", async ({
  page,
  viewport,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const spine = page.locator(".hero-spine");
  await expect(spine).toHaveAttribute("aria-hidden", "true");
  await expect(spine).toHaveText("Divyum Bhumra — Est. Punjab");
  if ((viewport?.width ?? 0) >= 1100) {
    await expect(spine).toBeVisible();
    await expect(spine).toHaveCSS("writing-mode", "vertical-rl");
    await expect(spine).toHaveCSS("transform", "matrix(-1, 0, 0, -1, 0, 0)");
    const [spineBox, support, hero] = await Promise.all([
      spine.boundingBox(),
      page.locator(".hero-support").boundingBox(),
      page.locator(".home-hero").boundingBox(),
    ]);
    expect(spineBox!.x + spineBox!.width).toBeLessThanOrEqual(
      hero!.x + hero!.width + 1,
    );
    expect(
      Math.abs(spineBox!.y + spineBox!.height - (support!.y + support!.height)),
    ).toBeLessThanOrEqual(2);
  } else {
    await expect(spine).toBeHidden();
  }
});

test("the presence line names the reference zone without JavaScript and ticks with it", async ({
  browser,
  baseURL,
  viewport,
  page,
}) => {
  test.skip(phone({ viewport }), "one presence check per engine");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport,
  });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  const slot = staticPage.locator(".hero-time-slot");
  await expect(slot).toHaveText("IST · UTC +5:30");
  const staticWidth = (await staticPage.locator(".hero-time").boundingBox())!
    .width;
  await context.close();

  await page.clock.setFixedTime(new Date("2026-09-11T18:31:00Z"));
  await page.goto("/");
  await expect(page.locator(".hero-time-slot")).toHaveText("00:01 IST");
  await expect(page.locator(".hero-time-slot")).toHaveText(/^\d{2}:\d{2} IST$/);
  expect(
    await page.locator(".hero-time").evaluate((node) => node.textContent),
  ).not.toMatch(/^24:/);
  const liveWidth = (await page.locator(".hero-time").boundingBox())!.width;
  expect(Math.abs(liveWidth - staticWidth)).toBeLessThanOrEqual(1);
});

test("the arrival still settles by 1,150ms, runs once, and the first click lands on real material", async ({
  page,
  viewport,
}) => {
  test.skip(phone({ viewport }), "one choreography check per engine");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const timeline = await page.locator("[data-signature]").evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => {
      const timing = animation.effect!.getTiming();
      return {
        end: Number(timing.delay) + Number(timing.duration),
        iterations: timing.iterations,
      };
    }),
  );
  expect(timeline.length).toBeGreaterThanOrEqual(5);
  for (const animation of timeline) {
    expect(animation.end).toBeLessThanOrEqual(1150);
    expect(animation.iterations).toBe(1);
  }
  await expect(
    page.getByRole("link", { name: "Explore the frameworks", exact: true }),
  ).toHaveAttribute("href", "/frameworks");
  await expect(page.locator(".hero-spine")).toHaveCSS("opacity", "1");
});
