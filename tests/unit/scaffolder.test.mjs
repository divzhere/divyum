import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import matter from "gray-matter";

const run = promisify(execFile);
const script = path.join(process.cwd(), "scripts", "new-content.mjs");

let fixtureRoot;

beforeEach(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "divyum-scaffold-test-"));
  await Promise.all(
    ["essays", "notes", "frameworks", "library"].map((kind) =>
      mkdir(path.join(fixtureRoot, "content", kind), { recursive: true }),
    ),
  );
});

afterEach(async () => {
  await rm(fixtureRoot, { recursive: true, force: true });
});

async function scaffold(...args) {
  return run(process.execPath, [script, ...args], { cwd: fixtureRoot });
}

describe("content:new scaffolder", () => {
  it("creates a draft essay whose frontmatter passes the content schema", async () => {
    await scaffold("essay", "Attention & the Machine!");

    const file = path.join(
      fixtureRoot,
      "content",
      "essays",
      "attention-the-machine.mdx",
    );
    const { data } = matter(await readFile(file, "utf8"));

    const { contentFrontmatterSchema } = await import("../../lib/content.ts");
    const parsed = contentFrontmatterSchema.parse(data);
    expect(parsed.draft).toBe(true);
    expect(parsed.title).toBe("Attention & the Machine!");
    expect(parsed.publishedAt).toBe(new Date().toISOString().slice(0, 10));
  });

  it("creates a draft framework that passes the framework schema", async () => {
    await scaffold("framework", "A New Lens");

    const file = path.join(
      fixtureRoot,
      "content",
      "frameworks",
      "a-new-lens.mdx",
    );
    const { data } = matter(await readFile(file, "utf8"));
    const { frameworkSchema } = await import("../../lib/frameworks.ts");
    expect(frameworkSchema.parse(data).draft).toBe(true);
  });

  it("creates a draft book that passes the library schema", async () => {
    await scaffold("book", "An Unread Classic");

    const file = path.join(
      fixtureRoot,
      "content",
      "library",
      "an-unread-classic.mdx",
    );
    const { data } = matter(await readFile(file, "utf8"));
    const { librarySchema } = await import("../../lib/library.ts");
    expect(librarySchema.parse(data).kind).toBe("book");
  });

  it("refuses to overwrite an existing file", async () => {
    await scaffold("note", "Same Title");
    await expect(scaffold("note", "Same Title")).rejects.toThrow(
      /refusing to overwrite/,
    );
  });

  it("rejects unknown types and empty titles", async () => {
    await expect(scaffold("poem", "A Poem")).rejects.toThrow(/Usage/);
    await expect(scaffold("essay", "!!!")).rejects.toThrow(/at least one/);
  });
});
