"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  rotaractCommittees,
  rotaractEvents,
  rotaractInitiatives,
  rotaractRoles,
  rotaractStructure,
} from "@/lib/community-service";

function ExternalSource({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function CommunityServiceJourney() {
  const structureRef = useRef<HTMLOListElement>(null);
  const structureIsVisible = useInView(structureRef, {
    once: true,
    amount: 0.35,
  });
  const reducedMotion = useReducedMotion();

  return (
    <div className="journey-community">
      <header className="journey-community-intro">
        <p className="journey-community-period">July 2017–June 2019</p>
        <h4 id="journey-community-title">From one team to the whole club</h4>
        <p>
          I spent two years moving through the club before becoming president.
          That progression mattered: by the time I led it, I understood the
          volunteer experience at every level.
        </p>
      </header>

      <ol className="journey-community-roles" aria-label="Leadership roles">
        {rotaractRoles.map((role) => (
          <li key={role.title}>
            <time dateTime={role.dateTime}>{role.period}</time>
            <div>
              <h5>{role.title}</h5>
              <p>{role.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="journey-community-structure">
        <header>
          <h4>How the club was structured</h4>
          <p>
            A volunteer organisation at this scale needed clear lines of care,
            responsibility and accountability—not only titles.
          </p>
        </header>

        <ol
          className="journey-community-org"
          ref={structureRef}
          aria-label="Club reporting structure from president to general body members"
        >
          {rotaractStructure.map((level, index) => (
            <motion.li
              key={level.title}
              className={`journey-community-org-level journey-community-org-level-${index + 1}`}
              initial={
                reducedMotion ? false : { opacity: 0.24, y: 14, scale: 0.985 }
              }
              animate={
                reducedMotion || structureIsVisible
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0.24, y: 14, scale: 0.985 }
              }
              transition={{
                duration: reducedMotion ? 0 : 0.42,
                delay: reducedMotion
                  ? 0
                  : (rotaractStructure.length - index - 1) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="journey-community-org-count">{level.count}</span>
              <span>
                <strong>{level.title}</strong>
                <small>{level.detail}</small>
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="journey-community-archive">
        <details className="journey-community-details">
          <summary>
            <span>
              <strong>Flagship events and fundraisers</strong>
              <small>
                {rotaractEvents.length} parts of the annual calendar
              </small>
            </span>
            <span
              className="journey-community-details-mark"
              aria-hidden="true"
            />
          </summary>
          <div className="journey-community-details-body">
            <ol>
              {rotaractEvents.map((event) => (
                <li key={event.title}>
                  <span className="journey-community-item-meta">
                    {event.period}
                  </span>
                  <div>
                    <h5>{event.title}</h5>
                    <p>{event.description}</p>
                    {"sourceLabel" in event && "sourceUrl" in event && (
                      <ExternalSource
                        label={event.sourceLabel}
                        url={event.sourceUrl}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </details>

        <details className="journey-community-details">
          <summary>
            <span>
              <strong>Community service initiatives</strong>
              <small>{rotaractInitiatives.length} areas of work</small>
            </span>
            <span
              className="journey-community-details-mark"
              aria-hidden="true"
            />
          </summary>
          <div className="journey-community-details-body">
            <ol>
              {rotaractInitiatives.map((initiative) => (
                <li key={initiative.title}>
                  <span className="journey-community-item-meta">Service</span>
                  <div>
                    <h5>{initiative.title}</h5>
                    <p>{initiative.description}</p>
                    {"sources" in initiative && (
                      <p className="journey-community-sources">
                        {initiative.sources.map((source) => (
                          <ExternalSource
                            key={source.url}
                            label={source.label}
                            url={source.url}
                          />
                        ))}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </details>

        <details className="journey-community-details">
          <summary>
            <span>
              <strong>Committees I mentored</strong>
              <small>{rotaractCommittees.length} specialist teams</small>
            </span>
            <span
              className="journey-community-details-mark"
              aria-hidden="true"
            />
          </summary>
          <div className="journey-community-details-body">
            <ul className="journey-community-committees">
              {rotaractCommittees.map(([name, remit]) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{remit}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
