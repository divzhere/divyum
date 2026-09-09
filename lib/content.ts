import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

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

function wordsToMinutes(body: string) {
  const words = body
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\p{L}\p{N}'-]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

function stringValue(value: unknown, field: string, filePath: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing or invalid \"${field}\" in ${filePath}`);
  }

  return value.trim();
}

function booleanValue(value: unknown, defaultValue = false) {
  return typeof value === "boolean" ? value : defaultValue;
}

function parseEntry(
  kind: ContentKind,
  filePath: string,
  source: string,
): ContentEntry {
  const { data, content } = matter(source);
  const filename = path.basename(filePath, path.extname(filePath));
  const slug =
    typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : filename;
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  return {
    title: stringValue(data.title, "title", filePath),
    description: stringValue(data.description, "description", filePath),
    publishedAt: stringValue(data.publishedAt, "publishedAt", filePath),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    slug,
    tags,
    featured: booleanValue(data.featured),
    draft: booleanValue(data.draft, true),
    status: typeof data.status === "string" ? (data.status as ProjectStatus) : undefined,
    year: typeof data.year === "string" ? data.year : undefined,
    website: typeof data.website === "string" ? data.website : undefined,
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
      return parseEntry(kind, filePath, source);
    }),
  );

  return entries
    .filter((entry) => !entry.draft)
    .sort(
      (first, second) =>
        new Date(second.publishedAt).getTime() -
        new Date(first.publishedAt).getTime(),
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
