import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/social-card";
import { getContentBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const alt = "Note by Divyum Bhumra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function NoteOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getContentBySlug("notes", slug);

  return new ImageResponse(
    <SocialCard
      label="Note"
      title={note?.title ?? "Notes"}
      description={
        note?.description ?? "Notes and observations by Divyum Bhumra."
      }
      accent="#9a5b2f"
      meta={note ? formatDate(note.publishedAt) : undefined}
      tags={note?.tags}
    />,
    size,
  );
}
