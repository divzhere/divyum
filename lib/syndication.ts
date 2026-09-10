import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
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

/** Strip MDX comment expressions; they are notes to the source, not prose. */
export function stripMdxComments(body: string) {
  return body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\n{3,}/g, "\n\n");
}

export function assertSupportedMdx(body: string, label: string) {
  const lines = body.split("\n");
  let inFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (/^\s*import\s/.test(line) || /^\s*export\s/.test(line)) {
      throw new Error(
        `${label}:${index + 1}: import/export statements cannot be syndicated — inline the content or drop it from the syndicated copy`,
      );
    }
    if (/<[A-Z][A-Za-z]*/.test(line)) {
      throw new Error(
        `${label}:${index + 1}: JSX component usage (${line.trim().slice(0, 40)}…) cannot be syndicated — platforms cannot render it`,
      );
    }
  }

  const withoutComments = stripMdxComments(body);
  const fenceStripped = withoutComments.replace(/(```|~~~)[\s\S]*?\1/g, "");
  const expression = fenceStripped.match(/\{[^\n}]*\}/);
  if (expression && !/^\{\s*\}$/.test(expression[0])) {
    throw new Error(
      `${label}: MDX expression ${expression[0].slice(0, 40)} cannot be syndicated — replace it with plain markdown`,
    );
  }
}

function absolutize(markdownOrHtml: string, origin: string) {
  return markdownOrHtml
    .replace(/(\]\()\/(?!\/)/g, `$1${origin}/`)
    .replace(/((?:href|src)=")\/(?!\/)/g, `$1${origin}/`);
}

export function renderHashnodeMarkdown(entry: ContentEntry, canonical: string) {
  const origin = new URL(canonical).origin;
  const body = absolutize(stripMdxComments(entry.body).trim(), origin);

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
  const origin = new URL(canonical).origin;
  const body = absolutize(stripMdxComments(entry.body).trim(), origin);

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
  const origin = new URL(canonical).origin;
  const markdown = stripMdxComments(entry.body).trim();

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  const html = flattenFootnotes(absolutize(String(processed), origin));

  return `<p><em>Originally published at <a href="${canonical}">${new URL(canonical).host}</a>.</em></p>
${html}
`;
}
