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

The suite covers essays, notes, frameworks, books, syndication, Journey and the
approved motion system. Extend `tests/browser-routes.ts`, schemas, unit tests,
visual baselines and Lighthouse URLs whenever adding a public route or data model.

| Layer            | Command                                  | What it blocks                                                                                                       |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Lint             | `pnpm lint`                              | ESLint errors across source and test code                                                                            |
| Types            | `pnpm typecheck`                         | TypeScript errors in the real project graph                                                                          |
| Content          | `pnpm content:check`                     | Invalid fields/dates, future public dates and duplicate slugs, including drafts                                      |
| Unit/integration | `pnpm test:unit`                         | Content and Journey regressions; 80% statement coverage across `lib/`                                                |
| Build/bundle     | `pnpm build && pnpm bundle:check`        | Production-build failures and more than 40 KiB gzip growth per route                                                 |
| E2E              | `pnpm test:e2e`                          | Routes, 404/noindex, drafts, feeds, keyboard use, themes, overflow, console errors, reduced motion and no-JS reading |
| Accessibility    | `pnpm test:a11y`                         | Any axe violations in both themes at 375, 768, 1280 and 1440px                                                       |
| Visual           | `pnpm test:visual`                       | Screenshot differences at 375, 390, 768, 1280, 1440 and 1728 px in both themes                                       |
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

Visual checks use reduced motion and capture the complete composition, including
the homepage point and rule. Every public framework detail page is included.

## Motion

The V3 point → line → horizon signature settles in 1,150ms. Its CSS sequence is
enabled before paint, with complete server-rendered content as the no-JS fallback.
`app/globals.css` owns the 160/240/450/700ms interaction/reveal tokens;
`lib/motion.ts` supplies the existing Framer Motion defaults for interactive tools.
Only the structural horizon participates in a 450ms native ViewTransition.
There is no full-page fade, delayed navigation or scroll hijacking. At the footer,
a progressively enhanced scroll timeline returns the line to a point.
Reduced motion keeps the finished composition with zero animation durations.

### Local V3 design lab

The two composition studies and three reading specimens are opt-in, noindexed
routes outside the content collections. They never enter feeds or the sitemap:

```bash
V3_DESIGN_LAB=1 pnpm build
V3_DESIGN_LAB=1 pnpm start --port 3113
V3_DESIGN_LAB=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3113 pnpm test:visual
```

Visit `/design/v3/open-horizon`, `/design/v3/facing-pages`, or
`/design/v3/reading/{essay,note,book}`. Do not set `V3_DESIGN_LAB` in Vercel.
Rebuild normally before release; the lab routes must return 404/noindex. The
normal-release exclusion tests cover all five URLs. See
[the V3 audit](docs/design/v3-audit.md) and [design results](docs/design/awwwards-v3-results.md).

## Local hooks

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
subtitle: "An optional reader-facing introduction."
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
a non-draft cannot have a future publication date. These rules also apply to
frameworks and books. Every MDX file requires a non-empty `description`, including
drafts. Article headers show `subtitle` when supplied, otherwise `description`;
search metadata continues to use `description`.

Projects use the same model in `content/projects`, with optional `year`, `status` and `website` fields. Supported statuses are `Building`, `Active`, `Experiment` and `Archived`.

## Publish a framework

Add an `.mdx` file to `content/frameworks`:

```mdx
---
title: "The Framework Name"
description: "A short description for search, previews and feeds."
subtitle: "A one-sentence framing"
origin: "Who it comes from"
lineage: "western" # western | eastern | personal
domains:
  - attention
visual: "EisenhowerMatrix" # must name an implemented visual component
related: [] # only reference slugs of published frameworks
publishedAt: "2026-09-10" # replace with the actual publication date
draft: true
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

Two private drafts, `future-framework-01.mdx` and `future-framework-02.mdx`, reserve
space for the next tools without inventing them. Replace their scaffold fields,
rename them and add real prose before publishing. Their current visual is only a
schema-valid placeholder. The index automatically places a published entry in its
lineage/domain group; both slots remain hidden, so the current six-entry index has
no empty rows or dead links.

## Add a book to the library

The shelf on `/library` merges two sources:

- `lib/library-seed.ts` — one file of placeholder spines. Replace its entries
  with real books (title, author, year, status, themes, coverColor) to fill
  the shelf in five minutes. Seed entries never link anywhere.
- `content/library/<slug>.mdx` — a book with reading notes. Same fields in
  frontmatter plus a required `description` (`kind: "book"`, `status`: `reading` | `read` | `rereading` |
  `shelved`, `coverColor` as a six-digit hex, `themes`); the MDX body holds
  the notes. A book with a non-empty body gets `/library/<slug>`; an empty
  body keeps it as an unlinked spine. Drafts stay entirely hidden.

The `kind` field also accepts `paper`, `person` and `idea` for later phases;
only `book` renders today. No cover images — spines are typographic by
design.

## Scaffold new content

```bash
pnpm content:new essay "The title"
pnpm content:new note "The title"
pnpm content:new framework "The title"
pnpm content:new book "The title"
```

Each command writes a correctly-shaped draft with today's date and a slug
derived from the title, and refuses to overwrite an existing file.

## Syndicate an essay or note

MDX in this repository is the single source of truth; everything published
elsewhere is a copy that points home. Routing convention: technical essays go
to Hashnode, everything else to Substack — the script suggests a platform
from the tags when the optional `syndication` frontmatter is absent.

```bash
pnpm syndicate <slug> --site-url https://divyum-bhumra.vercel.app
```

This writes paste-ready files to `.syndication/<slug>/` (gitignored):
`hashnode.md` (Hashnode frontmatter conventions), `substack.html` (clean HTML
that survives the editor paste: footnotes flattened, URLs absolute) and
`medium.md` (for Medium's import flow). Every output carries the canonical
URL at the top. Set `NEXT_PUBLIC_SITE_URL` in `.env.local` or the shell, or pass
`--site-url`. Shell settings take precedence over `.env.local`; the flag takes
precedence over both. Use the actual HTTP(S) production origin, with no path,
credentials, query or fragment. An optional frontmatter `canonicalUrl` must equal
that article's URL on this origin; a conflicting value stops the export.

Only the supported subset syndicates: headings, prose, quotes, gfm tables,
lists, footnotes, code, images and links. Inline and reference-style links and
images resolve against the article's canonical URL: `/images/a.jpg` starts at
the site root; `../images/a.jpg` follows normal browser URL rules. Local anchors
stay local. Code examples are preserved, including examples of MDX comments.
Actual authoring comments are removed. Imports, JSX (including HTML-like tags
and fragments), and live MDX expressions fail with the file and line instead of
silently disappearing. Use Markdown image/link syntax in exported articles.
Exports may normalize Markdown formatting; they never rewrite the source file.

The optional Hashnode adapter uses `--publish hashnode` (`--dry-run` previews
without sending a request). It requires `HASHNODE_TOKEN`,
`HASHNODE_PUBLICATION_ID` and an API-enabled Pro publication. Keep credentials in
`.env.local` (see `.env.example`). Re-runs use the post ID recorded in
`.syndication/state.json`; invalid state stops the command instead of silently
creating another post. Keep this ignored state file backed up, and recover the
existing ID from Hashnode if it is lost. Do not delete state to clear an error.

API availability checked on 10 September 2026:

- Hashnode's [official publishing guide](https://hashnode.com/blog/publishing-a-blog-post-to-hashnode-using-a-custom-editing-interface)
  documents GraphQL publishing and personal-access-token authentication. Its
  [13 May 2026 API change](https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access)
  requires Pro for all queries and mutations. Exports and no-network dry runs are
  tested; authenticated publishing is not verified without enabled credentials.
- [Medium's archived API documentation](https://github.com/Medium/medium-api-docs)
  says the API is unsupported and new integrations are closed. Use the export/import flow.
- [Substack's API terms](https://substack.com/api-tos) describe public creator and
  publication data access, not article creation. No public article-write API was
  verified. Use the HTML paste export; no private cookie-based API is used.

The canonical attribution included in an export is not a guarantee that a paste
editor creates a search-engine canonical tag. Check the destination platform's
canonical/import settings when publishing. Nothing is sent by the export command
alone, and no real article has been published as a test.

## Add a journey chapter

Journey copy and structure live in `lib/journey.ts`. Add a `JourneyChapter`
there with a permanent, URL-safe `id`, a unique `sequence`, one or more
`themes`, and a `primaryTheme` used by the thematic view. The `id` becomes the
shareable fragment (`/journey#chapter-id`), so do not change it after publishing.

Use `type: "professional"` with `professional.role`, `organisation`, `years`
and `built` for a work chapter. Only add facts that are already public; use
`null` and a `TODO(divyum)` comment when an organisation or detail is not ready
to publish. Never add the current employer. The optional `media` field accepts
one personally supplied image with `src`, descriptive `alt`, `width`, `height`
and an optional `caption`; no chapter ships with a placeholder image.

The filter and animation behavior stays in
`components/journey-explorer.tsx`. Supported thread IDs are defined once in
`journeyThemes`; the URL uses `?thread=travel,technology` and the alternate
ordering uses `?order=thematic`.

## Update the site

- Edit the current snapshot in `lib/currently.ts`.
- Edit journey chapters and their filters in `lib/journey.ts`.
- Add real social profiles, email and a newsletter URL in `lib/site.ts`; empty values stay hidden.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin. The fallback is `https://divyumbhumra.com`.

## Author checklist — all outstanding content decisions

These are intentional authoring placeholders, not invented personal claims.

- [ ] Add first-person practice notes in all six published files under
      `content/frameworks/`: Eisenhower Matrix, Signal vs Noise, Knowledge Tree,
      Tat Tvam Asi, Vision to Leverage and Eight Limbs. Their `TODO(divyum)` comments
      say which experience belongs there.
- [ ] Supply the eight deeper stage definitions and examples for Vision to
      Leverage. The component currently uses only the short definitions from the brief.
- [ ] Choose the two future frameworks and replace every `TODO(divyum)` field
      in the two reserved drafts, including description, framing and attribution.
- [ ] Replace the five labelled spines in `lib/library-seed.ts` with real books.
      Replace or remove the private `content/library/example-book.mdx` scaffold;
      write its description and reading notes if publishing it. Ratings are optional.
- [ ] Add a previous, already-public organisation to the professional chapter
      in `lib/journey.ts` only when ready. Further dates, work details and personally
      supplied photographs are optional; nothing has been guessed.
- [ ] Write real essays and notes. Each `content:new` scaffold marks its missing
      description (and framework origin/framing or book author) with `TODO(divyum)`.
      Replace those fields before changing `draft` to `false`.
- [ ] Optionally supply public social/contact links and a real newsletter-provider
      URL in `lib/site.ts`; blank values remain hidden. Update the canonical origin
      when a custom domain is attached.
