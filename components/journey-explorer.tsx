"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  journeyChapters,
  journeyThemes,
  type JourneyTheme,
} from "@/lib/journey";

const easeOut = [0.22, 1, 0.36, 1] as const;

const timelineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18 },
  },
};

const chapterVariants: Variants = {
  hidden: { opacity: 0, y: 24, rotateX: 5 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.62, ease: easeOut },
  },
};

function routeName(themes: JourneyTheme[]) {
  if (themes.length === 0) return "The whole journey";

  return themes
    .map((theme) => journeyThemes.find((item) => item.id === theme)?.label)
    .filter(Boolean)
    .join(" + ");
}

export function JourneyExplorer() {
  const reduceMotion = useReducedMotion();
  const [chosenThemes, setChosenThemes] = useState<JourneyTheme[]>([]);
  const [activeThemes, setActiveThemes] = useState<JourneyTheme[]>([]);
  const [routeVersion, setRouteVersion] = useState(0);

  const visibleChapters = useMemo(() => {
    if (activeThemes.length === 0) return journeyChapters;

    return journeyChapters.filter(
      (chapter) =>
        chapter.anchor ||
        chapter.themes.some((theme) => activeThemes.includes(theme)),
    );
  }, [activeThemes]);

  function toggleTheme(theme: JourneyTheme) {
    setChosenThemes((current) =>
      current.includes(theme)
        ? current.filter((item) => item !== theme)
        : [...current, theme],
    );
  }

  function showJourney(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveThemes(chosenThemes);
    setRouteVersion((version) => version + 1);
  }

  const routeKey = `${[...activeThemes].sort().join("-") || "all"}-${routeVersion}`;

  return (
    <div className="journey-explorer">
      <form className="journey-filter-panel" onSubmit={showJourney}>
        <div className="journey-filter-label">
          <h2 id="journey-filter-title">Choose a route</h2>
        </div>

        <div className="journey-filter-content">
          <fieldset aria-labelledby="journey-filter-title">
            <legend>What part of the story would you like to follow?</legend>
            <p className="journey-filter-help">
              Choose one thread, combine several, or follow every chapter.
            </p>

            <div className="journey-filter-grid">
              <motion.button
                className={`journey-filter-option journey-filter-all${
                  chosenThemes.length === 0 ? " is-selected" : ""
                }`}
                type="button"
                aria-pressed={chosenThemes.length === 0}
                onClick={() => setChosenThemes([])}
                whileHover={reduceMotion ? undefined : { z: 10, rotateX: -1.2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                transition={{ type: "tween", duration: 0.16, ease: "easeOut" }}
              >
                <span>
                  <strong>Whole story</strong>
                  <small>From Punjab to the chapter still unfolding.</small>
                </span>
                <span className="journey-choice-mark" aria-hidden="true" />
              </motion.button>

              {journeyThemes.map((theme) => {
                const selected = chosenThemes.includes(theme.id);

                return (
                  <motion.label
                    className={`journey-filter-option${selected ? " is-selected" : ""}`}
                    key={theme.id}
                    whileHover={
                      reduceMotion ? undefined : { z: 10, rotateX: -1.2 }
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    transition={{
                      type: "tween",
                      duration: 0.16,
                      ease: "easeOut",
                    }}
                  >
                    <input
                      className="journey-filter-input"
                      type="checkbox"
                      name="journey-theme"
                      value={theme.id}
                      checked={selected}
                      onChange={() => toggleTheme(theme.id)}
                    />
                    <span>
                      <strong>{theme.label}</strong>
                      <small>{theme.description}</small>
                    </span>
                    <span className="journey-choice-mark" aria-hidden="true" />
                  </motion.label>
                );
              })}
            </div>
          </fieldset>

          <div className="journey-filter-actions">
            <motion.button
              className="journey-submit"
              type="submit"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { y: 0, scale: 0.99 }}
              transition={{ type: "tween", duration: 0.16, ease: "easeOut" }}
            >
              Show this journey
            </motion.button>
            <p aria-live="polite">
              Ready to show: <span>{routeName(chosenThemes)}</span>
            </p>
          </div>
        </div>
      </form>

      <section
        className="journey-results"
        aria-labelledby="journey-stories-title"
      >
        <aside className="journey-results-aside">
          <span>Visible route</span>
          <strong>{visibleChapters.length} chapters</strong>
        </aside>

        <div className="journey-results-main">
          <header className="journey-results-header">
            <div>
              <h2 id="journey-stories-title">{routeName(activeThemes)}</h2>
              <p>
                A first map of the story. Dates, photographs and deeper
                professional chapters can be added as it grows.
              </p>
            </div>
            <span aria-live="polite">{visibleChapters.length} of 8</span>
          </header>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              className="journey-timeline"
              key={routeKey}
              variants={timelineVariants}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              exit={reduceMotion ? undefined : "exit"}
            >
              {visibleChapters.map((chapter) => (
                <motion.li
                  className="journey-chapter"
                  key={chapter.id}
                  variants={chapterVariants}
                  style={{
                    transformPerspective: 1000,
                    transformOrigin: "50% 0%",
                  }}
                >
                  <div className="journey-marker" aria-hidden="true">
                    <motion.span
                      className="journey-chapter-number"
                      variants={chapterVariants}
                    >
                      {String(chapter.sequence).padStart(2, "0")}
                    </motion.span>
                    <motion.span
                      className="journey-thread-segment"
                      initial={reduceMotion ? false : { scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
                    />
                  </div>

                  <article className="journey-chapter-copy">
                    <div className="journey-chapter-meta">
                      <span>{chapter.phase}</span>
                      <span>{chapter.place}</span>
                    </div>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.summary}</p>
                    {chapter.themes.length > 0 && (
                      <ul aria-label="Story threads">
                        {chapter.themes.map((theme) => (
                          <li key={theme}>
                            {
                              journeyThemes.find((item) => item.id === theme)
                                ?.label
                            }
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </motion.li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
