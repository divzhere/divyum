import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

let fixtureRoot;
let content;

beforeEach(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "divyum-content-test-"));
  await Promise.all(
    ["essays", "notes", "projects"].map((kind) =>
      mkdir(path.join(fixtureRoot, "content", kind), { recursive: true }),
    ),
  );
  vi.resetModules();
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(fixtureRoot);
  try {
    content = await import("../../lib/content.ts");
  } finally {
    cwd.mockRestore();
  }
});

afterEach(async () => {
  if (fixtureRoot) await rm(fixtureRoot, { recursive: true, force: true });
});

async function entry(
  filename,
  fields = {},
  body = "A small test entry.",
  kind = "essays",
) {
  const frontmatter = {
    title: "Fixture title",
    description: "Fixture description.",
    publishedAt: "2024-01-01",
    draft: false,
    ...fields,
  };
  const yaml = Object.entries(frontmatter)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  await writeFile(
    path.join(fixtureRoot, "content", kind, filename),
    `---\n${yaml}\n---\n${body}\n`,
  );
}

describe("published content", () => {
  it("returns normalized metadata and readable body from a markdown file", async () => {
    await entry(
      "first-note.md",
      {
        title: "  A useful note  ",
        description: "  A short description.  ",
        tags: ["Technology", "Attention"],
        featured: true,
      },
      "The public body.",
      "notes",
    );

    const result = await content.getContentBySlug("notes", "first-note");

    expect(result).toMatchObject({
      kind: "notes",
      slug: "first-note",
      title: "A useful note",
      description: "A short description.",
      publishedAt: "2024-01-01",
      tags: ["Technology", "Attention"],
      featured: true,
      draft: false,
      readingTime: 1,
    });
    expect(result.body.trim()).toBe("The public body.");
  });

  it("loads markdown only and sorts by publication date rather than filename", async () => {
    await entry("z-old.mdx", { publishedAt: "2023-01-01" });
    await entry("a-middle.md", { publishedAt: "2024-01-01" });
    await entry("m-new.mdx", { publishedAt: "2024-06-01" });
    await writeFile(
      path.join(fixtureRoot, "content/essays/ignore.txt"),
      "not frontmatter",
    );

    expect(
      (await content.getAllContent("essays")).map(({ slug }) => slug),
    ).toEqual(["m-new", "a-middle", "z-old"]);
  });

  it("does not publish drafts or entries without an explicit draft decision", async () => {
    await entry("public.mdx");
    await entry("draft.mdx", { draft: true });
    await entry("undecided.mdx", { draft: undefined });

    expect(
      (await content.getAllContent("essays")).map(({ slug }) => slug),
    ).toEqual(["public"]);
    expect(await content.getContentBySlug("essays", "draft")).toBeNull();
    expect(await content.getContentBySlug("essays", "undecided")).toBeNull();
  });

  it("resolves an explicit slug without exposing the source filename as another URL", async () => {
    await entry("source-name.mdx", { slug: "public-name" });

    expect(
      await content.getContentBySlug("essays", "public-name"),
    ).toMatchObject({ slug: "public-name" });
    expect(await content.getContentBySlug("essays", "source-name")).toBeNull();
    expect(await content.getContentBySlug("essays", "missing")).toBeNull();
  });

  it("keeps collections separate when filenames match", async () => {
    await entry("shared.mdx", { title: "Essay version" });
    await entry("shared.mdx", { title: "Note version" }, "A note.", "notes");

    expect(await content.getContentBySlug("essays", "shared")).toMatchObject({
      title: "Essay version",
      kind: "essays",
    });
    expect(await content.getContentBySlug("notes", "shared")).toMatchObject({
      title: "Note version",
      kind: "notes",
    });
  });

  it("validates every current collection in one content-check pass", async () => {
    await entry("essay.mdx");
    await entry("note.mdx", {}, "A note.", "notes");
    await entry(
      "project.mdx",
      { status: "Building" },
      "A project.",
      "projects",
    );

    await expect(content.validateAllContent()).resolves.toBeUndefined();
  });

  it.each([
    ["empty", "", 1],
    [
      "one-minute",
      `${"word ".repeat(220)}<Aside label="not reading text" />`,
      1,
    ],
    ["two-minutes", "word ".repeat(221), 2],
  ])("computes a bounded reading time for %s", async (slug, body, minutes) => {
    await entry(`${slug}.mdx`, {}, body);
    expect((await content.getContentBySlug("essays", slug)).readingTime).toBe(
      minutes,
    );
  });
});

describe("content neighbours", () => {
  beforeEach(async () => {
    await entry("oldest.mdx", { publishedAt: "2023-01-01" });
    await entry("middle.mdx", { publishedAt: "2024-01-01" });
    await entry("newest.mdx", { publishedAt: "2024-06-01" });
    await entry("hidden.mdx", { publishedAt: "2024-03-01", draft: true });
  });

  it.each([
    ["oldest", null, "middle"],
    ["middle", "oldest", "newest"],
    ["newest", "middle", null],
    ["missing", null, null],
    ["hidden", null, null],
  ])(
    "finds public chronological neighbours for %s",
    async (slug, previous, next) => {
      const result = await content.getContentNeighbours("essays", slug);
      expect(result.previous?.slug ?? null).toBe(previous);
      expect(result.next?.slug ?? null).toBe(next);
    },
  );
});

describe("frontmatter integrity", () => {
  it.each([
    ["title", ""],
    ["description", undefined],
    ["publishedAt", 42],
  ])("reports the file and invalid %s field", async (field, value) => {
    await entry("invalid.mdx", { [field]: value });

    await expect(content.getAllContent("essays")).rejects.toThrow(field);
    await expect(content.getAllContent("essays")).rejects.toThrow(
      "invalid.mdx",
    );
  });

  // These V2 contracts must remain failing until schema validation is implemented.
  it("rejects two published files resolving to the same slug", async () => {
    await entry("first.mdx", { slug: "duplicate" });
    await entry("second.mdx", { slug: "duplicate" });

    await expect(content.getAllContent("essays")).rejects.toThrow(
      /slug|duplicate/i,
    );
  });

  it("rejects a non-draft with a future publication date", async () => {
    await entry("future.mdx", { publishedAt: "9999-01-01" });

    await expect(content.getAllContent("essays")).rejects.toThrow(
      /publishedAt|future/i,
    );
  });

  it("rejects a calendar date that would otherwise silently roll into March", async () => {
    await entry("invalid-date.mdx", { publishedAt: "2024-02-30" });

    await expect(content.getAllContent("essays")).rejects.toThrow(
      /publishedAt|date/i,
    );
  });

  it("allows a future-dated draft without publishing it", async () => {
    await entry("future-draft.mdx", { publishedAt: "9999-01-01", draft: true });

    expect(await content.getAllContent("essays")).toEqual([]);
  });
});
