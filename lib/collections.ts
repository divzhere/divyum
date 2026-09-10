import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/*
  Generic MDX collection reader shared by every content type.

  content/<collection>/*.mdx
        │  gray-matter split
        ▼
  frontmatter ──schema.parse──▶ readable error naming file + field
        │
        ▼
  entries ──duplicate-slug check──▶ drafts filtered ──▶ sorted newest first
*/

export const calendarDateSchema = z
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

type BaseFields = {
  publishedAt: string;
  slug?: string;
  draft: boolean;
};

export function validatePublicationDate(
  entry: BaseFields,
  context: z.RefinementCtx,
) {
  const today = new Date().toISOString().slice(0, 10);
  if (!entry.draft && entry.publishedAt > today) {
    context.addIssue({
      code: "custom",
      path: ["publishedAt"],
      message: "cannot be in the future for published content",
    });
  }
}

export type CollectionEntry<Fields> = Fields & {
  slug: string;
  body: string;
  readingTime: number;
};

export function wordsToMinutes(body: string) {
  const words = body
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\p{L}\p{N}'-]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export async function readMdxCollection<Fields extends BaseFields>(
  directory: string,
  schema: z.ZodType<Fields>,
): Promise<CollectionEntry<Fields>[]> {
  const files = (await fs.readdir(directory)).filter((file) =>
    /\.mdx?$/.test(file),
  );

  const entries = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(directory, file);
      const source = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(source);
      const filename = path.basename(filePath, path.extname(filePath));
      const result = schema.safeParse(data);

      if (!result.success) {
        const details = result.error.issues
          .map(
            (issue) =>
              `${issue.path.join(".") || "frontmatter"}: ${issue.message}`,
          )
          .join("; ");
        throw new Error(`Invalid frontmatter in ${filePath}: ${details}`);
      }

      const metadata = result.data;
      const entry: CollectionEntry<Fields> = {
        ...metadata,
        slug: metadata.slug ?? filename,
        body: content,
        readingTime: wordsToMinutes(content),
      };

      return { entry, filePath };
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
