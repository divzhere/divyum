import { expect, test, type Locator, type Page } from "@playwright/test";

/*
  Corner ignition on the framework plates: the zone under the cursor leads,
  the rest follow 60ms later, nothing already drawn retracts while hovered,
  and reduced motion gets the finished state at once.
*/

test.skip(
  ({ browserName, viewport }) =>
    browserName !== "chromium" || viewport?.width !== 1280,
  "pointer choreography is checked once",
);

type Edge = {
  zone: string;
  which: "::before" | "::after";
  scale: number;
  delay: string;
};

async function edges(plate: Locator): Promise<Edge[]> {
  return plate.evaluate((element) => {
    const zones = [...element.querySelectorAll("[data-zone]")];
    return zones.flatMap((zone) =>
      (["::before", "::after"] as const).map((which) => {
        const style = getComputedStyle(zone, which);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return {
          zone: zone.getAttribute("data-zone")!,
          which,
          scale: which === "::before" ? matrix.a : matrix.d,
          delay: style.transitionDelay,
        };
      }),
    );
  });
}

async function hoverZone(page: Page, plate: Locator, zone: string) {
  const box = (await plate.boundingBox())!;
  const x = zone.endsWith("l")
    ? box.x + box.width * 0.25
    : box.x + box.width * 0.75;
  const y = zone.startsWith("t")
    ? box.y + box.height * 0.25
    : box.y + box.height * 0.75;
  await page.mouse.move(x, y);
}

function firstPlate(page: Page) {
  return page
    .getByRole("region", { name: "Frameworks", exact: true })
    .locator("a[href^='/frameworks/']:has(h3)")
    .first();
}

test("the nearest corner ignites first and the card never retracts while hovered", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const plate = firstPlate(page);
  await plate.scrollIntoViewIfNeeded();
  await hoverZone(page, plate, "tr");
  const early = await edges(plate);
  for (const edge of early) {
    expect(edge.delay).toBe(edge.zone === "tr" ? "0s" : "0.06s");
  }
  await expect
    .poll(async () => (await edges(plate)).every((e) => e.scale > 0.99))
    .toBe(true);
  await hoverZone(page, plate, "bl");
  await page.waitForTimeout(80);
  expect((await edges(plate)).every((e) => e.scale > 0.99)).toBe(true);
  await page.mouse.move(2, 2);
  await expect
    .poll(async () => (await edges(plate)).every((e) => e.scale < 0.01))
    .toBe(true);
});

test("keyboard focus ignites every edge from the origin corner", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const plate = firstPlate(page);
  await plate.focus();
  await expect(plate).toBeFocused();
  const focused = await edges(plate);
  for (const edge of focused) {
    expect(edge.delay).toBe(edge.zone === "tl" ? "0s" : "0.06s");
  }
  await expect
    .poll(async () => (await edges(plate)).every((e) => e.scale > 0.99))
    .toBe(true);
});

test("reduced motion ignites the plate instantly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const plate = firstPlate(page);
  await plate.scrollIntoViewIfNeeded();
  await hoverZone(page, plate, "br");
  const now = await edges(plate);
  expect(now.every((e) => e.scale > 0.99)).toBe(true);
  expect(
    await plate.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});
