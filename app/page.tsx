import Link from "next/link";
import { Currently } from "@/components/currently";
import { EssayList } from "@/components/essay-list";
import { HeroExperience } from "@/components/hero-experience";
import { frameworkGlyphs } from "@/components/frameworks/glyphs";
import { getAllContent } from "@/lib/content";
import { getAllFrameworks } from "@/lib/frameworks";
import { getShelf } from "@/lib/library";
import { journeyChapters } from "@/lib/journey";
import styles from "./home.module.css";

export default async function HomePage() {
  const [essays, frameworks, shelf] = await Promise.all([
    getAllContent("essays"),
    getAllFrameworks(),
    getShelf(),
  ]);
  const featured = ["signal-vs-noise", "knowledge-tree", "eight-limbs"].flatMap(
    (slug) => frameworks.filter((item) => item.slug === slug),
  );
  const moments = journeyChapters.filter((chapter) =>
    ["punjab", "remote-life", "yoga"].includes(chapter.id),
  );

  return (
    <div className={`page-shell home-page ${styles.home}`}>
      <HeroExperience />
      <section
        className={`${styles.section} ${styles.currently}`}
        aria-labelledby="currently-title"
      >
        <h2 id="currently-title">Currently</h2>
        <Currently />
      </section>
      <section
        className={`${styles.section} ${styles.writing}`}
        aria-labelledby="writing-title"
      >
        <div className={styles.sectionHead}>
          <h2 id="writing-title">Writing</h2>
          <div className={styles.links}>
            <Link className="text-link" href="/essays">
              Essays <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/notes">
              Notes <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className={styles.writingContent}>
          <EssayList essays={essays.slice(0, 5)} />
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.frameworks}`}
        aria-labelledby="frameworks-title"
      >
        <div className={styles.sectionHead}>
          <h2 id="frameworks-title">Frameworks</h2>
          <p>Ways of seeing, made tangible.</p>
          <Link className="text-link" href="/frameworks">
            Explore the thinking tools <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.plates}>
          {featured.map((framework, index) => {
            const Glyph = frameworkGlyphs[framework.visual];
            return (
              <Link
                href={`/frameworks/${framework.slug}`}
                className={styles.plate}
                key={framework.slug}
              >
                <div className={styles.plateMeta}>
                  <span>0{index + 1}</span>
                  <span>{framework.origin}</span>
                </div>
                <div className={styles.diagram}>
                  <Glyph />
                </div>
                <h3>
                  {framework.title}
                  <span aria-hidden="true">↗</span>
                </h3>
                <p>{framework.subtitle}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.journey}`}
        aria-labelledby="journey-title"
      >
        <div className={styles.sectionHead}>
          <h2 id="journey-title">Journey</h2>
          <p>One life, viewed through different threads.</p>
          <Link className="text-link" href="/journey">
            Choose a path <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ol className={styles.moments}>
          {moments.map((chapter) => (
            <li key={chapter.id}>
              <span className={styles.momentPhase}>
                {chapter.phase} / {chapter.place}
              </span>
              <Link href={`/journey#${chapter.id}`} className="text-link">
                <h3>{chapter.title}</h3>
              </Link>
              <p>{chapter.summary}</p>
            </li>
          ))}
        </ol>
      </section>
      <section
        className={`${styles.section} ${styles.library}`}
        aria-labelledby="library-title"
      >
        <div className={styles.sectionHead}>
          <h2 id="library-title">Library</h2>
          <p>Books, and the ideas they leave behind.</p>
          <Link className="text-link" href="/library">
            Visit the shelf <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.shelfPreview}>
          <ul className={styles.spines} aria-label="Library preview">
            {shelf.slice(0, 5).map((book) => (
              <li key={book.slug} className={styles.spine}>
                <span className={styles.spineTheme}>
                  {book.themes.join(" / ")}
                </span>
                {book.hasNotes ? (
                  <Link href={`/library/${book.slug}`}>{book.title}</Link>
                ) : (
                  <span>{book.title}</span>
                )}
                <span className={styles.spineStatus}>
                  {book.placeholder ? "Placeholder" : book.author}
                </span>
              </li>
            ))}
          </ul>
          {shelf.some((book) => book.placeholder) && (
            <p className={styles.shelfNote}>
              Placeholders for now. Real books and reading notes will follow.
            </p>
          )}
        </div>
      </section>
      <section
        className={`${styles.section} ${styles.about}`}
        aria-labelledby="about-title"
      >
        <h2 id="about-title">About</h2>
        <div>
          <p>
            Today I work in software, study ideas across disciplines and learn
            in public through writing, travel and direct experience.
          </p>
          <Link className="text-link" href="/about">
            More about me <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
