import type { Metadata } from "next";
import { LibraryShelf } from "@/components/library-shelf";
import { PageIntro } from "@/components/page-intro";
import { getShelf } from "@/lib/library";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Library",
  description:
    "Books Divyum Bhumra is reading and rereading, with notes where a book earned them.",
  path: "/library",
});

export default async function LibraryPage() {
  const shelf = await getShelf();

  return (
    <div className="page-shell inner-page">
      <PageIntro title="Library">
        <p>
          Books in actual rotation. Spines carry the whole shelf; a book gets
          its own page only once it has earned real notes.
        </p>
      </PageIntro>
      <div className="index-content">
        <LibraryShelf entries={shelf} />
      </div>
    </div>
  );
}
