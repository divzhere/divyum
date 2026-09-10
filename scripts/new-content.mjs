import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

/*
  pnpm content:new essay|note|framework|book "<title>"
  Scaffolds a correctly-shaped draft with today's date and a slug derived
  from the title. Never overwrites an existing file.
*/

const [type, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(" ").trim();

const types = {
  essay: "content/essays",
  note: "content/notes",
  framework: "content/frameworks",
  book: "content/library",
};

if (!types[type] || !title) {
  console.error('Usage: pnpm content:new essay|note|framework|book "<title>"');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

if (!slug) {
  console.error("The title must contain at least one letter or number.");
  process.exit(1);
}

const escapedTitle = title.replace(/"/g, '\\"');

const templates = {
  essay: `---
title: "${escapedTitle}"
description: "TODO(divyum): a clear one-sentence description."
publishedAt: "${today}"
tags: []
featured: false
draft: true
---

The writing begins here.
`,
  note: `---
title: "${escapedTitle}"
description: "TODO(divyum): a clear one-sentence description."
publishedAt: "${today}"
tags: []
featured: false
draft: true
---

The observation begins here.
`,
  framework: `---
title: "${escapedTitle}"
subtitle: "TODO(divyum): a one-sentence framing"
origin: "TODO(divyum): who it comes from"
lineage: "western"
domains:
  - attention
visual: "EisenhowerMatrix"
related: []
publishedAt: "${today}"
draft: true
---

## What it says

## How I use it

## Where it comes from
`,
  book: `---
kind: "book"
title: "${escapedTitle}"
author: "TODO(divyum): the author"
status: "read"
themes:
  - vedanta
coverColor: "#4c4668"
publishedAt: "${today}"
draft: true
---
`,
};

const filePath = path.join(process.cwd(), types[type], `${slug}.mdx`);

try {
  await fs.access(filePath);
  console.error(`${filePath} already exists; refusing to overwrite it.`);
  process.exit(1);
} catch {
  // does not exist — good
}

await fs.writeFile(filePath, templates[type]);
console.log(
  `Created ${types[type]}/${slug}.mdx (draft). Edit it, then set draft: false.`,
);
