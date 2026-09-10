import { expect, test } from "@playwright/test";

test("home introduces all six destinations through distinct, truthful sections", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main h2")).toHaveText([
    "Currently",
    "Writing",
    "Frameworks",
    "Journey",
    "Library",
    "About",
  ]);
  const frameworks = page.getByRole("region", {
    name: "Frameworks",
    exact: true,
  });
  await expect(frameworks.locator('a[href^="/frameworks/"]')).toHaveCount(3);
  const journey = page.getByRole("region", { name: "Journey", exact: true });
  await expect(journey.locator('a[href^="/journey#"]')).toHaveCount(3);
  await expect(
    page.getByRole("region", { name: "Library", exact: true }),
  ).toContainText("Placeholders");
  const footer = page.getByRole("navigation", { name: "Footer navigation" });
  for (const name of [
    "Essays",
    "Notes",
    "Frameworks",
    "Library",
    "Journey",
    "About",
  ]) {
    await expect(footer.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await expect(page.locator('a[href^="/projects"]')).toHaveCount(0);
});

test("every core page has a visible title and introduction without JavaScript", async ({
  browser,
  baseURL,
  viewport,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport,
  });
  const page = await context.newPage();
  for (const path of [
    "/",
    "/essays",
    "/notes",
    "/frameworks",
    "/library",
    "/journey",
    "/about",
  ]) {
    await page.goto(path);
    const heading = page.locator("main h1");
    await expect(heading).toBeVisible();
    // CSS opacity does not affect Playwright's visibility check. Test actual
    // composited opacity through the ancestors, not just DOM presence.
    expect(
      await heading.evaluate((element) => {
        let opacity = 1;
        for (
          let current: Element | null = element;
          current;
          current = current.parentElement
        ) {
          opacity *= Number(getComputedStyle(current).opacity);
        }
        return opacity;
      }),
    ).toBe(1);
  }
  await context.close();
});
