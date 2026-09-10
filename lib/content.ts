import path from "node:path";
import { z } from "zod";
import {
  calendarDateSchema,
  readMdxCollection,
  type CollectionEntry,
} from "./collections.ts";
import { validateAllFrameworks } from "./frameworks.ts";
import { validateAllLibrary } from "./library.ts";

export type ContentKind = "essays" | "notes" | "projects";
export type ProjectStatus = "Building" | "Active" | "Experiment" | "Archived";

const contentDirectory = path.join(process.cwd(), "content");

export const contentFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "is required"),
    description: z.string().trim().min(1, "is required"),
    publishedAt: calendarDateSchema,
    updatedAt: calendarDateSchema.optional(),
    slug: z.string().trim().min(1).optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true),
    status: z.enum(["Building", "Active", "Experiment", "Archived"]).optional(),
    year: z.string().trim().min(1).optional(),
    website: z.url().optional(),
  })
  .superRefine((entry, context) => {
    const today = new Date().toISOString().slice(0, 10);
    if (!entry.draft && entry.publishedAt > today) {
      context.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "cannot be in the future for published content",
      });
    }
  });

type ContentFrontmatter = z.output<typeof contentFrontmatterSchema>;

export type ContentEntry = CollectionEntry<ContentFrontmatter> & {
  kind: ContentKind;
};

export async function getAllContent(kind: ContentKind) {
  const entries = await readMdxCollection(
    path.join(contentDirectory, kind),
    contentFrontmatterSchema,
  );

  return entries.map((entry): ContentEntry => ({ ...entry, kind }));
}

export async function validateAllContent() {
  await Promise.all([
    ...(["essays", "notes", "projects"] as const).map((kind) =>
      getAllContent(kind),
    ),
    validateAllFrameworks(),
    validateAllLibrary(),
  ]);
}

export async function getContentBySlug(kind: ContentKind, slug: string) {
  const entries = await getAllContent(kind);
  return entries.find((entry) => entry.slug === slug) ?? null;
}

export async function getContentNeighbours(kind: ContentKind, slug: string) {
  const entries = await getAllContent(kind);
  const index = entries.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: entries[index + 1] ?? null,
    next: entries[index - 1] ?? null,
  };
}
