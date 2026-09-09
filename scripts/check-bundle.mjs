#!/usr/bin/env node
import { readFile, readdir, realpath, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { gzipSync } from "node:zlib";

const measurement = "initial-script-src-gzip-v1";
const { values } = parseArgs({
  options: {
    "build-dir": { type: "string", default: ".next" },
    baseline: { type: "string" },
    "write-baseline": { type: "string" },
    "max-growth-kb": { type: "string", default: "40" },
    help: { type: "boolean" },
  },
});

if (values.help) {
  console.log(`Usage: node scripts/check-bundle.mjs [options]
  --build-dir <dir>          Next production build directory (default: .next)
  --baseline <file>          Compare gzip bytes with a recorded baseline
  --max-growth-kb <number>   Allowed growth per page in KiB (default: 40)
  --write-baseline <file>    Write this build's measurements as JSON

Counts each JS file referenced by script src once per generated HTML route,
including nomodule scripts. Files are gzipped separately at level 9.
Excludes inline scripts, RSC payloads, prefetches, and runtime-loaded imports.
New routes compare with the baseline homepage; missing baseline routes fail.`);
} else {
  main().catch((error) => {
    console.error(`Bundle check failed: ${error.message}`);
    process.exitCode = 1;
  });
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) return htmlFiles(filename);
      return entry.isFile() && entry.name.endsWith(".html") ? [filename] : [];
    }),
  );
  return files.flat().sort();
}

function decodeAttribute(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    return String.fromCodePoint(
      entity[2].toLowerCase() === "x"
        ? parseInt(entity.slice(3, -1), 16)
        : parseInt(entity.slice(2, -1), 10),
    );
  });
}

async function main() {
  const maxGrowthBytes = Number(values["max-growth-kb"]) * 1024;
  if (!Number.isFinite(maxGrowthBytes) || maxGrowthBytes < 0) {
    throw new Error("--max-growth-kb must be a non-negative number");
  }
  const buildDirectory = path.resolve(values["build-dir"]);
  const buildId = (await readFile(path.join(buildDirectory, "BUILD_ID"), "utf8")).trim();
  if (!buildId) throw new Error("Missing production build ID; run next build first");
  const appDirectory = path.join(buildDirectory, "server/app");
  const staticDirectory = await realpath(path.join(buildDirectory, "static"));
  const manifest = JSON.parse(await readFile(path.join(buildDirectory, "prerender-manifest.json"), "utf8"));
  const pages = {};
  const chunkSizes = new Map();

  for (const filename of await htmlFiles(appDirectory)) {
    const relative = path.relative(appDirectory, filename).split(path.sep).join("/").replace(/\.html$/, "");
    const route = relative === "index" ? "/" : `/${relative}`;
    const html = await readFile(filename, "utf8");
    const chunks = new Map();
    for (const tag of html.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi)) {
      const source = tag[1].match(/(?:^|\s)src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i);
      if (!source) continue;
      const src = decodeAttribute(source[1] ?? source[2] ?? source[3]);
      const pathname = decodeURIComponent(new URL(src, "https://build.invalid").pathname);
      const marker = "/_next/static/";
      const markerIndex = pathname.indexOf(marker);
      if (markerIndex < 0 || !pathname.endsWith(".js")) {
        throw new Error(`${route}: unmeasured script source ${src}`);
      }
      const asset = pathname.slice(markerIndex + marker.length);
      const assetPath = await realpath(path.resolve(staticDirectory, asset));
      if (!assetPath.startsWith(`${staticDirectory}${path.sep}`)) {
        throw new Error(`${route}: script source escapes the build's static directory`);
      }
      if (!chunkSizes.has(assetPath)) {
        const bytes = await readFile(assetPath);
        chunkSizes.set(assetPath, { rawBytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 9 }).length });
      }
      chunks.set(assetPath, { file: `static/${path.relative(staticDirectory, assetPath).split(path.sep).join("/")}`, ...chunkSizes.get(assetPath) });
    }
    if (!chunks.size) throw new Error(`${route}: no script-src JS found; measurement would be empty`);
    const files = [...chunks.values()].sort((a, b) => a.file.localeCompare(b.file));
    pages[route] = {
      rawBytes: files.reduce((sum, file) => sum + file.rawBytes, 0),
      gzipBytes: files.reduce((sum, file) => sum + file.gzipBytes, 0),
      chunks: files,
    };
  }
  if (!pages["/"]) throw new Error("No built homepage HTML found; run next build first");
  for (const [route, entry] of Object.entries(manifest.routes ?? {})) {
    if (entry.routeType === "page" && !pages[route]) {
      throw new Error(`Prerender manifest lists ${route}, but its built HTML is missing`);
    }
  }

  let baseline;
  if (values.baseline) {
    baseline = JSON.parse(await readFile(values.baseline, "utf8"));
    if (baseline.measurement !== measurement || !baseline.pages?.["/"]) {
      throw new Error("Baseline must use the same measurement and contain the homepage");
    }
    for (const [route, page] of Object.entries(baseline.pages)) {
      if (!Number.isSafeInteger(page.gzipBytes) || page.gzipBytes < 0) {
        throw new Error(`Invalid baseline gzipBytes for ${route}`);
      }
      if (!pages[route]) throw new Error(`Baseline route ${route} is missing from this build`);
    }
  }

  console.log("Initial script-src JS; unique files per route; gzip level 9; sizes in KiB (1024 bytes).");
  console.log("Includes nomodule. Excludes inline JS, RSC, prefetches, and runtime-loaded imports.");
  const failures = [];
  const rows = Object.entries(pages).map(([route, page]) => {
    const previous = baseline?.pages[route] ?? baseline?.pages["/"];
    const growth = previous ? page.gzipBytes - previous.gzipBytes : null;
    if (growth !== null && growth > maxGrowthBytes) failures.push(`${route}: +${(growth / 1024).toFixed(2)} KiB exceeds +${values["max-growth-kb"]} KiB`);
    return {
      route,
      chunks: page.chunks.length,
      "raw KiB": (page.rawBytes / 1024).toFixed(2),
      "gzip KiB": (page.gzipBytes / 1024).toFixed(2),
      ...(previous ? { "before gzip KiB": (previous.gzipBytes / 1024).toFixed(2), "growth KiB": `${growth >= 0 ? "+" : ""}${(growth / 1024).toFixed(2)}`, baseline: baseline.pages[route] ? route : "/ (new route)" } : {}),
    };
  });
  console.table(rows);
  const unmeasuredDynamicRoutes = Object.entries(manifest.dynamicRoutes ?? {}).filter(([, entry]) => entry.routeType === "page").map(([route]) => route);
  if (unmeasuredDynamicRoutes.length) console.log(`Dynamic patterns are not measured beyond any generated HTML listed above: ${unmeasuredDynamicRoutes.join(", ")}`);
  if (failures.length) throw new Error(failures.join("; "));
  if (values["write-baseline"]) {
    const destination = path.resolve(values["write-baseline"]);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, `${JSON.stringify({ measurement, buildId, pages, unmeasuredDynamicRoutes }, null, 2)}\n`);
    console.log(`Wrote baseline: ${destination}`);
  }
  if (baseline) console.log(`PASS: every measured route is within +${values["max-growth-kb"]} KiB gzipped of its baseline.`);
}
