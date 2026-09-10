import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentArticle } from "../../components/content-article.tsx";

describe("article introduction", () => {
  it.each([
    ["A reader-facing subtitle.", "A reader-facing subtitle."],
    [undefined, "The search description."],
  ])(
    "renders the subtitle or falls back to the description: %s",
    (subtitle, expected) => {
      const article = ContentArticle({
        entry: {
          title: "A fixture",
          subtitle,
          description: "The search description.",
          publishedAt: "2024-01-01",
          readingTime: 2,
          tags: [],
          body: "",
        },
        label: "Essay",
        basePath: "/essays",
        previous: null,
        next: null,
      });
      // Only the reading header: the asynchronous MDX body is covered separately.
      const html = renderToStaticMarkup(article.props.children[0]);
      expect(html).toContain(`<p class="article-description">${expected}</p>`);
    },
  );
});
