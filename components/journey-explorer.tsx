"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  filterJourneyChapters,
  journeyChapters,
  journeyThemes,
  parseJourneyOrder,
  parseJourneyThreads,
  sortJourneyChapters,
  type JourneyOrder,
  type JourneyTheme,
} from "@/lib/journey";

function routeName(themes: JourneyTheme[]) {
  if (themes.length === 0) return "The whole journey";

  return themes
    .map((theme) => journeyThemes.find((item) => item.id === theme)?.label)
    .filter(Boolean)
    .join(" + ");
}

function updateJourneyUrl(themes: JourneyTheme[], order: JourneyOrder) {
  const url = new URL(window.location.href);

  if (themes.length > 0) {
    url.searchParams.set("thread", themes.join(","));
  } else {
    url.searchParams.delete("thread");
  }

  if (order === "thematic") {
    url.searchParams.set("order", "thematic");
  } else {
    url.searchParams.delete("order");
  }

  window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

export function JourneyExplorer() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const [chosenThemes, setChosenThemes] = useState<JourneyTheme[]>([]);
  const [activeThemes, setActiveThemes] = useState<JourneyTheme[]>([]);
  const [order, setOrder] = useState<JourneyOrder>("chronological");
  const [routeVersion, setRouteVersion] = useState(0);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"],
  });

  const visibleChapters = useMemo(() => {
    return sortJourneyChapters(filterJourneyChapters(activeThemes), order);
  }, [activeThemes, order]);

  useEffect(() => {
    if (!window.location.hash) return;
    let cancelled = false;
    // The browser initially anchors the unfiltered server HTML. Re-anchor
    // after the selected chapters render and font metrics have settled.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      const chapter = document.getElementById(window.location.hash.slice(1));
      if (chapter && timelineRef.current?.contains(chapter)) {
        chapter.scrollIntoView({ block: "start", behavior: "instant" });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [visibleChapters, routeVersion]);

  useEffect(() => {
    function restoreUrlState() {
      const params = new URLSearchParams(window.location.search);
      const nextThemes = parseJourneyThreads(params.get("thread") ?? undefined);
      const nextOrder = parseJourneyOrder(params.get("order") ?? undefined);
      setChosenThemes(nextThemes);
      setActiveThemes(nextThemes);
      setOrder(nextOrder);
      setRouteVersion((version) => version + 1);
    }

    restoreUrlState();
    window.addEventListener("popstate", restoreUrlState);
    return () => window.removeEventListener("popstate", restoreUrlState);
  }, []);

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
    updateJourneyUrl(chosenThemes, order);
    setRouteVersion((version) => version + 1);
  }

  function chooseOrder(nextOrder: JourneyOrder) {
    setOrder(nextOrder);
    updateJourneyUrl(activeThemes, nextOrder);
  }

  return (
    <div className="journey-explorer">
      <form className="journey-filter-panel" onSubmit={showJourney}>
        <div className="journey-filter-label">
          <h2 id="journey-filter-title">Start with a question</h2>
        </div>

        <div className="journey-filter-content">
          <fieldset aria-labelledby="journey-filter-title">
            <legend>What part of the story would you like to follow?</legend>
            <p className="journey-filter-help">
              Choose one thread, combine several, or follow every chapter.
            </p>

            <div className="journey-filter-grid">
              <button
                className={`journey-filter-option journey-filter-all${
                  chosenThemes.length === 0 ? " is-selected" : ""
                }`}
                type="button"
                aria-pressed={chosenThemes.length === 0}
                onClick={() => setChosenThemes([])}
              >
                <span>
                  <strong>Whole story</strong>
                  <small>From Punjab to the chapter still unfolding.</small>
                </span>
                <span className="journey-choice-mark" aria-hidden="true" />
              </button>

              {journeyThemes.map((theme) => {
                const selected = chosenThemes.includes(theme.id);

                return (
                  <label
                    className={`journey-filter-option${selected ? " is-selected" : ""}`}
                    key={theme.id}
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
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="journey-filter-actions">
            <button className="journey-submit" type="submit">
              Show this journey
            </button>
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
            <span aria-live="polite">
              {visibleChapters.length} of {journeyChapters.length}
            </span>
          </header>

          <div className="journey-order-row">
            <span>Read by</span>
            <div
              className="journey-order-controls"
              role="group"
              aria-label="Chapter order"
            >
              <button
                type="button"
                aria-pressed={order === "chronological"}
                onClick={() => chooseOrder("chronological")}
              >
                Chronological
              </button>
              <button
                type="button"
                aria-pressed={order === "thematic"}
                onClick={() => chooseOrder("thematic")}
              >
                Thematic
              </button>
            </div>
          </div>

          <div className="journey-reading-progress" aria-hidden="true">
            <motion.span style={{ scaleX: scrollYProgress }} />
          </div>

          {/* Keep the scroll target mounted when filters change. New
                chapters retain their shared CSS entrance animation. */}
          <ol className="journey-timeline" ref={timelineRef}>
            {visibleChapters.map((chapter) => (
              <li
                className="journey-chapter editorial-reveal"
                id={chapter.id}
                key={chapter.id}
                aria-labelledby={`${chapter.id}-title`}
              >
                <div className="journey-marker" aria-hidden="true">
                  <span className="journey-chapter-number">
                    {String(chapter.sequence).padStart(2, "0")}
                  </span>
                  <span className="journey-thread-segment" />
                </div>

                <article className="journey-chapter-copy">
                  <div className="journey-chapter-meta">
                    <span>{chapter.phase}</span>
                    <span>
                      {order === "thematic" && chapter.primaryTheme
                        ? journeyThemes.find(
                            ({ id }) => id === chapter.primaryTheme,
                          )?.label
                        : chapter.place}
                    </span>
                  </div>
                  <h3 id={`${chapter.id}-title`}>
                    <a href={`#${chapter.id}`} title="Link to this chapter">
                      {chapter.title}
                    </a>
                  </h3>
                  <p>{chapter.summary}</p>
                  {chapter.type === "professional" && chapter.professional && (
                    <div role="group" aria-label="Professional chapter details">
                      <dl className="journey-professional">
                        <div>
                          <dt>Role</dt>
                          <dd>{chapter.professional.role}</dd>
                        </div>
                        <div>
                          <dt>Organisation</dt>
                          <dd>
                            {chapter.professional.organisation ??
                              "Not named here"}
                          </dd>
                        </div>
                        <div>
                          <dt>Experience</dt>
                          <dd>{chapter.professional.years}</dd>
                        </div>
                        <div>
                          <dt>Built</dt>
                          <dd>{chapter.professional.built}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                  {chapter.media && (
                    <figure className="journey-chapter-media">
                      <Image
                        src={chapter.media.src}
                        alt={chapter.media.alt}
                        width={chapter.media.width}
                        height={chapter.media.height}
                      />
                      {chapter.media.caption && (
                        <figcaption>{chapter.media.caption}</figcaption>
                      )}
                    </figure>
                  )}
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
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
