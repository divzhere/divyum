import Link from "next/link";
import { Currently } from "@/components/currently";
import { EssayList } from "@/components/essay-list";
import { HeroExperience } from "@/components/hero-experience";
import { getAllContent } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const essays = await getAllContent("essays");

  return (
    <div className="page-shell home-page">
      <HeroExperience />

      <section className="editorial-section" aria-labelledby="currently-title">
        <h2 id="currently-title">Currently</h2>
        <Currently />
      </section>

      <section className="editorial-section" aria-labelledby="journey-title">
        <h2 id="journey-title">Journey</h2>
        <div className="section-copy">
          <p className="section-lede">One life, viewed through different threads.</p>
          <p>
            Follow the story through travel, technology, community service or the
            inner life.
          </p>
          <Link className="text-link section-link" href="/journey">
            Choose a path
          </Link>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="essays-title">
        <h2 id="essays-title">Essays</h2>
        <EssayList essays={essays.slice(0, 5)} />
      </section>

      {siteConfig.projectsVisible && (
        <section className="editorial-section" aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <div className="section-copy">
            <p className="section-lede">A record of software and experiments.</p>
            <p>
              Projects I&apos;m ready to share will appear here, alongside what they
              taught me.
            </p>
            <Link className="text-link section-link" href="/projects">
              View projects
            </Link>
          </div>
        </section>
      )}

      <section className="editorial-section" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <div className="section-copy">
          <p className="section-lede">
            I started by building software. The questions soon grew larger than
            the tools.
          </p>
          <p>
            Today I work in software, study ideas across disciplines and learn in
            public through writing, travel and direct experience.
          </p>
          <Link className="text-link section-link" href="/about">
            More about me
          </Link>
        </div>
      </section>
    </div>
  );
}
