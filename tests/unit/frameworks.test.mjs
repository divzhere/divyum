import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

let fixtureRoot;
let frameworks;

const validEntry = ({
  title = "Example framework",
  slug = null,
  lineage = "western",
  visual = "EisenhowerMatrix",
  related = [],
  draft = false,
  publishedAt = "2026-09-01",
} = {}) => `---
title: "${title}"
description: "A description for search and feeds."
subtitle: "A one-line framing"
${slug ? `slug: "${slug}"` : ""}
origin: "Someone"
lineage: "${lineage}"
domains:
  - attention
visual: "${visual}"
related: [${related.map((entry) => `"${entry}"`).join(", ")}]
publishedAt: "${publishedAt}"
draft: ${draft}
---

Body prose.
`;

beforeEach(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "divyum-frameworks-test-"));
  await mkdir(path.join(fixtureRoot, "content", "frameworks"), {
    recursive: true,
  });
  vi.resetModules();
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(fixtureRoot);
  try {
    frameworks = await import("../../lib/frameworks.ts");
  } finally {
    cwd.mockRestore();
  }
});

afterEach(async () => {
  await rm(fixtureRoot, { recursive: true, force: true });
});

async function write(name, source) {
  await writeFile(
    path.join(fixtureRoot, "content", "frameworks", name),
    source,
  );
}

async function load() {
  const cwd = vi.spyOn(process, "cwd").mockReturnValue(fixtureRoot);
  try {
    return await frameworks.getAllFrameworks();
  } finally {
    cwd.mockRestore();
  }
}

describe("framework content model", () => {
  it("rejects a published framework without a description", async () => {
    await write(
      "missing-description.mdx",
      validEntry().replace(/^description:.*\n/m, ""),
    );
    await expect(load()).rejects.toThrow(
      /missing-description.mdx: description/,
    );
  });

  it("rejects a future publication date but keeps future drafts private", async () => {
    await write("future.mdx", validEntry({ publishedAt: "9999-01-01" }));
    await expect(load()).rejects.toThrow(/future.mdx: publishedAt.*future/);
    await write(
      "future.mdx",
      validEntry({ publishedAt: "9999-01-01", draft: true }),
    );
    expect(await load()).toEqual([]);
  });

  it("parses a valid entry, derives the slug from the filename and excludes drafts", async () => {
    await write("first-tool.mdx", validEntry());
    await write("hidden.mdx", validEntry({ draft: true }));

    const entries = await load();

    expect(entries).toHaveLength(1);
    expect(entries[0].slug).toBe("first-tool");
    expect(entries[0].lineage).toBe("western");
    expect(entries[0].visual).toBe("EisenhowerMatrix");
  });

  it("rejects an unknown visual key and names the implemented visuals", async () => {
    await write("broken.mdx", validEntry({ visual: "SomethingUnbuilt" }));

    await expect(load()).rejects.toThrow(/visual/);
    await expect(load()).rejects.toThrow(/EisenhowerMatrix/);
  });

  it("rejects an unknown lineage", async () => {
    await write("broken.mdx", validEntry({ lineage: "martian" }));

    await expect(load()).rejects.toThrow(/lineage/);
  });

  it("rejects a related reference to a framework that does not exist", async () => {
    await write("first.mdx", validEntry({ related: ["missing-tool"] }));

    await expect(load()).rejects.toThrow(
      /Unknown related framework "missing-tool"/,
    );
  });

  it("rejects duplicate slugs across files", async () => {
    await write("one.mdx", validEntry({ slug: "same" }));
    await write("two.mdx", validEntry({ slug: "same" }));

    await expect(load()).rejects.toThrow(/Duplicate slug/);
  });

  it("groups by lineage in fixed order and by domain alphabetically", async () => {
    await write("west.mdx", validEntry({ slug: "west", lineage: "western" }));
    await write("east.mdx", validEntry({ slug: "east", lineage: "eastern" }));

    const entries = await load();
    const byLineage = frameworks.groupFrameworks(entries, "lineage");
    expect([...byLineage.keys()]).toEqual(["Western", "Eastern"]);

    const byDomain = frameworks.groupFrameworks(entries, "domain");
    expect([...byDomain.keys()]).toEqual(["attention"]);
    expect(byDomain.get("attention")).toHaveLength(2);
  });
});

describe("visual registry", () => {
  it("stays in lockstep with the implemented component registry", async () => {
    const { frameworkVisuals } =
      await import("../../components/frameworks/index.tsx");
    expect(Object.keys(frameworkVisuals).sort()).toEqual(
      [...frameworks.frameworkVisualKeys].sort(),
    );
  });

  it("has a glyph for every visual key", async () => {
    const { frameworkGlyphs } =
      await import("../../components/frameworks/glyphs.tsx");
    expect(Object.keys(frameworkGlyphs).sort()).toEqual(
      [...frameworks.frameworkVisualKeys].sort(),
    );
  });
});
