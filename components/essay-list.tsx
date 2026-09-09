import Link from "next/link";
import type { ContentEntry } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type EssayListProps = {
  essays: ContentEntry[];
};

export function EssayList({ essays }: EssayListProps) {
  if (essays.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">Essays are coming soon.</p>
        <p>
          I&apos;ve spent years building things and collecting questions. I&apos;m
          beginning to write them down.
        </p>
      </div>
    );
  }

  return (
    <ol className="entry-list">
      {essays.map((essay) => (
        <li key={essay.slug}>
          <Link className="entry-row" href={`/essays/${essay.slug}`}>
            <time dateTime={essay.publishedAt}>{formatDate(essay.publishedAt)}</time>
            <span className="entry-title">{essay.title}</span>
            <span className="entry-topics">{essay.tags.join(", ")}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
