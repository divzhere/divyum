import { expect, test } from "@playwright/test";

test("readers have legible body type and mobile edge space", async ({
  page,
}) => {
  await page.goto("/");
  const layout = await page.evaluate(() => ({
    bodySize: parseFloat(getComputedStyle(document.body).fontSize),
    left: document.querySelector(".home-page")!.getBoundingClientRect().left,
  }));
  expect(layout.bodySize).toBeGreaterThanOrEqual(17);
  expect(layout.left).toBeGreaterThanOrEqual(20);
});

test("navigation identifies the current section on detail pages", async ({
  page,
}) => {
  await page.goto("/frameworks/eight-limbs");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  await expect(
    navigation.getByRole("link", { name: "Frameworks", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await navigation.getByRole("link", { name: "Journey", exact: true }).click();
  await expect(
    navigation.getByRole("link", { name: "Journey", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator("[aria-current=page]")).toHaveCount(1);
});

test("reading measure and type remain comfortable on wide screens", async ({
  page,
  viewport,
}) => {
  test.skip((viewport?.width ?? 0) < 1024, "wide reading measure");
  await page.goto("/frameworks/eight-limbs");
  const prose = page.locator(".prose");
  const metrics = await prose.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    size: parseFloat(getComputedStyle(element).fontSize),
    lineHeight: parseFloat(getComputedStyle(element).lineHeight),
  }));
  expect(metrics.width).toBeGreaterThanOrEqual(680);
  expect(metrics.width).toBeLessThanOrEqual(740);
  expect(metrics.size).toBeGreaterThanOrEqual(19);
  expect(metrics.size).toBeLessThanOrEqual(21);
  expect(metrics.lineHeight / metrics.size).toBeLessThanOrEqual(1.75);
});
