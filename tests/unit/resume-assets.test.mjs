import { readdir, readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config.ts";

describe("resume assets", () => {
  it("keeps the generated and public PDFs synchronized", async () => {
    const [source, published] = await Promise.all([
      readFile("resume/divyum-bhumra-resume.pdf"),
      readFile("public/resume/divyum-bhumra-resume.pdf"),
    ]);

    expect(source.equals(published)).toBe(true);
    expect(source.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("keeps current employer and contact links in the resume source", async () => {
    const source = await readFile("resume/divyum-bhumra-resume.tex", "utf8");

    expect(source).toContain("Denim Health");
    expect(source).toContain("lead frontend and product role in 2025");
    expect(source).toContain("AI-Native Product Engineering");
    expect(source).toContain("\\href{tel:+919876767356}{+91 98767 67356}");
    expect(source).toContain(
      "\\href{https://www.divyumbhumra.com/}{divyumbhumra.com}",
    );
    expect(source).toContain(
      "\\href{https://www.linkedin.com/in/divyum/}{linkedin.com/in/divyum}",
    );
  });

  it("publishes exactly two WebP page previews", async () => {
    const previewNames = (await readdir("public/resume"))
      .filter((name) => /resume-page-\d+\.webp$/.test(name))
      .sort();

    expect(previewNames).toEqual([
      "divyum-bhumra-resume-page-1.webp",
      "divyum-bhumra-resume-page-2.webp",
    ]);

    for (const name of previewNames) {
      const image = await readFile(`public/resume/${name}`);
      expect(image.subarray(0, 4).toString()).toBe("RIFF");
      expect(image.subarray(8, 12).toString()).toBe("WEBP");
    }
  });

  it("does not advertise image widths beyond the resume source", () => {
    expect(nextConfig.images?.deviceSizes).toEqual([640, 750, 828, 1080, 1200]);
    expect(
      Math.max(...(nextConfig.images?.deviceSizes ?? [])),
    ).toBeLessThanOrEqual(1241);
  });
});
