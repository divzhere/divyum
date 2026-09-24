import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/social-card";
import { getContentBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const alt = "Essay by Divyum Bhumra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function EssayOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = await getContentBySlug("essays", slug);

  return new ImageResponse(
    <SocialCard
      label="Essay"
      title={essay?.title ?? "Essays"}
      description={essay?.description ?? "Long-form thinking by Divyum Bhumra."}
      accent="#315f73"
      meta={essay ? formatDate(essay.publishedAt) : undefined}
      tags={essay?.tags}
    />,
    size,
  );
}
