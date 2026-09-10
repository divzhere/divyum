import path from "node:path";
import { z } from "zod";
import { calendarDateSchema, readMdxCollection } from "./collections.ts";

/*
  Frameworks: thinking tools rendered as purpose-built visuals.

  content/frameworks/*.mdx ──▶ readMdxCollection(frameworkSchema)
                                     │
      visual key ──must map to──▶ components/frameworks/ registry
                                     │ unknown key = loud build failure
                                     ▼
      /frameworks index (grouped by lineage or domain) + /frameworks/[slug]
*/

import {
  frameworkLineages,
  frameworkVisualKeys,
  lineageLabels,
  type FrameworkLineage,
  type FrameworkVisualKey,
} from "./frameworks-meta.ts";

export {
  frameworkLineages,
  frameworkVisualKeys,
  lineageLabels,
  type FrameworkLineage,
  type FrameworkVisualKey,
};

export const frameworkSchema = z.object({
  title: z.string().trim().min(1, "is required"),
  subtitle: z.string().trim().min(1, "is required"),
  slug: z.string().trim().min(1).optional(),
  origin: z.string().trim().min(1, "is required"),
  lineage: z.enum(frameworkLineages),
  domains: z.array(z.string().trim().min(1)).min(1),
  visual: z.enum(frameworkVisualKeys, {
    error: () =>
      `must be one of the implemented visuals: ${frameworkVisualKeys.join(", ")}`,
  }),
  related: z.array(z.string().trim().min(1)).default([]),
  publishedAt: calendarDateSchema,
  updatedAt: calendarDateSchema.optional(),
  draft: z.boolean().default(true),
});

type FrameworkFrontmatter = z.output<typeof frameworkSchema>;

export type FrameworkEntry = FrameworkFrontmatter & {
  slug: string;
  body: string;
  readingTime: number;
};

const frameworksDirectory = path.join(process.cwd(), "content", "frameworks");

export async function getAllFrameworks(): Promise<FrameworkEntry[]> {
  const entries = await readMdxCollection(frameworksDirectory, frameworkSchema);

  // Related slugs must reference real frameworks; a typo should fail the
  // build with a message naming the entry, never render a dead link.
  const slugs = new Set(entries.map((entry) => entry.slug));
  for (const entry of entries) {
    for (const related of entry.related) {
      if (!slugs.has(related)) {
        throw new Error(
          `Unknown related framework \"${related}\" referenced by \"${entry.slug}\"`,
        );
      }
    }
  }

  return entries;
}

export async function validateAllFrameworks() {
  await getAllFrameworks();
}

export async function getFrameworkBySlug(slug: string) {
  const entries = await getAllFrameworks();
  return entries.find((entry) => entry.slug === slug) ?? null;
}

export function groupFrameworks(
  entries: FrameworkEntry[],
  grouping: "lineage" | "domain",
) {
  const groups = new Map<string, FrameworkEntry[]>();

  if (grouping === "lineage") {
    for (const lineage of frameworkLineages) {
      const members = entries.filter((entry) => entry.lineage === lineage);
      if (members.length > 0) groups.set(lineageLabels[lineage], members);
    }
    return groups;
  }

  const domains = [
    ...new Set(entries.flatMap((entry) => entry.domains)),
  ].sort();
  for (const domain of domains) {
    groups.set(
      domain,
      entries.filter((entry) => entry.domains.includes(domain)),
    );
  }
  return groups;
}
