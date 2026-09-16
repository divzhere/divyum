# V5 plan — "The Living Manuscript"

Date: 2026-09-17. Branch: `feat/v5-living-manuscript`, base `master` at `bc82c58` (V4 + resume).
Brief: the owner's "master prompt" of 2026-09-15 (Awwwards-level creative polish, hero first).
Laws inherited from V3/V4 stand: [awwwards-v4-prompt.md](awwwards-v4-prompt.md) hard laws, [awwwards-v4-plan.md](awwwards-v4-plan.md) §0 (two point sizes, dashed = absent).

## 1. Audit (what the live site does today)

Live-site inspection at 1728/1440/768/390 (screenshots in `.context/v5/research/`, not committed):

- After the 1,150ms arrival the home page is inert: nothing responds to pointer or scroll except the clock text and the footer line. The "living" promise (the Knowledge Tree) sits ~1,900px down.
- The right 40–45% of the desktop fold above the lede is empty paper; the spine is the only counterweight, at 12px.
- The presence stamp ("India / elsewhere", "22:39 IST") reads as metadata debris rather than a signature.
- Hero → Currently is a hard stop: the section rule is a second copy of the hero rule, starting at column 1 while the hero horizon starts at 13%, so the eye re-anchors; at 1728/1440 "Currently" is already inside the first fold.
- Phone nav is a 3×3 word grid (Resume alone on the last row) pushing the name 35% down the screen.

## 2. References (studied in the browser, screenshots in `.context/v5/research/`)

| Reference                                                                                             | Interesting                                                                                                                   | Adapt                                                                                            | Do not copy                                       |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Sandeep Kumar, sandeep.design (Awwwards portfolio)                                                    | Paper ground, "PORTFOLIO '26" + "● OPEN TO WORK" status, "01 —— FEATURED CASE" index rules                                    | Presence line as a small, truthful status; index rules as chapter openers (we already have I–VI) | Red display sans, case-study cards, "book a call" |
| Mike Barton, mikes.cv (Awwwards portfolio)                                                            | Fixed metadata block: name, city, 53.4888° N, GMT+1; a thread with markers the reader scrolls down                            | Coordinates and offsets as metadata; a marker that travels a line                                | Skeuomorphic plane window, image parallax         |
| Emi Takahashi, emitakahashi.ca (Awwwards)                                                             | Bespoke drawn glyphs used as ornament and index marks inside an editorial index                                               | A drawn word (नमस्ते) as identity, traced not typed                                              | Photo-led grid                                    |
| Jamie McKaye, Khanh Nguyen, Milan Compain (V4 research)                                               | Site-as-proof; monumental name; one motif followed everywhere                                                                 | Already applied in V4                                                                            | —                                                 |
| Counter-examples: benxrun.com, brookebeswick.com, studio-nikita.com, format.obys.agency, mattjinn.com | Cinematic photo, gradient sky + mascot, chat-portfolio, poster type, an intro gate that hides the site behind a cursor reveal | Nothing                                                                                          | All of it: gradients, canvases, gates, gimmicks   |

Cross-cutting principles: one motif in more states; the first interaction must be on the name or the rule, not beside them; metadata is only interesting when true; the page must read as print at rest.

## 3. Three hero concepts

**A. Kinetic typography.** Two name lines on separate depth planes; pointer movement leans them ±1° with 1,400px perspective and shifts them 6–10px in opposite rates; letters never leave their clipped line boxes. Cheap (CSS transitions on custom properties), invisible at rest, but on its own it is a whisper nobody would describe to a friend.

**B. Typography in 3D space.** Foreground name, midground rule and point, background metadata, each moving at its own rate under the pointer; scroll compresses them back into print. Same cost as A; the "planes" only read as depth if something on the midground plane is alive.

**C. Abstract personal orbit.** A fourth drawn diagram (four nodes: technology, AI, entrepreneurship, consciousness) reacting to the pointer and to hovering the five nouns in the lede. Beautiful in theory, but it is a second motif next to six real frameworks, competes with the name, and every "thought system" object risks reading as a template blob.

**Decision: A + B fused on the existing motif; C rejected** (second motif, law §0). The midground plane gets the life: the 5px marker that already exists as the site's "you are here" mark travels the hero horizon under the pointer, and the name leans toward it. The thing people can tell someone: "the dot on the line follows your cursor, and the name turns a degree toward it, like a page catching light."

## 4. What ships

1. **Signature interaction: the marker on the horizon.** A 5px oxide marker rides the hero horizon, following the pointer's x (CSS transition 600ms `--ease-out-expo`, driven by two custom properties written by a 40-line client island, no Framer, no rAF loop). The two name lines lean toward it (rotateY ±1.2°, translateX 6px / 10px), the presence block 3px, the lede 2px. Pointer leaves: everything settles back to print in 700ms. Touch and keyboard: no pointer effect; the marker rests at the origin. Reduced motion: the island never binds. No-JS: nothing. Nothing measured by the V4 geometry tests moves (point, horizon, spine, location left edge at rest).
2. **नमस्ते at the origin.** One SVG path traced from Noto Serif Devanagari (OFL) with HarfBuzz shaping, committed as `components/namaste.tsx`; no font shipped. First line of the presence block, 1.15rem tall, oxide, `aria-label="Namaste"`. It draws itself left to right along its headline stroke during the arrival's last beat (850–1,150ms) with a clip-path wipe; complete under reduced motion and without JS.
3. **Presence as a truthful status.** `INDIA / ELSEWHERE`, then `07:53 IST · 03:23 HERE` where HERE is the reader's own clock (only when their zone differs from IST); server and no-JS text stays `IST · UTC +5:30`. No "online" claim: nothing on this site knows that.
4. **Hero → Currently seam.** Each chapter's origin point arrives from the hero origin column (translateX 13cqi → 0) as its hairline enters the viewport, scroll-driven in CSS (`animation-timeline: view()` inside `@supports` and no-preference, the footer's proven pattern); static at 0 otherwise.
5. **Micro-interactions.** Arrow glyphs in text links translate 2px/−2px on hover (the plates already do this); the phone nav becomes a 4+3 grid so Resume no longer sits alone.
6. **Knowledge Tree late draw** reserved for the un-hydrated case (`data-draw="armed"` on mount).

Not doing, and why: custom cursor (banned by the V4 laws; the marker on the horizon is the sanctioned "rewards the cursor" form); WebGL/Three (nothing here needs it); a hero tagline or role line (V3 audit: no replacement slogan); a portrait (no photography exists); smooth-scroll libraries (scroll hijacking ban); continuously running ambient animation (performance rule in the brief); scroll-driven animation inside the hero subtree (the settle test enumerates it; the spine stays static).

## 5. Gates

`pnpm quality`; browser matrix on 3113; `--update-snapshots=all` then `test:visual`; Lighthouse desktop; mobile Lighthouse interleaved A/B against master; links; manual inspection at 390/768/1440/1728 in both themes; hover/pointer inspection in the browser.

## 6. Results (2026-09-17)

### Files

New: `components/hero-field.tsx` (pointer island), `components/namaste.tsx` (traced path), `scripts/trace-namaste.py` (reproducible trace), `tests/e2e/v5-hero.spec.ts` (6 checks: wake/lean/settle, reduced motion, नमस्ते at the origin and without JS, draw timing, two clocks, chapter-origin scroll timeline). Changed: `components/hero-experience.tsx`, `components/point-rule.tsx` (children slot for the marker), `components/local-time.tsx` (two clocks), `components/frameworks/knowledge-tree.tsx` (armed state), `app/globals.css`, `app/home.module.css`, `tests/e2e/v4-instrument.spec.ts` (poll window), 192 visual baselines.

### Gates

| Gate                                                          | Result                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint, types, unit                                             | pass; 126 tests, 96.87% statements                                                                                                                                                                                                                                                                                                                   |
| Bundle                                                        | pass; home 176.34 → 176.69 KiB gzip (+0.35, the pointer island); journey +0.87 since V4; every route far inside +40                                                                                                                                                                                                                                  |
| Browser matrix (14 projects)                                  | 1,243 passed, 1,647 scoped skips, 9 failed at full parallelism: the pre-existing 1024px prose check (×2) and seven WebKit-375 tests that all pass when that project runs alone (99 passed, 0 failed) and again in two further quiet reruns; recorded as load-sensitive                                                                               |
| Axe                                                           | inside the matrix, both themes, zero violations                                                                                                                                                                                                                                                                                                      |
| Visual                                                        | 192 baselines rewritten with `--update-snapshots=all` (frozen clock), verified twice (after the tablet-header fix the 32 baselines at 768 were rewritten again); home inspected by eye at 390/768/1440/1728 in both themes, plus the awake state with the pointer at 20% and 85%                                                                     |
| Lighthouse desktop, 15 routes × 3, median                     | 100 performance and 100 accessibility everywhere; LCP 406–590ms                                                                                                                                                                                                                                                                                      |
| Lighthouse mobile, interleaved A/B vs master, home × 10 pairs | score median 99 on both; LCP is bimodal on both sides (render delay 1,505ms or 2,030ms, one discrete step that is the serif font's arrival under simulated throttling, TTFB and FCP identical); master hit the fast step 8/10, the branch 5/10, which at n=10 is inside noise for a binary outcome; journey (3 pairs) 99 vs 99, LCP 2,156 vs 2,167ms |
| Links                                                         | 24 internal URLs, 65 links, zero failures; external failures are only the canonical self-links to the unlaunched domain                                                                                                                                                                                                                              |

### Self-score, 40/30/20/10

| Category   |  V4 |  V5 | Why                                                                                                                                           |
| ---------- | --: | --: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Design     | 8.9 | 9.0 | The fold now has a drawn greeting at the origin and reads as print until touched; the tablet header no longer collides; the phone nav is 4+3. |
| Usability  | 9.2 | 9.2 | Nothing moved that a reader depends on; pointer effects are additive, keyboard and touch see print.                                           |
| Creativity | 8.6 | 9.0 | One interaction people can describe: the dot on the line follows you and the name turns a degree toward it.                                   |
| Content    | 7.5 | 7.5 | Still no writing. Two clocks and a greeting are presence, not content.                                                                        |

Weighted: 8.91 (V4: 8.79). The standing admission holds: the biggest gap is real writing.

### Honest notes

- The lean is a whisper by design (6–10px, 1.2°). A jury will notice the marker first; the lean is what makes the marker feel like it belongs to the page.
- The chapter-origin arrival only exists where `animation-timeline: view()` is supported (Chromium, Safari 26); elsewhere the points sit at the chapter's left edge as before.
- The "· HH:MM here" clock depends on the reader's device clock and zone; it is hidden when the reader is on India's time.
