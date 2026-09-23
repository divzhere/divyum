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
    description: "Rotaract leadership, responsibility and service.",
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

type JourneyChapterBase = {
  id: string;
  sequence: number;
  phase: string;
  title: string;
  summary: string;
  themes: readonly JourneyTheme[];
  primaryTheme: JourneyTheme | null;
  media?: JourneyMedia;
  anchor?: boolean;
  legacyId?: string;
};

type JourneyLifeChapter = JourneyChapterBase & {
  type?: "life";
  place: string;
  descriptor?: never;
};

type JourneyProfessionalChapter = JourneyChapterBase & {
  type: "professional";
  descriptor: string;
  place?: never;
};

export type JourneyChapter = JourneyLifeChapter | JourneyProfessionalChapter;

export const journeyChapters: readonly JourneyChapter[] = [
  {
    id: "punjab",
    sequence: 1,
    phase: "Origins",
    place: "Punjab",
    title: "Born in Punjab",
    summary:
      "My story begins in Punjab. At 15, I moved to Chandigarh, the city that became the starting point for everything that followed.",
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
    id: "rotaract",
    legacyId: "rotary",
    sequence: 3,
    phase: "2018–2019",
    place: "Chandigarh",
    title: "Leading Rotaract Club Chandigarh Himalayan",
    summary:
      "As president, I led an 800+ member service organization and presided over club and board meetings. I coached committees across professional development and service projects while overseeing people policies, team structure, budgets, marketing and external representation; we raised INR 10 lakh for community initiatives.",
    themes: ["community"],
    primaryTheme: "community",
  },
  {
    id: "technology",
    sequence: 4,
    phase: "2019–20",
    type: "professional",
    title: "XenonStack",
    summary:
      "I revamped the careers portal with React, Redux and Sass, contributing to a 5× increase in job applications, and documented reusable design-system packages with Jest, Enzyme and Taiko coverage.",
    descriptor: "UI Developer Intern · React · Redux · Sass",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "building",
    sequence: 5,
    phase: "2020–21",
    type: "professional",
    title: "Independent / Remote",
    summary:
      "I built Zollege from the ground up with Next.js and grew it past 2.5 million site visits, then shipped React interfaces for hotel-management SaaS and a loan-underwriting application through Azure Pipelines and Azure App Service.",
    descriptor: "Frontend Engineer · Next.js · React · Azure",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "scale",
    sequence: 6,
    phase: "2021–22",
    type: "professional",
    title: "Topica Edtech Group",
    summary:
      "I owned React and Next.js features for Edumall across Thailand, Indonesia and Vietnam, and drove a product-wide design refresh for a learning platform receiving 200,000+ site visits.",
    descriptor: "Software Engineer · React · Next.js",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "ownership",
    sequence: 7,
    phase: "2022–23",
    type: "professional",
    title: "CAW Studios",
    summary:
      "I led frontend architecture for Calibrate, a multilingual coding-assessment platform supporting live hiring events and 10,000+ users, guided a cross-functional delivery team, and established the React and TypeScript foundation for Celito's B2B biotech SaaS product.",
    descriptor: "Software Development Engineer 3 · Frontend Lead",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "beyond-engineering",
    sequence: 8,
    phase: "Nov 2023–Sep 2026",
    type: "professional",
    title: "Denim Health",
    summary:
      "As founding engineer, I took a healthcare resource-management platform from its initial commit to production, architected its React and TypeScript frontend, shipped its first three AI features, and moved into the lead frontend and product role owning work from discovery and PRDs through UAT and rollout.",
    descriptor: "Founding Engineer / Lead Engineer · Healthcare",
    themes: ["technology"],
    primaryTheme: "technology",
  },
  {
    id: "building-my-own",
    sequence: 9,
    phase: "How I work now",
    type: "professional",
    title: "AI-native engineering",
    summary:
      "I translate requirements and PRDs into explicit specs, coordinate specialist agents across implementation, review and browser QA, and use Playwright and UAT gates while keeping architecture, release quality and production decisions human-owned.",
    descriptor: "Specification · Orchestration · Verification",
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
    title: "Yoga, Vedanta and a different rhythm",
    summary:
      "While travelling, I landed up in Rishikesh and found yoga, Reiki, Vedanta and breathwork. They gave my inner life a different rhythm.",
    themes: ["inner-life"],
    primaryTheme: "inner-life",
  },
  {
    id: "gt-track",
    sequence: 13,
    phase: "January 2026",
    place: "Level 1 & 2",
    title: "GT Track training",
    summary:
      "I completed GT Track Levels 1 and 2: an introduction to track riding, flag signals, motorcycle control and essential track-riding techniques.",
    themes: [],
    primaryTheme: null,
  },
  {
    id: "reiki-certification",
    sequence: 14,
    phase: "March 2026",
    place: "Level 1 & 2",
    title: "Reiki certification",
    summary:
      "I completed Reiki Levels 1 and 2, deepening the practice that had become part of my inner life alongside yoga, Vedanta and breathwork.",
    themes: ["inner-life"],
    primaryTheme: "inner-life",
  },
  {
    id: "now",
    sequence: 15,
    phase: "Now",
    place: "Still unfolding",
    title: "The threads keep crossing",
    summary:
      "Software, remote work, travel, service, writing and the study of consciousness now share the same path. Vedanta has given me a language for the inward part of that journey, which continues to unfold.",
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
