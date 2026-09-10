import { describe, expect, it } from "vitest";
import {
  assertSupportedMdx,
  renderHashnodeMarkdown,
  renderMediumMarkdown,
  renderSubstackHtml,
  stripMdxComments,
  suggestPlatform,
} from "../../lib/syndication.ts";

const fixtureEntry = {
  kind: "essays",
  slug: "fixture-essay",
  title: 'The "fixture" essay',
  description: "A fixture covering the whole supported subset.",
  publishedAt: "2026-09-01",
  tags: ["Technology", "Philosophy"],
  featured: false,
  draft: false,
  readingTime: 3,
  body: `A paragraph with **bold**, *italics* and a [relative link](/essays/other).

{/* an authoring note that must never reach a platform */}

## A heading

> A quotation.

A footnote reference.[^1]

| Column | Value |
| ------ | ----- |
| a      | 1     |

- a list item
- another

\`\`\`js
const code = "stays verbatim";
\`\`\`

![An image](/images/photo.jpg)

[^1]: The footnote text.
`,
};

const canonical = "https://example.org/essays/fixture-essay";

describe("supported-content contract", () => {
  it("accepts the full supported subset", () => {
    expect(() =>
      assertSupportedMdx(fixtureEntry.body, "fixture.mdx"),
    ).not.toThrow();
  });

  it("rejects import statements with the file and line", () => {
    expect(() =>
      assertSupportedMdx('import { X } from "y";\n\nProse.', "bad.mdx"),
    ).toThrow(/bad\.mdx:1: import\/export/);
  });

  it("rejects JSX component usage by name", () => {
    expect(() =>
      assertSupportedMdx("Prose.\n\n<HeroExperience />\n", "bad.mdx"),
    ).toThrow(/JSX component usage/);
  });

  it("rejects live MDX expressions but tolerates code fences", () => {
    expect(() =>
      assertSupportedMdx("The count is {40 + 2}.", "bad.mdx"),
    ).toThrow(/MDX expression/);
    expect(() =>
      assertSupportedMdx(
        "```js\nimport real from 'code';\nconst x = {a: 1};\n```\n",
        "ok.mdx",
      ),
    ).not.toThrow();
  });
});

describe("platform routing suggestion", () => {
  it("routes technical tags to Hashnode and everything else to Substack", () => {
    expect(suggestPlatform(["AI", "Philosophy"])).toBe("hashnode");
    expect(suggestPlatform(["Travel", "Life"])).toBe("substack");
  });
});

describe("renderers", () => {
  it("strips authoring comments from every output", async () => {
    const hashnode = renderHashnodeMarkdown(fixtureEntry, canonical);
    const medium = renderMediumMarkdown(fixtureEntry, canonical);
    const substack = await renderSubstackHtml(fixtureEntry, canonical);

    for (const output of [hashnode, medium, substack]) {
      expect(output).not.toContain("authoring note");
    }
    expect(stripMdxComments("a\n\n{/* x */}\n\nb")).not.toContain("x");
  });

  it("injects the canonical URL at the top of every output", async () => {
    const hashnode = renderHashnodeMarkdown(fixtureEntry, canonical);
    const medium = renderMediumMarkdown(fixtureEntry, canonical);
    const substack = await renderSubstackHtml(fixtureEntry, canonical);

    expect(hashnode).toContain(`canonicalUrl: ${canonical}`);
    expect(medium.split("\n")[2]).toContain(canonical);
    expect(substack.split("\n")[0]).toContain(canonical);
  });

  it("absolutizes relative links and images against the canonical origin", async () => {
    const hashnode = renderHashnodeMarkdown(fixtureEntry, canonical);
    const substack = await renderSubstackHtml(fixtureEntry, canonical);

    expect(hashnode).toContain("(https://example.org/essays/other)");
    expect(hashnode).toContain("(https://example.org/images/photo.jpg)");
    expect(substack).toContain('href="https://example.org/essays/other"');
    expect(substack).toContain('src="https://example.org/images/photo.jpg"');
  });

  it("flattens footnotes for Substack into bracketed numbers and a notes list", async () => {
    const substack = await renderSubstackHtml(fixtureEntry, canonical);

    expect(substack).not.toContain("<sup>");
    expect(substack).not.toContain("data-footnote-backref");
    expect(substack).toContain("[1]");
    expect(substack).toContain("<em>Notes</em>");
    expect(substack).toContain("The footnote text.");
  });

  it("matches the platform snapshots for the fixture essay", async () => {
    expect(renderHashnodeMarkdown(fixtureEntry, canonical)).toMatchSnapshot(
      "hashnode",
    );
    expect(renderMediumMarkdown(fixtureEntry, canonical)).toMatchSnapshot(
      "medium",
    );
    expect(await renderSubstackHtml(fixtureEntry, canonical)).toMatchSnapshot(
      "substack",
    );
  });
});
