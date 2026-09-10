import { Prose } from "@/components/prose";
import { PointRule } from "@/components/point-rule";
import type { LibraryEntry } from "@/lib/library";
import { formatDate } from "@/lib/utils";

export function BookArticle({ book }: { book: LibraryEntry }) {
  return (
    <article className="framework-article book-article">
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
        <PointRule className="article-horizon" />
      </header>
      <Prose source={book.body} />
    </article>
  );
}
