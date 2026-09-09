#!/usr/bin/env node

const args = process.argv.slice(2);
const checkExternal = args.includes("--external");
const positional = args.filter((arg) => arg !== "--external");
if (positional.length !== 1 || args.some((arg) => arg.startsWith("--") && arg !== "--external")) {
  console.error("Usage: node scripts/check-links.mjs <base-url> [--external]");
  process.exit(2);
}

let base;
try {
  base = new URL(positional[0]);
  if (!["http:", "https:"].includes(base.protocol)) throw new Error("Use an HTTP(S) URL.");
} catch (error) {
  console.error(`Invalid base URL: ${error.message}`);
  process.exit(2);
}

const concurrency = 5;
const timeoutMs = 10_000;
const maxInternalUrls = 1_000;
const pages = new Map();
const pending = [];
const references = new Map();
const external = new Map();
const failures = new Set();
let skippedProtocols = 0;

function decodeEntities(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (entity, name) => {
    if (!name.startsWith("#")) return named[name.toLowerCase()];
    const hex = name[1].toLowerCase() === "x";
    const point = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
    return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
      ? String.fromCodePoint(point)
      : "\ufffd";
  });
}

function readHtml(html) {
  const ids = new Set();
  const hrefs = [];
  let baseHref;
  // Ignore raw text and comments so embedded JavaScript is never treated as markup.
  const markup = html.replace(/<!--[\s\S]*?-->/g, "").replace(
    /(<(script|style|textarea|title)\b(?:"[^"]*"|'[^']*'|[^'">])*>)\s*[\s\S]*?<\/\2\s*>/gi,
    "$1",
  );
  for (const tag of markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi)) {
    const attributes = new Map();
    for (const attr of tag[2].matchAll(/([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
      const name = attr[1].toLowerCase();
      if (!attributes.has(name)) attributes.set(name, decodeEntities(attr[2] ?? attr[3] ?? attr[4] ?? ""));
    }
    if (attributes.has("id")) ids.add(attributes.get("id"));
    if (tag[1].toLowerCase() === "a" && attributes.has("name")) ids.add(attributes.get("name"));
    if (tag[1].toLowerCase() === "base") {
      baseHref ??= attributes.get("href");
    } else if (attributes.has("href")) {
      hrefs.push(attributes.get("href"));
    }
  }
  return { ids, hrefs, baseHref };
}

function addReference(href, source, resolutionBase = source) {
  let url;
  try {
    url = new URL(href, resolutionBase);
  } catch {
    failures.add(`Invalid URL ${JSON.stringify(href)} (from ${source})`);
    return;
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    skippedProtocols++;
    return;
  }
  if (url.origin !== base.origin) {
    url.hash = "";
    if (!external.has(url.href)) external.set(url.href, source);
    return;
  }
  if (!references.has(url.href)) references.set(url.href, source);
  url.hash = "";
  if (!pages.has(url.href)) {
    if (pages.size >= maxInternalUrls) {
      failures.add(`Crawl exceeded ${maxInternalUrls} internal URLs; unchecked URL: ${url.href}`);
      return;
    }
    pages.set(url.href, null);
    pending.push(url.href);
  }
}

async function request(url, internal) {
  const signal = AbortSignal.timeout(timeoutMs);
  for (let redirects = 0; redirects <= 10; redirects++) {
    const response = await fetch(url, { redirect: "manual", signal });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      await response.body?.cancel();
      const location = response.headers.get("location");
      if (!location) throw new Error(`HTTP ${response.status} without Location`);
      const next = new URL(location, url);
      if (!["http:", "https:"].includes(next.protocol)) throw new Error(`Unsupported redirect: ${next.href}`);
      if (internal && next.origin !== base.origin) return { externalUrl: next.href };
      url = next.href;
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(`HTTP ${response.status}`);
    }
    const html = /^(text\/html|application\/xhtml\+xml)\b/i.test(response.headers.get("content-type") ?? "");
    if (internal && html) return { ...readHtml(await response.text()), url };
    await response.body?.cancel();
    return { url };
  }
  throw new Error("More than 10 redirects");
}

addReference(base.href, "start URL", base);
while (pending.length) {
  await Promise.all(pending.splice(0, concurrency).map(async (url) => {
    try {
      const page = await request(url, true);
      pages.set(url, page);
      if (page.externalUrl) {
        addReference(page.externalUrl, url);
      } else if (page.hrefs) {
        if (page.url !== url) addReference(page.url, url);
        let resolutionBase = page.url;
        if (page.baseHref !== undefined) resolutionBase = new URL(page.baseHref, page.url).href;
        for (const href of page.hrefs) addReference(href, page.url, resolutionBase);
      }
    } catch (error) {
      pages.set(url, { error: error.message });
    }
  }));
}

for (const [href, source] of references) {
  const url = new URL(href);
  const hash = url.hash.slice(1);
  url.hash = "";
  const page = pages.get(url.href);
  if (!page) continue; // The crawl-limit error already identifies unchecked URLs.
  if (page.error) {
    failures.add(`${page.error}: ${href} (from ${source})`);
  } else if (hash && page.ids) {
    try {
      const id = decodeURIComponent(hash.split(":~:")[0]);
      if (id && !page.ids.has(id) && id.toLowerCase() !== "top") {
        failures.add(`Missing anchor #${id}: ${href} (from ${source})`);
      }
    } catch {
      failures.add(`Invalid encoded fragment: ${href} (from ${source})`);
    }
  }
}

const externalFailures = [];
if (checkExternal) {
  const remaining = [...external];
  while (remaining.length) {
    await Promise.all(remaining.splice(0, concurrency).map(async ([url, source]) => {
      try {
        await request(url, false);
      } catch (error) {
        externalFailures.push(`${error.message}: ${url} (from ${source})`);
      }
    }));
  }
}

for (const failure of [...failures, ...externalFailures].sort()) console.error(`FAIL ${failure}`);
console.log(`Checked ${pages.size} internal URLs and ${references.size} internal links: ${failures.size} failures.`);
console.log(`${external.size} external URLs ${checkExternal ? "checked" : "collected (use --external to check)"}${checkExternal ? `: ${externalFailures.length} failures` : ""}.`);
if (skippedProtocols) console.log(`Skipped ${skippedProtocols} non-HTTP(S) links (for example mailto: or tel:).`);
process.exitCode = failures.size || externalFailures.length ? 1 : 0;
