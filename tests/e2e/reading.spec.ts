import { expect, test } from "@playwright/test";

test("references are recognisable as links without hovering", async ({
  page,
}) => {
  await page.goto("/frameworks/eisenhower-matrix");
  await expect(page.locator(".prose a").first()).toHaveCSS(
    "text-decoration-line",
    "underline",
  );
});

test("ordered prose keeps visible step numbers", async ({ page }) => {
  await page.goto("/frameworks/eight-limbs");
  await expect(page.locator(".prose ol").first()).toHaveCSS(
    "list-style-type",
    "decimal",
  );
});

test("unordered prose keeps bullet markers", async ({ page }) => {
  await page.goto("/frameworks/eight-limbs");
  // No published article currently has an unordered list. Exercise its shared
  // reading styles without publishing a fictitious essay or a test-only route.
  await page.locator(".prose").evaluate((prose) => {
    const list = document.createElement("ul");
    const item = document.createElement("li");
    item.textContent = "A reading-style fixture";
    list.append(item);
    prose.append(list);
  });
  await expect(page.locator(".prose ul")).toHaveCSS("list-style-type", "disc");
});
