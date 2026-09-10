import Link from "next/link";
import { Prose } from "@/components/prose";
import { PointRule } from "@/components/point-rule";
import type { ContentEntry } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type ContentArticleProps = {
  entry: ContentEntry;
  label: "Essay" | "Note";
  basePath: "/essays" | "/notes";
  previous: ContentEntry | null;
  next: ContentEntry | null;
};

export function ContentArticle({
  entry,
  label,
  basePath,
  previous,
  next,
}: ContentArticleProps) {
  return (
    <article className="page-shell article-shell">
      <header className="article-header">
        <div className="article-margin">
          <Link className="text-link" href={basePath}>
            {label}s
          </Link>
        </div>
        <div>
          <h1 className="editorial-reveal">{entry.title}</h1>
          <p className="article-description">
            {entry.subtitle ?? entry.description}
          </p>
          <div className="article-meta">
            <time dateTime={entry.publishedAt}>
              {formatDate(entry.publishedAt)}
            </time>
            <span>{entry.readingTime} min read</span>
          </div>
        </div>
      </header>

      <PointRule className="article-horizon" />

      <div className="article-content-grid">
        <div aria-hidden="true" />
        <Prose source={entry.body} />
      </div>

      <footer className="article-footer">
        <div className="article-tags" aria-label="Topics">
          {entry.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {(previous || next) && (
          <nav
            className="article-neighbours"
            aria-label={`${label} navigation`}
          >
            {previous ? (
              <Link href={`${basePath}/${previous.slug}`}>
                <span>Previous</span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`${basePath}/${next.slug}`}>
                <span>Next</span>
                {next.title}
              </Link>
            )}
          </nav>
        )}
      </footer>
    </article>
  );
}
