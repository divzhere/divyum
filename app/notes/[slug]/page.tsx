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

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const notes = await getAllContent("notes");
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getContentBySlug("notes", slug);

  if (!note) {
    return {};
  }

  return createMetadata({
    title: note.title,
    description: note.description,
    path: `/notes/${note.slug}`,
    type: "article",
    publishedTime: note.publishedAt,
    modifiedTime: note.updatedAt,
    tags: note.tags,
  });
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getContentBySlug("notes", slug);

  if (!note) {
    notFound();
  }

  const { previous, next } = await getContentNeighbours("notes", slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: note.title,
          description: note.description,
          datePublished: note.publishedAt,
          dateModified: note.updatedAt ?? note.publishedAt,
          mainEntityOfPage: absoluteUrl(`/notes/${note.slug}`),
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          keywords: note.tags,
          inLanguage: "en",
        }}
      />
      <ContentArticle
        entry={note}
        label="Note"
        basePath="/notes"
        previous={previous}
        next={next}
      />
    </>
  );
}
