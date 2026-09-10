import type { FrameworkVisualKey } from "@/lib/frameworks-meta";

/*
  One small glyph per framework, derived from its own visual, so the index
  reads like a plate section in a book. Server-safe, stroke-only, sized by
  the surrounding text.
*/

type GlyphProps = { className?: string };

function glyphAttributes(className: string | undefined, label: string) {
  return {
    className: `fw-glyph${className ? ` ${className}` : ""}`,
    viewBox: "0 0 24 24",
    role: "img" as const,
    "aria-label": label,
  };
}

function EisenhowerGlyph({ className }: GlyphProps) {
  return (
    <svg {...glyphAttributes(className, "Two-by-two grid")}>
      <rect x={3} y={3} width={18} height={18} fill="none" />
      <line x1={12} y1={3} x2={12} y2={21} />
      <line x1={3} y1={12} x2={21} y2={12} />
      <circle cx={7.5} cy={7.5} r={1.6} fill="currentColor" stroke="none" />
    </svg>
  );
}

function SignalGlyph({ className }: GlyphProps) {
  return (
    <svg
      {...glyphAttributes(
        className,
        "A point extending into a line among scattered dots",
      )}
    >
      <circle cx={5} cy={16} r={2} fill="currentColor" stroke="none" />
      <line x1={7} y1={16} x2={21} y2={16} />
      <circle
        cx={8}
        cy={7}
        r={0.9}
        fill="currentColor"
        stroke="none"
        opacity={0.4}
      />
      <circle
        cx={14}
        cy={5}
        r={0.9}
        fill="currentColor"
        stroke="none"
        opacity={0.4}
      />
      <circle
        cx={18}
        cy={9}
        r={0.9}
        fill="currentColor"
        stroke="none"
        opacity={0.4}
      />
    </svg>
  );
}

function TreeGlyph({ className }: GlyphProps) {
  return (
    <svg {...glyphAttributes(className, "Trunk with two branches and leaves")}>
      <line x1={12} y1={21} x2={12} y2={12} />
      <path d="M12 12 C 11 9, 8 7.5, 6 6.5" fill="none" />
      <path d="M12 12 C 13 9, 16 7.5, 18 6.5" fill="none" />
      <circle cx={5.4} cy={5.6} r={1.4} fill="currentColor" stroke="none" />
      <circle cx={18.6} cy={5.6} r={1.4} fill="currentColor" stroke="none" />
    </svg>
  );
}

function TatTvamAsiGlyph({ className }: GlyphProps) {
  return (
    <svg
      {...glyphAttributes(className, "A ring of dots around one centre point")}
    >
      <circle cx={12} cy={12} r={8.5} fill="none" opacity={0.5} />
      <circle cx={12} cy={3.5} r={1.1} fill="currentColor" stroke="none" />
      <circle cx={20.5} cy={12} r={1.1} fill="currentColor" stroke="none" />
      <circle cx={12} cy={20.5} r={1.1} fill="currentColor" stroke="none" />
      <circle cx={3.5} cy={12} r={1.1} fill="currentColor" stroke="none" />
      <circle cx={12} cy={12} r={2} fill="currentColor" stroke="none" />
    </svg>
  );
}

function SpiralGlyph({ className }: GlyphProps) {
  return (
    <svg {...glyphAttributes(className, "A spiral widening outward")}>
      <path
        d="M12 12 C 13.5 10.5, 15 12, 14 14 C 12.5 16.5, 9 15.5, 8 12.5 C 6.8 9, 10 5.5, 14 6 C 18.5 6.6, 21 11, 19.5 15.5"
        fill="none"
      />
      <circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" />
    </svg>
  );
}

function LimbsGlyph({ className }: GlyphProps) {
  return (
    <svg
      {...glyphAttributes(className, "Concentric rings closing on a centre")}
    >
      <circle cx={12} cy={12} r={9} fill="none" opacity={0.4} />
      <circle cx={12} cy={12} r={6} fill="none" opacity={0.6} />
      <circle cx={12} cy={12} r={3} fill="none" opacity={0.8} />
      <circle cx={12} cy={12} r={1} fill="currentColor" stroke="none" />
    </svg>
  );
}

export const frameworkGlyphs: Record<
  FrameworkVisualKey,
  (props: GlyphProps) => React.JSX.Element
> = {
  EisenhowerMatrix: EisenhowerGlyph,
  SignalVsNoise: SignalGlyph,
  KnowledgeTree: TreeGlyph,
  TatTvamAsi: TatTvamAsiGlyph,
  VisionToLeverage: SpiralGlyph,
  EightLimbs: LimbsGlyph,
};
