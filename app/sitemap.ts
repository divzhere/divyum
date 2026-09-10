import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";
import { getAllFrameworks } from "@/lib/frameworks";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [essays, notes, projects, frameworks] = await Promise.all([
    getAllContent("essays"),
    getAllContent("notes"),
    getAllContent("projects"),
    getAllFrameworks(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/essays"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/notes"), changeFrequency: "weekly", priority: 0.8 },
    {
      url: absoluteUrl("/frameworks"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: absoluteUrl("/journey"), changeFrequency: "monthly", priority: 0.8 },
    ...(siteConfig.projectsVisible
      ? [
          {
            url: absoluteUrl("/projects"),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          },
        ]
      : []),
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.6 },
  ];

  const publicContent = [
    ...essays,
    ...notes,
    ...(siteConfig.projectsVisible ? projects : []),
  ];

  const contentPages: MetadataRoute.Sitemap = publicContent.map((entry) => ({
    url: absoluteUrl(`/${entry.kind}/${entry.slug}`),
    lastModified: new Date(entry.updatedAt ?? entry.publishedAt),
    changeFrequency: "monthly" as const,
    priority: entry.kind === "essays" ? 0.8 : 0.6,
  }));

  const frameworkPages: MetadataRoute.Sitemap = frameworks.map((entry) => ({
    url: absoluteUrl(`/frameworks/${entry.slug}`),
    lastModified: new Date(entry.updatedAt ?? entry.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...contentPages, ...frameworkPages];
}
