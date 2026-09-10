import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export type ContentKind = "essays" | "notes" | "projects";
export type ProjectStatus = "Building" | "Active" | "Experiment" | "Archived";

type BaseFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  slug?: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
};

type ProjectFrontmatter = BaseFrontmatter & {
  status?: ProjectStatus;
  year?: string;
  website?: string;
};

export type ContentEntry = ProjectFrontmatter & {
  slug: string;
  body: string;
  readingTime: number;
  kind: ContentKind;
};

const contentDirectory = path.join(process.cwd(), "content");

const calendarDateSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const parsed = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
      );
    },
    { message: "must be a real calendar date in YYYY-MM-DD format" },
  );

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

function wordsToMinutes(body: string) {
  const words = body
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\p{L}\p{N}'-]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

function parseEntry(
  kind: ContentKind,
  filePath: string,
  source: string,
): ContentEntry {
  const { data, content } = matter(source);
  const filename = path.basename(filePath, path.extname(filePath));
  const result = contentFrontmatterSchema.safeParse(data);

  if (!result.success) {
    const details = result.error.issues
      .map(
        (issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`,
      )
      .join("; ");
    throw new Error(`Invalid frontmatter in ${filePath}: ${details}`);
  }

  const metadata = result.data;

  return {
    ...metadata,
    slug: metadata.slug ?? filename,
    body: content,
    readingTime: wordsToMinutes(content),
    kind,
  };
}

async function readDirectory(kind: ContentKind) {
  const directory = path.join(contentDirectory, kind);
  const files = await fs.readdir(directory);

  return files.filter((file) => /\.mdx?$/.test(file));
}

export async function getAllContent(kind: ContentKind) {
  const files = await readDirectory(kind);
  const entries = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDirectory, kind, file);
      const source = await fs.readFile(filePath, "utf8");
      return { entry: parseEntry(kind, filePath, source), filePath };
    }),
  );

  const slugs = new Map<string, string>();
  for (const { entry, filePath } of entries) {
    const duplicate = slugs.get(entry.slug);
    if (duplicate) {
      throw new Error(
        `Duplicate slug \"${entry.slug}\" in ${duplicate} and ${filePath}`,
      );
    }
    slugs.set(entry.slug, filePath);
  }

  return entries
    .map(({ entry }) => entry)
    .filter((entry) => !entry.draft)
    .sort(
      (first, second) =>
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime(),
    );
}

export async function validateAllContent() {
  await Promise.all(
    (["essays", "notes", "projects"] as const).map((kind) =>
      getAllContent(kind),
    ),
  );
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
