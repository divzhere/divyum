import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/social-card";

export const alt = "Notes by Divyum Bhumra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function NotesOpenGraphImage() {
  return new ImageResponse(
    <SocialCard
      label="Notes"
      title="Ideas worth keeping"
      description="Short observations, unfinished ideas, reading notes and field notes."
      accent="#9a5b2f"
      tags={["Observations", "Books", "Questions"]}
    />,
    size,
  );
}
