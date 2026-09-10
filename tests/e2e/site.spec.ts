import { expect, test } from "@playwright/test";
import { hiddenRoutes, publicRoutes } from "../browser-routes";

for (const route of publicRoutes) {
  test(`${route.path} renders, stays within the viewport and has no console errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.fonts.status))
      .toBe("loaded");

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

  test(`${route.path} exposes working keyboard navigation`, async ({
    browserName,
    page,
  }) => {
    const tabKey = browserName === "webkit" ? "Alt+Tab" : "Tab";
    await page.goto(route.path);
    await page.keyboard.press(tabKey);
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();

    await page.goto(route.path);
    await page.keyboard.press(tabKey);
    await page.keyboard.press(tabKey);
    await expect(
      page.getByRole("link", { name: "Divyum Bhumra, home" }),
    ).toBeFocused();

    let reachedThemeToggle = false;
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press(tabKey);
      reachedThemeToggle = await page
        .getByRole("button", { name: /Use (light|dark) theme/ })
        .evaluate((button) => button === document.activeElement);
      if (reachedThemeToggle) break;
    }
    expect(reachedThemeToggle).toBe(true);
  });
}

test("theme choice persists after reload", async ({
  browserName,
  page,
  viewport,
}) => {
  test.skip(
    browserName !== "chromium" || viewport?.width !== 375,
    "one browser is sufficient",
  );
  await page.goto("/");
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /Use (light|dark) theme/ }).click();
  const chosenTheme = initialTheme === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosenTheme);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosenTheme);
});

test("journey choices are staged, combine as a union and reset", async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 768, "covered once per browser engine");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/journey");
  const results = page.getByRole("region", { name: "The whole journey" });
  const technology = page.getByRole("checkbox", { name: /^Technology/ });
  const travel = page.getByRole("checkbox", { name: /^Travel and place/ });

  await page.locator("label", { has: technology }).click();
  await page.locator("label", { has: travel }).click();
  await expect(technology).toBeChecked();
  await expect(travel).toBeChecked();
  await expect(
    results.getByRole("heading", {
      name: "Leading Rotary Chandigarh Himalayan",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show this journey" }).click();
  await expect(
    page.getByRole("region", { name: "Technology + Travel and place" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Finding my way into technology" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Travel became part of how I learn" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Leading Rotary Chandigarh Himalayan" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: /^Whole story/ }).click();
  await page.getByRole("button", { name: "Show this journey" }).click();
  await expect(
    page.getByRole("region", { name: "The whole journey" }),
  ).toBeVisible();
  await expect(page.locator(".journey-chapter")).toHaveCount(8);
});

for (const route of hiddenRoutes) {
  test(`${route} stays private and noindexed`, async ({
    browserName,
    page,
    viewport,
  }) => {
    test.skip(
      browserName !== "chromium" || viewport?.width !== 375,
      "one browser is sufficient",
    );
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]').first(),
    ).toHaveAttribute("content", /noindex/);
  });
}

test("draft slugs are absent from both feeds and the sitemap", async ({
  browserName,
  request,
  viewport,
}) => {
  test.skip(
    browserName !== "chromium" || viewport?.width !== 375,
    "one browser is sufficient",
  );
  for (const path of ["/feed.xml", "/rss.xml", "/sitemap.xml"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).not.toContain("example-essay");
    expect(body).not.toContain("example-note");
    expect(body).not.toContain("example-project");
    expect(body).not.toContain("/projects");
  }
});

test("server-rendered reading remains visible without JavaScript", async ({
  browser,
  viewport,
}) => {
  test.skip(viewport?.width !== 375, "covered once per browser engine");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();

  for (const route of publicRoutes) {
    await page.goto(route.path);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    if (route.path === "/journey") {
      await expect(page.locator(".journey-chapter")).toHaveCount(8);
    }
  }
  await context.close();
});

test("reduced motion does not start transform animations", async ({
  browser,
  viewport,
}) => {
  test.skip(viewport?.width !== 375, "covered once per browser engine");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();

  for (const path of ["/", "/journey"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const transformAnimations = await page.evaluate(
      () =>
        document.getAnimations().filter((animation) => {
          const effect = animation.effect;
          if (!(effect instanceof KeyframeEffect)) return false;
          return effect
            .getKeyframes()
            .some(
              (frame) =>
                Object.prototype.hasOwnProperty.call(frame, "transform") &&
                String(frame.transform) !== "none",
            );
        }).length,
    );
    expect(transformAnimations).toBe(0);
  }
  await context.close();
});
