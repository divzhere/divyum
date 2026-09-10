import { ImageResponse } from "next/og";
import {
  getFrameworkBySlug,
  lineageLabels,
  type FrameworkVisualKey,
} from "@/lib/frameworks";

export const alt = "A thinking tool from the frameworks collection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A simplified stroke rendering of each framework's own visual, so every
// framework shares a distinct OG image with its page.
function motif(visual: FrameworkVisualKey, stroke: string, accent: string) {
  const common = { fill: "none", stroke, strokeWidth: 4 };
  switch (visual) {
    case "EisenhowerMatrix":
      return (
        <svg width={230} height={230} viewBox="0 0 100 100">
          <rect x={8} y={8} width={84} height={84} {...common} />
          <line x1={50} y1={8} x2={50} y2={92} {...common} />
          <line x1={8} y1={50} x2={92} y2={50} {...common} />
          <circle cx={29} cy={29} r={7} fill={accent} />
        </svg>
      );
    case "SignalVsNoise":
      return (
        <svg width={230} height={230} viewBox="0 0 100 100">
          <circle cx={14} cy={64} r={7} fill={accent} />
          <line
            x1={22}
            y1={64}
            x2={92}
            y2={64}
            stroke={accent}
            strokeWidth={4}
          />
          <circle cx={30} cy={26} r={3} fill={stroke} opacity={0.35} />
          <circle cx={56} cy={18} r={3} fill={stroke} opacity={0.35} />
          <circle cx={76} cy={34} r={3} fill={stroke} opacity={0.35} />
          <circle cx={44} cy={40} r={3} fill={stroke} opacity={0.35} />
        </svg>
      );
    case "KnowledgeTree":
      return (
        <svg width={230} height={230} viewBox="0 0 100 100">
          <line x1={50} y1={92} x2={50} y2={52} {...common} />
          <path d="M50 52 C 46 38, 32 30, 22 26" {...common} />
          <path d="M50 52 C 54 38, 68 30, 78 26" {...common} />
          <circle cx={20} cy={22} r={6} fill={accent} />
          <circle cx={80} cy={22} r={6} fill={accent} />
        </svg>
      );
    case "TatTvamAsi":
      return (
        <svg width={230} height={230} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={36} {...common} opacity={0.55} />
          <circle cx={50} cy={14} r={4.5} fill={stroke} />
          <circle cx={86} cy={50} r={4.5} fill={stroke} />
          <circle cx={50} cy={86} r={4.5} fill={stroke} />
          <circle cx={14} cy={50} r={4.5} fill={stroke} />
          <circle cx={50} cy={50} r={8} fill={accent} />
        </svg>
      );
    case "VisionToLeverage":
      return (
        <svg width={230} height={230} viewBox="0 0 100 100">
          <path
            d="M50 50 C 56 44, 62 50, 58 58 C 52 68, 38 64, 34 52 C 29 38, 42 24, 58 26 C 76 28, 86 46, 80 64"
            {...common}
          />
          <circle cx={50} cy={50} r={5} fill={accent} />
        </svg>
      );
    case "EightLimbs":
      return (
        <svg width={230} height={230} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={40} {...common} opacity={0.35} />
          <circle cx={50} cy={50} r={28} {...common} opacity={0.55} />
          <circle cx={50} cy={50} r={16} {...common} opacity={0.8} />
          <circle cx={50} cy={50} r={4} fill={accent} />
        </svg>
      );
  }
}

export default async function FrameworkOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);

  const title = framework?.title ?? "Frameworks";
  const subtitle = framework?.subtitle ?? "";
  const lineage = framework ? lineageLabels[framework.lineage] : "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#f3f1ea",
        color: "#1f211e",
        padding: "74px 82px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 700,
        }}
      >
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#6c6e68",
          }}
        >
          {lineage ? `Framework · ${lineage}` : "Frameworks"}
        </div>
        <div
          style={{
            fontSize: 64,
            letterSpacing: "-2px",
            lineHeight: 1.08,
            marginTop: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 27,
            color: "#555851",
            marginTop: 20,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 24,
            color: "#6c6e68",
            marginTop: 44,
          }}
        >
          Divyum Bhumra
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {framework ? motif(framework.visual, "#1f211e", "#7b3837") : null}
      </div>
    </div>,
    size,
  );
}
