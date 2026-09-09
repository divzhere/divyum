import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { getAllContent, getContentBySlug } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  if (!siteConfig.projectsVisible) {
    return [];
  }

  const projects = await getAllContent("projects");
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  if (!siteConfig.projectsVisible) {
    return {};
  }

  const { slug } = await params;
  const project = await getContentBySlug("projects", slug);

  if (!project) {
    return {};
  }

  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  if (!siteConfig.projectsVisible) {
    notFound();
  }

  const { slug } = await params;
  const project = await getContentBySlug("projects", slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          url: absoluteUrl(`/projects/${project.slug}`),
          dateCreated: project.publishedAt,
          author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.url,
          },
          keywords: project.tags,
        }}
      />
      <article className="page-shell article-shell project-article">
        <header className="article-header">
          <div className="article-margin">
            <Link className="text-link" href="/projects">
              Projects
            </Link>
          </div>
          <div>
            <h1>{project.title}</h1>
            <p className="article-description">{project.description}</p>
            <div className="article-meta">
              {project.year && <span>{project.year}</span>}
              {project.status && <span>{project.status}</span>}
              {project.website && (
                <a className="text-link" href={project.website}>
                  Visit project
                </a>
              )}
            </div>
          </div>
        </header>
        <div className="article-content-grid">
          <div aria-hidden="true" />
          <Prose source={project.body} />
        </div>
      </article>
    </>
  );
}
