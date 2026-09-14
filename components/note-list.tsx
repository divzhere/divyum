import Link from "next/link";
import { EditionRow } from "@/components/edition-row";
import type { ContentEntry } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type NoteListProps = {
  notes: ContentEntry[];
};

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <EditionRow label="Note 001" />
        <p>
          Short observations, book notes and questions will collect here as they
          take shape.
        </p>
      </div>
    );
  }

  return (
    <ol className="entry-list notes-list">
      {notes.map((note) => (
        <li key={note.slug}>
          <Link className="entry-row" href={`/notes/${note.slug}`}>
            <time dateTime={note.publishedAt}>
              {formatDate(note.publishedAt)}
            </time>
            <span className="entry-title">{note.title}</span>
            <span className="entry-topics">{note.tags.join(", ")}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
