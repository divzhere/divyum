"use client";

import Link from "next/link";
import { useState } from "react";
import type { ShelfEntry } from "@/lib/library";

/*
  A shelf, not a card grid. Books render as typographic spines — title and
  author set vertically, tinted by coverColor — sortable by year, status or
  theme. No cover art. Spines without reading notes are inert; spines with
  notes link to their page. Placeholders are labelled as such.
*/

const sortModes = [
  { id: "year", label: "By year" },
  { id: "status", label: "By status" },
  { id: "theme", label: "By theme" },
] as const;

type SortMode = (typeof sortModes)[number]["id"];

const statusOrder = ["reading", "rereading", "read", "shelved"] as const;

const statusLabels: Record<string, string> = {
  reading: "Reading",
  rereading: "Rereading",
  read: "Read",
  shelved: "Shelved",
};

function sortShelf(entries: ShelfEntry[], mode: SortMode) {
  const copy = [...entries];
  if (mode === "year") {
    return copy.sort(
      (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title),
    );
  }
  if (mode === "status") {
    return copy.sort(
      (a, b) =>
        statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) ||
        a.title.localeCompare(b.title),
    );
  }
  return copy.sort(
    (a, b) =>
      (a.themes[0] ?? "").localeCompare(b.themes[0] ?? "") ||
      a.title.localeCompare(b.title),
  );
}

export function LibraryShelf({ entries }: { entries: ShelfEntry[] }) {
  const [mode, setMode] = useState<SortMode>("year");
  const sorted = sortShelf(entries, mode);
  const hasPlaceholders = entries.some((entry) => entry.placeholder);

  return (
    <div className="library">
      <div className="fw-toggle-group" role="group" aria-label="Sort the shelf">
        {sortModes.map((option) => (
          <button
            className="fw-toggle"
            key={option.id}
            type="button"
            aria-pressed={mode === option.id}
            onClick={() => setMode(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ul className="library-shelf" aria-label="Bookshelf">
        {sorted.map((entry) => {
          const spine = (
            <>
              <span className="library-spine-theme">
                {entry.themes.join(" / ")}
              </span>
              <span className="library-spine-title">{entry.title}</span>
              <span className="library-spine-author">
                {entry.placeholder ? "Not added yet" : entry.author}
              </span>
            </>
          );

          return (
            <li
              className="library-slot"
              key={entry.slug}
              data-placeholder={entry.placeholder || undefined}
            >
              {entry.hasNotes ? (
                <Link
                  className="library-spine"
                  href={`/library/${entry.slug}`}
                  style={{ "--spine": entry.coverColor } as React.CSSProperties}
                >
                  {spine}
                </Link>
              ) : (
                <span
                  className="library-spine"
                  style={{ "--spine": entry.coverColor } as React.CSSProperties}
                >
                  {spine}
                </span>
              )}
              <span className="library-slot-meta">
                {entry.placeholder
                  ? "placeholder"
                  : [statusLabels[entry.status], entry.year]
                      .filter(Boolean)
                      .join(" · ")}
              </span>
            </li>
          );
        })}
      </ul>

      {hasPlaceholders && (
        <p className="library-note">
          The spines marked as placeholders are exactly that — the real
          bookshelf is being carried over one book at a time.
        </p>
      )}
    </div>
  );
}
