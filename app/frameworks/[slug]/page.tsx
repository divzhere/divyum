import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { frameworkVisuals } from "@/components/frameworks";
import { frameworkGlyphs } from "@/components/frameworks/glyphs";
import {
  getAllFrameworks,
  getFrameworkBySlug,
  lineageLabels,
} from "@/lib/frameworks";
import { createMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type FrameworkPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const frameworks = await getAllFrameworks();
  return frameworks.map((framework) => ({ slug: framework.slug }));
}

export async function generateMetadata({
  params,
}: FrameworkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);

  if (!framework) {
    return {};
  }

  return createMetadata({
    title: framework.title,
    description: framework.description,
    path: `/frameworks/${framework.slug}`,
    imagePath: `/frameworks/${framework.slug}/opengraph-image`,
    type: "article",
    publishedTime: framework.publishedAt,
    modifiedTime: framework.updatedAt,
    tags: framework.domains,
  });
}

export default async function FrameworkPage({ params }: FrameworkPageProps) {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);

  if (!framework) {
    notFound();
  }

  const all = await getAllFrameworks();
  const related = framework.related
    .map((relatedSlug) => all.find((entry) => entry.slug === relatedSlug))
    .filter((entry) => entry !== undefined);

  const Visual = frameworkVisuals[framework.visual];

  return (
    <div className="page-shell inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: framework.title,
          description: framework.description,
          datePublished: framework.publishedAt,
          dateModified: framework.updatedAt ?? framework.publishedAt,
          mainEntityOfPage: absoluteUrl(`/frameworks/${framework.slug}`),
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          keywords: framework.domains,
          inLanguage: "en",
        }}
      />
      <article className="framework-article">
        <header className="framework-header">
          <p className="framework-eyebrow">
            <span>{lineageLabels[framework.lineage]}</span>
            <span aria-hidden="true"> · </span>
            <span>{framework.domains.join(", ")}</span>
          </p>
          <h1>{framework.title}</h1>
          <p className="framework-subtitle">{framework.subtitle}</p>
          <p className="framework-dateline">
            <time dateTime={framework.publishedAt}>
              {formatDate(framework.publishedAt)}
            </time>
            <span aria-hidden="true"> · </span>
            <span>{framework.readingTime} min read</span>
          </p>
        </header>

        <div className="framework-visual-frame">
          <Visual />
        </div>

        <Prose source={framework.body} />

        {related.length > 0 && (
          <nav className="framework-related" aria-label="Related frameworks">
            <h2>Related</h2>
            <ul>
              {related.map((entry) => {
                const Glyph = frameworkGlyphs[entry.visual];
                return (
                  <li key={entry.slug}>
                    <Link
                      className="framework-row"
                      href={`/frameworks/${entry.slug}`}
                    >
                      <Glyph className="framework-row-glyph" />
                      <span className="framework-row-copy">
                        <span className="framework-row-title">
                          {entry.title}
                        </span>
                        <span className="framework-row-subtitle">
                          {entry.subtitle}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </article>
    </div>
  );
}
