import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content-article";
import { BookArticle } from "@/components/book-article";
import type { ContentEntry } from "@/lib/content";
import type { LibraryEntry } from "@/lib/library";

export const metadata: Metadata = {
  title: "Local reading specimen — not published",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export function generateStaticParams() {
  return process.env.V3_DESIGN_LAB === "1"
    ? ["essay", "note", "book"].map((kind) => ({ kind }))
    : [];
}

// Test material only: these objects never enter the content collections.
const body = `Local fixture only. This is not Divyum's published writing or a real book recommendation. It exercises the actual article components with a long heading, a table, lists, code and an image.

## A heading that wraps naturally at narrow reading widths

An ordinary paragraph tests the measure and leading. **Emphasis stays readable**, while [this internal reference](/essays) remains recognisable without hovering. The page should stay quiet enough to read from beginning to end.

> A short quotation-shaped specimen checks the margin and contrast. This is test text, not an attributed quotation.

1. First numbered step.
2. Second numbered step.

- One list item.
- Another list item.

| Column one | Column two | Column three | Column four |
| --- | --- | --- | --- |
| Wide table specimen | A readable cell | Another readable cell | Final cell |

\`\`\`typescript
const readingSpecimenWithAnIntentionallyLongLine = "Code scrolls within its own container without widening the page";
\`\`\`

### A small local image

<img src="/icon.svg" alt="Local website mark used only as a reading-layout specimen" width="80" height="80" />

The last paragraph checks spacing before the article footer.
`;

export default async function ReadingSpecimen({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  if (
    process.env.V3_DESIGN_LAB !== "1" ||
    !["essay", "note", "book"].includes(kind)
  )
    notFound();
  const common = {
    title:
      "Reading specimen: a longer title to test the quiet space around an idea",
    description:
      "Local-only layout verification. This specimen is not published content.",
    slug: "reading-specimen",
    publishedAt: "2026-09-10",
    draft: true,
    body,
    readingTime: 2,
  };
  if (kind === "book") {
    const book: LibraryEntry = {
      ...common,
      kind: "book",
      author: "Test fixture, not an author",
      status: "read",
      themes: ["layout specimen"],
      rating: null,
      coverColor: "#843e34",
    };
    return (
      <div className="page-shell inner-page">
        <BookArticle book={book} />
      </div>
    );
  }
  const entry: ContentEntry = {
    ...common,
    kind: kind === "essay" ? "essays" : "notes",
    tags: ["layout specimen"],
    featured: false,
  };
  return (
    <ContentArticle
      entry={entry}
      label={kind === "essay" ? "Essay" : "Note"}
      basePath={kind === "essay" ? "/essays" : "/notes"}
      previous={null}
      next={null}
    />
  );
}
