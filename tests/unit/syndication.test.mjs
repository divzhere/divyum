import { describe, expect, it } from "vitest";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
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

  it.each([
    "<span>Content that an HTML exporter would drop</span>",
    "<>A fragment</>",
    "The answer is {\n  40 + 2\n}.",
  ])("rejects unsupported MDX instead of silently losing it: %s", (body) => {
    expect(() => assertSupportedMdx(body, "unsupported.mdx")).toThrow(
      /unsupported\.mdx.*cannot be syndicated/,
    );
  });

  it("accepts MDX examples in inline code and nested or mixed fences", () => {
    const body =
      "Use `<Component />` and `{value}`.\n\n````mdx\n```js\n<Example />\n~~~\n{value}\n```\n````";
    expect(() => assertSupportedMdx(body, "examples.mdx")).not.toThrow();
  });

  it("does not treat markup inside an authoring comment as live content", () => {
    expect(() =>
      assertSupportedMdx(
        '{/*\nimport X from "x";\n<Component />\n*/}\n\nProse.',
        "comment.mdx",
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
  it.each([
    ["[other](./other)", "https://example.org/essays/other"],
    ["![photo](../images/photo.jpg)", "https://example.org/images/photo.jpg"],
    [
      '[other][ref]\n\n[ref]: other "A title"',
      "https://example.org/essays/other",
    ],
    [
      "![photo][ref]\n\n[ref]: /images/photo.jpg",
      "https://example.org/images/photo.jpg",
    ],
    [
      "![photo](//cdn.example.org/photo.jpg)",
      "https://cdn.example.org/photo.jpg",
    ],
    [
      "[query](?view=print)",
      "https://example.org/essays/fixture-essay?view=print",
    ],
    [
      '[space](<images/a b.jpg> "Photo title")',
      "https://example.org/essays/images/a%20b.jpg",
    ],
    ["[paren](images/a(b).jpg)", "https://example.org/essays/images/a(b).jpg"],
  ])(
    "resolves actual URL nodes against the article URL: %s",
    async (body, expected) => {
      const entry = { ...fixtureEntry, body };
      const htmlOutputs = [await renderSubstackHtml(entry, canonical)];
      for (const markdown of [
        renderHashnodeMarkdown(entry, canonical),
        renderMediumMarkdown(entry, canonical),
      ]) {
        // Check the destination readers receive, allowing valid Markdown escaping.
        const html = await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype)
          .use(rehypeStringify)
          .process(matter(markdown).content);
        htmlOutputs.push(String(html));
      }
      for (const output of htmlOutputs) {
        expect(output).toContain(`="${expected}"`);
      }
    },
  );

  it("leaves code examples and their MDX comments intact in each export", async () => {
    const code = "[link](/example)\n{/* comment in code */}";
    const entry = {
      ...fixtureEntry,
      body: "`[inline](/example)`\n\n```mdx\n" + code + "\n```",
    };
    for (const output of [
      renderHashnodeMarkdown(entry, canonical),
      renderMediumMarkdown(entry, canonical),
      await renderSubstackHtml(entry, canonical),
    ]) {
      expect(output).toContain("[inline](/example)");
      expect(output).toContain(code);
      expect(output).not.toContain("https://example.org/example");
    }
  });

  it("keeps local anchors and non-HTTP destinations unchanged", async () => {
    const entry = {
      ...fixtureEntry,
      body: "[Section](#section) [Email](mailto:hello@example.org) [Elsewhere](https://other.example/path)",
    };
    for (const output of [
      renderHashnodeMarkdown(entry, canonical),
      await renderSubstackHtml(entry, canonical),
    ]) {
      expect(output).toContain("#section");
      expect(output).not.toContain("fixture-essay#section");
      expect(output).toContain("mailto:hello@example.org");
      expect(output).toContain("https://other.example/path");
    }
  });

  it("preserves backslashes and quotes in the exported Hashnode title", () => {
    const title = String.raw`Reading "C:\notes"`;
    const output = renderHashnodeMarkdown(
      { ...fixtureEntry, title },
      canonical,
    );
    expect(matter(output).data.title).toBe(title);
  });

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
