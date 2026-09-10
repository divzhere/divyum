import { expect, test } from "@playwright/test";

// Run against the explicitly enabled local design lab. It is absent from
// production; the public-site suite verifies that exclusion separately.
test.skip(!process.env.V3_DESIGN_LAB, "isolated local design study");

for (const study of ["open-horizon", "facing-pages"]) {
  test(`${study} composes the name without clipping and keeps a working writing link`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/design/v3/${study}`);
    const title = page.getByRole("heading", {
      level: 1,
      name: "Divyum Bhumra",
    });
    await expect(title).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const layout = await title.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const letters = [...element.querySelectorAll("[data-name-word]")].map(
        (word) => {
          const r = word.getBoundingClientRect();
          return {
            left: r.left,
            right: r.right,
            width: word.scrollWidth,
            available: word.clientWidth,
          };
        },
      );
      return { left: box.left, right: box.right, width: innerWidth, letters };
    });
    expect(layout.left).toBeGreaterThanOrEqual(0);
    expect(layout.right).toBeLessThanOrEqual(layout.width);
    for (const word of layout.letters) {
      expect(word.left).toBeGreaterThanOrEqual(0);
      expect(word.right).toBeLessThanOrEqual(layout.width);
      expect(word.width).toBeLessThanOrEqual(word.available + 1);
    }
    await page
      .getByRole("link", { name: "Read the writing", exact: true })
      .click();
    await expect(page).toHaveURL(/\/essays$/);
  });

  test(`${study} remains meaningful without JavaScript`, async ({
    browser,
    baseURL,
    viewport,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport,
      baseURL,
    });
    const page = await context.newPage();
    await page.goto(`/design/v3/${study}`);
    await expect(
      page.getByRole("heading", { name: "Divyum Bhumra" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "I build software and write about technology, artificial intelligence, entrepreneurship, philosophy and consciousness.",
      ),
    ).toBeVisible();
    await expect(page.locator("[data-horizon]")).toBeVisible();
    await context.close();
  });
}

test("the signature settles by 1.4 seconds and is static with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/design/v3/open-horizon");
  const timeline = await page.locator("[data-signature]").evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => {
      const t = animation.effect!.getTiming();
      return {
        end: Number(t.delay) + Number(t.duration),
        iterations: t.iterations,
      };
    }),
  );
  expect(timeline.length).toBeGreaterThan(0);
  for (const animation of timeline) {
    expect(animation.end).toBeLessThanOrEqual(1400);
    expect(animation.iterations).toBe(1);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page
        .locator("[data-signature]")
        .evaluate((element) => element.getAnimations({ subtree: true }).length),
    )
    .toBe(0);
  await expect(
    page.getByRole("heading", { name: "Divyum Bhumra" }),
  ).toBeVisible();
});
