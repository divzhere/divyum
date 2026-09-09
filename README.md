# Divyum Bhumra

A content-first personal site built with Next.js, TypeScript, Tailwind CSS and MDX.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm lint`, `pnpm typecheck` and `pnpm build` before publishing.

## Deployment

The repository deploys through Vercel. The production branch is `master`, and
pull requests receive Vercel previews. Production is available at
[divyumbhumra.vercel.app](https://divyumbhumra.vercel.app).

Use the Next.js framework preset, the repository root, and `pnpm build`. Keep
`.vercel/` and environment secrets out of Git. Set `NEXT_PUBLIC_SITE_URL` in
Vercel to the intended canonical origin before changing the public domain.

## Link and JavaScript checks

Run checks against a production build, not the development server:

```bash
pnpm build
pnpm bundle:report
pnpm bundle:check
pnpm start --port 3102
```

In a second terminal:

```bash
pnpm links:check http://127.0.0.1:3102
# Optional: also check external URLs. These can fail independently of the site.
pnpm links:check http://127.0.0.1:3102 --external
```

The link checker follows same-origin links in server-rendered HTML and validates
HTTP responses and fragment targets. It does not execute JavaScript or discover
unlinked pages; route and interaction tests are separate checks. External URLs
are collected but never requested unless `--external` is supplied.

The bundle checker counts each initial `script src` JavaScript file once per
built HTML page, gzip level 9. It includes legacy `nomodule` scripts, but excludes
inline JavaScript, RSC payloads, prefetches, and runtime-loaded imports. It is a
repeatable initial-JavaScript measure, not a complete browser transfer budget.
Each existing route may grow by at most 40 KiB gzipped from its recorded baseline;
new routes use the original homepage as their reference. Missing baseline routes,
missing assets, and missing production builds fail the check.

The baseline in `tests/baselines/bundle.json` records V1 before the V2 workstreams.
Do not overwrite it to make a failing budget pass. If an intentional baseline
change is approved, rebuild, record the reason and before/after sizes in the PR,
then regenerate it:

```bash
pnpm bundle:report --write-baseline tests/baselines/bundle.json
```

## Publish an essay or note

Add an `.mdx` file to `content/essays` or `content/notes`:

```mdx
---
title: "The title"
description: "A clear one-sentence description."
publishedAt: "2026-09-09"
updatedAt: "2026-09-10"
tags:
  - Technology
  - Philosophy
featured: false
draft: false
---

The writing begins here.
```

Drafts are excluded from indexes, public routes, RSS and the sitemap. URLs use the filename unless a `slug` is provided.

Projects use the same model in `content/projects`, with optional `year`, `status` and `website` fields. Supported statuses are `Building`, `Active`, `Experiment` and `Archived`.

## Update the site

- Edit the current snapshot in `lib/currently.ts`.
- Edit journey chapters and their filters in `lib/journey.ts`.
- Add real social profiles, email and a newsletter URL in `lib/site.ts`; empty values stay hidden.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin. The fallback is `https://divyumbhumra.com`.
- A future `/library` section can use the same page shell and content loader without changing existing URLs.
