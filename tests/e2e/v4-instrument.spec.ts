import { expect, test, type Page } from "@playwright/test";

/*
  The living instrument: the real Knowledge Tree on the home page, its ground
  line drawn from an origin point, complete by default and self-drawing only
  under no-preference once it scrolls into view.
*/

test.skip(
  ({ viewport }) => ![375, 1280, 1440].includes(viewport?.width ?? 0),
  "instrument checks run at phone and desktop widths",
);

const region = (page: Page) =>
  page.getByRole("region", { name: "Frameworks", exact: true });

test("the origin point is 9px and centred on the start of the ground line", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const tree = region(page).locator(".fw-tree");
  await expect(tree).toHaveCount(1);
  const geometry = await tree.evaluate((element) => {
    const origin = element
      .querySelector(".fw-tree-origin")!
      .getBoundingClientRect();
    const line = element
      .querySelector(".fw-tree-ground")!
      .getBoundingClientRect();
    return { origin, line };
  });
  expect(geometry.origin.width).toBe(9);
  expect(geometry.origin.height).toBe(9);
  expect(
    Math.abs(geometry.origin.left + 4.5 - geometry.line.left),
  ).toBeLessThan(1.5);
  expect(
    Math.abs(
      geometry.origin.top +
        4.5 -
        (geometry.line.top + geometry.line.height / 2),
    ),
  ).toBeLessThan(1.5);
});

test("the ground line is complete under reduced motion and without JavaScript", async ({
  browser,
  baseURL,
  viewport,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const ground = region(page).locator(".fw-tree-ground");
  await expect(ground).toHaveCSS("animation-name", "none");
  await expect(ground).toHaveCSS("stroke-dashoffset", "0px");

  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport,
  });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  const staticGround = staticPage.locator(".fw-tree-ground");
  await expect(staticGround).toHaveCSS("animation-name", "none");
  await expect(staticGround).toHaveCSS("stroke-dasharray", "none");
  await expect(staticPage.locator(".fw-tree-origin")).toBeVisible();
  await context.close();
});

test("the ground line draws itself once when it scrolls into view", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const tree = region(page).locator(".fw-tree");
  await tree.locator(".fw-tree-canvas").scrollIntoViewIfNeeded();
  await expect(tree).toHaveAttribute("data-draw", "drawn");
  const ground = tree.locator(".fw-tree-ground");
  await expect(ground).toHaveCSS("animation-name", "fw-ground-draw");
  await expect
    .poll(() =>
      ground.evaluate((node) => getComputedStyle(node).strokeDashoffset),
    )
    .toBe("0px");
  const timing = await ground.evaluate((node) =>
    node.getAnimations().map((animation) => animation.effect!.getTiming()),
  );
  for (const t of timing) {
    expect(t.iterations).toBe(1);
    expect(Number(t.duration)).toBeLessThanOrEqual(700);
  }
});

test("when application chunks never arrive the line still draws itself", async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 375, "one blocked-chunk pass per engine");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveAttribute(
    "data-signature-motion",
    "ready",
  );
  const ground = page.locator(".fw-tree-ground");
  await expect(ground).toHaveCSS("animation-name", "fw-ground-draw-late");
  const delay = await ground.evaluate(
    (node) => node.getAnimations()[0]?.effect!.getTiming().delay,
  );
  expect(delay).toBe(4000);
  await expect
    .poll(
      () => ground.evaluate((node) => getComputedStyle(node).strokeDashoffset),
      // CSS applies after commit, then a 4s delay and a 700ms ease-out tail.
      { timeout: 8000 },
    )
    .toBe("0px");
});

test("the tree is keyboard-operable from the home page with distinct names", async ({
  browserName,
  page,
}) => {
  const tabKey = browserName === "webkit" ? "Alt+Tab" : "Tab";
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const tree = region(page).locator(".fw-tree");
  const names = await tree
    .getByRole("button")
    .evaluateAll((buttons) => buttons.map((b) => b.getAttribute("aria-label")));
  expect(new Set(names).size).toBe(names.length);
  expect(names).toContain("Build branch A: a core truth");
  expect(names).toContain("Attach leaf A1: a detail on branch A");

  const status = tree.getByRole("status");
  await tree
    .getByRole("button", {
      name: "Build the trunk: the fundamental principles",
    })
    .focus();
  await page.keyboard.press("Enter");
  await expect(status).toContainText("Trunk built");
  await page.keyboard.press(tabKey);
  await expect(
    tree.getByRole("button", { name: "Build branch A: a core truth" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(status).toContainText("Branch built");
  await tree
    .getByRole("button", { name: "Attach leaf A1: a detail on branch A" })
    .focus();
  await page.keyboard.press("Space");
  await expect(status).toContainText("Leaf attached");
  await tree.getByRole("button", { name: "Start over" }).focus();
  await page.keyboard.press("Enter");
  await expect(status).toContainText("Cleared");
  await expect(tree.locator(".fw-tree-trunk")).not.toHaveClass(/is-built/);
});

test("the trunk shows its resting affordance and the caption comes from the framework itself", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trunk = region(page).locator(".fw-hotspot-trunk span");
  expect(
    await trunk.evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe("rgba(0, 0, 0, 0)");
  await expect(region(page)).toContainText(
    "First principles: trunk before leaves",
  );
  await expect(
    region(page).getByRole("link", { name: /Read the framework/ }),
  ).toHaveAttribute("href", "/frameworks/knowledge-tree");
});

test("a branch reveals a clear click affordance on hover and keyboard focus", async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 1280, "hover affordance is checked on desktop");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const branch = region(page).getByRole("button", {
    name: "Build branch A: a core truth",
  });

  await expect(branch).toHaveAttribute("data-hint", "Build branch");
  expect(
    await branch.evaluate((node) =>
      getComputedStyle(node, "::after").getPropertyValue("opacity"),
    ),
  ).toBe("0");

  await branch.hover();
  await expect
    .poll(() =>
      branch.evaluate((node) =>
        getComputedStyle(node, "::after").getPropertyValue("opacity"),
      ),
    )
    .toBe("1");

  await branch.focus();
  await expect
    .poll(() =>
      branch.evaluate((node) =>
        getComputedStyle(node, "::after").getPropertyValue("opacity"),
      ),
    )
    .toBe("1");
});
