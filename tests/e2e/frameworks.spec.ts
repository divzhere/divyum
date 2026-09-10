import { expect, test } from "@playwright/test";

/*
  Behavior of the frameworks index and all six interactive visuals.
  Route-level checks (200, h1, overflow, console, keyboard reach, a11y,
  visual baselines, no-JS heading) come from browser-routes.ts; this file
  covers what the interactions actually do.
*/

test.skip(
  ({ browserName, viewport }) =>
    !(
      (browserName === "chromium" && viewport?.width === 1280) ||
      (browserName === "webkit" && viewport?.width === 768)
    ),
  "interaction behavior is covered once per engine",
);

test("the index groups by lineage and regroups by domain", async ({ page }) => {
  await page.goto("/frameworks");

  await expect(
    page.getByRole("heading", { level: 2, name: "Western" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Eastern" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Personal" }),
  ).toBeVisible();
  await expect(page.locator(".framework-row")).toHaveCount(6);

  await page.getByRole("button", { name: "By domain" }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "attention" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "consciousness" }),
  ).toBeVisible();
});

test("the Eisenhower matrix sorts a picked task into a quadrant", async ({
  page,
}) => {
  await page.goto("/frameworks/eisenhower-matrix");

  const task = page.getByRole("button", {
    name: "Reply to a message that just arrived",
  });
  await task.focus();
  await page.keyboard.press("Enter");
  await expect(task).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Place the held task in Do/ }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toContainText("sorted into do");
  await expect(page.locator(".fw-chip-placed")).toHaveCount(1);
});

test("signal resolves only after the noise is filtered", async ({ page }) => {
  await page.goto("/frameworks/signal-vs-noise");

  const line = page.locator(".fw-signal-line");
  await expect(line).toHaveCSS("opacity", "0");

  await page.getByRole("button", { name: "Only what matters" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toContainText("one line");
  await expect
    .poll(async () =>
      Number(await line.evaluate((node) => getComputedStyle(node).opacity)),
    )
    .toBeGreaterThan(0.5);
});

test("a leaf falls without its trunk and holds after the structure is built", async ({
  page,
}) => {
  await page.goto("/frameworks/knowledge-tree");

  await page
    .getByRole("button", { name: "Attach a leaf: a detail" })
    .first()
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("nothing to hang on to");

  await page
    .getByRole("button", {
      name: "Build the trunk: the fundamental principles",
    })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Trunk built");

  await page
    .getByRole("button", { name: "Build a big branch: a core truth" })
    .first()
    .focus();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Attach a leaf: a detail" })
    .first()
    .focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toContainText("Leaf attached");
});

test("the many resolve into one, and each yoga names its approach", async ({
  page,
}) => {
  await page.goto("/frameworks/tat-tvam-asi");

  await expect(page.getByRole("status")).toContainText("many");
  await page.getByRole("button", { name: "The one" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toContainText("one, without a second");

  await page.getByRole("button", { name: "Karma" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("unselfish action");
});

test("vision-to-leverage stages advance with the arrow keys", async ({
  page,
}) => {
  await page.goto("/frameworks/vision-to-leverage");

  const first = page.getByRole("button", { name: /Stage 1: Sankalp/ });
  await first.focus();
  await expect(page.locator(".fw-v2l-detail")).toContainText("Sankalp");

  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".fw-v2l-detail")).toContainText("Abhyas");
  await page.keyboard.press("End");
  await expect(page.locator(".fw-v2l-detail")).toContainText(
    "Building Leverage",
  );
});

test("the eight limbs connect keyboard selection to their concentric ring", async ({
  page,
}) => {
  await page.goto("/frameworks/eight-limbs");
  const first = page.getByRole("button", { name: /^Limb 1: Yama/ });
  await first.focus();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowDown");
  const second = page.getByRole("button", { name: /^Limb 2: Niyama/ });
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.locator('.fw-limbs-ring[data-selected="true"]'),
  ).toHaveAttribute("r", "49");
  await page.keyboard.press("End");
  await expect(
    page.getByRole("button", { name: /^Limb 8: Samadhi/ }),
  ).toBeFocused();
  await expect(
    page.locator('.fw-limbs-ring[data-selected="true"]'),
  ).toHaveAttribute("r", "7");
  await page.getByRole("button", { name: /^Limb 3: Asana/ }).click();
  await expect(
    page.locator('.fw-limbs-ring[data-selected="true"]'),
  ).toHaveAttribute("r", "42");
});

test("framework visuals are present in the server HTML without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  for (const slug of [
    "eisenhower-matrix",
    "signal-vs-noise",
    "knowledge-tree",
    "tat-tvam-asi",
    "vision-to-leverage",
    "eight-limbs",
  ]) {
    await page.goto(`/frameworks/${slug}`);
    await expect(page.locator(".fw-visual")).toBeVisible();
    await expect(
      page.locator(".framework-visual-frame svg, .fw-eisenhower-grid"),
    ).not.toHaveCount(0);
    if (slug === "eight-limbs") {
      await expect(page.locator(".fw-limbs-ring")).toHaveCount(8);
      await expect(page.locator(".fw-limbs-list li")).toHaveCount(8);
      await expect(page.locator(".fw-limbs-list")).toContainText("absorption");
    }
  }
  await context.close();
});

for (const slug of [
  "eisenhower-matrix",
  "signal-vs-noise",
  "knowledge-tree",
  "tat-tvam-asi",
  "vision-to-leverage",
  "eight-limbs",
]) {
  test(`${slug} advertises its own diagram in social metadata`, async ({
    page,
    request,
  }) => {
    await page.goto(`/frameworks/${slug}`);
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      const image = await page.locator(selector).getAttribute("content");
      expect(new URL(image!).pathname).toBe(
        `/frameworks/${slug}/opengraph-image`,
      );
      const response = await request.get(new URL(image!).pathname);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
      expect((await response.body()).byteLength).toBeGreaterThan(1000);
    }
  });
}
