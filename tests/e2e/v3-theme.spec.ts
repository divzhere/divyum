import { expect, test } from "@playwright/test";

test.skip(({ viewport }) => viewport?.width !== 375);

test("the theme knob reflects the saved theme before application hydration", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("divyum-theme", "dark"));
  await page.route("**/*.js", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".theme-knob")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 12, 0)",
  );
});

test("the theme knob toggles without motion for reduced-motion readers", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("divyum-theme", "light"));
  await page.goto("/");
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator(".theme-knob")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 12, 0)",
  );
  expect(
    await page
      .locator(".theme-knob")
      .evaluate((node) => node.getAnimations().length),
  ).toBe(0);
  await page.getByRole("button", { name: "Use light theme" }).click();
  await expect(page.locator(".theme-knob")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)",
  );
});
