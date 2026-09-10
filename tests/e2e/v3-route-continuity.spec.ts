import { expect, test } from "@playwright/test";

test.skip(
  ({ viewport }) => viewport?.width !== 375,
  "one navigation pass per engine",
);

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`the structural horizon connects routes with ${reducedMotion}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.addInitScript(() => {
      const durations: string[] = [];
      Object.assign(window, { horizonDurations: durations });
      const native = document.startViewTransition?.bind(document);
      if (!native) return;
      document.startViewTransition = (...args) => {
        const transition = native(...args);
        void transition.ready
          .then(() => {
            durations.push(
              getComputedStyle(
                document.documentElement,
                "::view-transition-group(route-horizon)",
              ).animationDuration,
            );
          })
          .catch(() => {});
        return transition;
      };
    });
    await page.goto("/");
    const supported = await page.evaluate(
      () => typeof document.startViewTransition === "function",
    );
    test.skip(!supported, "native view transitions unavailable");
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Essays", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Essays", exact: true }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { horizonDurations: string[] })
              .horizonDurations.length,
        ),
      )
      .toBeGreaterThan(0);
    const durations = await page.evaluate(
      () =>
        (window as unknown as { horizonDurations: string[] }).horizonDurations,
    );
    for (const duration of durations) {
      const seconds = parseFloat(duration);
      if (reducedMotion === "reduce") expect(seconds).toBe(0);
      else {
        expect(seconds).toBeGreaterThanOrEqual(0.3);
        expect(seconds).toBeLessThanOrEqual(0.55);
      }
    }
  });
}

for (const supported of [true, false]) {
  test(`rapid navigation still works with native transitions ${supported ? "enabled" : "unavailable"}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    if (!supported)
      await page.addInitScript(() => {
        Object.defineProperty(document, "startViewTransition", {
          value: undefined,
        });
      });
    await page.goto("/essays");
    const navigation = page.getByRole("navigation", {
      name: "Primary navigation",
    });
    await navigation
      .getByRole("link", { name: "Frameworks", exact: true })
      .click();
    await expect(page).toHaveURL(/\/frameworks$/);
    await navigation
      .getByRole("link", { name: "Journey", exact: true })
      .click();
    await expect(page).toHaveURL(/\/journey$/);
    await expect(
      page.getByRole("heading", { name: "Journey", exact: true }),
    ).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/frameworks$/);
    expect(errors).toEqual([]);
  });
}
