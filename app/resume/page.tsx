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
            <h3>Summary</h3>
            <p>
              Product-minded Lead Engineer with 7+ years owning customer-facing
              software from ambiguous requirements through architecture,
              implementation, UAT and production. Founding engineer on a
              healthcare platform led from its initial commit to production,
              pairing deep React and TypeScript work with product ownership and
              distributed-team leadership. Works in an AI-native engineering
              model — agentic coding, context engineering and multi-agent
              orchestration — to take on larger implementation scopes while
              architecture, review and production decisions stay human-owned,
              with spec-driven development and Playwright-based verification
              gates holding the line.
            </p>
          </section>

          <section>
            <h3>Expertise and technologies</h3>
            <dl className={styles.expertise}>
              <div>
                <dt>Product leadership</dt>
                <dd>
                  Discovery, PRDs, user flows, roadmaps, prioritization, feature
                  scoping, customer feedback, release planning and Agile/Scrum
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
                <dt>Languages and frameworks</dt>
                <dd>
                  TypeScript, JavaScript (ES6+), React 19, Next.js, Vite, Redux,
                  Chakra UI, React Router, React Hook Form, Zod, Storybook,
                  HTML, CSS/Sass, Web APIs, code splitting, performance
                  engineering and accessibility
                </dd>
              </div>
              <div>
                <dt>Quality and verification</dt>
                <dd>
                  Playwright, E2E automation, verification harnesses, Vitest,
                  Jest, regression testing, UAT gates, release validation,
                  Sentry, observability and Core Web Vitals
                </dd>
              </div>
              <div>
                <dt>Platforms and infrastructure</dt>
                <dd>
                  GCP (App Engine, BigQuery, Cloud Logging), Grafana, GitHub
                  Actions, CI/CD, Auth0, Azure App Service, Webpack, Nx and
                  Google Maps API
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3>Professional experience</h3>

            <section className={styles.role}>
              <h4>Founding Engineer / Lead Engineer · Denim Health</h4>
              <p>November 2023–September 2026 · Remote, India</p>
              <ul>
                <li>
                  Founding engineer on a healthcare resource-management platform
                  for Community Health Systems care coordinators: authored the
                  initial commit and 87% of 3,379 commits, shipping 87 releases
                  across 1,362 merged PRs into an approximately 107K-line
                  TypeScript and React system used weekly by roughly 200 care
                  coordinators and 300–400 healthcare call agents; moved into
                  the lead frontend and product role in 2025, owning initiatives
                  from discovery and PRDs through UAT, rollout and post-release
                  support.
                </li>
                <li>
                  Architected the React 19, TypeScript and Vite frontend — 58
                  component families, 15 custom hooks and a 20-module typed API
                  service layer — setting the Chakra UI design system, routing,
                  form, auth and state conventions every later engineer built
                  on.
                </li>
                <li>
                  Shipped the platform&apos;s first three AI features: a
                  classification engine for daily alerts and office notes with
                  an agree/disagree feedback loop that logs disagreements as
                  training data; a conversational assistant answering market and
                  practice questions, contributing to the underlying bot as well
                  as its interface; and an AI call-deflection module for
                  transitional care management, built as an 8,700-line isolated
                  micro-frontend on Chakra v3 against a second API gateway
                  inside the same app shell.
                </li>
                <li>
                  Built the real-time call widget for patient conversation
                  handling — movable picture-in-picture across 3 view modes,
                  inline chart alerts and follow-up reminders, and integrations
                  with 2 electronic health record systems, Athena and Cerner.
                </li>
                <li>
                  Designed and owned the core UX surfaces: a dual table and card
                  resource grid, unified omni-search, filter drawers with
                  server-driven options, role-based rendering across 4
                  permission tiers, and a timezone-aware office-hours, closures
                  and absences system.
                </li>
                <li>
                  Re-architected Sentry instrumentation — eliminating 94,000+
                  daily spurious auth errors, fixing 401 redirect loops, and
                  adding route-aware sampling and a 5-minute TTL dedup cache —
                  cutting error volume from 272K to roughly 75K per month and
                  session replays from 96K to under 1K with no loss of
                  diagnostic coverage.
                </li>
                <li>
                  Designed a HIPAA-safe product analytics pipeline across 5
                  stages (browser, App Engine, Cloud Logging, BigQuery, Grafana)
                  with HMAC-pseudonymized IDs, fail-closed allowlisting and
                  route templating so zero PHI leaves the BAA boundary,
                  replacing estimated usage with measured DAU/WAU/MAU ahead of a
                  customer renewal, plus Slack alerts on slow API calls.
                </li>
                <li>
                  Cut frontend API traffic in critical workflows from 40+
                  requests to approximately 10–12 by redesigning data fetching
                  and client-side orchestration, and eliminated 90%+ of
                  redundant requests with a custom-fields caching layer.
                </li>
                <li>
                  Established the team&apos;s quality and release infrastructure
                  — Vitest and Playwright across 61 test files, a critical E2E
                  suite gating every PR in GitHub Actions, Husky pre-push hooks,
                  and 8 CI/CD workflows driving automated semver releases and
                  QA/UAT/Prod deploys to App Engine — which doubles as the
                  verification harness around AI-assisted implementation.
                </li>
                <li>
                  Designed an AI-native software delivery workflow using Claude
                  Code, Codex and gstack, orchestrating specialist agents across
                  6 responsibilities — spec analysis, architecture,
                  implementation, code review, browser QA and release
                  preparation — and applied context engineering and structured
                  task decomposition to parallelize feature work while keeping
                  ownership of architecture and production decisions.
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
                  candidate verification, cheating detection and an
                  autocomplete-enabled coding environment; shaped product
                  strategy and technical direction while owning sprints and the
                  Jira board, supporting live hiring events and 10,000+ users.
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
              <p>2021–2022 · Gurugram, India</p>
              <ul>
                <li>
                  Owned and delivered React and Next.js features for Edumall, a
                  short-skills learning platform serving Thailand, Indonesia and
                  Vietnam, and drove a product-wide design refresh that
                  strengthened the learner experience for a platform receiving
                  200,000+ site visits.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>Frontend Engineer · Independent / Remote</h4>
              <p>2020–2021 · India</p>
              <ul>
                <li>
                  Built Zollege, a college-search platform, from the ground up
                  with Next.js, growing it past 2.5 million site visits; also
                  translated Figma designs into production React interfaces for
                  a hotel-management SaaS product and built IceCap Group&apos;s
                  loan-underwriting application, owning delivery through Azure
                  Pipelines and Azure App Service.
                </li>
              </ul>
            </section>

            <section className={styles.role}>
              <h4>UI Developer Intern · XenonStack</h4>
              <p>2019–2020 · Chandigarh, India</p>
              <ul>
                <li>
                  Revamped XenonStack&apos;s careers portal with React, Redux
                  and Sass, contributing to a 5× increase in job applications,
                  and documented reusable design-system packages with Jest,
                  Enzyme and Taiko coverage.
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
                <dt>Specification and context</dt>
                <dd>
                  Requirements and PRDs translated into explicit specs,
                  acceptance criteria and decomposed workstreams before any
                  agent runs, with curated repository context, conventions and
                  prior decisions supplied up front rather than one-shot
                  prompting
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
                  Automated checks, Playwright E2E suites and UAT gates that
                  every agent-assisted change must clear
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
              <p>2018–2019 · Chandigarh, India</p>
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
              <p>2018 · National finalist</p>
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
