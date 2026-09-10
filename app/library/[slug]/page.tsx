import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import {
  getAllLibraryEntries,
  getBookBySlug,
  hasReadingNotes,
} from "@/lib/library";
import { createMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await getAllLibraryEntries();
  return entries
    .filter((entry) => hasReadingNotes(entry))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    return {};
  }

  return createMetadata({
    title: `${book.title} — reading notes`,
    description: book.description,
    path: `/library/${book.slug}`,
    type: "article",
    publishedTime: book.publishedAt,
    modifiedTime: book.updatedAt,
    tags: book.themes,
  });
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="page-shell inner-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: book.title,
          author: { "@type": "Person", name: book.author },
          ...(book.year && { datePublished: String(book.year) }),
          mainEntityOfPage: absoluteUrl(`/library/${book.slug}`),
          review: {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
            },
            datePublished: book.publishedAt,
            description: book.description,
          },
          inLanguage: "en",
        }}
      />
      <article className="framework-article">
        <header className="framework-header">
          <p className="framework-eyebrow">
            <span>Reading notes</span>
            <span aria-hidden="true"> · </span>
            <span>{book.themes.join(", ")}</span>
          </p>
          <h1>{book.title}</h1>
          <p className="framework-subtitle">
            {book.author}
            {book.year ? `, ${book.year}` : ""}
          </p>
          <p className="framework-dateline">
            <time dateTime={book.publishedAt}>
              {formatDate(book.publishedAt)}
            </time>
            <span aria-hidden="true"> · </span>
            <span>{book.readingTime} min read</span>
          </p>
        </header>
        <Prose source={book.body} />
      </article>
    </div>
  );
}
