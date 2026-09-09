# Divyum Bhumra

A content-first personal site built with Next.js, TypeScript, Tailwind CSS and MDX.

## Local development

```bash
npm install
npm run dev
```

Run `npm run lint`, `npm run typecheck` and `npm run build` before publishing.

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
