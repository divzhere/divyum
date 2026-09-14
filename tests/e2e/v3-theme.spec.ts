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

test("hovering the toggle eclipses the rule into the point without moving the knob", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("divyum-theme", "light"));
  await page.goto("/");
  const track = () =>
    page.evaluate(() => {
      const node = document.querySelector(".theme-track")!;
      const style = getComputedStyle(node, "::before");
      return {
        transform: style.transform,
        origin: style.transformOrigin,
        height: style.height,
      };
    });
  const before = await track();
  expect(before.transform).toBe("none");
  expect(before.height).toBe("1px");
  await page.getByRole("button", { name: "Use dark theme" }).hover();
  await expect
    .poll(async () => (await track()).transform)
    .toBe("matrix(0, 0, 0, 1, 0, 0)");
  await expect(page.locator(".theme-knob")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 0, 0)",
  );
  await expect(page.locator(".theme-knob")).toHaveCSS("width", "9px");
  await page.mouse.move(1, 1);
  await expect.poll(async () => (await track()).transform).toBe("none");
});
