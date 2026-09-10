import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { z } from "zod";
import { getContentBySlug } from "../lib/content.ts";
import {
  assertSupportedMdx,
  renderHashnodeMarkdown,
  renderMediumMarkdown,
  renderSubstackHtml,
  suggestPlatform,
} from "../lib/syndication.ts";

/*
  pnpm syndicate <slug> [--publish hashnode] [--dry-run] [--site-url <origin>]

  Renders an essay or note to paste-ready platform outputs under
  .syndication/<slug>/ (gitignored), each carrying the canonical URL home.
  Live publishing exists for Hashnode only (its GraphQL API is the only
  documented write API), gated behind HASHNODE_TOKEN + HASHNODE_PUBLICATION_ID.
  Re-runs update the existing article via the id persisted in
  .syndication/state.json rather than creating duplicates.
*/

function fail(message) {
  console.error(message);
  process.exit(1);
}

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith("--"));
const publishTarget = args.includes("--publish")
  ? args[args.indexOf("--publish") + 1]
  : null;
const dryRun = args.includes("--dry-run");
const siteUrlFlag = args.includes("--site-url")
  ? args[args.indexOf("--site-url") + 1]
  : null;

try {
  process.loadEnvFile(path.join(process.cwd(), ".env.local"));
} catch (error) {
  if (error.code !== "ENOENT")
    fail("Cannot read .env.local. Check the file and its permissions.");
}

if (!slug) {
  fail(
    "Usage: pnpm syndicate <slug> [--publish hashnode] [--dry-run] [--site-url <origin>]",
  );
}

const siteUrl = siteUrlFlag ?? process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  fail(
    "Set NEXT_PUBLIC_SITE_URL (or pass --site-url) to the production origin. " +
      "Without it the canonical URL would point at a placeholder domain and " +
      "syndicated copies would hand their SEO credit to nowhere.",
  );
}

let origin;
try {
  const url = new URL(siteUrl);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("not an origin");
  }
  origin = url.origin;
} catch {
  fail(
    "The site URL must be an HTTP(S) origin without credentials, a path, query or fragment.",
  );
}

const kinds = ["essays", "notes"];
let entry = null;
let kind = null;
for (const candidate of kinds) {
  entry = await getContentBySlug(candidate, slug);
  if (entry) {
    kind = candidate;
    break;
  }
}
if (!entry) {
  fail(
    `No published essay or note has the slug "${slug}". Drafts cannot be syndicated.`,
  );
}

const canonical = new URL(`/${kind}/${entry.slug}`, origin).toString();
if (entry.canonicalUrl && new URL(entry.canonicalUrl).href !== canonical) {
  fail(
    `Invalid canonicalUrl for ${entry.slug}: it must point home to ${canonical}.`,
  );
}
assertSupportedMdx(entry.body, `content/${kind}/${entry.slug}.mdx`);

const outputDirectory = path.join(process.cwd(), ".syndication", entry.slug);
await fs.mkdir(outputDirectory, { recursive: true });

const outputs = {
  "hashnode.md": renderHashnodeMarkdown(entry, canonical),
  "substack.html": await renderSubstackHtml(entry, canonical),
  "medium.md": renderMediumMarkdown(entry, canonical),
};

for (const [name, contents] of Object.entries(outputs)) {
  await fs.writeFile(path.join(outputDirectory, name), contents);
  console.log(`Wrote .syndication/${entry.slug}/${name}`);
}

const syndication = entry.syndication;
if (!syndication) {
  const suggestion = suggestPlatform(entry.tags);
  console.log(
    `No syndication frontmatter. Suggested platform for these tags: ${suggestion}` +
      ` (technical essays go to Hashnode; everything else to Substack).`,
  );
}

if (publishTarget) {
  if (publishTarget !== "hashnode") {
    fail(
      `Live publishing is only implemented for Hashnode. Medium no longer supports its API ` +
        `or new integrations, and Substack has no verified public ` +
        `write API — paste the generated files instead.`,
    );
  }

  const token = process.env.HASHNODE_TOKEN;
  const publicationId = process.env.HASHNODE_PUBLICATION_ID;
  if (!token || !publicationId) {
    fail(
      "Set HASHNODE_TOKEN and HASHNODE_PUBLICATION_ID in .env.local. Hashnode API access also requires an enabled Pro publication.",
    );
  }

  const statePath = path.join(process.cwd(), ".syndication", "state.json");
  let state = {};
  try {
    state = z
      .record(
        z.string(),
        z
          .object({ hashnode: z.string().trim().min(1).optional() })
          .passthrough(),
      )
      .parse(JSON.parse(await fs.readFile(statePath, "utf8")));
  } catch (error) {
    if (error.code !== "ENOENT") {
      fail(
        "Cannot read valid .syndication/state.json; repair it before publishing to avoid creating a duplicate post.",
      );
    }
  }
  const existingId = state[entry.slug]?.hashnode;

  const markdown = outputs["hashnode.md"].replace(/^---[\s\S]*?---\n\n/, "");
  const input = {
    title: entry.title,
    contentMarkdown: markdown,
    publicationId,
    originalArticleURL: canonical,
    tags: entry.tags.map((tag) => ({
      name: tag,
      slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    })),
  };

  const mutation = existingId
    ? `mutation ($input: UpdatePostInput!) { updatePost(input: $input) { post { id url } } }`
    : `mutation ($input: PublishPostInput!) { publishPost(input: $input) { post { id url } } }`;
  const variables = existingId
    ? {
        input: {
          id: existingId,
          title: input.title,
          contentMarkdown: input.contentMarkdown,
          originalArticleURL: canonical,
        },
      }
    : { input };

  if (dryRun) {
    console.log(
      `Dry run: would ${existingId ? `update Hashnode post ${existingId}` : "create a new Hashnode post"} with canonical ${canonical}.`,
    );
    process.exit(0);
  }

  const response = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ query: mutation, variables }),
  });
  const result = await response.json();

  if (!response.ok || result.errors) {
    fail(`Hashnode API error: ${JSON.stringify(result.errors ?? result)}`);
  }

  const post = existingId
    ? result.data.updatePost.post
    : result.data.publishPost.post;
  state[entry.slug] = { ...state[entry.slug], hashnode: post.id };
  await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
  console.log(
    `${existingId ? "Updated" : "Published"} on Hashnode: ${post.url} (canonical → ${canonical})`,
  );
}
