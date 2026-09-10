import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const run = promisify(execFile);
const script = path.join(process.cwd(), "scripts/syndicate.mjs");
let fixtureRoot;

beforeEach(async () => {
  fixtureRoot = await mkdtemp(path.join(tmpdir(), "divyum-syndication-test-"));
  await mkdir(path.join(fixtureRoot, "content/essays"), { recursive: true });
  await writeEntry();
});

afterEach(async () => {
  await rm(fixtureRoot, { recursive: true, force: true });
});

async function writeEntry(extra = "") {
  await writeFile(
    path.join(fixtureRoot, "content/essays/fixture.mdx"),
    `---
title: "Fixture essay"
description: "Only a test fixture."
publishedAt: "2024-01-01"
draft: false
tags: [Technology]
${extra}
---
Fixture body.
`,
  );
}

async function syndicate(args = [], overrides = {}) {
  const env = { ...process.env };
  for (const key of [
    "NEXT_PUBLIC_SITE_URL",
    "HASHNODE_TOKEN",
    "HASHNODE_PUBLICATION_ID",
  ])
    delete env[key];
  return run(process.execPath, [script, "fixture", ...args], {
    cwd: fixtureRoot,
    env: { ...env, ...overrides },
    timeout: 10000,
  });
}

describe("standalone syndication CLI", { timeout: 15_000 }, () => {
  it("loads the production origin from .env.local into every export", async () => {
    await writeFile(
      path.join(fixtureRoot, ".env.local"),
      "NEXT_PUBLIC_SITE_URL=https://example.org\n",
    );
    await syndicate();
    for (const name of ["hashnode.md", "substack.html", "medium.md"]) {
      expect(
        await readFile(
          path.join(fixtureRoot, ".syndication/fixture", name),
          "utf8",
        ),
      ).toContain("https://example.org/essays/fixture");
    }
  });

  it("lets the site-url flag override .env.local", async () => {
    await writeFile(
      path.join(fixtureRoot, ".env.local"),
      "NEXT_PUBLIC_SITE_URL=https://old.example.org\n",
    );
    await syndicate(["--site-url", "https://example.org"]);
    expect(
      await readFile(
        path.join(fixtureRoot, ".syndication/fixture/hashnode.md"),
        "utf8",
      ),
    ).toContain("https://example.org/essays/fixture");
  });

  it.each([
    "ftp://example.org",
    "https://example.org/not-an-origin",
    "https://user:password@example.org",
    "https://example.org?tracking=1",
  ])("rejects an unsafe or non-origin site URL: %s", async (origin) => {
    await expect(syndicate(["--site-url", origin])).rejects.toThrow(
      /HTTP.*origin/,
    );
  });

  it.each([
    "https://elsewhere.example/essays/fixture",
    "https://example.org/essays/wrong",
  ])(
    "rejects a frontmatter canonical pointing away from this article: %s",
    async (canonical) => {
      await writeEntry(`canonicalUrl: "${canonical}"`);
      await expect(
        syndicate(["--site-url", "https://example.org"]),
      ).rejects.toThrow(/canonicalUrl.*https:\/\/example.org\/essays\/fixture/);
    },
  );

  it.each(["{broken json", "[]", '{"fixture":{"hashnode":42}}'])(
    "refuses invalid publishing state without overwriting it: %s",
    async (state) => {
      await mkdir(path.join(fixtureRoot, ".syndication"));
      const statePath = path.join(fixtureRoot, ".syndication/state.json");
      await writeFile(statePath, state);
      await expect(
        syndicate(
          [
            "--site-url",
            "https://example.org",
            "--publish",
            "hashnode",
            "--dry-run",
          ],
          {
            HASHNODE_TOKEN: "test-only-not-a-real-token",
            HASHNODE_PUBLICATION_ID: "fixture-publication",
          },
        ),
      ).rejects.toThrow(/state.json.*repair/i);
      expect(await readFile(statePath, "utf8")).toBe(state);
    },
  );

  it("loads Hashnode settings and reports the saved update in a no-network dry run", async () => {
    await writeFile(
      path.join(fixtureRoot, ".env.local"),
      "NEXT_PUBLIC_SITE_URL=https://example.org\nHASHNODE_TOKEN=test-only-not-a-real-token\nHASHNODE_PUBLICATION_ID=fixture-publication\n",
    );
    await mkdir(path.join(fixtureRoot, ".syndication"));
    await writeFile(
      path.join(fixtureRoot, ".syndication/state.json"),
      '{"fixture":{"hashnode":"saved-post"}}',
    );
    const result = await syndicate(["--publish", "hashnode", "--dry-run"]);
    expect(result.stdout).toContain("would update Hashnode post saved-post");
    expect(result.stdout).not.toContain("test-only-not-a-real-token");
  });
});
