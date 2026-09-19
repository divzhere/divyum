import { expect, test } from "@playwright/test";

test("resume can be previewed, opened and downloaded", async ({ page }) => {
  await page.goto("/resume");

  const pdfPath = "/resume/divyum-bhumra-resume.pdf";
  const previews = page.locator('img[src*="divyum-bhumra-resume-page-"]');
  await expect(previews).toHaveCount(2);
  await expect(previews.nth(0)).toHaveAttribute("alt", "");
  await expect(previews.nth(1)).toHaveAttribute("alt", "");
  await expect(page.getByRole("link", { name: /View PDF/ })).toHaveAttribute(
    "href",
    pdfPath,
  );
  const downloadLink = page.getByRole("link", { name: /Download PDF/ });
  await expect(downloadLink).toHaveAttribute("href", pdfPath);
  await expect(downloadLink).toHaveAttribute(
    "download",
    "Divyum-Bhumra-Resume.pdf",
  );
  await expect(
    page.getByRole("link", { name: "open the PDF directly" }),
  ).toHaveAttribute("href", pdfPath);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/resume$/,
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    /\/resume$/,
  );

  await page
    .getByText("Read the accessible text version", { exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Founding Engineer / Lead Engineer · Denim Health",
    }),
  ).toBeVisible();
  await expect(page.locator("main")).not.toContainText("98767");

  const response = await page.request.get(pdfPath);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    downloadLink.click(),
  ]);
  expect(download.suggestedFilename()).toBe("Divyum-Bhumra-Resume.pdf");
  expect(await download.failure()).toBeNull();

  const sitemap = await page.request.get("/sitemap.xml");
  const sitemapXml = await sitemap.text();
  const sitemapPaths = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    ([, location]) => new URL(location).pathname,
  );
  expect(sitemapPaths).toEqual(
    expect.arrayContaining(["/resume", "/experience"]),
  );
});
