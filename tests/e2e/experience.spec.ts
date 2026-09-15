import { expect, test } from "@playwright/test";

test("professional overview connects to the filtered journey", async ({
  page,
}) => {
  await page.goto("/journey");
  const overview = page.getByRole("link", { name: "Professional overview" });
  await overview.focus();
  await expect(overview).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Professional overview",
  );
  await expect(
    page.getByRole("heading", { name: "U.S. healthcare technology" }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText(
    "lead frontend and UX role in 2025",
  );
  await expect(
    page.locator('main a[download], main a[href$=".pdf"], main form, main img'),
  ).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/experience$/,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    /\/experience$/,
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /frontend engineering/,
  );

  await page
    .getByRole("link", { name: "Follow the technology journey" })
    .click();
  await expect(page).toHaveURL(/\/journey\?thread=technology#technology$/);
  await expect(page.locator(".journey-chapter")).toHaveCount(6);
  await expect(page.locator("#technology")).toBeInViewport();
});

test("professional overview remains readable without JavaScript", async ({
  browser,
  viewport,
}) => {
  test.skip(viewport?.width !== 375, "covered once per engine");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport,
  });
  const page = await context.newPage();
  try {
    await page.goto("/experience");
    await expect(
      page.getByRole("heading", { name: "Professional overview", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Delivery and quality" }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText("Playwright");
    await expect(
      page.getByRole("link", { name: "Follow the technology journey" }),
    ).toHaveAttribute("href", "/journey?thread=technology#technology");
  } finally {
    await context.close();
  }
});
