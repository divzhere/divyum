import { expect, test } from "@playwright/test";

const origin = "https://www.divyumbhumra.com";

const socialPages = [
  { path: "/", imagePath: "/opengraph-image" },
  { path: "/essays", imagePath: "/essays/opengraph-image" },
  {
    path: "/essays/do-not-measure-the-river-too-much",
    imagePath: "/essays/do-not-measure-the-river-too-much/opengraph-image",
  },
  { path: "/notes", imagePath: "/notes/opengraph-image" },
  {
    path: "/notes/eight-sacred-intentions",
    imagePath: "/notes/eight-sacred-intentions/opengraph-image",
  },
  { path: "/frameworks", imagePath: "/frameworks/opengraph-image" },
  {
    path: "/frameworks/eisenhower-matrix",
    imagePath: "/frameworks/eisenhower-matrix/opengraph-image",
  },
];

for (const { path, imagePath } of socialPages) {
  test(`${path} exposes a share-ready social card`, async ({
    page,
    request,
  }) => {
    await page.goto(path);

    const canonical = path === "/" ? origin : new URL(path, origin).toString();

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(
      page.locator('meta[property="og:description"]'),
    ).toHaveAttribute("content", /\S/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const openGraphImage = new URL(
      (await page
        .locator('meta[property="og:image"]')
        .getAttribute("content"))!,
    );
    const twitterImage = new URL(
      (await page
        .locator('meta[name="twitter:image"]')
        .getAttribute("content"))!,
    );
    for (const image of [openGraphImage, twitterImage]) {
      expect(image.origin).toBe(origin);
      expect(image.pathname).toBe(imagePath);
    }

    const response = await request.get(
      `${openGraphImage.pathname}${openGraphImage.search}`,
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).byteLength).toBeGreaterThan(10_000);
  });
}
