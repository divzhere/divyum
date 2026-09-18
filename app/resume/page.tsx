import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/metadata";
import styles from "./resume.module.css";

const resumePath = "/resume/divyum-bhumra-resume.pdf";

export const metadata: Metadata = createMetadata({
  title: "Resume",
  description:
    "View or download Divyum Bhumra's resume for lead engineering, AI-native product engineering and frontend architecture roles.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="page-shell inner-page">
      <PageIntro title="Resume">
        <p>
          Lead engineering, AI-native product engineering and frontend
          architecture — from ambiguous requirements through production.
        </p>
      </PageIntro>

      <section className={styles.resume} aria-labelledby="resume-preview-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Curriculum vitae · PDF</p>
            <h2 id="resume-preview-title">Divyum Bhumra</h2>
          </div>
          <div className={styles.actions}>
            <a
              className={`text-link ${styles.action}`}
              href={resumePath}
              target="_blank"
              rel="noreferrer"
            >
              View PDF <span aria-hidden="true">↗</span>
            </a>
            <a
              className={`text-link ${styles.action}`}
              href={resumePath}
              download="Divyum-Bhumra-Resume.pdf"
            >
              Download PDF <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className={styles.preview} aria-hidden="true">
          <Image
            className={styles.page}
            src="/resume/divyum-bhumra-resume-page-1.webp"
            alt=""
            width={1241}
            height={1754}
            sizes="(max-width: 700px) calc(100vw - 40px), 960px"
            priority
          />
          <Image
            className={styles.page}
            src="/resume/divyum-bhumra-resume-page-2.webp"
            alt=""
            width={1241}
            height={1754}
            sizes="(max-width: 700px) calc(100vw - 40px), 960px"
          />
        </div>
        <p className={styles.fallback}>
          Prefer the original document? You can{" "}
          <a
            className="text-link"
            href={resumePath}
            target="_blank"
            rel="noreferrer"
          >
            open the PDF directly
          </a>
          .
        </p>
      </section>

      <details className={styles.textVersion}>
        <summary>
          <span>Read the accessible text version</span>
          <span aria-hidden="true">↓</span>
        </summary>
        <article className={"prose " + styles.textContent}>
          <header>
            <h2>Divyum Bhumra</h2>
            <p>
              <strong>
                Lead Engineer · AI-Native Product Engineering · Frontend
                Architecture
              </strong>
            </p>
            <address>
              Remote, India ·{" "}
              <a href="mailto:divz7777@gmail.com">divz7777@gmail.com</a> ·{" "}
              <a href="https://divyumbhumra.com">divyumbhumra.com</a>
            </address>
          </header>

          <section>
            <h3>Leadership profile</h3>
            <p>
              Product-minded Lead Engineer with 7+ years owning customer-facing
              software from ambiguous requirements through architecture,
              implementation, UAT and production. Deep React and TypeScript
              background across healthcare, assessment and education platforms,
              with product ownership spanning discovery, PRDs, user flows and
              release planning, and experience leading distributed teams across
              product, design, backend and QA. Works in an AI-native engineering
              model — agentic coding workflows, context engineering and
              multi-agent orchestration — to take on larger implementation
              scopes while architecture, technical review and production
              decisions stay human-owned, with spec-driven development and
              Playwright-based verification gates holding the quality line.
            </p>
          </section>

          <section>
            <h3>Core expertise</h3>
            <dl className={styles.expertise}>
              <div>
                <dt>Product leadership</dt>
                <dd>
                  Discovery, PRDs, user flows, roadmaps, prioritization, feature
                  scoping, customer feedback and release planning
                </dd>
              </div>
              <div>
                <dt>Engineering leadership</dt>
                <dd>
                  Technical strategy, system design, technical architecture,
                  architectural ownership, mentoring, code review, estimation
                  and cross-functional influence
                </dd>
              </div>
              <div>
                <dt>AI-native engineering</dt>
                <dd>
                  Agentic coding workflows, multi-agent orchestration, context
                  engineering, spec-driven development, prompt engineering,
                  structured task decomposition, human-in-the-loop engineering,
                  agentic QA, AI-assisted software delivery, Claude Code, OpenAI
                  Codex and gstack
                </dd>
              </div>
              <div>
                <dt>Frontend architecture</dt>
                <dd>
                  React, TypeScript, JavaScript (ES6+), Next.js, Vite, Redux,
                  Chakra UI, Storybook, HTML, CSS/Sass, Web APIs, performance
                  engineering and accessibility
                </dd>
              </div>
              <div>
                <dt>Quality and verification</dt>
                <dd>
                  Playwright, E2E automation, verification harnesses, Jest,
                  regression testing, UAT gates, release validation, production
                  validation, observability and Web Vitals
                </dd>
              </div>
              <div>
                <dt>Delivery and platforms</dt>
                <dd>
                  Agile/Scrum, Jira, backlog refinement, dependencies,
                  milestones, defect triage, CI/CD, Nx, Webpack, Auth0 and Azure
                  App Service
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3>Professional experience</h3>

            <section className={styles.role}>
              <h4>Senior Software Engineer / Lead Engineer · Denim Health</h4>
              <p>2023–September 2026 · Remote, India</p>
              <ul>
                <li>
                  Progressed into a lead frontend and product role in 2025,
                  owning initiatives end-to-end — client discovery,
                  requirements, PRDs, user flows and technical planning through
                  implementation, QA, UAT, production rollout and post-release
                  support.
                </li>
                <li>
                  Led frontend architecture and delivery with React, TypeScript,
                  Vite, Chakra UI, Auth0 and Playwright, staying hands-on across
                  implementation, debugging, refactoring and UX decisions.
                </li>
                <li>
                  Built complex healthcare workflows on a platform used by
                  hundreds of agents, spanning providers, practices, insurance,
                  search, filters, maps, schedules, closures and operational
                  data.
                </li>
                <li>
                  Contributed to conversational AI experiences handling large
                  patient-call volumes, aligning frontend behavior, product
                  decisions and operational edge cases across the flow.
                </li>
                <li>
                  Reduced frontend API traffic in critical workflows from 40+
                  requests to approximately 10–12 by redesigning data fetching
                  and client-side orchestration, improving responsiveness and
                  simplifying the frontend data architecture.
                </li>
                <li>
                  Designed an AI-native software delivery workflow using Claude
                  Code, Codex and gstack, orchestrating specialist agents across
                  spec analysis, architecture, implementation, refactoring, code
                  review, browser QA and release preparation while retaining
                  ownership of architecture and production decisions.
                </li>
                <li>
                  Established Playwright end-to-end coverage for critical user
                  journeys and grew it into a verification harness — explicit
                  acceptance criteria, automated browser checks and UAT gates —
                  that raised release confidence, cut manual regression effort
                  and let AI-assisted implementation run at higher velocity
                  without bypassing quality controls.
                </li>
                <li>
                  Applied context engineering and structured task decomposition
                  to parallelize feature work across specialist agents,
                  compressing implementation cycles and shifting effort toward
                  specification, architecture, review and system-level
                  decisions.
                </li>
                <li>
                  Built internal observability and product analytics
                  instrumentation, giving product and client stakeholders
                  visibility into workflow health, adoption and failure
                  patterns.
                </li>
                <li>
                  Partnered directly with client stakeholders to understand
                  operational workflows, turn feedback into prioritized product
                  decisions, resolve production issues and align upcoming
                  releases.
                </li>
                <li>
                  Drove sprint execution in Jira — refinement, prioritization,
                  estimation, dependencies, milestones, defect triage, release
                  readiness — and coordinated UAT validation, production
                  rollouts and cross-functional release communication.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>Software Development Engineer 3 · CAW Studios</h4>
              <p>October 2022–June 2023 · Hyderabad, India</p>
              <ul>
                <li>
                  Led frontend development and architecture for Calibrate, a
                  multilingual coding-assessment platform with proctoring,
                  candidate verification, cheating detection, live hiring events
                  and an autocomplete-enabled coding environment; the platform
                  supported live hiring events and attracted 10,000+ users.
                </li>
                <li>
                  Shaped product strategy, feature prioritization and technical
                  direction while owning sprints and the Jira board, translating
                  hiring-workflow requirements into scoped, shippable releases.
                </li>
                <li>
                  Led a cross-functional team of 3–4 frontend engineers, two QA
                  engineers and one designer; mentored engineers, ran code
                  reviews and coordinated production deployments.
                </li>
                <li>
                  Established the frontend foundation for Celito, a B2B biotech
                  SaaS product, selecting React, TypeScript, Fluent UI, Webpack,
                  Storybook and an MVC architecture to keep a new codebase
                  consistent as the team grew.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>Software Engineer · Topica Edtech Group</h4>
              <p>November 2021–October 2022 · Gurugram, India</p>
              <ul>
                <li>
                  Owned and delivered React and Next.js features for Edumall, a
                  short-skills learning platform serving Thailand, Indonesia and
                  Vietnam.
                </li>
                <li>
                  Drove a product-wide design refresh that strengthened the
                  learner experience for a platform receiving 200,000+ site
                  visits.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>Frontend Engineer · Independent / Remote</h4>
              <p>February 2020–September 2021 · India</p>
              <ul>
                <li>
                  Built Zollege, a college-search platform, from the ground up
                  with Next.js; the product grew to more than 2.5 million site
                  visits.
                </li>
                <li>
                  Delivered new workflows and translated Figma designs into
                  production React interfaces for a hotel-management SaaS
                  product.
                </li>
                <li>
                  Built a React application for IceCap Group&apos;s
                  loan-underwriting workflow and owned delivery through Azure
                  Pipelines and Azure App Service.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>UI Developer Intern · XenonStack</h4>
              <p>July 2019–January 2020 · Chandigarh, India</p>
              <ul>
                <li>
                  Revamped XenonStack&apos;s careers portal with React, Redux
                  and Sass, contributing to a 5× increase in job applications.
                </li>
                <li>
                  Developed and documented reusable design-system packages;
                  added unit coverage with Jest and Enzyme and automation
                  coverage with Taiko.
                </li>
              </ul>
            </section>
          </section>

          <section>
            <h3>AI-native engineering system</h3>
            <p>
              How AI-assisted delivery is structured in practice, from
              specification to production ownership.
            </p>
            <dl className={styles.expertise}>
              <div>
                <dt>Specification</dt>
                <dd>
                  Requirements and PRDs translated into explicit specs,
                  acceptance criteria and decomposed workstreams before any
                  agent runs
                </dd>
              </div>
              <div>
                <dt>Context</dt>
                <dd>
                  Curated repository context, conventions, constraints and prior
                  decisions supplied to agents, rather than one-shot prompting
                </dd>
              </div>
              <div>
                <dt>Orchestration</dt>
                <dd>
                  Specialist agents assigned distinct responsibilities — spec
                  analysis, architecture, implementation, debugging,
                  refactoring, code review, browser and Playwright QA, release
                  preparation — and run in parallel where work is independent
                </dd>
              </div>
              <div>
                <dt>Verification</dt>
                <dd>
                  Automated checks, Playwright E2E suites, browser validation
                  and UAT gates that every agent-assisted change must clear
                </dd>
              </div>
              <div>
                <dt>Human ownership</dt>
                <dd>
                  Problem definition, architecture, system boundaries, technical
                  review, testing strategy, release quality and production
                  decisions stay with the engineer
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3>Leadership beyond engineering</h3>
            <section className={styles.role}>
              <h4>President · Rotaract Club Chandigarh Himalayan</h4>
              <p>June 2018–June 2019 · Chandigarh, India</p>
              <ul>
                <li>
                  Led an 800+ member service organization, overseeing programs,
                  people policies, team structure, budgets, marketing and
                  external representation; raised INR 10 lakh for community
                  initiatives.
                </li>
              </ul>
            </section>
            <section className={styles.role}>
              <h4>Team Leader · Smart India Hackathon 2018</h4>
              <p>January–May 2018 · National finalist</p>
              <ul>
                <li>
                  Led e-Rozgaar, an online file-tracking system for government
                  offices, to the national finals from a field of 12,000+ teams.
                </li>
              </ul>
            </section>
          </section>

          <section>
            <h3>Education</h3>
            <ul>
              <li>
                <strong>PG Diploma in Product Management</strong>, Pragmatic
                Leaders (Y Combinator-backed), 2021–2022
              </li>
              <li>
                <strong>
                  Bachelor of Engineering in Information Technology
                </strong>
                , UIET, Panjab University, 2015–2019
              </li>
            </ul>
          </section>
        </article>
      </details>
    </div>
  );
}
