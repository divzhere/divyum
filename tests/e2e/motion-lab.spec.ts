import { expect, test } from "@playwright/test";

const routes = [
  "/motion/paper-depth",
  "/motion/point-line",
  "/motion/instrument",
] as const;

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" || viewport?.width !== 375,
);

for (const route of routes) {
  test(`${route} is readable, private and contained`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: "Divyum Bhumra" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    const overflow = await page.evaluate(
      () =>
        Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
        ) - innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test("motion labs keep their content without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { name: "Divyum Bhumra" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "I build software and write about technology, artificial intelligence, entrepreneurship, philosophy and consciousness.",
      ),
    ).toBeVisible();
  }

  await context.close();
});

test("reduced-motion labs start no transform animations", async ({
  browser,
}) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const transformAnimations = await page.evaluate(() =>
      document.getAnimations().filter((animation) => {
        const effect = animation.effect;
        if (!(effect instanceof KeyframeEffect)) return false;
        return effect
          .getKeyframes()
          .some((keyframe) => keyframe.transform !== undefined);
      }),
    );
    expect(transformAnimations).toHaveLength(0);
  }

  await context.close();
});

test("fine-pointer depth responds without moving the page", async ({
  page,
}) => {
  for (const [route, selector] of [
    ["/motion/paper-depth", ".motion-paper-stack"],
    ["/motion/instrument", ".motion-instrument-stage"],
  ] as const) {
    await page.goto(route);
    const target = page.locator(selector);
    const bounds = await target.boundingBox();
    expect(bounds).not.toBeNull();
    const before = await target.evaluate(
      (element) => getComputedStyle(element).transform,
    );

    await page.mouse.move(
      (bounds?.x ?? 0) + (bounds?.width ?? 0) - 2,
      (bounds?.y ?? 0) + 2,
    );
    await page.waitForTimeout(300);
    const after = await target.evaluate(
      (element) => getComputedStyle(element).transform,
    );

    expect(after).not.toBe(before);
    expect(
      await page.evaluate(
        () =>
          Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          ) - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  }
});

test("motion labs stay out of the sitemap", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/motion/");
});
