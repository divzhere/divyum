import { describe, expect, it } from "vitest";
import {
  filterJourneyChapters,
  journeyChapters,
  parseJourneyOrder,
  parseJourneyThreads,
  sortJourneyChapters,
} from "../../lib/journey.ts";
import { travelHistory } from "../../lib/travel-history.ts";

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
      "XenonStack",
      "Independent / Remote",
      "Topica Edtech Group",
      "CAW Studios",
      "Denim Health",
      "AI-native engineering",
    ]);
    expect(chapters.every(({ type }) => type === "professional")).toBe(true);
    expect(sortJourneyChapters(chapters, "thematic")).toEqual(chapters);
  });

  it("filters selected threads as a union while retaining anchor chapters", () => {
    const filtered = filterJourneyChapters(["technology", "community"]);

    expect(filtered.map(({ id }) => id)).toEqual([
      "punjab",
      "rotaract",
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
      "inner-life",
      null,
      null,
    ]);
  });

  it("keeps resume evidence and 2026 training milestones explicit", () => {
    const rotaract = journeyChapters.find(({ id }) => id === "rotaract");
    const denim = journeyChapters.find(({ id }) => id === "beyond-engineering");
    const gtTrack = journeyChapters.find(({ id }) => id === "gt-track");
    const reiki = journeyChapters.find(
      ({ id }) => id === "reiki-certification",
    );

    expect(rotaract?.summary).toContain("800+ member service organization");
    expect(rotaract?.summary).toContain("INR 10 lakh");
    expect(rotaract?.legacyId).toBe("rotary");
    expect(denim?.summary).toContain("first three AI features");
    expect(gtTrack).toMatchObject({
      phase: "January 2026",
      place: "Level 1 & 2",
    });
    expect(reiki).toMatchObject({ phase: "March 2026", place: "Level 1 & 2" });
  });

  it("describes remote travel only at the regional level supported by the source map", () => {
    const remoteLife = journeyChapters.find(({ id }) => id === "remote-life");

    expect(remoteLife?.summary).toContain("across India");
    expect(remoteLife?.summary).toContain("Southeast Asia");
  });

  it("keeps optional chapter photography empty", () => {
    expect(journeyChapters.every(({ media }) => media === undefined)).toBe(
      true,
    );
  });
});

describe("travel history", () => {
  it("keeps the supplied decade in chronological order", () => {
    expect(travelHistory.map(({ year }) => year)).toEqual([
      2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
    ]);
    expect(travelHistory.find(({ year }) => year === 2025)?.entries).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Kuala Lumpur"),
        expect.stringContaining("Bali"),
      ]),
    );
    expect(travelHistory.at(-1)?.entries).toContain(
      "Late April–June — Chennai.",
    );
  });
});
