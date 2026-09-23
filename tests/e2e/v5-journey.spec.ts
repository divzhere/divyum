import { expect, test } from "@playwright/test";

/*
  Journey as one thread: an identity block on the left, a single vertical
  thread that fills with reading progress, phases to its left, chapters to
  its right, each a 5px marker that grows into an origin as it passes.
*/

test.skip(
  ({ viewport }) => ![375, 1440].includes(viewport?.width ?? 0),
  "journey layout checked at phone and desktop widths",
);

test("the identity block says only what the site already asserts", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-09-17T02:23:00Z"));
  await page.goto("/journey");
  const aside = page.locator(".journey-results-aside");
  await expect(aside).toContainText("Divyum Bhumra");
  await expect(aside).toContainText("India / elsewhere");
  await expect(aside).toContainText("Est. Punjab");
  await expect(aside.locator(".hero-time-slot")).toHaveText("07:53 IST");
  await expect(aside).toContainText("15 chapters");
});

test("every chapter is a marker on one thread, with its phase beside it on wide screens", async ({
  page,
  viewport,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/journey");
  const chapters = page.locator(".journey-chapter");
  await expect(chapters).toHaveCount(15);
  await expect(page.locator(".journey-reading-progress")).toHaveCount(1);
  const [thread, marker] = await Promise.all([
    page.locator(".journey-reading-progress").boundingBox(),
    chapters
      .first()
      .locator(".journey-marker")
      .evaluate((node) => {
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node, "::before");
        return {
          x: box.left + box.width / 2 + window.scrollX,
          width: style.width,
          transform: style.transform,
        };
      }),
  ]);
  expect(Math.abs(thread!.x + thread!.width / 2 - marker.x)).toBeLessThan(1.5);
  expect(marker.width).toBe("5px");
  expect(marker.transform).toBe("none");
  // One phase element per chapter: left of the thread on wide screens, in
  // the meta row on phones.
  const phase = chapters
    .first()
    .locator(".journey-chapter-meta > span")
    .first();
  await expect(phase).toHaveText("Origins");
  const [phaseBox, threadBox] = await Promise.all([
    phase.boundingBox(),
    page.locator(".journey-reading-progress").boundingBox(),
  ]);
  if ((viewport?.width ?? 0) > 700) {
    expect(phaseBox!.x + phaseBox!.width).toBeLessThan(threadBox!.x);
  } else {
    expect(phaseBox!.x).toBeGreaterThan(threadBox!.x);
  }
  await expect(page.locator(".journey-chapter-number")).toHaveCount(0);
});

test("the remote-life chapter carries a responsive travel globe", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/journey#remote-life");
  const globe = page.getByRole("figure", { name: /India → Southeast Asia/ });

  await expect(globe).toBeInViewport();
  await expect(globe).toContainText("many roads across India");
  await expect(globe.locator("svg")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("the travel decade opens as an accordion without shifting the page sideways", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/journey?thread=travel#travel");
  const disclosure = page.locator(".journey-travel-history");

  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.getByText("Travel in my 20s").click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(disclosure.getByText("2016", { exact: true })).toBeVisible();
  await expect(disclosure.getByText(/Kuala Lumpur/)).toBeVisible();
  await expect(disclosure.getByText(/Late April–June/)).toBeVisible();
  const mapCards = page.locator(".journey-travel-map-card");
  await expect(mapCards).toHaveCount(2);
  await expect(
    mapCards.getByRole("img", { name: /Google Photos travel map/ }),
  ).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("the community chapter keeps the two-year progression and club structure readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/journey?thread=community#rotaract");

  const community = page.locator(".journey-community");
  await expect(community).toBeInViewport();
  await expect(community).toContainText("July 2017–June 2019");
  await expect(community.locator(".journey-community-roles > li")).toHaveCount(
    4,
  );
  await expect(community.locator(".journey-community-org-level")).toHaveCount(
    5,
  );
  await expect(community.getByText("1:7–8", { exact: true })).toBeVisible();
  await expect(community.getByText("40–50", { exact: true })).toBeVisible();
  await expect(community.getByText("10–15", { exact: true })).toBeVisible();

  const disclosures = community.locator(".journey-community-details");
  await expect(disclosures).toHaveCount(3);
  for (const disclosure of await disclosures.all()) {
    await disclosure.locator("summary").click();
    await expect(disclosure).toHaveAttribute("open", "");
  }
  await expect(community.getByText("Pirates of the City")).toBeVisible();
  await expect(
    community.getByText("Happy School", { exact: true }),
  ).toBeVisible();
  await expect(community.getByText("RotaTech")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("the thread fills as the reader scrolls and the current chapter's marker becomes an origin", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/journey#rotaract");
  await expect(page.locator("#rotaract")).toBeInViewport();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          getComputedStyle(
            document.querySelector("#rotaract .journey-marker")!,
            "::before",
          ).transform,
      ),
    )
    .toBe("matrix(1.8, 0, 0, 1.8, 0, 0)");
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect
    .poll(() =>
      page
        .locator(".journey-reading-progress span")
        .evaluate(
          (node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).d,
        ),
    )
    .toBeGreaterThan(0.99);
});

test("chapters and home sections arrive on a scroll timeline, never under reduced motion", async ({
  browserName,
  page,
  viewport,
}) => {
  test.skip(
    browserName !== "chromium" || viewport?.width !== 1440,
    "scroll timelines checked once",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/journey");
  const supported = await page.evaluate(() =>
    CSS.supports("animation-timeline", "view()"),
  );
  test.skip(!supported, "scroll-driven animations unavailable");
  const last = page.locator(".journey-chapter").last();
  await expect(last).toHaveCSS("animation-timeline", "view()");
  await expect(last).toHaveCSS("animation-name", "scroll-reveal");
  await last.scrollIntoViewIfNeeded();
  await expect
    .poll(() => last.evaluate((n) => getComputedStyle(n).opacity))
    .toBe("1");
  await page.goto("/");
  const section = page.locator('[aria-labelledby="about-title"]');
  await expect(section).toHaveCSS("animation-timeline", "view()");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section).toHaveCSS("animation-name", "none");
  await expect(section).toHaveCSS("opacity", "1");
});
