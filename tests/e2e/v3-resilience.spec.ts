import { expect, test } from "@playwright/test";

test.skip(
  ({ viewport }) => viewport?.width !== 375,
  "one resilience pass per engine",
);

test("the complete introduction is readable while application scripts are delayed", async ({
  page,
}) => {
  let heldScripts = 0;
  let releaseScripts: () => void = () => {};
  const scriptsReady = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (route) => {
    heldScripts += 1;
    await scriptsReady;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await expect.poll(() => heldScripts).toBeGreaterThan(0);
    await expect(
      page.getByRole("heading", { name: "Divyum Bhumra", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".hero-support")).toHaveCSS("opacity", "1");
    await expect(
      page.getByRole("heading", { name: "Currently", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link"),
    ).toHaveCount(6);
  } finally {
    releaseScripts();
  }
  await page.waitForLoadState("load");
  await page.getByRole("button", { name: /Use (light|dark) theme/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
