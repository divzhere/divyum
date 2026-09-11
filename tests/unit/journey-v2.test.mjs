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
  it("distills the technology thread to six professional transitions in era order", () => {
    const chapters = filterJourneyChapters(["technology"]);
    expect(chapters.map(({ title }) => title)).toEqual([
      "Interfaces",
      "Building",
      "Scale",
      "Ownership",
      "Beyond Engineering",
      "Building My Own",
    ]);
    expect(chapters.every(({ type }) => type === "professional")).toBe(true);
    expect(sortJourneyChapters(chapters, "thematic")).toEqual(chapters);
  });

  it("filters selected threads as a union while retaining anchor chapters", () => {
    const filtered = filterJourneyChapters(["technology", "community"]);

    expect(filtered.map(({ id }) => id)).toEqual([
      "punjab",
      "rotary",
      "technology",
      "building",
      "scale",
      "ownership",
      "beyond-engineering",
      "building-my-own",
      "now",
    ]);
  });

  it("sorts chronologically by sequence and thematically by primary thread", () => {
    const shuffled = ["now", "technology", "punjab"].map((id) =>
      journeyChapters.find((chapter) => chapter.id === id),
    );

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
      "travel",
      "technology",
      "technology",
      "technology",
      "technology",
      "technology",
      "technology",
      "community",
      "inner-life",
      "inner-life",
      null,
    ]);
  });

  it("ships no media before Divyum approves it", () => {
    expect(journeyChapters.every(({ media }) => media === undefined)).toBe(
      true,
    );
  });
});
