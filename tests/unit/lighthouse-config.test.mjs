import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import lighthouseConfig from "../../lighthouserc.cjs";

const require = createRequire(import.meta.url);
const requireFromLhci = createRequire(
  require.resolve("@lhci/cli/package.json"),
);
const { getAllAssertionResults } = requireFromLhci(
  "@lhci/utils/src/assertions.js",
);

function categoryResult(category, scores) {
  const reports = scores.map((score) => ({
    finalUrl: "http://localhost/",
    categories: { [category]: { score } },
    audits: {
      "first-contentful-paint": { numericValue: 500 },
      interactive: { numericValue: 1000 },
    },
  }));
  const assertion = `categories:${category}`;

  return getAllAssertionResults(
    {
      ...lighthouseConfig.ci.assert,
      includePassedAssertions: true,
      assertions: {
        [assertion]: lighthouseConfig.ci.assert.assertions[assertion],
      },
    },
    reports,
  )[0];
}

describe("Lighthouse release score gates", () => {
  it.each(["performance", "best-practices", "seo"])(
    "rejects a below-target %s median even when one run passes",
    (category) => {
      expect(categoryResult(category, [0.87, 0.92, 0.98])).toMatchObject({
        passed: false,
        actual: 0.92,
        expected: 0.95,
      });
    },
  );

  it("accepts performance at the median boundary, not the best run", () => {
    expect(categoryResult("performance", [0.94, 0.95, 0.99])).toMatchObject({
      passed: true,
      actual: 0.95,
      expected: 0.95,
    });
  });

  it("rejects accessibility below 100 despite one perfect run", () => {
    expect(categoryResult("accessibility", [0.95, 0.99, 1])).toMatchObject({
      passed: false,
      actual: 0.99,
      expected: 1,
    });
  });
});
