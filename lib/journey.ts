export const journeyThemes = [
  {
    id: "travel",
    label: "Travel and place",
    description: "Punjab, life on the road and the remote digital-nomad years.",
  },
  {
    id: "technology",
    label: "Technology",
    description: "The path into software and professional technical work.",
  },
  {
    id: "community",
    label: "Community service",
    description: "Rotary leadership, responsibility and service.",
  },
  {
    id: "inner-life",
    label: "Inner life",
    description: "Yoga, consciousness and the changes that happened within.",
  },
] as const;

export type JourneyTheme = (typeof journeyThemes)[number]["id"];

export type JourneyOrder = "chronological" | "thematic";

export type JourneyMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type JourneyChapter = {
  id: string;
  sequence: number;
  type?: "life" | "professional";
  phase: string;
  place?: string;
  title: string;
  summary: string;
  themes: readonly JourneyTheme[];
  primaryTheme: JourneyTheme | null;
  descriptor?: string;
  media?: JourneyMedia;
  anchor?: boolean;
};

export const journeyChapters: readonly JourneyChapter[] = [
  {
    id: "punjab",
    sequence: 1,
    phase: "Origins",
    place: "Punjab",
    title: "Born in Punjab",
    summary:
      "My story begins in Punjab. It is the first place in this journey and the starting point for everything that followed.",
    themes: ["travel", "inner-life"],
    primaryTheme: "travel",
    anchor: true,
  },
  {
    id: "pu",
    sequence: 2,
    phase: "Education",
    place: "Panjab University",
    title: "The university years",
    summary:
      "I studied at Panjab University. This chapter will eventually hold the people, ideas and turning points that shaped those years.",
    themes: [],
    primaryTheme: null,
  },
  {
    id: "rotary",
    sequence: 3,
    phase: "Community",
    place: "Chandigarh",
    title: "Leading Rotary Chandigarh Himalayan",
    summary:
      "I became president of Rotary Chandigarh Himalayan, taking on a chapter centred on leadership, responsibility and community service.",
    themes: ["community"],
    primaryTheme: "community",
  },
  {
    id: "technology",
    sequence: 4,
    phase: "2019–20",
    type: "professional",
    title: "Interfaces",
    summary:
      "I started by learning how design becomes software: reusable interfaces, consistent details and the tests that help them hold together.",
    descriptor: "UI Engineering",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "building",
    sequence: 5,
    phase: "2020–21",
    type: "professional",
    title: "Building",
    summary:
      "From individual screens to complete workflows. Building consumer web and business software taught me to think about the connections between them.",
    descriptor: "Frontend · SaaS · Web",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "scale",
    sequence: 6,
    phase: "2021–22",
    type: "professional",
    title: "Scale",
    summary:
      "Building online-learning experiences for people across Southeast Asia brought product thinking and user experience closer to my engineering work.",
    descriptor: "Product Engineering",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "ownership",
    sequence: 7,
    phase: "2022–23",
    type: "professional",
    title: "Ownership",
    summary:
      "Developer tools and B2B software expanded my work into frontend architecture, product decisions and helping a team deliver together.",
    descriptor: "Developer Tools · B2B SaaS",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "beyond-engineering",
    sequence: 8,
    phase: "2023–Now",
    type: "professional",
    title: "Beyond Engineering",
    summary:
      "I grew from senior engineering into a lead frontend and UX role. Today I connect customer needs, engineering and reliable delivery for U.S. healthcare.",
    descriptor: "Lead Engineer · Health Technology",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "building-my-own",
    sequence: 9,
    phase: "Now →",
    type: "professional",
    title: "Building My Own",
    summary:
      "Taking what I learned from products, people and systems into things I build myself.",
    descriptor: "Founder · Technologist",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "remote-life",
    sequence: 10,
    phase: "Remote life",
    place: "Many places",
    title: "Work without one fixed place",
    summary:
      "Remote work gave me the freedom to work from different places. Over time, that became a digital-nomad way of life.",
    themes: ["travel"],
    primaryTheme: "travel",
  },
  {
    id: "travel",
    sequence: 11,
    phase: "Exploration",
    place: "On the road",
    title: "Travel became part of how I learn",
    summary:
      "I began travelling more often, learning through unfamiliar places, conversations and the experience of living outside a fixed routine.",
    themes: ["travel"],
    primaryTheme: "travel",
  },
  {
    id: "yoga",
    sequence: 12,
    phase: "Inner life",
    place: "Within",
    title: "Yoga, a beard and a different rhythm",
    summary:
      "Somewhere along the way I found yoga, grew a beard and started paying closer attention to consciousness and the inner life.",
    themes: ["inner-life"],
    primaryTheme: "inner-life",
  },
  {
    id: "now",
    sequence: 13,
    phase: "Now",
    place: "Still unfolding",
    title: "The threads keep crossing",
    summary:
      "Software, remote work, travel, service, writing and the study of consciousness now share the same path. This page will keep changing as the journey does.",
    themes: ["travel", "community", "inner-life"],
    primaryTheme: "inner-life",
    anchor: true,
  },
];

const journeyThemeIds = journeyThemes.map(({ id }) => id);

export function parseJourneyThreads(
  value: string | string[] | undefined,
): JourneyTheme[] {
  const requested = new Set(
    (Array.isArray(value) ? value : [value ?? ""])
      .flatMap((part) => part.split(","))
      .map((part) => part.trim()),
  );

  return journeyThemeIds.filter((theme) => requested.has(theme));
}

export function parseJourneyOrder(
  value: string | string[] | undefined,
): JourneyOrder {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected === "thematic" ? "thematic" : "chronological";
}

export function filterJourneyChapters(
  themes: readonly JourneyTheme[],
): JourneyChapter[] {
  if (themes.length === 0) return [...journeyChapters];

  const includeLifeAnchors = themes.some((theme) => theme !== "technology");
  return journeyChapters.filter(
    (chapter) =>
      (includeLifeAnchors && chapter.anchor) ||
      chapter.themes.some((theme) => themes.includes(theme)),
  );
}

export function sortJourneyChapters(
  chapters: readonly JourneyChapter[],
  order: JourneyOrder,
): JourneyChapter[] {
  if (order === "chronological") {
    return [...chapters].sort((a, b) => a.sequence - b.sequence);
  }

  return [...chapters].sort((a, b) => {
    const aTheme = a.primaryTheme
      ? journeyThemeIds.indexOf(a.primaryTheme)
      : journeyThemeIds.length;
    const bTheme = b.primaryTheme
      ? journeyThemeIds.indexOf(b.primaryTheme)
      : journeyThemeIds.length;
    return aTheme - bTheme || a.sequence - b.sequence;
  });
}
