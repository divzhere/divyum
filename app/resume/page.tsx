import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/metadata";
import styles from "./resume.module.css";

const resumePath = "/resume/divyum-bhumra-resume.pdf";

export const metadata: Metadata = createMetadata({
  title: "Resume",
  description:
    "View or download Divyum Bhumra's resume for engineering leadership, product delivery and frontend architecture roles.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="page-shell inner-page">
      <PageIntro title="Resume">
        <p>
          Engineering leadership, product delivery and frontend architecture —
          from discovery through production.
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
                Lead Engineer · Product Engineering · Frontend Architecture
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
              Product-minded engineering leader with 7+ years of experience
              turning ambiguous requirements into reliable, customer-facing
              software. Leads Denim Health initiatives from discovery and PRDs
              through architecture, sprint execution, UAT, production rollout
              and post-release support. Combines deep React and TypeScript
              expertise with client partnership, cross-functional leadership and
              a record of improving performance, quality and delivery
              confidence. Experienced building and guiding distributed teams
              across product, design, backend, QA and customer-facing functions.
            </p>
          </section>

          <section>
            <h3>Core leadership and technical expertise</h3>
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
                  Frontend architecture, technical strategy, mentoring, code
                  reviews, estimation, quality, performance and accessibility
                </dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>
                  Agile/Scrum, Jira, backlog refinement, dependencies,
                  milestones, QA, UAT, defect triage and production releases
                </dd>
              </div>
              <div>
                <dt>Frontend</dt>
                <dd>
                  React, TypeScript, JavaScript (ES6+), Next.js, Vite, Redux,
                  Chakra UI, Storybook, HTML and CSS/Sass
                </dd>
              </div>
              <div>
                <dt>Quality and platforms</dt>
                <dd>
                  Playwright, Jest, Enzyme, Auth0, Nx, Webpack, CI/CD, Azure App
                  Service, Web APIs, Web Vitals and PWAs
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3>Professional experience</h3>

            <section className={styles.role}>
              <h4>Senior Software Engineer / Lead Engineer · Denim Health</h4>
              <p>2023–Present · Remote, India</p>
              <ul>
                <li>
                  Progressed into a lead frontend and UX role in 2025; now own
                  product initiatives end-to-end—from client discovery,
                  requirements, PRDs, user flows and technical planning through
                  development, QA, UAT, production rollout and post-release
                  support.
                </li>
                <li>
                  Partner directly with client stakeholders to understand
                  operational workflows, turn feedback into prioritized product
                  decisions, resolve issues and align upcoming releases.
                </li>
                <li>
                  Lead frontend architecture and delivery with React,
                  TypeScript, Vite, Chakra UI, Auth0 and Playwright; contribute
                  hands-on to implementation, debugging, refactoring and UX
                  decisions.
                </li>
                <li>
                  Build complex healthcare workflows spanning providers,
                  practices, search, filters, maps, schedules, closures and
                  operational data.
                </li>
                <li>
                  Reduced frontend API traffic in key workflows from 40+
                  requests to approximately 10–12, improving performance and
                  simplifying client-side orchestration.
                </li>
                <li>
                  Established Playwright end-to-end coverage for critical user
                  journeys, increasing release confidence and reducing manual
                  regression effort.
                </li>
                <li>
                  Drive sprint execution in Jira across backlog refinement,
                  prioritization, estimation, dependencies, milestones, defect
                  triage and release readiness.
                </li>
                <li>
                  Coordinate UAT validation, production rollouts, release notes
                  and cross-functional communication across engineering,
                  product, UX, customer-facing teams and client stakeholders.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>Software Development Engineer 3 · CAW Studios</h4>
              <p>October 2022–June 2023 · Hyderabad, India</p>
              <ul>
                <li>
                  Led frontend development for Calibrate, a multilingual
                  coding-assessment platform with proctoring, candidate
                  verification, cheating detection, live hiring events and an
                  autocomplete-enabled coding environment.
                </li>
                <li>
                  Shaped product strategy, feature prioritization and frontend
                  architecture while managing sprints and the Jira board; helped
                  the platform support live hiring events and attract 10,000+
                  users.
                </li>
                <li>
                  Led a cross-functional team of 3–4 frontend engineers, two QA
                  engineers and one designer; mentored engineers, reviewed code
                  and coordinated production deployments.
                </li>
                <li>
                  Established the frontend foundation for Celito, a B2B biotech
                  SaaS product, using React, TypeScript, Fluent UI, Webpack,
                  Storybook and an MVC architecture.
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
                  Contributed to a product-wide design refresh that strengthened
                  the learner experience for a platform receiving 200,000+ site
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
                  loan-underwriting workflow and configured delivery through
                  Azure Pipelines and Azure App Service.
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
