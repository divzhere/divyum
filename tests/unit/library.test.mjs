import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

let fixtureRoot;
let library;

const book = ({
  title = "A fixture book",
  slug = null,
  status = "read",
  coverColor = "#4c4668",
  draft = false,
  body = "",
  kind = "book",
} = {}) => `---
kind: "${kind}"
title: "${title}"
author: "A. Author"
year: 2001
${slug ? `slug: "${slug}"` : ""}
status: "${status}"
themes:
  - vedanta
coverColor: "${coverColor}"
publishedAt: "2026-09-01"
draft: ${draft}
---
${body}
`;

beforeEach(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "divyum-library-test-"));
  await mkdir(path.join(fixtureRoot, "content", "library"), {
    recursive: true,
  });
  vi.resetModules();
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(fixtureRoot);
  try {
    library = await import("../../lib/library.ts");
  } finally {
    cwd.mockRestore();
  }
});

afterEach(async () => {
  await rm(fixtureRoot, { recursive: true, force: true });
});

async function write(name, source) {
  await writeFile(path.join(fixtureRoot, "content", "library", name), source);
}

async function withCwd(run) {
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(fixtureRoot);
  try {
    return await run();
  } finally {
    cwd.mockRestore();
  }
}

describe("library content model", () => {
  it("keeps a book without notes on the shelf but unlinked", async () => {
    await write("bare.mdx", book({ slug: "bare" }));
    await write("noted.mdx", book({ slug: "noted", body: "Real notes." }));

    const shelf = await withCwd(() => library.getShelf());
    const bare = shelf.find((entry) => entry.slug === "bare");
    const noted = shelf.find((entry) => entry.slug === "noted");

    expect(bare?.hasNotes).toBe(false);
    expect(noted?.hasNotes).toBe(true);
    expect(await withCwd(() => library.getBookBySlug("bare"))).toBeNull();
    expect((await withCwd(() => library.getBookBySlug("noted")))?.slug).toBe(
      "noted",
    );
  });

  it("appends clearly-marked placeholder seeds after real books", async () => {
    await write("real.mdx", book({ slug: "real" }));

    const shelf = await withCwd(() => library.getShelf());
    const placeholders = shelf.filter((entry) => entry.placeholder);

    expect(shelf[0].slug).toBe("real");
    expect(placeholders.length).toBeGreaterThan(0);
    expect(placeholders.every((entry) => entry.hasNotes === false)).toBe(true);
  });

  it("rejects an invalid status, cover colour and kind", async () => {
    await write("bad-status.mdx", book({ status: "abandoned" }));
    await expect(withCwd(() => library.getAllLibraryEntries())).rejects.toThrow(
      /status/,
    );
    await rm(path.join(fixtureRoot, "content", "library", "bad-status.mdx"));

    await write("bad-color.mdx", book({ coverColor: "red" }));
    await expect(withCwd(() => library.getAllLibraryEntries())).rejects.toThrow(
      /six-digit hex/,
    );
    await rm(path.join(fixtureRoot, "content", "library", "bad-color.mdx"));

    await write("bad-kind.mdx", book({ kind: "planet" }));
    await expect(withCwd(() => library.getAllLibraryEntries())).rejects.toThrow(
      /kind/,
    );
  });

  it("filters future kinds out of the book listing without error", async () => {
    await write("paper.mdx", book({ slug: "a-paper", kind: "paper" }));
    await write("real.mdx", book({ slug: "real" }));

    const entries = await withCwd(() => library.getAllLibraryEntries());
    expect(entries.map((entry) => entry.slug)).toEqual(["real"]);
  });

  it("excludes drafts from the shelf", async () => {
    await write("hidden.mdx", book({ slug: "hidden", draft: true }));

    const shelf = await withCwd(() => library.getShelf());
    expect(shelf.find((entry) => entry.slug === "hidden")).toBeUndefined();
  });
});
