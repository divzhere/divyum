// Client-safe framework metadata: no node imports, usable in browser chunks.

export const frameworkLineages = ["western", "eastern", "personal"] as const;
export type FrameworkLineage = (typeof frameworkLineages)[number];

export const lineageLabels: Record<FrameworkLineage, string> = {
  western: "Western",
  eastern: "Eastern",
  personal: "Personal",
};

// Every implemented visual, by key. lib code stays server-safe: the actual
// component registry lives in components/frameworks/index.tsx and is checked
// against this list by a unit test so the two cannot drift apart.
export const frameworkVisualKeys = [
  "EisenhowerMatrix",
  "SignalVsNoise",
  "KnowledgeTree",
  "TatTvamAsi",
  "VisionToLeverage",
  "EightLimbs",
] as const;
export type FrameworkVisualKey = (typeof frameworkVisualKeys)[number];
