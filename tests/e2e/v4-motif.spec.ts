import { expect, test } from "@playwright/test";

/*
  One motif, more states: the point before the current nav item, the lost
  point on the 404, editions in waiting, points on the shelf line, the origin
  of the Currently rule, and 5px markers in prose and Journey moments.
*/

test.skip(
  ({ viewport }) => ![375, 1280].includes(viewport?.width ?? 0),
  "motif states are checked at one phone and one desktop width",
);

const pseudo = (selector: string, which: string, prop: string) =>
  `(() => { const n = document.querySelector('${selector}'); return getComputedStyle(n, '${which}').getPropertyValue('${prop}'); })()`;

test("navigation carries exactly one current indicator: the point", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/frameworks/eight-limbs");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav.locator("[aria-current=page]")).toHaveCount(1);
  expect(
    await page.evaluate(
      pseudo('.nav-link[aria-current="page"]', "::before", "transform"),
    ),
  ).toBe("matrix(1, 0, 0, 1, 0, 0)");
  expect(
    await page.evaluate(
      pseudo('.nav-link[aria-current="page"]', "::before", "width"),
    ),
  ).toBe("5px");
  // The underline is not a second current indicator.
  expect(
    await page.evaluate(
      pseudo('.nav-link[aria-current="page"]', "::after", "transform"),
    ),
  ).toBe("matrix(0, 0, 0, 1, 0, 0)");
  const journey = nav.getByRole("link", { name: "Journey", exact: true });
  await journey.hover();
  expect(
    await page.evaluate(
      pseudo('.nav-link[href="/journey"]', "::before", "transform"),
    ),
  ).toBe("matrix(0, 0, 0, 0, 0, 0)");
});

test("the 404 is a lost point with a dashed trace and no horizon participant", async ({
  page,
}) => {
  const response = await page.goto("/this-page-is-not-here");
  expect(response?.status()).toBe(404);
  await expect(page.locator(".not-found-mark .hero-point")).toBeVisible();
  await expect(page.locator(".not-found-trace")).toHaveCSS(
    "border-top-style",
    "dashed",
  );
  await expect(page.locator("[data-horizon]")).toHaveCount(0);
});

for (const path of ["/essays", "/notes"]) {
  test(`${path} shows one forthcoming edition and no invented entries`, async ({
    page,
  }) => {
    await page.goto(path);
    const content = page.locator(".index-content");
    await expect(content.locator(".edition-row")).toHaveCount(1);
    await expect(content.locator(".edition-row")).toContainText("Forthcoming");
    await expect(content.locator(".edition-row")).toContainText(
      /(Essay|Note) 001/,
    );
    await expect(content.locator("a")).toHaveCount(0);
    await expect(content.locator(".empty-state-title")).toHaveCount(0);
    const row = content.locator(".edition-row");
    const [rowBox, leader] = await Promise.all([
      row.boundingBox(),
      content.locator(".edition-leader").boundingBox(),
    ]);
    expect(rowBox!.height).toBeLessThan(40);
    expect(leader!.width).toBeGreaterThanOrEqual(32);
  });
}

test("the home library preview is five points in waiting on the shelf line", async ({
  page,
}) => {
  await page.goto("/");
  const library = page.getByRole("region", { name: "Library", exact: true });
  const points = library.locator("li[data-placeholder]");
  await expect(points).toHaveCount(5);
  for (const point of await points.all()) {
    const box = await point.boundingBox();
    expect(box!.width).toBe(9);
    expect(box!.height).toBe(9);
  }
  await expect(library).toContainText("Five spines in waiting.");
  await expect(library.locator("a[href^='/library/']")).toHaveCount(0);
  await expect(library.locator("li").first()).toContainText("Shelf 001");
});

test("the library shelf numbers its spines in waiting and marks them forthcoming", async ({
  page,
}) => {
  await page.goto("/library");
  await expect(page.locator(".library-spine-title").first()).toHaveText(
    "Shelf 001",
  );
  await expect(page.locator(".library-slot-meta").first()).toHaveText(
    "Forthcoming",
  );
  await expect(page.getByText("Spines marked forthcoming")).toBeVisible();
});

test("the Currently rule starts from an origin point on wide screens only", async ({
  page,
  viewport,
}) => {
  await page.goto("/");
  const display = await page.evaluate(
    pseudo(".currently-list", "::before", "display"),
  );
  const width = await page.evaluate(
    pseudo(".currently-list", "::before", "width"),
  );
  if ((viewport?.width ?? 0) > 700) {
    expect(display).toBe("block");
    expect(width).toBe("9px");
  } else {
    expect(display).toBe("none");
  }
});

test("prose bullets are 5px points while lists keep their semantics", async ({
  page,
}) => {
  await page.goto("/frameworks/eight-limbs");
  await page.locator(".prose").evaluate((prose) => {
    const list = document.createElement("ul");
    const item = document.createElement("li");
    item.textContent = "A reading-style fixture";
    list.append(item);
    prose.append(list);
  });
  await expect(page.locator(".prose ul")).toHaveCSS("list-style-type", "disc");
  expect(
    await page.evaluate(pseudo(".prose ul > li", "::before", "width")),
  ).toBe("5px");
  expect(
    await page.evaluate(pseudo(".prose ul > li", "::marker", "color")),
  ).toBe("rgba(0, 0, 0, 0)");
});

test("journey moments carry 5px markers that grow into origins on hover", async ({
  page,
  viewport,
}) => {
  test.skip(viewport?.width !== 1280, "hover is a pointer affordance");
  await page.goto("/");
  const first = page
    .getByRole("region", { name: "Journey", exact: true })
    .locator("li")
    .first();
  await expect(first).toBeVisible();
  const marker = '[aria-labelledby="journey-title"] li';
  expect(await page.evaluate(pseudo(marker, "::before", "width"))).toBe("5px");
  await first.getByRole("link").hover();
  await expect
    .poll(() => page.evaluate(pseudo(marker, "::before", "transform")))
    .toBe("matrix(1.8, 0, 0, 1.8, 0, 0)");
});

test("the plate meta names the lineage, not a running number", async ({
  page,
}) => {
  await page.goto("/");
  const plates = page
    .getByRole("region", { name: "Frameworks", exact: true })
    .locator("a[href^='/frameworks/']:has(h3)");
  await expect(plates).toHaveCount(3);
  await expect(plates.nth(0)).toContainText("Western");
  await expect(plates.nth(1)).toContainText("Eastern");
  await expect(plates.nth(2)).toContainText("Personal");
  await expect(plates.nth(0)).not.toContainText(/\b0[1-3]\b/);
});
