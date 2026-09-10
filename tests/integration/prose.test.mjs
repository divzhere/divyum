import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Prose } from "../../components/prose.tsx";

describe("MDX reading links", () => {
  it("renders the supported reading elements from real MDX", async () => {
    const prose = Prose({
      source:
        "## A section\n\n> A quotation\n\n1. First step\n2. Second step\n\n- A bullet\n\n```js\nconst value = 1;\n```\n\n![An accessible image](/images/fixture.jpg)\n\n| Key | Value |\n| --- | --- |\n| A | B |",
    });
    const mdx = prose.props.children;
    const html = renderToStaticMarkup(await mdx.type(mdx.props));
    expect(html).toContain("<h2>A section</h2>");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>First step</li>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>A bullet</li>");
    expect(html).toContain('<pre><code class="language-js">const value = 1;');
    expect(html).toContain('alt="An accessible image"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain("<table>");
    expect(html).toContain("<th>Key</th>");
    expect(html).toContain("<td>B</td>");
  });

  it("keeps footnotes in the current document while external references open separately", async () => {
    const prose = Prose({
      source:
        "A note.[^1]\n\n[External reference](https://example.org)\n\n[^1]: Footnote text.",
    });
    const mdx = prose.props.children;
    const html = renderToStaticMarkup(await mdx.type(mdx.props));
    const links = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag);
    const footnoteLinks = links.filter((tag) => /href="#/.test(tag));
    expect(footnoteLinks).toHaveLength(2);
    for (const link of footnoteLinks)
      expect(link).not.toContain('target="_blank"');
    expect(
      links.find((tag) => tag.includes('href="https://example.org"')),
    ).toContain('target="_blank"');
  });
});
