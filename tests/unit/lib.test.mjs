import { describe, expect, it } from "vitest";
import { currentlyItems } from "../../lib/currently.ts";
import { journeyChapters, journeyThemes } from "../../lib/journey.ts";
import { createMetadata } from "../../lib/metadata.ts";
import { absoluteUrl, siteConfig } from "../../lib/site.ts";
import { escapeXml, formatDate } from "../../lib/utils.ts";

describe("shared site data", () => {
  it("keeps journey identifiers, order and theme references valid", () => {
    const themeIds = new Set(journeyThemes.map(({ id }) => id));
    const chapterIds = journeyChapters.map(({ id }) => id);
    const sequences = journeyChapters.map(({ sequence }) => sequence);

    expect(new Set(chapterIds).size).toBe(chapterIds.length);
    expect(sequences).toEqual([...sequences].sort((a, b) => a - b));
    expect(
      journeyChapters.every(({ themes }) =>
        themes.every((id) => themeIds.has(id)),
      ),
    ).toBe(true);
  });

  it("keeps the currently snapshot structured and non-empty", () => {
    expect(currentlyItems.length).toBeGreaterThan(0);
    expect(currentlyItems.every(({ label, detail }) => label && detail)).toBe(
      true,
    );
  });

  it("builds canonical URLs and page metadata from site configuration", () => {
    expect(absoluteUrl("/about")).toBe(
      new URL("/about", siteConfig.url).toString(),
    );
    const metadata = createMetadata({
      title: "About",
      description: "A description.",
      path: "/about",
      type: "article",
      publishedTime: "2024-01-01",
      tags: ["Technology"],
    });

    expect(metadata.alternates?.canonical).toBe(absoluteUrl("/about"));
    expect(metadata.openGraph).toMatchObject({
      title: "About",
      type: "article",
      publishedTime: "2024-01-01",
      tags: ["Technology"],
    });
  });
});

describe("format helpers", () => {
  it("formats publication dates in UTC", () => {
    expect(formatDate("2024-01-02")).toBe("2 January 2024");
  });

  it("escapes all XML-sensitive characters", () => {
    expect(escapeXml(`<tag a='one' b="two">&`)).toBe(
      "&lt;tag a=&apos;one&apos; b=&quot;two&quot;&gt;&amp;",
    );
  });
});
