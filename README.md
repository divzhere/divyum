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

Husky installs with `pnpm install`. Pre-commit runs lint-staged (ESLint fixes,
Prettier and a real project-wide typecheck when code is staged) followed by the
content check. Commit messages follow Conventional Commits. Pre-push runs unit
tests and a production build. Git always allows a deliberate bypass:

```bash
git commit --no-verify
git push --no-verify
```

Use that only when the skipped failure is understood; CI still runs independently.
GitHub Actions runs `lint-and-types`, `unit`, `build`, `e2e`, `a11y`, `visual` and
`lighthouse`. Browser traces, screenshots and Lighthouse reports are uploaded on
failure. A weekly non-blocking workflow checks external links against production.

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

## Protect `master` on GitHub

Divyum must configure this; the agent does not change repository protection.
Local checks alone cannot prevent a direct push. Wait for the quality-suite
workflow to run on a pull request before selecting its checks below; GitHub only
lists checks that have run at least once.

1. Open [repository settings](https://github.com/divzhere/divyum/settings/branches)
   → **Branches** → **Add classic branch protection rule**. If a rule already
   targets `master`, edit it instead of creating a duplicate.
2. Set **Branch name pattern** to `master`.
3. Enable **Require a pull request before merging**. Keep **Require approvals**
   off for a solo-maintained repository, or require one if another reviewer is
   available.
4. Enable **Require status checks to pass before merging** and **Require branches
   to be up to date before merging**. Select the actual PR checks:
   `lint-and-types`, `unit`, `build`, `e2e`, `a11y`, `visual`, `lighthouse`, and
   `Vercel`.
   If a slow check moves to nightly-only execution, do not require it on PRs.
5. Enable **Do not allow bypassing the above settings**. Leave **Allow force
   pushes**, **Allow deletions**, and PR bypass exceptions disabled.
6. Click **Create** (or **Save changes** for an existing rule).

See [GitHub's branch-protection instructions](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule).

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
