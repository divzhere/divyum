import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Currently } from "@/components/currently";
import styles from "./study.module.css";

export const metadata: Metadata = {
  title: "V3 design study",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return process.env.V3_DESIGN_LAB === "1"
    ? [{ study: "open-horizon" }, { study: "facing-pages" }]
    : [];
}

export default async function DesignStudy({
  params,
}: {
  params: Promise<{ study: string }>;
}) {
  const { study } = await params;
  if (
    process.env.V3_DESIGN_LAB !== "1" ||
    !["open-horizon", "facing-pages"].includes(study)
  ) {
    notFound();
  }

  return (
    <div className={`page-shell ${styles.study}`}>
      {/* Parser-time enhancement: no script means the finished composition.
          This local-only prototype is never linked from the public site. */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.dataset.signatureMotion='ready';",
        }}
      />
      <section
        className={`${styles.hero} ${study === "facing-pages" ? styles.spread : ""}`}
        data-signature
        aria-labelledby="study-name"
      >
        <h1 id="study-name" className={styles.name} aria-label="Divyum Bhumra">
          <span className={styles.nameLine}>
            <span data-name-word>Divyum</span>
          </span>
          <span className={styles.nameLine}>
            <span data-name-word>Bhumra</span>
          </span>
        </h1>
        <div className={styles.horizon} data-horizon aria-hidden="true">
          <span className={styles.point} />
          <span className={styles.line} />
        </div>
        <p className={styles.location}>India / elsewhere</p>
        <div className={styles.support}>
          <p>
            I build software and write about technology, artificial
            intelligence, entrepreneurship, philosophy and consciousness.
          </p>
          <Link className="text-link" href="/essays">
            Read the writing
          </Link>
        </div>
      </section>
      <section className={styles.currently} aria-labelledby="study-currently">
        <h2 id="study-currently">Currently</h2>
        <Currently />
      </section>
      <nav className={styles.studyNav} aria-label="Compare design studies">
        <Link className="text-link" href="/design/v3/open-horizon">
          Open horizon
        </Link>
        <Link className="text-link" href="/design/v3/facing-pages">
          Facing pages
        </Link>
      </nav>
    </div>
  );
}
