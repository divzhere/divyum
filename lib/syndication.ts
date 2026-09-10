import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import type { Root, RootContent } from "mdast";
import type { ContentEntry } from "./content.ts";

/*
  Syndication renderers. MDX in this repo is the single source of truth;
  every output is a copy that points home via the canonical URL.

  entry.body ──assertSupportedMdx──▶ markdown subset
       │                                  │
       ▼                                  ▼
  hashnode.md / medium.md          substack.html (unified md→html,
  (markdown + canonical)           footnotes flattened, URLs absolutized)

  The supported subset is what the reading experience supports minus
  anything platform editors cannot survive: headings, prose, emphasis,
  quotes, gfm tables/lists/footnotes, code, images and links by URL.
  Imports, exports and JSX components are rejected loudly — a syndicated
  copy silently missing a component would misrepresent the essay.
*/

export type SyndicationPlatform = "hashnode" | "substack" | "medium";

const technicalTags = new Set([
  "technology",
  "ai",
  "startups",
  "software",
  "engineering",
  "product",
]);

export function suggestPlatform(tags: string[]): SyndicationPlatform {
  return tags.some((tag) => technicalTags.has(tag.toLowerCase()))
    ? "hashnode"
    : "substack";
}

const mdxParser = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);
const markdownWriter = unified()
  .use(remarkGfm)
  .use(remarkStringify, { bullet: "-", resourceLink: true });

function* nodes(node: Root | RootContent): Generator<Root | RootContent> {
  yield node;
  if ("children" in node) {
    for (const child of node.children) yield* nodes(child);
  }
}

function isComment(node: Root | RootContent) {
  return (
    (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") &&
    node.data?.estree?.body.length === 0
  );
}

/** Remove only actual MDX comments, never the same syntax inside code. */
export function stripMdxComments(body: string) {
  const comments = [...nodes(mdxParser.parse(body))].filter(isComment);
  for (const comment of comments.reverse()) {
    body =
      body.slice(0, comment.position!.start.offset!) +
      body.slice(comment.position!.end.offset!);
  }
  return body;
}

export function assertSupportedMdx(body: string, label: string) {
  let tree: Root;
  try {
    tree = mdxParser.parse(body);
  } catch (error) {
    throw new Error(
      `${label}: invalid MDX cannot be syndicated — ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  for (const node of nodes(tree)) {
    if (isComment(node)) continue;
    const unsupported =
      node.type === "mdxjsEsm"
        ? "import/export statements"
        : node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement"
          ? "JSX component usage"
          : node.type === "mdxFlowExpression" ||
              node.type === "mdxTextExpression"
            ? "MDX expression"
            : null;
    if (unsupported) {
      throw new Error(
        `${label}:${node.position!.start.line}: ${unsupported} cannot be syndicated — replace it with plain markdown`,
      );
    }
  }
}

function exportTree(entry: ContentEntry, canonical: string) {
  assertSupportedMdx(entry.body, `${entry.slug}.mdx`);
  const tree = mdxParser.parse(stripMdxComments(entry.body).trim());
  for (const node of nodes(tree)) {
    if (
      node.type !== "link" &&
      node.type !== "image" &&
      node.type !== "definition"
    )
      continue;
    // Anchors stay within the copy; scheme URLs (including mailto:) stay intact.
    if (!node.url.startsWith("#") && !/^[a-z][a-z0-9+.-]*:/i.test(node.url)) {
      node.url = new URL(node.url, canonical).href;
    }
  }
  return tree;
}

export function renderHashnodeMarkdown(entry: ContentEntry, canonical: string) {
  const body = markdownWriter.stringify(exportTree(entry, canonical)).trim();

  return `---
title: ${JSON.stringify(entry.title)}
canonicalUrl: ${canonical}
tags: ${entry.tags.map((tag) => tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")).join(", ")}
---

> Originally published at [${new URL(canonical).host}](${canonical}).

${body}
`;
}

export function renderMediumMarkdown(entry: ContentEntry, canonical: string) {
  const body = markdownWriter.stringify(exportTree(entry, canonical)).trim();

  return `# ${entry.title}

*Originally published at [${new URL(canonical).host}](${canonical}). Set the canonical link to that URL in Medium's import settings.*

${body}
`;
}

function flattenFootnotes(html: string) {
  // Substack's editor drops <sup>/<section> footnote chrome on paste.
  // Reduce references to plain bracketed numbers and the definitions to an
  // ordered list under a rule.
  let flattened = html.replace(
    /<sup><a[^>]*data-footnote-ref[^>]*>([^<]+)<\/a><\/sup>/g,
    " [$1]",
  );
  flattened = flattened.replace(
    /<section data-footnotes[^>]*>[\s\S]*?<ol>/,
    "<hr /><p><em>Notes</em></p><ol>",
  );
  flattened = flattened.replace(/<\/ol>\s*<\/section>/, "</ol>");
  flattened = flattened.replace(
    /\s*<a[^>]*data-footnote-backref[^>]*>[\s\S]*?<\/a>/g,
    "",
  );
  flattened = flattened.replace(
    /<h2[^>]*id="footnote-label"[^>]*>[\s\S]*?<\/h2>/,
    "",
  );
  return flattened;
}

export async function renderSubstackHtml(
  entry: ContentEntry,
  canonical: string,
) {
  const processor = unified().use(remarkRehype).use(rehypeStringify);
  const processed = await processor.run(exportTree(entry, canonical));
  const html = flattenFootnotes(processor.stringify(processed));

  return `<p><em>Originally published at <a href="${canonical}">${new URL(canonical).host}</a>.</em></p>
${html}
`;
}
