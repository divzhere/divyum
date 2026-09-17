import Link from "next/link";
import { Currently } from "@/components/currently";
import { EssayList } from "@/components/essay-list";
import { HeroExperience } from "@/components/hero-experience";
import { KnowledgeTree } from "@/components/frameworks/knowledge-tree";
import { frameworkGlyphs } from "@/components/frameworks/glyphs";
import { getAllContent } from "@/lib/content";
import { getAllFrameworks, lineageLabels } from "@/lib/frameworks";
import { getShelf, waitingCaption } from "@/lib/library";
import { journeyChapters } from "@/lib/journey";
import styles from "./home.module.css";

/*
  The home page reads as a table of contents for a life: six chapters, each
  opening with the point on its hairline and a roman numeral. The Knowledge
  Tree is the living instrument (the real component, not a picture); three
  plates beneath it show one framework per lineage.
*/

const numerals = ["I", "II", "III", "IV", "V", "VI"] as const;

function Numeral({ index }: { index: number }) {
  return (
    <span className={styles.numeral} aria-hidden="true">
      {numerals[index]}
    </span>
  );
}

export default async function HomePage() {
  const [essays, frameworks, shelf] = await Promise.all([
    getAllContent("essays"),
    getAllFrameworks(),
    getShelf(),
  ]);
  const instrument = frameworks.find((item) => item.slug === "knowledge-tree");
  const featured = [
    "signal-vs-noise",
    "eight-limbs",
    "vision-to-leverage",
  ].flatMap((slug) => frameworks.filter((item) => item.slug === slug));
  const moments = journeyChapters.filter((chapter) =>
    ["punjab", "remote-life", "yoga"].includes(chapter.id),
  );
  const preview = shelf.slice(0, 5);
  const waiting = preview.filter((book) => book.placeholder).length;

  return (
    <div className={`page-shell home-page ${styles.home}`}>
      <HeroExperience />
      <section
        className={`${styles.section} scroll-reveal ${styles.currently}`}
        aria-labelledby="currently-title"
      >
        <div className={styles.sectionHead}>
          <Numeral index={0} />
          <h2 id="currently-title">Currently</h2>
        </div>
        <Currently />
      </section>
      <section
        className={`${styles.section} scroll-reveal ${styles.writing}`}
        aria-labelledby="writing-title"
      >
        <div className={styles.sectionHead}>
          <Numeral index={1} />
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
        className={`${styles.section} scroll-reveal ${styles.frameworks}`}
        aria-labelledby="frameworks-title"
      >
        <div className={styles.sectionHead}>
          <Numeral index={2} />
          <h2 id="frameworks-title">Frameworks</h2>
          <p>Ways of seeing, made tangible.</p>
          <Link className="text-link" href="/frameworks">
            Explore the thinking tools <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {instrument && (
          <div className={styles.instrument}>
            <div className={styles.instrumentCopy}>
              <h3>{instrument.title}</h3>
              <p className={styles.instrumentMeta}>
                {lineageLabels[instrument.lineage]} · {instrument.origin}
              </p>
              <p className={styles.instrumentCaption}>
                {instrument.description}
              </p>
              <Link
                className="text-link"
                href={`/frameworks/${instrument.slug}`}
              >
                Read the framework <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.instrumentCanvas}>
              <KnowledgeTree />
            </div>
          </div>
        )}
        <div className={styles.plates}>
          {featured.map((framework) => {
            const Glyph = frameworkGlyphs[framework.visual];
            return (
              <Link
                href={`/frameworks/${framework.slug}`}
                className={styles.plate}
                key={framework.slug}
              >
                <span className={styles.zones} aria-hidden="true">
                  <span data-zone="tl" />
                  <span data-zone="tr" />
                  <span data-zone="bl" />
                  <span data-zone="br" />
                </span>
                <div className={styles.plateMeta}>
                  <span>{lineageLabels[framework.lineage]}</span>
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
        className={`${styles.section} scroll-reveal ${styles.journey}`}
        aria-labelledby="journey-title"
      >
        <div className={styles.sectionHead}>
          <Numeral index={3} />
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
        className={`${styles.section} scroll-reveal ${styles.library}`}
        aria-labelledby="library-title"
      >
        <div className={styles.sectionHead}>
          <Numeral index={4} />
          <h2 id="library-title">Library</h2>
          <p>Books, and the ideas they leave behind.</p>
          <Link className="text-link" href="/library">
            Visit the shelf <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.shelfPreview}>
          <ul className={styles.shelfLine} aria-label="Library preview">
            {preview.map((book) => (
              <li
                key={book.slug}
                className={styles.shelfPoint}
                data-placeholder={book.placeholder || undefined}
              >
                {book.placeholder ? (
                  <span className="visually-hidden">
                    {`${book.label} · ${book.themes.join(" / ")} · forthcoming`}
                  </span>
                ) : book.hasNotes ? (
                  <Link className="text-link" href={`/library/${book.slug}`}>
                    {book.title}
                  </Link>
                ) : (
                  <span>{book.title}</span>
                )}
              </li>
            ))}
          </ul>
          {waiting > 0 && (
            <p className={styles.shelfNote}>
              {waitingCaption(waiting)} Real books and reading notes will
              follow.
            </p>
          )}
        </div>
      </section>
      <section
        className={`${styles.section} scroll-reveal ${styles.about}`}
        aria-labelledby="about-title"
      >
        <div className={styles.sectionHead}>
          <Numeral index={5} />
          <h2 id="about-title">About</h2>
        </div>
        <div className={styles.aboutCopy}>
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
