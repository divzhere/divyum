import { getAllContent } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { escapeXml } from "@/lib/utils";

export const dynamic = "force-static";

export async function GET() {
  const [essays, notes] = await Promise.all([
    getAllContent("essays"),
    getAllContent("notes"),
  ]);

  const entries = [...essays, ...notes].sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() -
      new Date(first.publishedAt).getTime(),
  );

  const items = entries
    .map((entry) => {
      const path = `/${entry.kind}/${entry.slug}`;
      const url = absoluteUrl(path);

      return `<item>
        <title>${escapeXml(entry.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(entry.description)}</description>
        <pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate>
      </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeXml(siteConfig.name)}</title>
      <link>${siteConfig.url}</link>
      <description>${escapeXml(siteConfig.description)}</description>
      <language>en</language>
      <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
      ${items}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
