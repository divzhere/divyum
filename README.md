# Divyum Bhumra

A content-first personal site built with Next.js, TypeScript, Tailwind CSS and MDX.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm quality` before opening a pull request.

## Quality suite

The suite tests the routes and content types that exist now. Every later feature
PR must extend `tests/browser-routes.ts`, content schemas, unit tests, visual
baselines and Lighthouse URLs when it adds a public route or data model. Tests for
frameworks, books and syndication belong in the PR that introduces those features;
the suite does not pretend that absent modules are covered.

| Layer            | Command                                  | What it blocks                                                                                                       |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Lint             | `pnpm lint`                              | ESLint errors across source and test code                                                                            |
| Types            | `pnpm typecheck`                         | TypeScript errors in the real project graph                                                                          |
| Content          | `pnpm content:check`                     | Invalid fields/dates, future public dates and duplicate slugs, including drafts                                      |
| Unit/integration | `pnpm test:unit`                         | Content and Journey regressions; 80% statement coverage across `lib/`                                                |
| Build/bundle     | `pnpm build && pnpm bundle:check`        | Production-build failures and more than 40 KiB gzip growth per route                                                 |
| E2E              | `pnpm test:e2e`                          | Routes, 404/noindex, drafts, feeds, keyboard use, themes, overflow, console errors, reduced motion and no-JS reading |
| Accessibility    | `pnpm test:a11y`                         | Serious or critical axe violations in light and dark themes                                                          |
| Visual           | `pnpm test:visual`                       | Screenshot differences at 375, 768 and 1440 px in both themes                                                        |
| Lighthouse       | `pnpm test:lighthouse`                   | Any current route below 95 in performance, best practices or SEO, or below 100 in accessibility                      |
| Internal links   | `pnpm links:check http://127.0.0.1:3102` | Broken same-origin links and fragments                                                                               |

Browser, accessibility, visual and Lighthouse checks require a production build.
Playwright starts `pnpm start` itself; build first, then run the desired command.
Install its local browsers once with:

```bash
pnpm exec playwright install chromium webkit
```

Visual baselines are committed in `tests/visual/__screenshots__`. Review the
rendered change before intentionally replacing them:

```bash
pnpm build
pnpm test:visual:update
pnpm test:visual
```

The homepage motion region is masked and visual checks use reduced motion so the
baseline records layout and typography rather than a random animation frame.

Husky installs with `pnpm install`. Pre-commit runs the fast checks: lint-staged
(ESLint fixes and Prettier on staged files) followed by the content check. Commit
messages follow Conventional Commits. Pre-push runs the important gates: lint,
typecheck, unit tests and a production build. Git always allows a deliberate
bypass:

```bash
git commit --no-verify
git push --no-verify
```

Use that only when the skipped failure is understood. There is no hosted CI:
this repository intentionally does not use GitHub Actions (solo project, no paid
plan). The hooks above and the Vercel deployment are the gates. Run the slower
layers (`pnpm test:e2e`, `pnpm test:a11y`, `pnpm test:visual`,
`pnpm test:lighthouse`, `pnpm links:check`) locally before merging a feature
branch — `pnpm quality` covers the fast set.

## Deployment

The repository deploys through the Vercel project `divyum-bhumra`. The
production branch is `master`, and every pushed branch receives a Vercel preview
deployment. Production is available at
[divyum-bhumra.vercel.app](https://divyum-bhumra.vercel.app) until a custom
domain is attached. The similarly named `divyumbhumra.vercel.app` belongs to a
different Vercel project and does not deploy from this repository.

Use the Next.js framework preset, the repository root, and `pnpm build`. Keep
`.vercel/` and environment secrets out of Git. `NEXT_PUBLIC_SITE_URL` is set in
Vercel production to the canonical origin; update it when the custom domain
arrives.

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

## Solo workflow

This is a solo-developed site. There is no paid GitHub plan, no GitHub Actions
and no branch protection; discipline replaces configuration. Treat `master` as
production and never develop on it directly.

```
feature branch
  → local quality gates (hooks: lint, typecheck, unit tests, build)
  → push to GitHub
  → Vercel preview deployment
  → verify the preview builds and works (open it, click through the change)
  → merge into master
  → Vercel production deployment
```

Do not merge a branch when local gates fail, the Vercel build fails, or the
preview is visually or functionally broken. Run the slower local layers (e2e,
a11y, visual, Lighthouse) before merging anything that touches routes, layout or
motion.

If the project later gains contributors, reconsider GitHub branch protection,
required status checks and hosted CI.

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

Run `pnpm content:check` before publishing. Dates must be real `YYYY-MM-DD`
calendar dates, two files in one collection cannot resolve to the same slug, and
a non-draft cannot have a future publication date.

Projects use the same model in `content/projects`, with optional `year`, `status` and `website` fields. Supported statuses are `Building`, `Active`, `Experiment` and `Archived`.

## Publish a framework

Add an `.mdx` file to `content/frameworks`:

```mdx
---
title: "The Framework Name"
subtitle: "A one-sentence framing"
origin: "Who it comes from"
lineage: "western" # western | eastern | personal
domains:
  - attention
visual: "EisenhowerMatrix" # must name an implemented visual component
related:
  - "another-framework-slug"
publishedAt: "2026-09-15"
draft: false
---

## What it says

## How I use it

## Where it comes from
```

The `visual` key must be one of the implemented components in
`components/frameworks/`; an unknown key fails the build and names the
implemented visuals. `related` slugs must exist. To add a new visual:

1. Build the component in `components/frameworks/<name>.tsx`. Server-render a
   complete SVG/CSS composition; make every interactive element a real button
   with a visible focus state; use one hue from the `--fw-*` scale in
   `app/globals.css`.
2. Register it in `components/frameworks/index.tsx` and add its key to
   `frameworkVisualKeys` in `lib/frameworks-meta.ts` (a unit test keeps the
   two in lockstep). Add a small glyph in `components/frameworks/glyphs.tsx`.
3. Rebuild and refresh visual baselines if the index page changed.

## Add a book to the library

The shelf on `/library` merges two sources:

- `lib/library-seed.ts` — one file of placeholder spines. Replace its entries
  with real books (title, author, year, status, themes, coverColor) to fill
  the shelf in five minutes. Seed entries never link anywhere.
- `content/library/<slug>.mdx` — a book with reading notes. Same fields in
  frontmatter (`kind: "book"`, `status`: `reading` | `read` | `rereading` |
  `shelved`, `coverColor` as a six-digit hex, `themes`); the MDX body holds
  the notes. A book with a non-empty body gets `/library/<slug>`; an empty
  body keeps it as an unlinked spine. Drafts stay entirely hidden.

The `kind` field also accepts `paper`, `person` and `idea` for later phases;
only `book` renders today. No cover images — spines are typographic by
design.

## Update the site

- Edit the current snapshot in `lib/currently.ts`.
- Edit journey chapters and their filters in `lib/journey.ts`.
- Add real social profiles, email and a newsletter URL in `lib/site.ts`; empty values stay hidden.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin. The fallback is `https://divyumbhumra.com`.
- A future `/library` section can use the same page shell and content loader without changing existing URLs.

Framework, book scaffolding and syndication are not available yet. Their ordered
feature PRs will add the exact authoring commands and examples here when the data
models exist. Until then, do not create ad-hoc framework or library files that
bypass validation.
