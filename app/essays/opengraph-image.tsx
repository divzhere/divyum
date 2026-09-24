import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/social-card";

export const alt = "Essays by Divyum Bhumra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function EssaysOpenGraphImage() {
  return new ImageResponse(
    <SocialCard
      label="Essays"
      title="Long-form thinking"
      description="Essays on technology, human agency, philosophy, consciousness and the questions that connect them."
      accent="#315f73"
      tags={["Technology", "Philosophy", "Life"]}
    />,
    size,
  );
}
