import type { FrameworkVisualKey } from "@/lib/frameworks-meta";
import { EightLimbs } from "@/components/frameworks/eight-limbs";
import { EisenhowerMatrix } from "@/components/frameworks/eisenhower-matrix";
import { KnowledgeTree } from "@/components/frameworks/knowledge-tree";
import { SignalVsNoise } from "@/components/frameworks/signal-vs-noise";
import { TatTvamAsi } from "@/components/frameworks/tat-tvam-asi";
import { VisionToLeverage } from "@/components/frameworks/vision-to-leverage";

// The registry the `visual` frontmatter key resolves against. The unit suite
// asserts this stays in lockstep with frameworkVisualKeys in lib/frameworks.ts
// so an unimplemented key can never reach a page.
export const frameworkVisuals: Record<
  FrameworkVisualKey,
  () => React.JSX.Element
> = {
  EisenhowerMatrix,
  SignalVsNoise,
  KnowledgeTree,
  TatTvamAsi,
  VisionToLeverage,
  EightLimbs,
};
