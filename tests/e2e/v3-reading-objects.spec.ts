import { expect, test } from "@playwright/test";

test("a phone reader can build the tree and select spiral stages by touch", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/frameworks/knowledge-tree");
  await page
    .getByRole("button", {
      name: "Build the trunk: the fundamental principles",
    })
    .tap();
  await expect(page.getByRole("status")).toContainText("Trunk built");
  await page
    .getByRole("button", { name: "Build a big branch: a core truth" })
    .first()
    .tap();
  await expect(page.getByRole("status")).toContainText("Branch built");
  await page
    .getByRole("button", { name: "Attach a leaf: a detail" })
    .first()
    .tap();
  await expect(page.getByRole("status")).toContainText("Leaf attached");
  await page.goto("/frameworks/vision-to-leverage");
  await page.getByRole("button", { name: /^Stage 4:/ }).tap();
  await expect(page.getByRole("status")).toContainText("Swadhyaya");
  await context.close();
});

test("homepage diagrams include visible lines, not just isolated points", async ({
  page,
}) => {
  await page.goto("/");
  const diagrams = page
    .getByRole("region", { name: "Frameworks", exact: true })
    .locator("svg");
  await expect(diagrams).toHaveCount(3);
  for (const diagram of await diagrams.all()) {
    const stroke = await diagram
      .locator("path, line, circle[fill='none']")
      .first()
      .evaluate((element) => getComputedStyle(element).stroke);
    expect(stroke).not.toBe("none");
  }
});

test("book titles are readable and horizontal on phones", async ({
  page,
  viewport,
}) => {
  await page.goto("/library");
  const title = page.locator(".library-spine-title").first();
  expect(
    await title.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    ),
  ).toBeGreaterThanOrEqual(17);
  if ((viewport?.width ?? 0) <= 640)
    await expect(title).toHaveCSS("writing-mode", "horizontal-tb");
});

test("the eight limbs diagram is large enough to read as a diagram", async ({
  page,
}) => {
  await page.goto("/frameworks/eight-limbs");
  const box = await page.locator(".fw-limbs-rings").boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(200);
});

for (const [slug, svgClass, buttons, nodes] of [
  ["knowledge-tree", ".fw-tree-svg", ".fw-hotspot-leaf", ".fw-tree-leaf"],
  ["vision-to-leverage", ".fw-v2l-svg", ".fw-hotspot-stage", ".fw-v2l-node"],
] as const) {
  test(`${slug} touch controls sit on the visible nodes`, async ({ page }) => {
    await page.goto(`/frameworks/${slug}`);
    const distances = await page.evaluate(
      ({ svgClass, buttons, nodes }) => {
        const svg = document.querySelector<SVGSVGElement>(svgClass)!;
        const controls = [...document.querySelectorAll(buttons)];
        return [...svg.querySelectorAll<SVGCircleElement>(nodes)].map(
          (node, index) => {
            const point = new DOMPoint(
              node.cx.baseVal.value,
              node.cy.baseVal.value,
            ).matrixTransform(svg.getScreenCTM()!);
            const box = controls[index].getBoundingClientRect();
            return Math.hypot(
              point.x - box.left - box.width / 2,
              point.y - box.top - box.height / 2,
            );
          },
        );
      },
      { svgClass, buttons, nodes },
    );
    for (const distance of distances) expect(distance).toBeLessThan(2);
  });
}
