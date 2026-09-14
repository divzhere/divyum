# Awwwards-level prompt — divyumbhumra.com

Research date: 2026-09-11. Grounded in the live codebase (V3 "Open Horizon", commit 7e37c3e) and a browse pass over current Awwwards portfolio winners (Jamie McKaye, Khanh Nguyen, Milan Compain, Redouane Oumahi, plus the portfolio-category index). Paste the block below into a design/build agent as a single brief.

---

## THE PROMPT

You are an award-winning art director and creative developer. Your benchmark is Awwwards Site of the Day, judged 40% design, 30% usability, 20% creativity, 10% content. You are elevating an existing site, not replacing it. The site already has laws; breaking them disqualifies the work.

### Who this is for

Divyum Bhumra — technologist, software engineer and independent thinker. India / elsewhere. He builds software and writes about technology, AI, entrepreneurship, philosophy and consciousness, and studies Vedanta, Yoga and psychology. The site is a personal instrument, not a freelancer funnel: no "hire me," no services grid, no client logos. Its flagship content is six hand-drawn interactive thinking frameworks spanning Western (Eisenhower, Signal vs Noise, Knowledge Tree), Eastern (Tat Tvam Asi, Eight Limbs of Yoga) and Personal (Vision to Leverage) lineages — "each one is drawn, not just described."

### What already exists (keep, do not re-invent)

- Next.js 16 App Router, React 19, Tailwind v4 tokens bridging a hand-written `globals.css`; CSS Modules for compositions.
- Palette: paper `#f5f2eb` / ink `#24221e` / muted `#6c675f` / rule `#d9d4ca` / oxide accent `#843e34`; dark theme `#211f1b` / `#f0ede5` / `#d18a76`. One accent family. Nothing else.
- Type: Literata (display/serif, weights 450–480, tight negative tracking, display clamp 64→150px) + Public Sans (UI/meta). Hero name set as two uppercase lines, line-height 0.92, second line offset 13%.
- The signature motif: a 9px oxide point with a 1px horizon rule extending from it. It opens the home page (CSS-only arrival sequence settling at 1,150ms), labels every inner page, and inverts in the footer (line contracts back into the point, scroll-linked).
- Route transitions via native ViewTransition ("horizon-morph", 450ms). Framer Motion only inside framework diagrams and Journey.
- 12-column grid, hairline-ruled sections, 100rem page width, 45rem reading measure.

### Creative thesis

"A quiet instrument for ideas in motion." Sharpen it to one sentence you can defend in every pixel: **the point is Divyum; the horizon is everything he is exploring; every page is a new meeting of point and line.** East and West meet on the same drawn line — an Upanishadic diagram and an Eisenhower matrix rendered by the same hand.

### What current Awwwards portfolio winners actually do — apply each as a directive

1. **One motif, total commitment** (Milan Compain follows a single star through the whole site — "Suivez l'étoile"). The point + horizon must appear in more states: as list bullets, as the theme toggle, as diagram origin points, as the 404's lost point, as the loading state. Never introduce a second motif.
2. **The name as monument** (Khanh Nguyen: ~160px editorial serif name against a quiet field, sidebar spine reading "FOLIO — EDITION", copyright rotated in the margin). The display Literata name is already the identity — push composition, not size: consider a vertical margin spine ("DIVYUM BHUMRA — EST. PUNJAB"), and let the second line's 13% offset ride the horizon rule exactly.
3. **The site itself is the proof** (Jamie McKaye exhibits his own JSON-LD, llms.txt and rendered page as museum pieces: "claims on this site are measured by the site; nothing is an adjective"). Here the equivalent is the frameworks: put a living, interactive diagram fragment on the home page — not a screenshot, the real instrument, drawing itself on scroll-into-view with a single oxide stroke (SVG line-draw, `prefers-reduced-motion` renders it complete).
4. **Narrative structure** (Khanh's "Chapter I–IV"; the Journey page already has chapters). Let the home page read as a table of contents for a life: Currently → Writing → Frameworks → Journey → Library → About, each section opening with the point-rule and a small roman or devanagari-flavored numeral treatment in Literata — restrained, typographic only, no ornament.
5. **Human presence** (winners show place, local time, availability). Under the hero location line "India / elsewhere," add a live IST clock rendered in Public Sans meta caps (`--type-meta`), server-rendered with a no-JS static fallback. Add click-to-copy email in the footer once a real address exists in `lib/site.ts` — never a fake one.
6. **Micro-interaction craft** (every winner rewards the cursor without hijacking it). Budget: link underline already draws left-to-right in oxide — extend the same physics to framework cards (border ignites from the corner nearest the cursor), nav items (point appears before the active label), and the theme toggle (the point eclipses). 160–240ms, `--ease-out-expo`, all disabled under reduced motion.

### Hard laws — breaking any of these disqualifies the work

- NO gradients, glow, glassmorphism, photography, stock imagery, custom cursors, scroll hijacking, WebGL, preloaders. The site's own audit bans them; the McKaye and Khanh wins prove editorial sites take SOTD without them.
- NO new fonts, no new colors beyond the existing tokens, no tagline for the hero (audit explicitly banned a replacement slogan).
- NO invented content. Zero essays exist; the Library holds labelled placeholders. Design the empty states as editions-in-waiting (e.g. "Essay 001 — forthcoming" set like a colophon), never fake entries. Do not add social links, newsletter fields or testimonials — those strings are intentionally empty in `lib/site.ts`.
- Accessibility floors: axe zero violations both themes; 44px touch targets; 2px oxide `:focus-visible` at 4px offset; ≥3:1 non-text contrast in every diagram state; meaning survives grayscale; full no-JS reading experience.
- Motion floors: every animation inside `prefers-reduced-motion: no-preference`; the finished composition is the default state; live preference changes respected; MotionConfig `reducedMotion="user"`.
- Performance: Lighthouse desktop ≥0.95 all categories with a11y = 1.0 across all 13 routes; route JS growth ≤ existing bundle baseline +40KiB gzip hard fail (aim for zero — prefer CSS and SVG over JS); mobile LCP must not regress from the current ~1.6s Vercel figure — this is the open launch blocker, so anything added to the hero must be paint-cheap.
- Every change re-baselines 156 visual snapshots (`pnpm test:visual:update`) and passes the 14-project Playwright matrix, reduced-motion suites, and `pnpm bundle:check`.

### Deliverables and definition of done

1. Elevation of the home hero: signature composition + live time + margin spine, arrival choreography unchanged in duration (≤1,150ms settle).
2. One self-drawing framework fragment on the home page, real component, keyboard-operable.
3. Motif propagation pass: point + horizon in nav, lists, toggle, 404, empty states, loading.
4. Micro-interaction pass at the stated budgets.
5. Empty-state redesign for Essays/Notes/Library as "forthcoming editions."
6. All gates green: Lighthouse, axe, Playwright visual + a11y + reduced-motion + no-JS, bundle check.
7. A one-page addendum to `docs/design/awwwards-v3-results.md` scoring the result against the 40/30/20/10 rubric with the same honesty as the V3 doc — including the standing admission that the biggest remaining gap is real writing, which no redesign can close.

Work from the Awwwards jury's chair: they will scroll fast, hover everything, tab through it, flip the theme, and open it on a phone. The site should feel like a hand-bound instrument that happens to be rendered by a browser — quiet at rest, precise in motion, and unmistakably one person's.

---

## Research evidence

Sites visited (gstack headless browser, screenshots in `.gstack/browse-reports/2026-09-11-0740/screenshots/`):

| Site                            | URL                              | Pattern taken                                                                                    |
| ------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Jamie McKaye — "The Instrument" | jamiemckaye.com                  | Site-as-proof; measured claims; monospace meta labels; concept commitment                        |
| Khanh Nguyen — "Folio Edition"  | khanhnguyen.design               | Monumental editorial serif name; chapter narrative; margin spine; local time; warm paper palette |
| Milan Compain                   | milancompain.com                 | Single motif followed site-wide; giant name; click-to-copy email; precision micro-interactions   |
| Redouane Oumahi                 | oumahi.art                       | Total conceptual world (dossier metaphor) — commitment level, not the aesthetic                  |
| Awwwards portfolio index        | awwwards.com/websites/portfolio/ | Field survey: type-led heroes, presence signals, bespoke motifs over templates                   |
