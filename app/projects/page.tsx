import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { getAllContent } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export function generateMetadata(): Metadata {
  if (!siteConfig.projectsVisible) {
    return {};
  }

  return createMetadata({
    title: "Projects",
    description: "Software and experiments built by Divyum Bhumra.",
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  if (!siteConfig.projectsVisible) {
    notFound();
  }

  const projects = await getAllContent("projects");

  return (
    <div className="page-shell inner-page">
      <PageIntro title="Projects">
        <p>
          Software and experiments, documented by the questions behind them and what
          happened next.
        </p>
      </PageIntro>

      <div className="index-content">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No public projects listed yet.</p>
            <p>
              This will become a record of real work, including the thesis,
              status and lessons from each project.
            </p>
          </div>
        ) : (
          <ol className="project-list">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>
                  <span className="project-year">{project.year}</span>
                  <span>
                    <span className="project-title">{project.title}</span>
                    <span className="project-thesis">{project.description}</span>
                  </span>
                  <span className="project-status">{project.status}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
