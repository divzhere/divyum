import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Professional overview",
  description:
    "Divyum Bhumra's path through frontend engineering, product development and customer-focused delivery in U.S. healthcare technology.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div className="page-shell inner-page experience-page">
      <PageIntro title="Professional overview">
        <p>
          From the details of an interface to the work of bringing a product
          into people&apos;s hands.
        </p>
      </PageIntro>

      <section
        className="story-layout experience-section"
        aria-labelledby="experience-current"
      >
        <div className="story-margin">2023–present</div>
        <div className="story-copy">
          <h2 id="experience-current">U.S. healthcare technology</h2>
          <p>
            Today I lead frontend engineering and product delivery for a U.S.
            healthcare SaaS platform, connecting customer needs with thoughtful
            interfaces and reliable releases. The work supports hospital and
            health-system teams managing provider and practice information.
          </p>
          <p>
            I joined in late 2023 as a senior software engineer and moved into a
            lead frontend and UX role in 2025. My responsibilities now span
            discovery, technical decisions, implementation and what happens
            after a release reaches customers.
          </p>

          <h3>Product and customers</h3>
          <p>
            I work directly with customers, product stakeholders and designers
            to understand requirements and turn feedback into practical plans.
            That includes product requirements, UX discussions, roadmap input
            and breaking initiatives into work the team can deliver. I help keep
            customer expectations and engineering decisions connected as
            requirements evolve.
          </p>

          <h3>Engineering</h3>
          <p>
            I own frontend architecture built with React and TypeScript,
            establishing reusable patterns for complex, data-driven workflows.
            Search, filtering and operational interfaces need to remain clear
            even when the underlying rules are not. My work includes simplifying
            data flows, improving frontend performance, reviewing code and
            making the product easier to maintain.
          </p>

          <h3>Delivery and quality</h3>
          <p>
            I coordinate planning, dependencies, QA, user acceptance testing and
            release readiness across engineering and business teams. Playwright
            coverage, regression checks and clear release notes support that
            process. After launch, I stay involved in customer feedback,
            production triage and follow-through, so delivery does not end at
            deployment.
          </p>
        </div>
      </section>

      <section
        className="story-layout experience-section"
        aria-labelledby="experience-earlier"
      >
        <div className="story-margin">2019–2023</div>
        <div className="story-copy">
          <h2 id="experience-earlier">How I got here</h2>

          <h3>2019–20: Learning the interface</h3>
          <p>
            I began in UI engineering, translating designs into React interfaces
            and working on reusable components, documentation and tests.
            Collaborating with designers and analysts helped me see an interface
            as part of a larger workflow, not just a collection of screens.
          </p>

          <h3>2020–21: Connecting the workflow</h3>
          <p>
            Frontend work across consumer discovery and business software
            broadened that perspective. I built with React and Next.js,
            translated designs into working features and contributed to
            operational workflows. I started thinking more about how a person
            moves through a product from beginning to end.
          </p>

          <h3>2021–22: Thinking in products</h3>
          <p>
            On an online-learning platform serving Southeast Asia, I developed
            React and Next.js features and contributed to redesign work. Working
            on consumer learning experiences drew me further into product
            engineering: understanding the user journey alongside the
            implementation, and making those two concerns inform each other.
          </p>

          <h3>2022–23: Taking technical ownership</h3>
          <p>
            Developer tools and B2B SaaS brought broader responsibility for
            frontend architecture, design systems and delivery. Alongside
            implementation, I contributed to product priorities, sprint
            planning, code reviews and mentoring. The work became as much about
            helping a team make sound decisions as writing the code myself.
          </p>
        </div>
      </section>

      <div className="story-layout experience-section">
        <div className="story-margin" aria-hidden="true">
          Still learning
        </div>
        <div className="story-copy">
          <p>
            That experience also informs the things I explore and build for
            myself. Software is one thread; travel, community and inner life
            continue alongside it.
          </p>
          <Link
            className="experience-return"
            href="/journey?thread=technology#technology"
          >
            Follow the technology journey
          </Link>
        </div>
      </div>
    </div>
  );
}
