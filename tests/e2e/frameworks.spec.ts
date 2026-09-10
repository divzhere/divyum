import { expect, test } from "@playwright/test";

/*
  Behavior of the frameworks index and the five interactive visuals.
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
  await task.click();
  await expect(task).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Place the held task in Do/ }).click();
  await expect(page.getByRole("status")).toContainText("sorted into do");
  await expect(page.locator(".fw-chip-placed")).toHaveCount(1);
});

test("signal resolves only after the noise is filtered", async ({ page }) => {
  await page.goto("/frameworks/signal-vs-noise");

  const line = page.locator(".fw-signal-line");
  await expect(line).toHaveCSS("opacity", "0");

  await page.getByRole("button", { name: "Only what matters" }).click();
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
    .click();
  await expect(page.getByRole("status")).toContainText("nothing to hang on to");

  await page
    .getByRole("button", {
      name: "Build the trunk: the fundamental principles",
    })
    .click();
  await expect(page.getByRole("status")).toContainText("Trunk built");

  await page
    .getByRole("button", { name: "Build a big branch: a core truth" })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Attach a leaf: a detail" })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("Leaf attached");
});

test("the many resolve into one, and each yoga names its approach", async ({
  page,
}) => {
  await page.goto("/frameworks/tat-tvam-asi");

  await expect(page.getByRole("status")).toContainText("many");
  await page.getByRole("button", { name: "The one" }).click();
  await expect(page.getByRole("status")).toContainText("one, without a second");

  await page.getByRole("button", { name: "Karma" }).click();
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
  }
  await context.close();
});
