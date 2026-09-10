# V3 audit and implementation ledger

## Baseline and scope

V3 starts from `527a5a8d777c5342cf34955ac7c69eb994c95ec6` (PR #43).
Branch: `codex/v3-horizon`. V2 is the technical baseline, not the final V3 launch.
The full design brief and handoff supplied on 10 September 2026 govern this work.
No content-model rewrite, hosted Actions, paid service, stock imagery or invented
personal material is planned. The final launch includes a verified production SHA
and a release tag, only after design review and approval.

## Evidence collected before editing

- Read the root layout/template, global CSS, home, all shared layout/reading
  primitives, six framework components and registry/glyphs, Journey explorer/data,
  Currently/site configuration, collection schemas/readers, and all public routes.
- Fresh production build and all 106 unit/integration tests pass; statement
  coverage 96.77%. The checkout initially lacked already-locked MDX dependencies;
  `pnpm install --frozen-lockfile` restored them without a lockfile change.
- Current build initial script-src gzip: home 215.24 KiB; framework detail
  218.40 KiB; Journey 225.27 KiB; Library 214.56 KiB. Compare the final build with
  this same-checkout measurement, not a different build's chunk rounding.
- Captured and visually inspected all six fresh production homepage baselines:

| Width | Light                                                       | Dark                                                       |
| ----- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| 375   | [Screenshot](../../.gstack/v3/baseline/home-375-light.png)  | [Screenshot](../../.gstack/v3/baseline/home-375-dark.png)  |
| 768   | [Screenshot](../../.gstack/v3/baseline/home-768-light.png)  | [Screenshot](../../.gstack/v3/baseline/home-768-dark.png)  |
| 1440  | [Screenshot](../../.gstack/v3/baseline/home-1440-light.png) | [Screenshot](../../.gstack/v3/baseline/home-1440-dark.png) |

The image files are local audit artifacts. Retain immutable V2 screenshot links
at the baseline commit in the final results document for portable comparison.

## KEEP

- Literata for editorial/display type and Public Sans for interface text. They
  have useful contrast already; composition, not another font download, is missing.
- Exact home sentence, truthful Journey chapters, honest empty writing states,
  five explicitly labelled book placeholders and private author TODOs.
- MDX, Zod, permanent routes, schemas, canonical/export pipeline and hidden routes.
- Native scrolling, actual buttons, reduced-motion policy and semantic server HTML.
- Six distinct thinking tools and their real interactions. Their visual prominence
  can grow without throwing away their state machines.

## RESHAPE

- The homepage hides two principal destinations: no Frameworks or Library preview.
  Restore the brief's order: intro, Currently, writing, frameworks, Journey,
  Library, About fragment, footer.
- Desktop name caps at 80px and stays in the same narrow reading grid as the rest.
  Enlarge the name, use a 12-column field and place supporting copy asymmetrically.
- Every home section repeats the same heading-left/body-right rhythm. Give
  diagrams, timeline and shelf their own truthful material and proportions.
- Mobile gutters are only 16px; secondary copy, metadata and library spines are
  too small. Use a separately composed 20–24px-gutter mobile layout.
- Framework glyphs are tiny; Eight Limbs rings are only 86px wide. Make diagrams
  legible objects with a clear origin and controls, not icons above text.
- The footer is a small name and two links, not a considered end to the document.
- About has little narrative segmentation. Recompose confirmed facts only.

## REMOVE

- Six unrelated framework accent hues; map information states to one oxide accent.
- `transition: all` in tree and spiral styles; name properties explicitly.
- Unnecessary page-intro perspective/rotateX and duplicate route/heading entrances.
- Repetitive role text in the hero; the exact supporting sentence already explains
  what Divyum does. No replacement slogan.
- Shrinking book spines into unreadable mobile objects, pill-like filter chrome,
  and any motion whose removal improves comprehension.

## MISSING

- Active-route navigation and accessible current-page indication.
- First-arrival signature: point, 200–300ms pause, line, name-axis reveal, copy,
  settled by 1.4s. Readable immediately without JS or with reduced motion.
- Meaningful recurrence: Currently baseline, thinking-tool origin, shelf,
  timeline, reading axis, About separator, footer return to point.
- Progressive route continuity without delaying navigation or intercepting native
  link behavior. Installed Next 16.3.4's `view-transitions.md` documents React
  ViewTransition directly in App Router; validate support and fallback in phase 5.
- Coverage at 390, 1024 and 1728; final screenshots at six requested widths in
  both themes on every public route. Exercise unpublished article templates with
  local test fixtures, never public fabricated essays/books.
- Dedicated slow-network, touch, no-JS and production release evidence for V3.

## Research and design studies

[Awwwards' evaluation system](https://www.awwwards.com/about-evaluation/), checked
10 September 2026, confirms 40% design / 30% usability / 20% creativity / 10%
content. Internal scores are critique, not an award or independent jury result.
No paid submission is part of the launch.

Compare two compositions using the same actual fonts and content:

1. **Open horizon**: two large name lines occupy the left field; the second line
   reaches across the grid; copy sits to its right/below. A single full-width rule
   becomes the name's baseline, then the margin of the next section.
2. **Facing pages**: name occupies a narrow left column, copy and chapter index
   occupy the right. More book-like, but risks preserving V2's narrow hero and
   dividing attention before the visitor knows whose site this is.

Initial preference: Open horizon. Compare actual mobile/tablet/desktop renders
before integrating. Keep the name dominant, prose calm and no decorative slogan.
The supplied material palette is deliberate; distinguish the site through the
name/axis composition and actual diagrams, not generic cream-and-serif styling.

## Execution and proof ledger

| Phase / brief sections       | Required deliverable                                                | Proof / current state                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 / 01–08, 41–46             | Baseline, truthful scope, audit                                     | This document; baseline build/tests/images                                                                                                    |
| 1 / 12–16, 21, 32, 36        | Palette, type, grid, spacing, focus, motion tokens                  | Complete; foundation tests and final 182-check axe matrix pass at seven widths in both themes                                                 |
| 2 / 09–11, 20, 22, 34, 37–38 | Isolated signature + direction comparison                           | Open Horizon chosen after 12 screenshots; 37 targeted checks passed across Chromium/WebKit; first sequence ends at 1,150ms                    |
| 3 / 17–18, 40–45             | All eight homepage sections, navigation, footer                     | Complete using existing content; sections, links, no-JS, touch targets and footer return tested                                               |
| 4 / 23–31                    | Core routes and reading templates                                   | Complete; keyboard table/code scrolling and author image dimensions fixed; 94 specimen/resilience/visual checks pass                          |
| 5 / 19, 33                   | Progressive horizon route transitions                               | Native 450ms horizon verified; supported/unsupported/reduced-motion, rapid navigation and browser Back pass                                   |
| 6 / 35–39, 47–48             | Polish, responsive/no-JS/slow-network/keyboard/touch, SEO, quality  | Normal build: 106 unit/integration and 473 browser checks pass; desktop Lighthouse 100 in all categories on 13 routes; final mobile run below |
| Review / 02, 42–45, 49–52    | `awwwards-v3-results.md`, all 15 requested report items             | Dedicated visual critique complete; content remains honestly below the aspirational content score, with P2 author work listed                 |
| Launch / handoff             | Approval, merge, exact Vercel SHA, public smoke, release tag/record | Screenshot approved; local LCP and deployed mobile score/LCP gaps documented; keep production on V2 until the launch decision is resolved     |

Final technical gates: lint, types, unit/integration, build, Chromium/WebKit,
axe, Lighthouse >=95 with accessibility 100, zero runtime errors/overflow,
home incremental JS <=40 KiB (signature preferably <=20 KiB). Report LCP/CLS
lab measurements; INP needs real interactions/field data, never infer it from a
Lighthouse score. Preserve all draft/project/lab exclusions and canonical URLs.

Domain choice requested asynchronously. Until confirmed, use the existing Vercel
alias; do not assume that the fallback domain in site configuration is connected.

## Skills and deliberately rejected generic advice

The redesign and frontend-design skills informed the audit/comparison process.
The user's brief overrides generic suggestions to swap fonts first, add stock
images, add glassmorphism, invent content or change scrolling. None of those
suggestions apply here. Behavioral changes use regression tests before code.

## Implementation checkpoint — 10 September 2026

The following is an intermediate checkpoint. The ledger above and
[final results](awwwards-v3-results.md) supersede its pending items and early
bundle measurements.

- Compared both studies at 375, 768 and 1440 in light and dark: twelve images
  captured and inspected in `.gstack/v3/studies/`. Open Horizon gives the name
  more presence and an asymmetric baseline; Facing Pages stayed too close to V2.
  Same Literata/Public Sans fonts retained, so no font-replacement approval gate.
- The prototype's CSS sequence lasts 1,150ms. No loader, no looping motion,
  no JS-required content, no new dependency. Its initial script-src payload was
  214.14 KiB; after integrating and removing the JS-dependent PageIntro it is
  212.86 KiB on home, **2.38 KiB below the same-checkout V2 baseline**.
  Final post-transition bundle measurement is still required.
- Home now shows the exact sentence and all required destinations in order.
  Framework previews use existing glyphs/metadata; three Journey moments deep-link
  to actual chapter IDs. Placeholder spines are explicitly labelled. Footer
  includes all six core routes and only configured social links.
- No-JS regression exposed hidden page intros and a redundant full-page fade.
  Converted PageIntro to server markup; removed the full-page fade; kept finite
  local feedback on actual framework and Journey controls.
- New visual-object tests first failed for missing homepage SVG strokes, 15.68px
  phone book titles, undersized Eight Limbs rings, and offset tree/spiral controls.
  Fixed each cause. The revised tests pass in Chromium 375/768/1440 and WebKit
  375 (37 passed, three wide-measure skips). Actual phone taps can build a tree
  branch/leaf and select a spiral stage.
- 106 unit/integration tests still pass; statement coverage 96.77%. Production
  build and lint pass at the core-route checkpoint. An earlier 52-check axe run
  passed for all 13 routes in both themes at 375/1440; rerun after final changes.
- Two WebKit navigation checks timed out during overlapping six-worker suites.
  Both passed alone, and then passed in the bounded two-worker core suite.
  Final suites will run sequentially with bounded concurrency.
- Local `/design/v3/reading/{essay,note,book}` specimens exercise the actual
  ContentArticle/BookArticle renderers, not copied HTML. They carry noindex,
  use draft test objects outside content collections and require
  `V3_DESIGN_LAB=1` at build/runtime. Public feeds/sitemap exclude them.
  Specimens exposed keyboard-inaccessible table/code overflow; fix and full
  light/dark Chromium/WebKit verification in progress.
- Latest inspected desktop screenshots: `.gstack/v3/core/` for home,
  Frameworks, Library, Journey, About and Eight Limbs. Final matrix still pending.
- No merge, push, production change, release tag or final design score yet.
