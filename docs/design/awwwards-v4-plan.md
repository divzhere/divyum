<!-- /autoplan restore point: /Users/divyumb/.gstack/projects/divzhere-divyum/awwwards-level-site-prompt-autoplan-restore-20260911-141921.md -->

# V4 implementation plan — "Instrument"

Date: 2026-09-11. Branch: `awwwards-level-site-prompt`. Base: `master` at `7e37c3e` (V3 Open Horizon, live in production).
Brief: [awwwards-v4-prompt.md](awwwards-v4-prompt.md). Prior record: [awwwards-v3-results.md](awwwards-v3-results.md), [v3-audit.md](v3-audit.md).
Amended after the /autoplan CEO and Design phases (see §7).

## 0. Thesis, sharpened to one sentence

**The point is Divyum; the horizon is everything he is exploring; every page is a new meeting of point and line.**
Every change below must be defensible as a new state of that one motif. Nothing else gets introduced.

Two laws that follow from it:

- **Point scale.** Two sizes only. 9px = an origin (hero, section openings, diagram origin, Currently rule, footer). 5px = a marker (nav current page, list bullets, Journey moments). Nothing at 7px.
- **Dashed = absent.** A dashed stroke means "not here yet": unbuilt tree parts, placeholder spines, the 404's lost horizon. Dashed is never decoration.

## 1. What exists and is reused (no re-invention)

| Sub-problem                                                                | Existing code reused                                                                                                                                 |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Point + horizon markup and CSS                                             | `components/point-rule.tsx`, `.hero-point` / `.hero-horizon` in `app/globals.css`                                                                    |
| Arrival choreography (250ms hold, 500ms extend, name rise, 1,150ms settle) | `@keyframes horizon-extend / name-rise / signature-arrive`, gated by `html[data-signature-motion="ready"]` + `prefers-reduced-motion: no-preference` |
| Scroll-linked line contraction                                             | `.footer-return-line` with `animation-timeline: view()` and `@supports` fallback                                                                     |
| Link underline physics (left to right, oxide, 240ms, ease-out-expo)        | `.text-link::after`                                                                                                                                  |
| Six real interactive diagrams                                              | `components/frameworks/*.tsx`, registry `components/frameworks/index.tsx`, glyphs                                                                    |
| Theme knob (CSS transition, JS-free saved position)                        | `.theme-track` / `.theme-knob`, `components/theme-toggle.tsx`                                                                                        |
| Empty states                                                               | `components/essay-list.tsx`, `components/note-list.tsx`, `.empty-state`                                                                              |
| Placeholder shelf                                                          | `lib/library-seed.ts`, `components/library-shelf.tsx`, home `.spines`                                                                                |
| Framework frontmatter (`subtitle`, `description`, `origin`, `lineage`)     | `lib/frameworks.ts`, used for the home caption without inventing copy                                                                                |
| Motion tokens                                                              | `--motion-micro 160ms`, `--motion-ui 240ms`, `--motion-reveal 700ms`, `--ease-out-expo`                                                              |
| Gates                                                                      | `pnpm quality`, `test:e2e`, `test:a11y`, `test:visual(:update)`, `test:lighthouse`, `bundle:check`, `links:check`                                    |

No new dependency. No new font, colour, or motif. Framer Motion stays confined to Journey and `MotionProvider`.

## 2. Deliverables mapped to changes

### D1. Hero elevation (`components/hero-experience.tsx`, `components/local-time.tsx` new, `app/globals.css`)

1. **Second line rides the horizon.** One custom property, `--horizon-start`, set on `.home-hero` only (inner-page intros keep their own point-rule untouched), drives the second name line's indent, the point-rule origin, and everything that hangs off the point: `.hero-name-line + .hero-name-line { margin-left: var(--horizon-start) }`; `.home-hero .hero-point { left: var(--horizon-start) }`; `.home-hero .hero-horizon { left: calc(var(--horizon-start) + 4px) }`; `.hero-location`, `.hero-time` and (at 701–1000px) `.hero-support` get `margin-left: var(--horizon-start)` so nothing floats left of the origin. `.hero-name` spans all 12 columns (it sits on its own rows). Values: `13%` at ≥701px, `0` under 700px.
   **Vertical relationship:** the horizon sits _beneath_ the letters, touching the cap baseline: rule top = baseline + 2px (the line underlines BHUMRA, it does not cut it). Implementation: `.home-hero .hero-rule { margin-top: calc(var(--type-display) * -0.1) }` (one constant K = 0.1 across breakpoints, tuned once against 1440 and 375 screenshots). Choreography: the second line rises inside its own `overflow: clip` box, so the letters never cross the stationary line; the extend (250–750ms) finishes before the line lands (550–1000ms). Settle stays at 1,150ms.
2. **Margin spine.** `<p class="hero-spine" aria-hidden="true">Divyum Bhumra — Est. Punjab</p>` (the brief's suggested copy; taste decision T4) in Public Sans meta caps (`--type-meta`, letter-spacing 0.14em, muted), `writing-mode: vertical-rl; transform: rotate(180deg)` so it reads bottom-up like a book spine, bottom-anchored to the hero's last row, at the hero's right edge. Shown at ≥1100px; `.hero-support` reserves the column with `padding-inline-end: 2rem` at that width so the lede never rags into it. `aria-hidden` because the name is already the `h1`. "Punjab" is confirmed by `journeyChapters[0]` ("Born in Punjab"); no other claim is added.
3. **Live IST clock.** New client component `LocalTime`: `useSyncExternalStore` with a 15-second interval subscription, `Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })` (never `24:09`), wrapped in try/catch returning `null` so any formatter exception falls back to the static text. Server snapshot `null`: server HTML and no-JS readers see `IST · UTC +5:30`; after hydration `14:09 IST`. Both strings live in a fixed slot: `min-inline-size: 15ch; font-variant-numeric: tabular-nums`, so the swap after hydration moves nothing (it snaps, no fade). Rendered under `.hero-location` as `.hero-time` in `--type-meta`. Visual baselines freeze the clock with `page.clock.install` at 08:39 UTC (14:09 IST). _Both CEO voices doubt a fixed IST clock is truthful presence for "India / elsewhere"; the brief asks for it explicitly (taste decision T3); "IST" names the reference zone rather than a location._
4. **Hero CTA.** "Read the writing" currently sends the first click to an empty archive. It becomes "Explore the frameworks" → `/frameworks` (design finding, both voices). The Writing section keeps its own Essays / Notes links.
5. **Arrival choreography unchanged.** Spine and time join the `signature-arrive` group (300ms at 850ms). A new test asserts every hero animation ends ≤ 1,150ms and runs once.

### D2. Self-drawing framework fragment on the home page (`components/frameworks/knowledge-tree.tsx`, `app/page.tsx`, `app/home.module.css`, `app/globals.css`)

The **Knowledge Tree** becomes the living instrument on the home page: the real component, not a copy. Rationale: its ground line is already a horizon; giving it an origin point makes it the motif's "diagram origin"; its build order (trunk → branch → leaf, leaves fall) is the strongest keyboard-operable interaction of the six. The three plates beneath are Signal vs Noise (Western), Eight Limbs (Eastern) and Vision to Leverage (Personal): one per lineage; Eight Limbs, the most distinct Eastern diagram, stays featured; Vision to Leverage takes the tree's old slot.

1. **Origin point + oxide ground.** The ground line's stroke becomes oxide with `pathLength="1"`. The origin is a 9px HTML point (`<span class="fw-tree-origin" aria-hidden>`) absolutely positioned inside `.fw-tree-canvas` at left 20% / top 90% with `translate(-50%, -50%)` and `pointer-events: none`, so it is centred on the line's end, stays 9px at every render size, and never sits over a hotspot. Same on `/frameworks/knowledge-tree`.
2. **Self-draw on scroll-into-view, with an exit.** The tree observes its canvas with one `IntersectionObserver` (threshold 0.35) and sets `data-draw="drawn"` once; if the API is missing the effect sets it immediately. CSS, inside `prefers-reduced-motion: no-preference` only:
   `html[data-signature-motion="ready"] .fw-tree:not([data-draw="drawn"]) .fw-tree-ground { animation: fw-ground-draw-late var(--motion-reveal) var(--ease-out-expo) 4s both }` and `.fw-tree[data-draw="drawn"] .fw-tree-ground { animation: fw-ground-draw var(--motion-reveal) var(--ease-out-expo) both }` (two identical keyframe sets, different names, so switching restarts at 0ms). The "late" animation is the exit: if application chunks never arrive after the inline script marked the document ready, the line draws itself anyway after 4s. Reduced motion and no-JS render it complete because the hidden state exists only inside the query and behind the attribute. Live preference flip: query stops matching, line complete. One oxide stroke, 700ms, one iteration.
3. **Home composition (responsive, intentional).**
   - ≥1000px: `.instrument` is a two-column row inside the Frameworks section: columns 1–4 carry the label "The Knowledge Tree" (Literata, plate-title size), the lineage/origin meta line ("Western · Elon Musk's semantic-tree analogy"), the framework's real `description` from its frontmatter as the caption, and the link "Read the framework ↗"; columns 5–12 carry the tree canvas (max-width 42rem, right-aligned) with its status line and Start over beneath it. The status line renders at body size on the home page (`.instrument .fw-status { font-size: var(--type-body) }`).
   - 700–1000px: caption block above, canvas full width below (max 42rem, centred).
   - <700px: same stack; canvas full width (343px at 375); caption two lines max.
   - Plates below keep the 3-up grid ≥1000, become a 1-column stack ≤700, and at 700–1000 render 3-up at reduced padding (existing rule); the 768 baseline is inspected for cramp and the grid drops to 1-up + 2-up if the titles wrap to three lines.
     The `v3-home` expectation of three `/frameworks/` links becomes four.
4. **Affordance and names.** The trunk hotspot shows its 10%-ink resting disc at rest on every page (it is the intended first click); branches and leaves keep hover-only discs. Accessible names become distinct: "Build the trunk: the fundamental principles", "Build branch A: a core truth", "Attach leaf A1: a detail on branch A" (and so on). The `frameworks.spec` selectors move to regexes. Leaf hotspots at 375px are 29px apart and overlap as 44px targets today (pre-existing); the topmost target wins and each leaf still has ≥29×44px of unique area; recorded, not changed.
5. **Keyboard sequence tested from the home page:** Tab to trunk → Enter (built) → Tab to branch A → Enter → Tab to leaf A1 → Space (attached) → Tab to Start over → Enter (cleared), with `role="status"` text checked at each step.
6. **Performance guard.** The home page currently ships no interactive framework; the tree adds hydration. The guard is the mobile performance score and LCP on Home, pre/post on the same machine (§D6). If Home regresses, the tree is loaded with `next/dynamic({ ssr: true })` so the server still renders the complete static tree and caption at full dimensions; only hydration defers. That is the fallback's reader experience: identical HTML, controls activate after load.

### D3. Motif propagation (`app/globals.css`, `app/home.module.css`, `components/navigation.tsx` CSS only, `components/theme-toggle.tsx` CSS only, `app/not-found.tsx`, `components/currently.tsx` CSS only)

| Surface         | Point + horizon state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home sections   | Each `.section` opens with a 9px point sitting on its hairline (`::before` at top:-5px) and a small roman numeral (I–VI) in Literata 0.85rem muted above the `h2`. Typographic only. Devanagari is out (latin subset only, no new font). Plate numbers `01–03` are removed (the section has the numeral); the plate meta line shows lineage on the left and origin on the right.                                                                                                                                        |
| Nav             | The 5px point sits before the `aria-current="page"` label only, static. It scales from 0 to 1 over 160ms when a link _becomes_ current (the attribute flips after navigation), so route changes reward the eye once. No point on hover; the underline stays the hover/focus affordance. The current-page underline (`.nav-link[aria-current="page"]::after`) is removed: one current indicator.                                                                                                                         |
| Lists           | `.prose ul { list-style: none }` with a 5px oxide `::before` disc per `li` (Eight Limbs and Vision to Leverage bodies have lists); Journey moments move from 7px to the 5px marker and grow to a 9px origin on hover/focus of their link (accepted expansion E5). Currently list gets its origin: `.currently-list::before` 9px point at the top of its vertical rule (hidden under 700px where the rule is removed).                                                                                                   |
| Theme toggle    | A point on a horizon: `.theme-track` is a 21×1px rule drawn by a pseudo-element, `.theme-knob` a 9px oxide point travelling the existing 12px (`translateX(12px)` keeps `v3-theme` intact). The eclipse is literal: on hover/focus-visible the rule contracts into the point (`scaleX(0)`, transform-origin on the point's side: left in light, right in dark), 180ms; releasing restores it. The knob's translation is untouched by the effect. The 0.78rem text label stays so the control reads as a switch at 21px. |
| Diagram origins | Tree origin point (D2). The other five already carry an origin (bindu, centre, spiral node, limbs centre, quadrant grid).                                                                                                                                                                                                                                                                                                                                                                                               |
| 404             | "The lost point": `.not-found-mark` renders the 9px point followed by a 6rem _dashed_ hairline that stops. Plain markup, no `ViewTransition` name (only one named horizon per page).                                                                                                                                                                                                                                                                                                                                    |
| Loading         | No `app/loading.tsx`: every route is static and never suspends, so a loading UI would flash for milliseconds and insert an unnamed horizon into the `route-horizon` morph. The motif's loading state is the held point of the arrival sequence (250ms before its line extends), which already exists.                                                                                                                                                                                                                   |
| Empty states    | See D5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Footer          | Already inverts. Click-to-copy email is **not** added: `siteConfig.social.email` is empty and the brief forbids a fake address.                                                                                                                                                                                                                                                                                                                                                                                         |

### D4. Micro-interaction pass (CSS only, 160–240ms, `--ease-out-expo`, off under reduced motion via the existing global `transition: none !important`)

1. **Framework plates ignite from the nearest corner and never retract while hovered.** Four invisible hover zones (2×2, `aria-hidden`, `<span data-zone>`) inside each plate; each zone owns its two adjacent edges as `::before` (the full horizontal edge) and `::after` (the full vertical edge), positioned on the card's outer edges, 1px oxide, `transform: scale(0)`. On `.plate:hover` all eight pseudo-edges reach scale 1 with `transition-delay: 60ms`; the zone under the cursor gets `transition-delay: 0`, so the nearest corner starts first and the rest follow. Crossing the card's midline changes nothing already drawn. Leaving the card retracts everything (240ms). `.plate:focus-visible` ignites all edges with the top-left (origin) zone first; when the mouse is already on a focused card nothing changes. The existing whole-border `.plate:hover { border-color }` rule is removed; the base 1px `--rule` border remains for touch. No `:has()`.
2. **Nav point** (D3), 160ms on becoming current.
3. **Toggle eclipse** (D3), 180ms.
4. **Journey moment point grows** 5px → 9px on link hover/focus, 160ms.
5. Link underline physics unchanged.

### D5. Empty states as editions-in-waiting (`components/edition-row.tsx` new, `components/essay-list.tsx`, `components/note-list.tsx`, `components/library-shelf.tsx`, `lib/library.ts`, `app/page.tsx`, `app/globals.css`, `app/home.module.css`)

1. **Essays and Notes: one colophon row, one sentence.** `EditionRow` (shared by both lists) renders `<p class="edition-row">`: 9px point, `Essay 001` in Public Sans meta caps, a hairline leader filling the row (flex: 1), `Forthcoming` in Literata; at 375px the leader keeps ≥2rem and the row never wraps. Exactly one row (the brief's own example); more would claim a pipeline. The `.empty-state-title` ("Essays are coming soon.") is dropped everywhere; the human sentence ("I've spent years building things…") stays beneath the row on `/essays`, `/notes` and the home Writing section, so section II is one row and one line tall.
2. **Library, home preview: points on a shelf.** The five 20rem placeholder rectangles leave the home page. The preview becomes the shelf line (the existing `.spines` bottom rule) carrying one 9px point per placeholder at spine spacing, each `li` holding visually-hidden text "Shelf 001 · vedanta · forthcoming", plus the caption "Five spines in waiting. Real books and reading notes will follow." When real books exist, they render as spines on the same line and the caption counts only the placeholders (`n spine(s) in waiting`; omitted at 0).
3. **Library page.** Placeholder spines keep their theme label (the one truthful datum), render the title as `Shelf 001 … 005` and the status as `Forthcoming`, dashed border kept, still unlinked. Numbering comes from `spineLabel(entry)` in `lib/library.ts`, derived from the placeholder's position in the seed file, so sorting the shelf never renumbers it (unit-tested). Sort controls stay: they are the shelf's real instrument and will matter the day the first book lands. Note rewritten to match ("Spines marked forthcoming are exactly that…").
4. Tests: `v3-home` ("Placeholders") and `library.spec` ("placeholder") assertions updated to "forthcoming" / "in waiting".

### D6. Gates (all must be green before merge)

| Gate                                      | Command                                                                                                                                                                            | Notes                                                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Lint, types, content, unit, build, bundle | `pnpm quality`                                                                                                                                                                     | bundle growth ≤ +40 KiB vs `tests/baselines/bundle.json`; target ≤ +4 KiB on `/`                              |
| Browser matrix (14 projects)              | `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3113 pnpm test:browser`                                                                                                                      | port 3103 is held by another workspace's server; this workspace runs `pnpm start --port 3113`                 |
| Axe both themes                           | included in `test:browser`, also `pnpm test:a11y`                                                                                                                                  | zero violations                                                                                               |
| Visual re-baseline                        | `pnpm test:visual:update`, then `pnpm test:visual`                                                                                                                                 | 156 public screenshots with the clock frozen; the update step only regenerates, the real gate is the next row |
| Snapshot inspection                       | agent reads regenerated home, essays, library, framework-tree screenshots at 375/768/1440 in both themes, plus the 404; before/after pairs attached to the PR                      | catches what pixel diffs cannot                                                                               |
| Reduced motion, no-JS, blocked chunks     | `motion-system.spec`, `v3-home`, `v3-resilience`, new `v4-*.spec`                                                                                                                  | includes the "inline script ran, app chunks blocked" case for the ground line                                 |
| Lighthouse desktop, 13 routes             | `pnpm test:lighthouse` (3104 must be free)                                                                                                                                         | ≥ 0.95, a11y 1.0                                                                                              |
| Mobile guard                              | Lighthouse mobile, three runs, median, `/` and `/journey`, pre-change build then post-change build on the same machine (pre-change run recorded in `.context/autoplan/lh-before/`) | performance score and LCP must not regress; if Home drops, D2.6 applies                                       |
| Links                                     | `pnpm links:check`                                                                                                                                                                 |                                                                                                               |

### D7. Documentation

Append "V4 addendum — Instrument" to `docs/design/awwwards-v3-results.md`: what changed, gate evidence, and the 40/30/20/10 self-score with the standing admission that real writing is the biggest gap. `README.md` unchanged unless a command changes.

## 3. New tests (written before the code they protect)

| Test                                   | Covers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/e2e/v4-hero.spec.ts`            | at 1440: point x equals the second name word's left edge (±4px), and `.hero-location` starts at the same x; rule top is between the word's baseline box bottom −0.15em and +0.05em; at 375 origin at column 1; spine visible ≥1100 only, `aria-hidden`, reads bottom-up; `.hero-time` reads `IST · UTC +5:30` without JS and `/^\d{2}:\d{2} IST$/` with JS, never `24:`; slot width identical before/after hydration; every hero animation ends ≤ 1,150ms and runs once; CTA links to `/frameworks` |
| `tests/e2e/v4-instrument.spec.ts`      | home Frameworks region contains the tree, origin point 9×9 centred on the line end; ground line complete under reduced motion and without JS; with no-preference it finishes drawn after scrolling into view; with `_next/static/**/*.js` blocked after the inline script, the line is drawn within 5s; full keyboard sequence trunk → branch → leaf → Start over with status text; distinct accessible names                                                                                       |
| `tests/e2e/v4-motif.spec.ts`           | nav: exactly one current indicator, point scale 1 on current, no point on hover of another link; 404 has the lost point, dashed trace, and no `route-horizon` participant; essays/notes render exactly one `Forthcoming` row and the sentence, no links; home library preview has five points and the "in waiting" caption; Currently origin point present ≥701                                                                                                                                     |
| `tests/e2e/v4-plates.spec.ts`          | hover TR zone → top and right edges reach scale 1 first (delay 0) and all eight reach 1 (Chromium 1280); moving the mouse to BL keeps all eight at 1; leaving retracts; focus-visible ignites; reduced motion: instant; plate meta shows lineage not `01`                                                                                                                                                                                                                                           |
| `tests/e2e/v3-theme.spec.ts` (extend)  | eclipse: hover contracts the rule to `scaleX(0)` with the knob translation unchanged                                                                                                                                                                                                                                                                                                                                                                                                                |
| `tests/unit/library.test.mjs` (extend) | `spineLabel` numbers placeholders by seed order regardless of sort; caption count                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `tests/visual/visual.spec.ts`          | `page.clock.install` at 2026-09-11T08:39:00Z before navigation                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Existing updates                       | `v3-home` link count 3→4 and "Placeholders"→"in waiting"; `library.spec` placeholder text; `frameworks.spec` leaf/branch names to regexes                                                                                                                                                                                                                                                                                                                                                           |

## 4. Diagrams

### Home page order (table of contents for a life)

```
HERO   DIVYUM ─────────────────────────────── spine (reads up): DIVYUM BHUMRA — EST. PUNJAB
          BHUMRA
          ●──────────────────────────────────── (point at the corner of BHUMRA, line beneath the caps)
          India / elsewhere · IST · UTC +5:30 → 14:09 IST          lede · Explore the frameworks
─●─ I   Currently        ●│ Building / Studying / Exploring / Writing
─●─ II  Writing          ● Essay 001 ───────────────── Forthcoming   (one sentence beneath)
─●─ III Frameworks       The Knowledge Tree · caption   [ tree canvas, ground draws on entry ]
                         [ Signal vs Noise ] [ Eight Limbs ] [ Vision to Leverage ]
─●─ IV  Journey          · Born in Punjab / · Work without one fixed place / · Yoga…   (5px, grow on hover)
─●─ V   Library          ─●────●────●────●────●─  Five spines in waiting.
─●─ VI  About            …
FOOTER  Divyum Bhumra●   ───────────────────────────────────────────────● (contracts)
```

### Self-draw state machine (Knowledge Tree ground line)

```
server HTML ─────────────────────► line complete (no attribute, no JS)
   │ inline head script sets html[data-signature-motion=ready]
   ▼
no-preference ──► hidden, "late" draw scheduled at +4s
   ├─ app chunks hydrate ──IntersectionObserver──► data-draw=drawn ──► draw now (700ms) ──► complete
   ├─ observer missing ─────────────────────────► drawn immediately ──► complete
   └─ chunks never arrive ─────────────────────► late draw at 4s ────► complete
reduce (at load or flipped later) ──────────────► query stops matching ──► complete
```

### Plate corner ignition

```
.plate (a, position: relative, base 1px rule border)
 └─ 4 × span[data-zone] (aria-hidden, 50%×50%)
      ::before = full horizontal edge (top for tl/tr, bottom for bl/br), origin at the zone's side
      ::after  = full vertical edge   (left for tl/bl, right for tr/br), origin at the zone's side
 .plate:hover  → all eight scale(1), delay 60ms; [data-zone]:hover → delay 0 (nearest corner leads)
 .plate:focus-visible → all eight scale(1), tl delay 0
 leave → all retract (240ms). Reduced motion: instant.
```

## 5. NOT in scope

- Click-to-copy email (no real address in `lib/site.ts`).
- Social links, newsletter, testimonials, photography, custom cursor, WebGL, preloaders.
- New essays, notes or books. Both CEO voices argue this is the highest-value work on the site; that is the owner's call and is surfaced at the gate (UC1), not decided here.
- Reordering the home sections (Frameworks first). The brief fixes the order; surfaced as taste decision T5.
- Devanagari numerals (no font subset; no new font).
- Any change to Journey's Framer Motion, route transitions, or the footer contraction.
- Production release record. V3 already serves at the production URL (probe 2026-09-11); V4 deploys through master → Vercel; the addendum records verification; the owner owns the merge.
- Extending the live fragment to all six frameworks (deferred, §7.5).
- Shrinking tree hotspots on phones (pre-existing overlap; recorded in D2.4).

## 6. Risks and mitigations

| Risk                                                        | Mitigation                                                                                               |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Hero rule alignment drifts across breakpoints               | One custom property for every offset; one K for the vertical; screenshot check at 375/768/1024/1440/1728 |
| Ground line hidden when chunks fail after the inline script | 4s "late" draw exit; blocked-chunk test                                                                  |
| Home mobile score regresses (V3 deployed median 92)         | Pre/post mobile Lighthouse on the same machine; `next/dynamic({ ssr: true })` fallback                   |
| Clock drifts visual baselines                               | `page.clock.install` in `visual.spec`                                                                    |
| Bundle                                                      | Tree already ships in the frameworks chunk; expected +2–3 KiB gzip on `/`                                |
| Port collision with the other workspace                     | 3113 (Playwright), 3104/3114 checked before use                                                          |
| Visual gate is only a regeneration                          | Snapshot inspection row in D6                                                                            |

## 7. /autoplan review record

Pipeline: CEO → Design → Eng, auto-decided with the six principles; Conductor session, so the final gate is rendered in prose. Mode: SELECTIVE EXPANSION (feature iteration on an existing system).

### 7.1 System audit

- `master` = `7e37c3e` (V3, PR #44, merged 2026-09-11). Branch has one untracked doc (the brief) and this plan. No stash, no TODOS.md, no `TODO/FIXME` in app/components/lib source (author `TODO(divyum)` markers live in content and `lib/library-seed.ts`).
- Recently touched: `app/globals.css`, `app/page.tsx`, `components/*`, the V3 e2e suites. Retrospective: V2 → V3 went through two reduced-motion fixes (`53c2b6f`, `2efe97b`) and one hydration race (memory: `framer-usereducedmotion-hydration-race`). Motion is the recurring problem area; every V4 animation is therefore CSS inside `prefers-reduced-motion: no-preference` and gated on the pre-hydration html attribute, never on React state at first render.
- Production probe: `https://divyum-bhumra.vercel.app/` returns V3 markup. The plan's original "V3 launch hold" premise was stale and is corrected in §5.
- Taste references: `components/point-rule.tsx` (one motif, one component, one `ViewTransition` name), `.footer-return-line` (scroll-linked CSS with `@supports` fallback), `components/frameworks/signal-vs-noise.tsx` (seeded generator, comment diagram, no hydration drift). Anti-pattern to avoid: the six `--fw-*` aliases in `globals.css` that all resolve to `--accent` (dead indirection; not touched here).
- UI scope: yes. DX scope: no (personal site, no developer-facing surface). Design doc: none; `/office-hours` skipped (P6, the brief is the design doc). DESIGN.md: none; the brief's token list is the design system and every decision cites its tokens.

### 7.2 Step 0A premise challenge

| Premise                                                  | Assessment                                                                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| "Elevating an existing site, not replacing it"           | Accepted. Diff is CSS-heavy, no route or data-model change.                                                                   |
| "The motif can carry more states without a second motif" | Accepted; every D3 row is a point or a point+line; two point sizes written as law.                                            |
| "A live IST clock is a truthful presence signal"         | Doubtful (both CEO voices). Owner's brief asks for it; ships with the doubt recorded (T3).                                    |
| "Numbered forthcoming editions are not invented content" | Partly wrong: a count is a claim. Reduced to one row.                                                                         |
| "V3 launch hold still stands"                            | Wrong; V3 is live. Corrected.                                                                                                 |
| "Mobile LCP is the open blocker"                         | Incomplete; the deployed gap was the performance _score_ (92 on Home). Guard widened.                                         |
| "Winners' patterns (spine, clock, numerals) cause wins"  | Unproven (Codex 4). Accepted as the owner's direction; kept typographic and small so the frameworks stay the loudest element. |
| "Read the writing is the right first click"              | Wrong while the archive is empty (both design voices). CTA changed.                                                           |
| "Design work is the best next spend"                     | Contested by all four voices. User challenge UC1.                                                                             |

### 7.3 Step 0C dream state

```
CURRENT (V3 live)                 THIS PLAN                          12-MONTH IDEAL
motif on hero/intro/footer  --->  motif in nav, lists, toggle,  ---> same instrument, with an archive:
six diagrams behind /frameworks   404, empty states; one live         essays, notes, real books; the
zero essays, five placeholders    diagram on home; presence line;     home "Writing" section lists real
                                  spine; first click → frameworks     editions and the empty states retire
```

Delta: the plan finishes the instrument. It does not move the archive; only the owner can.

### 7.4 Step 0C-bis implementation alternatives

```
APPROACH A: CSS-first elevation (chosen)
  Summary: every motion in CSS behind the existing gates; two small client additions (clock, observer).
  Effort: M (human ~3 days / CC ~2 h)   Risk: Low
  Pros: zero new deps; bundle ~flat; reduced-motion story identical to V3; reversible by revert.
  Cons: observer and clock add two hydration points to the hero/home.
  Reuses: point-rule, keyframes, view-timeline pattern, framework components.

APPROACH B: Minimal viable (hero + empty states only)
  Summary: D1 and D5 only; skip fragment, propagation, micro-interactions.
  Effort: S (human ~1 day / CC ~40 min)   Risk: Low
  Pros: smallest diff; no home hydration change.
  Cons: fails five of seven brief deliverables; motif commitment (directive 1) unmet.

APPROACH C: Instrument-first (all six diagrams live on home, motion via Framer)
  Summary: a scrolling gallery of the six real diagrams with Framer-driven line draws.
  Effort: L (human ~1.5 weeks / CC ~5 h)   Risk: High
  Pros: maximises the site's unique asset (Claude F8).
  Cons: six hydrating components on a page with a 92 mobile score; Framer outside its agreed boundary; likely LCP regression.
```

Decision: A (P1 completeness within the brief; P5 explicit CSS over clever JS). C deferred. Taste decision T1.

### 7.5 Step 0D selective expansion

Complexity check: ~18 files touched (12 source, 6 tests, plus docs). Above the 8-file smell, but each deliverable is a small, independent CSS/markup change on one motif; no new class, service or route. Not reduced (P1, P2).

| #   | Candidate                                      | Effort | Decision                                     | Principle                       |
| --- | ---------------------------------------------- | ------ | -------------------------------------------- | ------------------------------- |
| E1  | All six diagrams live on the home page         | L      | Defer (TODOS)                                | outside blast radius, perf risk |
| E2  | Click-to-copy email once a real address exists | S      | Defer until `siteConfig.social.email` is set | brief forbids fake data         |
| E3  | Home OG image carrying the point-rule          | —      | Exists (`app/opengraph-image.tsx`)           | P4                              |
| E4  | "Currently" rows dated                         | S      | Defer, content decision                      | owner-owned                     |
| E5  | Hover state on Journey moments (point grows)   | S      | Accept, in blast radius                      | P2                              |
| E6  | Theme-aware `theme-color` meta                 | —      | Exists                                       | P4                              |
| E7  | One real essay                                 | M      | User challenge UC1                           | never auto-decided              |

### 7.6 Step 0E temporal interrogation

- Hour 1: token names, `--horizon-start` scoped to `.home-hero`, the html-attribute gate, ports 3113/3114/3104.
- Hour 2–3: K for the vertical rule offset; the tree's IO effect must not SSR a hidden state; `useSyncExternalStore` server snapshot for the clock; the two-name keyframe trick for the late draw.
- Hour 4–5: test updates for link counts, placeholder copy, leaf names; the `v3-theme` `translateX(12px)` invariant; zone pseudo-elements in a CSS Module.
- Hour 6+: snapshot regeneration (156) with frozen clock, Lighthouse mobile pre/post, addendum honesty.

### 7.7 Sections 1–11 (SELECTIVE EXPANSION, UI scope on)

1. **Architecture.** New: `LocalTime` (client, hero), `EditionRow` (server), origin span + observer in `KnowledgeTree`, home `.instrument` block, `spineLabel` in `lib/library.ts`. Coupling: `app/page.tsx` imports `KnowledgeTree` (client); the frameworks chunk joins the home route. Rollback: `git revert` of one squash commit; no data, no migration. Production failure scenario: chunks blocked after inline script → 4s late draw. Finding A1: home hydration cost, mitigated by D2.6.
2. **Error & rescue map.** `LocalTime` formatter wrapped in try/catch → `null` → static text; `IntersectionObserver` absent → immediate `drawn`; chunks absent → late draw; `localStorage` in the theme script already try/caught. No network, no async data. No GAP.
3. **Security & threat model.** No new input, endpoint, secret, dependency, or data. No findings.
4. **Data flow & interaction edge cases.** Clock: nil snapshot → fallback; interval cleared on unmount; hidden tab throttles the interval and corrects on the next tick; fixed slot prevents reflow. Tree on home: idempotent clicks; navigating away mid-draw harmless. Plates: zone crossing never retracts; mouse + focus specified. Library mixed state (real + placeholder) specified. No unhandled gaps.
5. **Code quality.** DRY: one `--horizon-start`; one `EditionRow`; one `spineLabel`. Naming: `fw-tree-origin`, `hero-spine`, `hero-time`, `edition-row`. No new abstraction beyond those.
6. **Test review.** See §3 and the eng phase test diagram (§7.13).
7. **Performance.** No queries. One 15s interval; one observer; ~+2–3 KiB gzip JS on `/`; four extra DOM nodes per plate; five `li` on the home shelf instead of five 20rem boxes (cheaper paint). Guard: mobile Lighthouse pre/post.
8. **Observability.** Static site; evidence lives in the gates and the addendum. No findings.
9. **Deployment & rollout.** Branch → PR → Vercel preview → merge → production; revert to roll back. Post-deploy: curl production HTML for `hero-time`, `fw-tree-origin`, `edition-row`; Lighthouse against the production URL.
10. **Long-term trajectory.** Reversibility 5/5. Debt: `--fw-*` alias block (pre-existing). The 1-year question: `point-rule.tsx`, §0's two laws and the CSS comments explain one motif.
11. **Design & UX.** Phase 2 below.

### 7.8 Registries

Error & rescue registry:

| Codepath                 | What can go wrong       | Rescued?             | Action                | User sees         |
| ------------------------ | ----------------------- | -------------------- | --------------------- | ----------------- |
| `LocalTime` snapshot     | formatter throws        | Y (try/catch → null) | keep fallback text    | `IST · UTC +5:30` |
| `KnowledgeTree` observer | API missing             | Y                    | set drawn immediately | complete line     |
| `KnowledgeTree` observer | element unmounted       | Y                    | disconnect in cleanup | nothing           |
| ground line hidden state | app chunks never arrive | Y                    | late draw at 4s       | line draws itself |

Failure modes registry:

| Codepath                 | Failure mode                        | Rescued                 | Test                           | User sees       | Logged |
| ------------------------ | ----------------------------------- | ----------------------- | ------------------------------ | --------------- | ------ |
| ground line hidden state | scripts blocked after inline script | Y (late draw)           | v4-instrument (blocked chunks) | line at 4s      | n/a    |
| hero rule offset         | breakpoint drift                    | Y (one property, one K) | v4-hero                        | misaligned rule | n/a    |
| plate zones              | `:hover` on touch                   | Y (base border)         | v4-plates                      | static card     | n/a    |
| clock slot               | width change after hydration        | Y (fixed slot)          | v4-hero                        | nothing moves   | n/a    |

No CRITICAL GAP.

### 7.9 CEO dual voices

**CODEX SAYS (CEO — strategy challenge), summarised; full text in `.context/autoplan/codex-ceo.out`:** 1. Audience is a biography, not a reader. 2. Numbered forthcoming editions make an unfulfilled promise more prominent. 3. Knowledge Tree chosen for visual convenience. 4. Winners' features are correlation, not causation. 5. Definition of done bypasses the launch problem (deployed Home 92). 6. Presence reduced to metadata. 7. Motif propagation has no stopping rule. 10×: build the public record of the About page's question.

**CLAUDE SUBAGENT (CEO — strategic independence):** F1 critical: contradicts V3's own conclusion (writing first). F2 high: launch premise unverified. F3 high: score, not LCP. F4 medium: fixed IST clock. F5 medium: numbered editions are a claim. F6 medium: featured-set swap, corner ignition, duplicated 13% logic, tautological visual gate. F7 high: six-month regret. F8 medium: converges on the template.

```
CEO DUAL VOICES — CONSENSUS TABLE
  Dimension                             Claude   Codex    Consensus
  1. Premises valid?                    NO       NO       CONFIRMED → fixed where technical
  2. Right problem to solve?            NO       NO       CONFIRMED → USER CHALLENGE UC1
  3. Scope calibration correct?         NO       NO       CONFIRMED → UC1 + T2
  4. Alternatives sufficiently explored? PARTIAL  NO       DISAGREE → §7.4 added
  5. Competitive/market risks covered?  NO       NO       CONFIRMED → recorded; brief stands
  6. 6-month trajectory sound?          NO       NO       CONFIRMED → UC1
```

**User challenge UC1 (never auto-decided).** You said: elevate the site per the Awwwards brief (seven design deliverables). All four voices recommend spending this effort on one real essay and two real books instead, keeping only the live diagram. Why: content scored lowest in V3, the archive compounds, the chrome converges on the reference set. What we might be missing: you may already be writing; the brief may be deliberate sequencing; an award submission may have a date. If we are wrong to change course: the site stays chrome-complete and archive-empty for another cycle. **Default: your direction stands; the plan ships the brief.**

### 7.10 Design phase (Phase 2)

Step 0: design completeness of the plan before this phase, **6/10**: the mechanics were precise, but five states were unspecified (zone crossing, clock swap width, blocked-chunk partial state, mixed library state, instrument responsive composition) and two decisions were generic (`::marker`, "eclipse"). A 10 for this plan: every point has a size from one scale, every animated element names its resting, mid and failure state, every new block has a 375/768/1440 composition, and the first click lands on real material. Mockups: skipped (auto-decision 15); the current V3 baselines under `tests/visual/__screenshots__/` were read as the visual reference (home 1440 light, home 375 dark).

**CODEX SAYS (design — UX challenge), summarised; full text in `.context/autoplan/codex-design.out`:** Litmus: brand YES, anchor YES, scan-by-headlines NO, one job per section NO, cards necessary YES, motion improves hierarchy NO, premium without shadows YES. 1. Hierarchy serves the inventory: CTA leads to an empty archive; recommend Frameworks first. 2. States partial: loading text, library sort over placeholders, client error path, blocked-chunk partial state, mixed library state. 3. Instrument lacks a responsive composition. 4. A11y: identical hotspot names, overlapping 44px targets at 375, keyboard sequence untested, grayscale untested. 5. Unresolved: hero vertical geometry, CSS ownership, zone crossing, toggle occlusion, clock label, home caption. 6. Freeze the clock for screenshots; define the dynamic fallback's reader experience.

**CLAUDE SUBAGENT (design — independent review):** F1 critical: location/clock float left of the moved point. F2 high: zone-to-zone flicker. F3 high: three tiers of "nothing". F4 high: tree has no legend or resting affordance on home. F5 high: loading route flickers and breaks the morph. F6 medium: clock string swap width, `24:09`. F7 medium: four point sizes. F8 medium: two nav hover affordances. F9 medium: eclipse invisible. F10 medium: three numbering systems. F11 medium: spine copy and anchoring. F12 medium: px baseline on a clamped font. F13 medium: origin transform. F14 low: dashed = absent unwritten. Litmus: brand YES, anchor YES, scan YES, one job NO, cards NO (brief-level), motion YES for arrival/draw/footer, NO for ignition/eclipse as first specified, shadows YES.

```
DESIGN DUAL VOICES — LITMUS SCORECARD
  Check                                   Claude  Codex  Consensus
  1. Brand unmistakable first screen      YES     YES    CONFIRMED
  2. One strong visual anchor             YES     YES    CONFIRMED
  3. Scannable by headlines               YES     NO     DISAGREE (T5: section order)
  4. Each section one job                 NO      NO     CONFIRMED → Writing shrunk to one row; Frameworks keeps both jobs per brief
  5. Cards necessary                      NO      YES    DISAGREE → plates kept (brief names them)
  6. Motion improves hierarchy            PARTIAL NO     DISAGREE → ignition/eclipse respecified; loading dropped
  7. Premium without shadows              YES     YES    CONFIRMED
```

Passes (score before → after):

1. Information architecture 6 → 8: origin binds everything beneath it (F1); CTA to frameworks; Writing one row tall; section order kept per brief (T5 open).
2. Interaction states 5 → 9: zone crossing, clock swap, blocked chunks, mixed library, loading removed, client error path all specified.
3. User journey 6 → 8: the two "absence" beats (II, V) shrink to one line each; the instrument gets a caption and a resting affordance; footer ending untouched.
4. AI-slop risk 8 → 9: no gradients, no cards beyond the three plates, roman numerals are typographic; the calibration warning ("cream ground, serif, oxide accent") applies to this site's inherited palette, which the brief locks; not a V4 decision.
5. Design-system alignment 8 → 9: two point sizes and the dashed law written into §0; every value cites an existing token.
6. Responsive & accessibility 5 → 8: instrument composition at three widths; distinct hotspot names; keyboard sequence test; hotspot overlap recorded as pre-existing (not raised to 10).
7. Unresolved decisions register: T3 clock, T4 spine copy, T5 section order, plus the pre-existing hotspot overlap.

Design decisions folded in (audit rows 17–31): F1, F2, F3 (home shelf as points; sort controls kept), F4 (caption from frontmatter, resting trunk disc, "Read the framework"), F5 (no loading route), F6 (fixed slot, h23), F7 (two-size scale, list `::before`), F8 (static current point, animates on becoming current), F9 (literal eclipse), F10 (plate numbers dropped), F11 (bottom-anchored, reads up, reserved column; copy kept as T4), F12 (one K, underline-not-cut), F13 (transform, pointer-events), F14 (law in §0); Codex: CTA change, blocked-chunk exit, freeze clock, distinct names, keyboard sequence, `.home-hero` scoping, whole-border rule removed, `ssr: true` fallback semantics, mixed library state.

**Phase 2 complete.** Codex: 6 concern groups. Claude subagent: 14 issues. Consensus: 4/7 confirmed, 3 disagreements → surfaced at gate (T5, cards, motion value). Passing to Phase 3.

### 7.11 Decision audit trail

| #   | Phase  | Decision                                                                 | Class          | Principle           | Rationale                                 | Rejected         |
| --- | ------ | ------------------------------------------------------------------------ | -------------- | ------------------- | ----------------------------------------- | ---------------- |
| 1   | CEO    | Mode SELECTIVE EXPANSION                                                 | Mechanical     | default             | feature iteration                         | HOLD             |
| 2   | CEO    | Approach A                                                               | Taste (T1)     | P1, P5              | complete within the brief, CSS-first      | B, C             |
| 3   | CEO    | Correct launch premise (V3 live)                                         | Mechanical     | evidence            | production probe                          | —                |
| 4   | CEO    | Widen mobile guard to performance score                                  | Mechanical     | P1                  | V3 deployed gap was the score             | LCP-only         |
| 5   | CEO    | One forthcoming row, not three                                           | Mechanical     | no invented content | count is a claim                          | 3 rows           |
| 6   | CEO    | Keep Eight Limbs featured; V2L replaces tree in plates                   | Mechanical     | P3                  | one per lineage                           | TTA              |
| 7   | CEO    | One `--horizon-start`, full-width name                                   | Mechanical     | P4                  | no duplicated 13%                         | calc duplication |
| 8   | CEO    | Zone-owned pseudo-element edges, no `:has()`                             | Mechanical     | P5                  | 4 nodes, 8 rules                          | `:has()`         |
| 9   | CEO    | Keep nearest-corner ignition (brief)                                     | Taste (T2)     | user direction      | brief explicit                            | top-left only    |
| 10  | CEO    | Remove nav current underline                                             | Mechanical     | P5                  | one indicator                             | two              |
| 11  | CEO    | Origin point as 9px HTML span                                            | Mechanical     | P5                  | constant size                             | SVG r            |
| 12  | CEO    | Keep IST clock                                                           | Taste (T3)     | user direction      | brief explicit                            | static/none      |
| 13  | CEO    | Add snapshot inspection gate                                             | Mechanical     | P1                  | visual update is tautological             | none             |
| 14  | CEO    | E5 accepted, E1/E2/E4 deferred, E3/E6 exist                              | Mechanical     | P2, P4              | blast radius                              | —                |
| 15  | CEO    | Skip `/office-hours`, CEO spec-review loop, AI mockups; real screenshots | Mechanical     | P3, P6              | brief is the design doc                   | ceremony         |
| 16  | CEO    | UC1 not decided; brief stands                                            | User challenge | rule                | owner's call                              | —                |
| 17  | Design | Location, time, support bound to `--horizon-start`                       | Mechanical     | P5                  | nothing floats left of the origin         | as was           |
| 18  | Design | Ignition never retracts while hovered; nearest corner leads by delay     | Mechanical     | P1                  | no flicker                                | per-zone only    |
| 19  | Design | Home Writing = one row + sentence; title dropped                         | Mechanical     | P1                  | one job                                   | three tiers      |
| 20  | Design | Home library preview = points on the shelf line                          | Mechanical     | P5                  | motif, cheaper paint                      | five 20rem boxes |
| 21  | Design | Library sort controls stay                                               | Taste          | P6                  | real control, matters at first book       | hide             |
| 22  | Design | Tree caption from frontmatter; resting trunk disc; distinct names        | Mechanical     | P1                  | affordance without invention              | as was           |
| 23  | Design | No `app/loading.tsx`                                                     | Mechanical     | P5                  | static routes never suspend; morph safety | 700ms loader     |
| 24  | Design | Clock fixed slot, `hourCycle: h23`, try/catch, frozen in visuals         | Mechanical     | P1                  | no reflow, no 24:09, no drift             | as was           |
| 25  | Design | Two point sizes law; list `::before` discs; moments 5px                  | Mechanical     | P5                  | one motif                                 | four sizes       |
| 26  | Design | Nav point static on current, animates on becoming current                | Mechanical     | P5                  | one hover affordance                      | hover point      |
| 27  | Design | Literal eclipse (rule contracts into the point)                          | Mechanical     | P5                  | reads as the motif's inversion            | 1.35 scale       |
| 28  | Design | Plate numbers dropped; lineage shown                                     | Mechanical     | P4                  | one numbering per level                   | three systems    |
| 29  | Design | Spine bottom-anchored, reads up, reserved column; copy kept              | Taste (T4)     | user direction      | brief's suggested copy                    | artefact label   |
| 30  | Design | Late-draw exit at 4s for blocked chunks                                  | Mechanical     | P1                  | no silent hidden state                    | none             |
| 31  | Design | Hero CTA → "Explore the frameworks"                                      | Mechanical     | P6                  | first click lands on real material        | empty archive    |
| 32  | Design | Section order kept per brief                                             | Taste (T5)     | user direction      | brief fixes it                            | Frameworks first |

### 7.12 Phase 1 and 2 completion summary

| Item                                     | Result                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Mode                                     | SELECTIVE EXPANSION                                                                            |
| CEO sections 1–11                        | 2 findings (A1 perf guard, Q1 spine helper), 0 security, 0 error gaps, 0 critical failure gaps |
| Design passes 1–7                        | 6 → 8, 5 → 9, 6 → 8, 8 → 9, 8 → 9, 5 → 8; 3 taste decisions open; overall 6 → 8.5              |
| NOT in scope / What exists / Dream delta | written (§5, §1, §7.3)                                                                         |
| Registries                               | written (§7.8)                                                                                 |
| Expansion                                | 7 candidates, 1 accepted, 3 deferred, 2 exist, 1 user challenge                                |
| Dual voices                              | CEO codex+subagent 5/6 confirmed; Design codex+subagent 4/7 confirmed                          |
| Lake score                               | 16/16 recommendations chose the complete option                                                |
