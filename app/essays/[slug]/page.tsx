import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content-article";
import { JsonLd } from "@/components/json-ld";
import {
  getAllContent,
  getContentBySlug,
  getContentNeighbours,
} from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

type EssayPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const essays = await getAllContent("essays");
  return essays.map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({ params }: EssayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getContentBySlug("essays", slug);

  if (!essay) {
    return {};
  }

  return createMetadata({
    title: essay.title,
    description: essay.description,
    path: `/essays/${essay.slug}`,
    type: "article",
    publishedTime: essay.publishedAt,
    modifiedTime: essay.updatedAt,
    tags: essay.tags,
  });
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params;
  const essay = await getContentBySlug("essays", slug);

  if (!essay) {
    notFound();
  }

  const { previous, next } = await getContentNeighbours("essays", slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: essay.title,
          description: essay.description,
          datePublished: essay.publishedAt,
          dateModified: essay.updatedAt ?? essay.publishedAt,
          mainEntityOfPage: absoluteUrl(`/essays/${essay.slug}`),
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          publisher: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          keywords: essay.tags,
          inLanguage: "en",
        }}
      />
      <ContentArticle
        entry={essay}
        label="Essay"
        basePath="/essays"
        previous={previous}
        next={next}
      />
    </>
  );
}
