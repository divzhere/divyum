import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const productLoopEssay = "/essays/product-management-is-a-loop-not-a-launch";

test("the product essay contrasts a launch with the operating loop", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(productLoopEssay);

  const diagram = page.getByRole("figure", {
    name: "Launch view and operating loop",
  });
  await expect(diagram).toBeVisible();

  const loopView = diagram.getByRole("button", { name: "Loop view" });
  const launchView = diagram.getByRole("button", { name: "Launch view" });
  await expect(loopView).toHaveAttribute("aria-pressed", "true");
  await expect(diagram.getByRole("status")).toContainText(
    "Name the user and problem",
  );

  await launchView.click();
  await expect(launchView).toHaveAttribute("aria-pressed", "true");
  await expect(diagram.getByRole("status")).toContainText(
    "Release becomes the finish line",
  );

  await loopView.click();
  await diagram.getByRole("button", { name: "Improve" }).click();
  await expect(diagram.getByRole("status")).toContainText(
    "Strengthen the product's reason to return",
  );
});

test("the product loop stops its circulation when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(productLoopEssay);
  await expect(page.locator(".product-loop-flow")).toHaveCSS(
    "animation-name",
    "none",
  );
});

for (const theme of ["light", "dark"] as const) {
  test(`the product loop has no accessibility violations or horizontal overflow in ${theme} theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem("divyum-theme", selectedTheme);
    }, theme);
    await page.goto(productLoopEssay);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

    expect(
      await page.evaluate(
        () =>
          Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          ) - window.innerWidth,
      ),
    ).toBeLessThanOrEqual(1);

    const results = await new AxeBuilder({ page })
      .include(".product-loop-figure")
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });
}
