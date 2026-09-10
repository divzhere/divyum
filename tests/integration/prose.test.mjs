import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Prose } from "../../components/prose.tsx";

describe("MDX reading links", () => {
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
