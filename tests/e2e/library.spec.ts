import { expect, test } from "@playwright/test";

test.skip(
  ({ browserName, viewport }) =>
    !(
      (browserName === "chromium" && viewport?.width === 1280) ||
      (browserName === "webkit" && viewport?.width === 768)
    ),
  "shelf behavior is covered once per engine",
);

test("the shelf renders spines, resorts, and placeholders stay unlinked", async ({
  page,
}) => {
  await page.goto("/library");

  const spines = page.locator(".library-spine");
  await expect(spines).toHaveCount(5);

  // Placeholders are labelled, visibly marked, and never link anywhere.
  await expect(page.locator(".library-slot[data-placeholder]")).toHaveCount(5);
  await expect(page.locator("a.library-spine")).toHaveCount(0);
  await expect(
    page.getByText("placeholder", { exact: false }).first(),
  ).toBeVisible();

  // Sorting flips order without losing spines.
  await page.getByRole("button", { name: "By theme" }).click();
  await expect(spines).toHaveCount(5);
  await page.getByRole("button", { name: "By status" }).click();
  await expect(spines).toHaveCount(5);
});

test("a library page for an unknown or note-less book returns 404", async ({
  page,
}) => {
  const bare = await page.goto("/library/placeholder-vedanta");
  expect(bare?.status()).toBe(404);

  const unknown = await page.goto("/library/never-existed");
  expect(unknown?.status()).toBe(404);
});
