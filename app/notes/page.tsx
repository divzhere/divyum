import type { Metadata } from "next";
import { NoteList } from "@/components/note-list";
import { PageIntro } from "@/components/page-intro";
import { getAllContent } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Notes",
  description:
    "Short observations, questions, book notes and field notes by Divyum Bhumra.",
  path: "/notes",
  imagePath: "/notes/opengraph-image",
});

export default async function NotesPage() {
  const notes = await getAllContent("notes");

  return (
    <div className="page-shell inner-page notes-page">
      <PageIntro title="Notes">
        <p>
          Observations, unfinished ideas, reading notes and questions worth
          keeping.
        </p>
      </PageIntro>
      <div className="index-content scroll-reveal">
        <NoteList notes={notes} />
      </div>
    </div>
  );
}
