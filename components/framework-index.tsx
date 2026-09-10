"use client";

import Link from "next/link";
import { useState } from "react";
import {
  lineageLabels,
  type FrameworkLineage,
  type FrameworkVisualKey,
} from "@/lib/frameworks-meta";
import { frameworkGlyphs } from "@/components/frameworks/glyphs";

/*
  Editorial index, not a card wall. Rows grouped by lineage by default, with a
  toggle to regroup by domain. Each row carries the small glyph derived from
  its framework's own visual, like a plate section in a book.
*/

export type FrameworkIndexEntry = {
  slug: string;
  title: string;
  subtitle: string;
  lineage: FrameworkLineage;
  domains: string[];
  visual: FrameworkVisualKey;
};

type FrameworkIndexProps = {
  entries: FrameworkIndexEntry[];
};

export function FrameworkIndex({ entries }: FrameworkIndexProps) {
  const [grouping, setGrouping] = useState<"lineage" | "domain">("lineage");

  const groups = new Map<string, FrameworkIndexEntry[]>();
  if (grouping === "lineage") {
    for (const lineage of ["western", "eastern", "personal"] as const) {
      const members = entries.filter((entry) => entry.lineage === lineage);
      if (members.length > 0) groups.set(lineageLabels[lineage], members);
    }
  } else {
    const domains = [
      ...new Set(entries.flatMap((entry) => entry.domains)),
    ].sort();
    for (const domain of domains) {
      groups.set(
        domain,
        entries.filter((entry) => entry.domains.includes(domain)),
      );
    }
  }

  return (
    <div className="framework-index">
      <div
        className="fw-toggle-group framework-grouping"
        role="group"
        aria-label="Group the frameworks"
      >
        <button
          className="fw-toggle"
          type="button"
          aria-pressed={grouping === "lineage"}
          onClick={() => setGrouping("lineage")}
        >
          By lineage
        </button>
        <button
          className="fw-toggle"
          type="button"
          aria-pressed={grouping === "domain"}
          onClick={() => setGrouping("domain")}
        >
          By domain
        </button>
      </div>

      {[...groups.entries()].map(([groupName, members]) => (
        <section className="framework-group" key={groupName}>
          <h2 className="framework-group-title">{groupName}</h2>
          <ul className="framework-rows">
            {members.map((entry) => {
              const Glyph = frameworkGlyphs[entry.visual];
              return (
                <li key={entry.slug}>
                  <Link
                    className="framework-row"
                    href={`/frameworks/${entry.slug}`}
                  >
                    <Glyph className="framework-row-glyph" />
                    <span className="framework-row-copy">
                      <span className="framework-row-title">{entry.title}</span>
                      <span className="framework-row-subtitle">
                        {entry.subtitle}
                      </span>
                    </span>
                    <span className="framework-row-domains" aria-hidden="true">
                      {entry.domains.join(" · ")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
