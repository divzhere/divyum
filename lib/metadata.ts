import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  imagePath?: string;
};

export function createMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  imagePath = "/opengraph-image",
}: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: absoluteUrl(imagePath), width: 1200, height: 630 }],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: [siteConfig.name],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(imagePath)],
    },
  };
}
