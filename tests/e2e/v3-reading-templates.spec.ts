import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.skip(!process.env.V3_DESIGN_LAB, "local-only reading specimens");

for (const kind of ["essay", "note", "book"]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${kind} reading template remains readable in ${theme}`, async ({
      page,
      viewport,
      browserName,
    }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      const response = await page.goto(`/design/v3/reading/${kind}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("main h1")).toContainText("Reading specimen");
      await expect(page.locator(".prose")).toContainText("Local fixture only");
      await expect(page.locator(".prose ol")).toHaveCSS(
        "list-style-type",
        "decimal",
      );
      await expect(page.locator(".prose ul")).toHaveCSS(
        "list-style-type",
        "disc",
      );
      await expect(page.locator(".prose a").first()).toHaveCSS(
        "text-decoration-line",
        "underline",
      );
      await expect(page.locator(".prose img")).toBeVisible();
      await expect(page.locator(".prose img")).toHaveCSS("width", "80px");
      for (const selector of [".prose-table", ".prose pre"]) {
        const scrollRegion = page.locator(selector);
        if (
          await scrollRegion.evaluate(
            (element) => element.scrollWidth > element.clientWidth,
          )
        ) {
          await scrollRegion.scrollIntoViewIfNeeded();
          await scrollRegion.focus();
          await expect(scrollRegion).toBeFocused();
          await page.keyboard.down("ArrowRight");
          try {
            await expect
              .poll(() =>
                scrollRegion.evaluate((element) => element.scrollLeft),
              )
              .toBeGreaterThan(0);
          } finally {
            await page.keyboard.up("ArrowRight");
          }
        }
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      const width = await page
        .locator(".prose")
        .evaluate((element) => element.getBoundingClientRect().width);
      if ((viewport?.width ?? 0) >= 1280) {
        expect(width).toBeGreaterThanOrEqual(680);
        expect(width).toBeLessThanOrEqual(740);
      }
      if (browserName === "chromium")
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
    });
  }
}

test("local reading specimens never enter public discovery", async ({
  request,
}) => {
  for (const path of ["/sitemap.xml", "/feed.xml", "/rss.xml"]) {
    const response = await request.get(path);
    expect(await response.text()).not.toContain("/design/v3/");
  }
});
