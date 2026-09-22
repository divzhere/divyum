import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const riverEssay = "/essays/do-not-measure-the-river-too-much";

test("the river essay stays faithful to the journal and includes the observer interaction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(riverEssay);

  await expect(
    page.getByRole("heading", { name: "Do Not Measure the River Too Much" }),
  ).toBeVisible();
  await expect(page.getByText("So, do not measure too much.")).toBeVisible();
  await expect(
    page.getByText(/My dumb ape, humble mind hypothesis/),
  ).toBeVisible();
  await expect(
    page.getByText("Ask. Believe. Trust. Let go. Receive."),
  ).toBeVisible();
  await expect(
    page.getByText("Flow like energy. Flow like electricity. Flow like water."),
  ).toBeVisible();
  await expect(
    page.getByText(/river does not need my constant report/),
  ).toHaveCount(0);

  const field = page.getByRole("button", {
    name: "Observe the energy field",
  });
  await expect(field).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("status")).toHaveText(
    "Unobserved: wave and possibility.",
  );
  await field.click();
  await expect(field).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status")).toHaveText(
    "Observed: particle and position.",
  );
});

test("the observer interaction is static when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(riverEssay);
  const animated = page.locator(".observer-wave, .observer-particle").first();
  await expect(animated).toHaveCSS("animation-name", "none");
});

for (const theme of ["light", "dark"] as const) {
  test(`the river essay has no accessibility violations or horizontal overflow in ${theme} theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem("divyum-theme", selectedTheme);
    }, theme);
    await page.goto(riverEssay);
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

    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2),
    ).toEqual([]);
  });
}
