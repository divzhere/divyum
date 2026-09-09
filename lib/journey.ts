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

export type JourneyChapter = {
  id: string;
  sequence: number;
  phase: string;
  place: string;
  title: string;
  summary: string;
  themes: readonly JourneyTheme[];
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
    anchor: true,
  },
  {
    id: "pu",
    sequence: 2,
    phase: "Education",
    place: "PU",
    title: "The university years",
    summary:
      "I studied at PU. This chapter will eventually hold the people, ideas and turning points that shaped those years.",
    themes: [],
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
  },
  {
    id: "technology",
    sequence: 4,
    phase: "Work",
    place: "Technology",
    title: "Finding my way into technology",
    summary:
      "I moved into technology and began building software. This chapter will grow into a detailed record of the roles, systems, products and technical lessons that shaped me.",
    themes: ["technology"],
  },
  {
    id: "remote-life",
    sequence: 5,
    phase: "Remote life",
    place: "Many places",
    title: "Work without one fixed place",
    summary:
      "Remote work gave me the freedom to work from different places. Over time, that became a digital-nomad way of life.",
    themes: ["technology", "travel"],
  },
  {
    id: "travel",
    sequence: 6,
    phase: "Exploration",
    place: "On the road",
    title: "Travel became part of how I learn",
    summary:
      "I began travelling more often, learning through unfamiliar places, conversations and the experience of living outside a fixed routine.",
    themes: ["travel"],
  },
  {
    id: "yoga",
    sequence: 7,
    phase: "Inner life",
    place: "Within",
    title: "Yoga, a beard and a different rhythm",
    summary:
      "Somewhere along the way I found yoga, grew a beard and started paying closer attention to consciousness and the inner life.",
    themes: ["inner-life"],
  },
  {
    id: "now",
    sequence: 8,
    phase: "Now",
    place: "Still unfolding",
    title: "The threads keep crossing",
    summary:
      "Software, remote work, travel, service, writing and the study of consciousness now share the same path. This page will keep changing as the journey does.",
    themes: ["travel", "technology", "community", "inner-life"],
    anchor: true,
  },
];
