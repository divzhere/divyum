# Divyum Bhumra

A content-first personal site built with Next.js, TypeScript, Tailwind CSS and MDX.

## Local development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm lint`, `pnpm typecheck` and `pnpm build` before publishing.

## Quality-suite checkpoint

This branch is not ready to merge. Vitest and Testing Library specifications are
prepared in `tests/unit` and `tests/integration`, but their dependencies and runner
configuration are pending approval. They have not run under Vitest, and no unit
coverage result is claimed. Production lint/type checks do not execute them.

The content specifications cover parsing, draft exclusion, sorting, slug lookup,
neighbours, reading-time boundaries, and validation. Isolated direct calls to the
current content loader confirmed three missing V2 validations: duplicate slugs,
future publication dates, and impossible calendar dates are currently accepted.
Their rejection tests are intentionally not skipped. Journey specifications cover
staged versus applied selection, combined threads, retained anchor chapters, and
restoring the whole story. The browser/CI/accessibility suite and hooks remain to
be implemented before this workstream can merge.

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
Local checks alone cannot prevent a direct push. Complete the quality-suite CI
and run its checks on a PR before selecting them below; those jobs are not yet
installed in this checkpoint.

1. Open [repository settings](https://github.com/divzhere/divyum/settings/branches)
   → **Branches** → **Add classic branch protection rule**. If a rule already
   targets `master`, edit it instead of creating a duplicate.
2. Set **Branch name pattern** to `master`.
3. Enable **Require a pull request before merging**. Keep **Require approvals**
   off for a solo-maintained repository, or require one if another reviewer is
   available.
4. Enable **Require status checks to pass before merging** and **Require branches
   to be up to date before merging**. Select the actual PR checks:
   `lint-and-types`, `unit`, `build`, `e2e`, `a11y`, `lighthouse`, and `Vercel`.
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

Projects use the same model in `content/projects`, with optional `year`, `status` and `website` fields. Supported statuses are `Building`, `Active`, `Experiment` and `Archived`.

## Update the site

- Edit the current snapshot in `lib/currently.ts`.
- Edit journey chapters and their filters in `lib/journey.ts`.
- Add real social profiles, email and a newsletter URL in `lib/site.ts`; empty values stay hidden.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin. The fallback is `https://divyumbhumra.com`.
- A future `/library` section can use the same page shell and content loader without changing existing URLs.
