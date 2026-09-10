import { describe, expect, it } from "vitest";
import {
  filterJourneyChapters,
  journeyChapters,
  parseJourneyOrder,
  parseJourneyThreads,
  sortJourneyChapters,
} from "../../lib/journey.ts";

describe("journey URL state", () => {
  it("keeps only known, unique threads in their canonical order", () => {
    expect(parseJourneyThreads("technology,travel,technology,unknown")).toEqual(
      ["travel", "technology"],
    );
    expect(parseJourneyThreads(["community", "inner-life,travel"])).toEqual([
      "travel",
      "community",
      "inner-life",
    ]);
    expect(parseJourneyThreads(undefined)).toEqual([]);
  });

  it("defaults invalid order values to chronological", () => {
    expect(parseJourneyOrder("thematic")).toBe("thematic");
    expect(parseJourneyOrder("chronological")).toBe("chronological");
    expect(parseJourneyOrder("alphabetical")).toBe("chronological");
    expect(parseJourneyOrder(undefined)).toBe("chronological");
  });
});

describe("journey chapters", () => {
  it("filters selected threads as a union while retaining anchor chapters", () => {
    const filtered = filterJourneyChapters(["technology", "community"]);

    expect(filtered.map(({ id }) => id)).toEqual([
      "punjab",
      "rotary",
      "technology",
      "remote-life",
      "now",
    ]);
  });

  it("sorts chronologically by sequence and thematically by primary thread", () => {
    const shuffled = [
      journeyChapters[7],
      journeyChapters[3],
      journeyChapters[0],
    ];

    expect(
      sortJourneyChapters(shuffled, "chronological").map(({ id }) => id),
    ).toEqual(["punjab", "technology", "now"]);
    expect(
      sortJourneyChapters(shuffled, "thematic").map(({ id }) => id),
    ).toEqual(["punjab", "technology", "now"]);

    const thematic = sortJourneyChapters(journeyChapters, "thematic");
    expect(thematic.map(({ primaryTheme }) => primaryTheme)).toEqual([
      "travel",
      "travel",
      "technology",
      "technology",
      "community",
      "inner-life",
      "inner-life",
      null,
    ]);
  });

  it("keeps professional facts explicit and ships no media before Divyum supplies it", () => {
    const professional = journeyChapters.filter(
      ({ type }) => type === "professional",
    );

    expect(professional).toHaveLength(1);
    expect(professional[0].professional).toEqual({
      role: "Software engineer",
      organisation: null,
      years: "7+ years",
      built: "Software products and systems.",
    });
    expect(journeyChapters.every(({ media }) => media === undefined)).toBe(
      true,
    );
  });
});
