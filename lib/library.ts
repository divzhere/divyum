import path from "node:path";
import { z } from "zod";
import {
  calendarDateSchema,
  readMdxCollection,
  validatePublicationDate,
} from "./collections.ts";
import { placeholderShelf } from "./library-seed.ts";

/*
  Library: books only in this phase. The `kind` field anticipates papers,
  people and ideas later without a rewrite — the schema discriminates on it
  and the shelf simply filters.

  content/library/*.mdx (books with reading notes; body = the notes)
        │ readMdxCollection(bookSchema)
        ▼
  shelf = MDX books ∪ placeholder seeds (lib/library-seed.ts, one file the
  owner replaces in five minutes). Entries without notes render as spines
  but never link to an empty page.
*/

export const libraryKinds = ["book", "paper", "person", "idea"] as const;
export type LibraryKind = (typeof libraryKinds)[number];

export const bookStatuses = [
  "reading",
  "read",
  "rereading",
  "shelved",
] as const;
export type BookStatus = (typeof bookStatuses)[number];

export const librarySchema = z
  .object({
    kind: z.enum(libraryKinds).default("book"),
    title: z.string().trim().min(1, "is required"),
    description: z.string().trim().min(1, "is required"),
    author: z.string().trim().min(1, "is required"),
    year: z.number().int().min(0).max(2100).optional(),
    slug: z.string().trim().min(1).optional(),
    status: z.enum(bookStatuses),
    rating: z.number().min(1).max(10).nullable().default(null),
    themes: z.array(z.string().trim().min(1)).min(1),
    coverColor: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "must be a six-digit hex colour"),
    publishedAt: calendarDateSchema,
    updatedAt: calendarDateSchema.optional(),
    draft: z.boolean().default(true),
  })
  .superRefine(validatePublicationDate);

type LibraryFrontmatter = z.output<typeof librarySchema>;

export type LibraryEntry = LibraryFrontmatter & {
  slug: string;
  body: string;
  readingTime: number;
};

/** A spine on the shelf: an MDX book (with or without notes) or a seed. */
export type ShelfEntry = {
  slug: string;
  title: string;
  author: string;
  year?: number;
  status: BookStatus;
  themes: string[];
  coverColor: string;
  hasNotes: boolean;
  placeholder: boolean;
};

const libraryDirectory = path.join(process.cwd(), "content", "library");

export async function getAllLibraryEntries(): Promise<LibraryEntry[]> {
  const entries = await readMdxCollection(libraryDirectory, librarySchema);
  return entries.filter((entry) => entry.kind === "book");
}

export async function validateAllLibrary() {
  await getAllLibraryEntries();
}

/** Books whose MDX body holds real reading notes get their own page. */
export function hasReadingNotes(entry: LibraryEntry) {
  return entry.body.trim().length > 0;
}

export async function getBookBySlug(slug: string) {
  const entries = await getAllLibraryEntries();
  const entry = entries.find((item) => item.slug === slug) ?? null;
  return entry && hasReadingNotes(entry) ? entry : null;
}

export async function getShelf(): Promise<ShelfEntry[]> {
  const entries = await getAllLibraryEntries();
  const shelf: ShelfEntry[] = entries.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    author: entry.author,
    year: entry.year,
    status: entry.status,
    themes: entry.themes,
    coverColor: entry.coverColor,
    hasNotes: hasReadingNotes(entry),
    placeholder: false,
  }));

  const taken = new Set(shelf.map((entry) => entry.slug));
  for (const seed of placeholderShelf) {
    if (!taken.has(seed.slug)) {
      shelf.push({ ...seed, hasNotes: false, placeholder: true });
    }
  }

  return shelf;
}
