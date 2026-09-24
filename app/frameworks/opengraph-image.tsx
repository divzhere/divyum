import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/social-card";

export const alt = "Frameworks by Divyum Bhumra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function FrameworksOpenGraphImage() {
  return new ImageResponse(
    <SocialCard
      label="Frameworks"
      title="Thinking tools in actual use"
      description="Purpose-built diagrams for making decisions, understanding systems and seeing more clearly."
      accent="#4d6555"
      tags={["Decisions", "Systems", "Practice"]}
    />,
    size,
  );
}
