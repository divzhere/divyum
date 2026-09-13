# V3 design review — Open Horizon

Status: release candidate under verification, not a production release record.
Branch: `codex/v3-horizon`. V2 baseline: `527a5a8d777c5342cf34955ac7c69eb994c95ec6`.

## 1. Creative thesis

A quiet instrument for ideas in motion. The name and the reading axis establish
the identity; the actual frameworks, Journey and writing carry the substance.
Open Horizon was selected after comparing two compositions at three widths in
both themes. See [the audit](v3-audit.md). No stock imagery or invented personal
material was introduced.

## 2. Signature interaction

A point appears, holds for 250ms, then extends into a horizon. The two name lines
rise from their axes; supporting copy follows. The first-arrival sequence ends
at 1,150ms. It never gates navigation, loops or acts as a loading screen.
The same construction becomes a reading axis, timeline, shelf and diagram origin.
Near the footer, a scroll-linked line contracts into its endpoint. Browsers that
do not support scroll timelines retain the complete static composition.

## 3–4. Before / after and mobile screenshots

Baseline screenshots are immutable at the V2 commit:

- [375 light](https://github.com/divzhere/divyum/blob/527a5a8d777c5342cf34955ac7c69eb994c95ec6/tests/visual/__screenshots__/home-375-light.png)
- [1440 light](https://github.com/divzhere/divyum/blob/527a5a8d777c5342cf34955ac7c69eb994c95ec6/tests/visual/__screenshots__/home-1440-light.png)
- [1440 dark](https://github.com/divzhere/divyum/blob/527a5a8d777c5342cf34955ac7c69eb994c95ec6/tests/visual/__screenshots__/home-1440-dark.png)

Captured 192 screenshots: 13 public routes plus three locally guarded reading
specimens × light/dark × 375, 390, 768, 1280, 1440, 1728. Public baselines passed
again on the normal release build. The additional 1024px breakpoint is covered
by layout/overflow and axe checks. Representative routes were inspected at
phone, tablet, laptop and wide-desktop widths; a grayscale matrix check retained
the quadrant labels, structure and control meaning.

After screenshots in this branch:

- [375 light](../../tests/visual/__screenshots__/home-375-light.png)
- [390 dark](../../tests/visual/__screenshots__/home-390-dark.png)
- [768 light](../../tests/visual/__screenshots__/home-768-light.png)
- [1280 light](../../tests/visual/__screenshots__/home-1280-light.png)
- [1440 light](../../tests/visual/__screenshots__/home-1440-light.png)
- [1728 dark](../../tests/visual/__screenshots__/home-1728-dark.png)
- [Essay specimen, mobile](../../tests/visual/__screenshots__/specimen-essay-375-light.png)
- [Book specimen, desktop](../../tests/visual/__screenshots__/specimen-book-1440-dark.png)

## 5. Typography

Retained the self-hosted Literata and Public Sans fonts. The two-line name scales
from 64px to 150px, with an offset second line on wide screens. Twelve columns
separate index labels, narrative and reading content. Reading measure tops out
at 720px; mobile has 20–24px gutters, 17px body and 18px prose. Desktop prose is
20px. Notes use smaller sans-serif titles than essays. Tables and code retain
their native semantics inside named, keyboard-focusable scroll regions.

## 6. Colour

Light: paper `#f5f2eb`, ink `#24221e`, oxide `#843e34`.
Dark: charcoal `#211f1b`, paper `#f0ede5`, oxide `#d18a76`.
The six framework accent hues now share one oxide family. Shape, text, state
labels and underlines carry meaning independently of colour. No gradients,
glow, glass or photographic substitutes.

## 7. Interaction system

Retained all six framework state machines, library regrouping, Journey selection,
URL state, chapter links, ordering and progress. Diagram hit areas align with
their rendered nodes; tree and spiral have real phone-tap regression coverage.
Navigation exposes `aria-current`; links, theme toggle and primary controls have
44px targets. Motion uses explicit properties and shared 160/240/450/700ms tokens.

## 8. Page transitions

Next 16.3.4's bundled App Router React supports native `ViewTransition` directly.
One `route-horizon` pair connects the structural axis between routes in 450ms.
The root crossfade is disabled; neither navigation nor the entire page is a
named participant. Pointer events pass through. No click interception, deferred
navigation, new dependency or router replacement. Both engines pass native,
unsupported-API, rapid-navigation and browser-back checks.

## 9. Reduced motion and resilience

Reduced motion disables first-arrival transforms, scroll-linked contraction and
native transition durations/delays. Server HTML remains readable without JS.
The delayed-script regression holds application downloads until the complete
introduction and navigation are readable, then verifies hydration/theme control.
48 targeted reading/motion/resilience checks pass in Chromium and WebKit.
Holding an arrow key verifies scrolling in WebKit; a zero-duration synthetic
press did not allow its native scroll animation to advance.

## 10. Bundle comparison

Same-checkout production builds, unique initial script-src gzip (KiB):

| Route                  |     V2 | V3 with native transitions | Change |
| ---------------------- | -----: | -------------------------: | -----: |
| Home                   | 215.24 |                     174.24 | -41.00 |
| Framework detail       | 218.40 |                     179.25 | -39.15 |
| Journey                | 225.27 |                     222.65 |  -2.62 |
| Library                | 214.56 |                     175.12 | -39.44 |
| Essays / Notes / About | 213.90 |                     174.24 | -39.66 |

Includes nomodule scripts; excludes inline scripts, RSC payloads, prefetches and
runtime-loaded imports. The signature adds no application JS dependency. This is
not a claim that the entire application weighs 20KiB. These are normal-build
measurements with the existing Vercel canonical origin and no lab flag. The
earlier candidate measured 212.59KiB on home. Mobile profiling identified the
theme knob's Framer component as an unnecessary shared import. Replacing only
that 12px movement with a reduced-motion-aware CSS transition removed 38.35KiB
from the home path without changing its appearance or the interactive tools.
Four theme tests additionally verify the saved knob position before hydration
and zero-motion switching in both browser engines.

## 11. Lighthouse

The normal-build desktop sweep passed all 13 public routes, three runs per route
(39 runs), using median-run aggregation. Every route scored **100 performance /
100 accessibility / 100 best practices / 100 SEO**. Median LCP ranged from 424ms
(Notes) to 594ms (Home); every run had CLS 0. Command: `pnpm test:lighthouse`.
After the final theme optimization, an additional one-run-per-route desktop
recheck passed all 13 routes: performance 99–100, all other categories 100,
LCP 407–598ms and CLS 0. Tat Tvam Asi scored 99 performance; the other routes
scored 100. This recheck is separate from the earlier three-run median sweep.
Mobile verification uses Lighthouse's default simulated mobile throttling, three
runs per route. After the theme optimization, median category scores are 95 / 97 /
99 for Home / Journey / Knowledge Tree, with accessibility, best practices and
SEO 100 throughout. Median LCP is 2,355 / 2,522 / 1,958ms respectively and CLS 0.
The selected representative Journey run has LCP 2,122ms; do not confuse that with
the median of all three LCP values. The stricter 1,800ms mobile LCP assertion
**still fails**. Field INP has not been measured.

A controlled `inlineCss` experiment was rejected: the home HTML grew from about
7KiB to 43KiB gzip and mobile LCP worsened to about 3.5s. The flag was removed;
the release candidate retains separately cacheable CSS. This is not a reason to
lower the assertion or report all performance targets as met.

The untouched V2 server at port 3103 was verified against commit
`4f4c0162ad23c17b40ceaf094f74d726b44ffe8b`, whose tree matches the merged V2
baseline. The same default mobile settings and three runs per route measured:

| Route          | V2 median performance | V3 median performance | V2 median LCP | V3 median LCP |
| -------------- | --------------------: | --------------------: | ------------: | ------------: |
| Home           |                    97 |                    95 |       2,690ms |       2,355ms |
| Journey        |                    95 |                    97 |       2,805ms |       2,522ms |
| Knowledge Tree |                    96 |                    99 |       2,713ms |       1,958ms |

V3 improves LCP in this comparison and passes the score gate, but the stricter
mobile target remains unmet. A launch exception was requested explicitly rather
than silently changing that target. The final decision and deployment evidence
belong in the native GitHub release record after production verification.
These are local lab measurements, not guarantees of every connection.

### Deployed mobile follow-up and gate correction — 11 September

The protected Vercel preview on `c882deaa` was also measured with default mobile
throttling, three runs per route. This is additional deployment evidence, not a
replacement for the local comparison above:

| Route          | Performance scores | Median performance | Median LCP | CLS |
| -------------- | ------------------ | -----------------: | ---------: | --: |
| Home           | 92 / 87 / 98       |                 92 |    1,606ms |   0 |
| Journey        | 91 / 91 / 100      |                 91 |    2,150ms |   0 |
| Knowledge Tree | 100 / 99 / 99      |                 99 |    1,491ms |   0 |

Accessibility and best practices scored 100 in all nine runs. SEO scored 66
because Vercel deliberately sends `x-robots-tag: noindex` on this protected
preview. The temporary share URL redirects to the actual page. Do not treat
these preview SEO results as production results or remove preview protection.
Production metadata must still be verified after a real production deployment.

**The launch hold now includes the 95 performance score target on Home and
Journey, as well as the remaining LCP gap.** No production deployment or exception
approval has occurred. Raw reports are retained locally under
`.gstack/v3/lighthouse-vercel-mobile/`; they are not public artifacts.

This run exposed a verification issue: in the installed Lighthouse CI version,
`median-run` category assertions accept the best category score across runs.
The release configuration now uses `median` so each metric is checked at its
actual median. Five regression tests exercise the installed assertion engine
with controlled reports; all five first failed against the old configuration
and then passed after the correction. Score thresholds were not lowered.
Re-evaluating the existing local reports still fails the three LCP targets;
re-evaluating the preview reports also correctly fails the two score targets.

A separate diagnostic blocked speculative RSC prefetch requests on Home. The
unused Journey download disappeared, but median LCP remained 2,516ms, so that
hypothesis was rejected and navigation prefetching was left unchanged. Neither
this diagnostic nor the gate correction changes the approved visual design.

## 12. Accessibility and technical evidence

- Fresh quality run after the gate correction: lint, types, content validation,
  111 unit/integration tests, production build and bundle check pass; statement
  coverage 96.77%. The 13 saved final desktop reports also pass the corrected gate.
- Production compilation and type checking pass with native transitions.
- Reading specimens caught and fixed keyboard-inaccessible table/code overflow.
- 403 core E2E checks passed at 375/768/1440 in Chromium and WebKit (287 scoped
  skips). After the image-size fix, 94 specimen/resilience/visual checks passed
  across eight browser projects (18 scoped skips).
- The normal-build matrix passed 473 checks: 182 axe checks across seven widths
  in both themes, 130 route/overflow checks, 156 public screenshot comparisons
  and all five 404/noindex lab exclusions. 227 out-of-scope combinations skipped.
- After the final theme optimization, another 333 checks passed: all 156 public
  screenshots, 156 axe checks at six widths in both themes, the five private-lab
  exclusions, contrast checks and both-engine theme/navigation/resilience checks.
  The remaining 129 combinations were explicitly out of scope and skipped.
- Internal links: 19 URLs and 40 links checked, zero failures. Outbound checking
  found two 404 citations on Knowledge Tree; replaced them with the original
  Reddit AMA, retaining James Clear's working first-principles reference. Reddit
  returned HTTP 200 but blocked automated content access; its body was not
  independently re-read in this run. Final recheck passed: 19 internal URLs,
  40 internal links and 20 external URLs, zero HTTP/anchor failures.
- The reading-size regression first showed an 80px image enlarged to the prose
  width. Removing the CSS width override restores author dimensions; all six
  specimen sizes/themes passed and their 36 baselines were regenerated.
- Manual review found that unbuilt tree parts were too faint even though axe
  passed. A composited-colour regression measured only 1.72:1 for a light-theme
  branch and 2.27:1 in dark. Increased unbuilt opacity while preserving dashed
  branches and the distinct built state. The regression now passes ≥3:1 for
  all 11 unbuilt parts in both themes; phone touch interactions still pass.

## 13. Motion deliberately removed

Removed the full-page fade, JS-required page-intro opacity/perspective entrance,
the hero's old JS animation wrapper, blanket `transition: all` and perspective on
Journey chapters. Retained finite
framework feedback that explains a change of state, native route continuity and
the first-arrival signature. No custom cursor or scroll hijacking.

## 14. Dependencies

None introduced. Existing Framer Motion remains for interactive tools/Journey;
CSS handles the signature and footer, and the browser handles route continuity.
No CMS, WebGL runtime, paid service, GitHub Actions or hosted CI was added.

## 15. Author TODOs and launch boundary

- Publish real essays/notes when ready; the empty states are intentional.
- Replace the five labelled placeholder spines with actual books and notes.
- Expand confirmed Journey chapters, dates and optionally public professional
  details. Employer/contract/compensation material remains out of the site.
- Supply only owned/approved photographs if desired; none were fabricated.
- Confirm public social/contact URLs and the eventual personal domain.
- Screenshot comparison and the V3 go-live workflow are approved. The stricter
  mobile LCP target exception is awaiting a separate decision. Production stays
  on V2 until that decision, exact-SHA verification and public smoke tests.
  The release tag comes last; its native GitHub release is the authoritative
  record of the merge SHA, deployment ID, public checks and accepted non-blockers.

## Dedicated design critique

Internal assessment after inspecting all 13 major public routes at representative
viewports, both themes, the composition studies and the reading specimens:

| Category   | Internal score | Assessment                                                                                                                                                                         |
| ---------- | -------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design     |       8.6 / 10 | The offset name, consistent axes, diagram plates and restrained paper/charcoal system give the site one identity. Mobile spines and navigation are separately composed.            |
| Usability  |       9.2 / 10 | Native navigation, legible reading measure, visible focus/current state, 44px controls, URL-backed Journey and no-JS/reduced-motion support remain intact.                         |
| Creativity |       8.2 / 10 | A small visual vocabulary connects software, reading and the inner life. The six actual thinking tools carry more character than decorative motion.                                |
| Content    |       7.5 / 10 | Existing frameworks are useful and attributed; Journey is truthful. Empty essays/notes, placeholder books and unfinished first-person practice sections limit the authorial voice. |

Weighted using the brief's 40/30/20/10 rubric: 8.59 / 10. These are subjective
self-review scores, not an Awwwards jury result or award prediction. The content
score is below the aspirational 8.5 target. Do not disguise that gap with invented
writing. The launch brief classifies additional essays as P2; this is a public V3
design release, not a claim that the archive is ready for an awards submission.

No severe visual defect remains in the reviewed layouts. The most valuable next
improvement is real writing and reading notes, not more animation or another
frontend redesign.

## V4 addendum — Instrument

Date: 2026-09-14. Branch: `awwwards-level-site-prompt`, on top of `master`
`7e37c3e` (V3, live). Brief: [awwwards-v4-prompt.md](awwwards-v4-prompt.md).
Plan and review record: [awwwards-v4-plan.md](awwwards-v4-plan.md). Same
honesty rule as above: these are local measurements and a self-review, not an
award result.

### What changed

One motif, more states. Nothing new was introduced: no font, colour, dependency,
gradient, photograph, cursor, preloader or loading route.

- **Hero.** One custom property (`--horizon-start`, a container-query unit on
  `.home-hero`) now indents the second name line, places the point, and hangs
  the location block from the same origin. The rule runs 2.7px (1440) to 4.3px
  (375) beneath the caps of BHUMRA instead of a rem below the name. A margin
  spine ("Divyum Bhumra — Est. Punjab", Public Sans meta caps, reads bottom-up,
  ≥1100px, `aria-hidden`) sits at the hero's right edge. A live IST clock in
  `--type-meta` renders "IST · UTC +5:30" on the server and for no-JS readers
  and "14:09 IST" after hydration, in a fixed-width slot so nothing moves. The
  first link now reads "Explore the frameworks" and lands on real material.
  Arrival choreography unchanged: every hero animation still ends at or before
  1,150ms and runs once (asserted).
- **Living instrument.** The real Knowledge Tree component sits in the
  Frameworks section with its own caption drawn from the framework's
  frontmatter. Its ground line is now an oxide stroke from a 9px origin point;
  under `prefers-reduced-motion: no-preference` it draws itself (700ms, once)
  when the canvas scrolls into view, and if application chunks never arrive
  after the inline script marked the document ready, CSS draws it anyway at 4s.
  Server HTML, no-JS readers and reduced motion always get the complete line.
  Hotspots have distinct names ("Build branch A: a core truth", "Attach leaf A1:
  a detail on branch A"); the trunk shows a resting disc. The three plates
  beneath are one per lineage: Signal vs Noise, Eight Limbs, Vision to Leverage.
- **Motif propagation.** Six home chapters each open with a 9px point on the
  hairline and a roman numeral (Devanagari was ruled out: no new font). The
  5px marker sits before the current nav item and the underline is no longer a
  second current indicator. The theme toggle is a 9px point on a 21px rule;
  hover or focus contracts the rule into the point. Prose bullets keep the
  native disc for list semantics but paint it transparent and draw a 5px
  point. Journey moments use the 5px marker and grow to 9px on hover or focus.
  The Currently rule starts from an origin point. The 404 is a lost point with
  a dashed trace and no view-transition participant. Point scale is two sizes
  only, 9px origins and 5px markers.
- **Micro-interactions.** Framework plates ignite from the corner nearest the
  cursor: four hover zones own two edges each, the zone under the cursor
  starts at 0ms and the rest follow at 60ms, nothing retracts while hovered,
  focus-visible ignites from the top-left, and reduced motion is instant.
- **Editions in waiting.** Essays and Notes render exactly one colophon row
  ("Essay 001 ——— Forthcoming") above the existing sentence. The home library
  preview is five points on the shelf line with the caption "Five spines in
  waiting." The library page numbers its placeholder spines Shelf 001–005 by
  seed order (unit-tested so sorting never renumbers them) and marks them
  Forthcoming.

Not done, by rule: click-to-copy email (`siteConfig.social.email` is empty and
a fake address is forbidden), social links, newsletter, testimonials.

### Gate evidence

| Gate                                           | Result                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lint, types, content, unit                     | pass; 112 unit/integration tests, statement coverage 96.84%                                                                                                                                                                                                                                                                                                                                                  |
| Build and bundle                               | pass; home initial JS 174.30 → 176.34 KiB gzip (+2.04, the tree joining the home route); every other route +0.20 to +0.38; journey +0.29; hard limit +40                                                                                                                                                                                                                                                     |
| Browser matrix (14 projects)                   | 1,067 passed, 1,479 scoped skips, **2 failed**: `v3-foundation` "reading measure and type" at 1024px in Chromium and WebKit, because `--type-prose` resolves to 18.43px there. Same clamp, same test and same project exist on `master`; it fails identically before this branch. Left for the owner: raising the clamp floor to 1.1875rem changes the reading size on every article between 1000 and 1055px |
| Axe, both themes, seven widths                 | 182 checks inside the matrix, zero violations                                                                                                                                                                                                                                                                                                                                                                |
| Visual                                         | all 156 public baselines regenerated with `--update-snapshots=all` (the default `changed` mode had silently kept stale baselines whose diff was under the 1% tolerance), then 156 pass; the hero clock is frozen at 14:09 IST in every capture; home, essays, library, 404, framework-tree and eight-limbs inspected by eye at 375/390/768/1440 in both themes                                               |
| New tests                                      | `v4-hero`, `v4-instrument`, `v4-motif`, `v4-plates` (24 checks) plus the toggle eclipse in `v3-theme` and spine numbering in the unit suite; blocked-chunk, no-JS, reduced-motion and full keyboard sequences included                                                                                                                                                                                       |
| Lighthouse desktop, 13 routes × 3 runs, median | 100 / 100 / 100 / 100 on every route; LCP 427–573ms; CLS 0                                                                                                                                                                                                                                                                                                                                                   |
| Links                                          | 19 internal URLs and 40 links, zero failures; the six external citations pass; the 14 "failures" are canonical self-links to the custom domain, which is not live, the same as any local build without `NEXT_PUBLIC_SITE_URL`                                                                                                                                                                                |

### Mobile guard

Local mobile numbers on this machine are noisy (single runs of the same build
ranged 78–99), so a sequential before/after was inconclusive. The decisive
check was an interleaved A/B: `master` built in a separate worktree on one
port, this branch on another, runs alternating A, B, A, B under the same load.

| Route   | Runs per side | master median score / LCP | V4 median score / LCP |
| ------- | ------------: | ------------------------- | --------------------- |
| Home    |             5 | 92 / 3,132ms              | 97 / 2,503ms          |
| Journey |             3 | 97 / 2,539ms              | 99 / 2,113ms          |

The branch does not regress either route, so the `next/dynamic` fallback in
the plan (D2.6) was not needed. The home LCP element moved from the Currently
heading to the hero name itself. The ~1.6s Vercel figure can only be confirmed
on the preview deployment; that check, and the production metadata check,
belong to the release record.

### Self-score, 40/30/20/10

| Category   |  V3 |  V4 | Why                                                                                                                                                                                |
| ---------- | --: | --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design     | 8.6 | 8.9 | The origin now binds the name, rule, location and time; the motif appears in every state the brief listed. Risk: the home page carries more elements than before.                  |
| Usability  | 9.2 | 9.2 | Unchanged floors: 44px targets, visible focus, no-JS reading, one current indicator. The leaf hotspots at 375px still overlap as 44px targets (pre-existing, recorded, not fixed). |
| Creativity | 8.2 | 8.6 | A real instrument drawing itself on the home page, corner ignition and the toggle eclipse are all the same point and line.                                                         |
| Content    | 7.5 | 7.5 | No writing exists. The empty states are more honest now, but an honest absence is still an absence.                                                                                |

Weighted: 8.79 / 10 (V3: 8.59). The standing admission holds: the biggest gap
is real writing and real books, and no redesign can close it. Both review
voices in the plan said the next hour should go to one essay, not more chrome;
this branch ships the brief the owner set and leaves that call to the owner.
