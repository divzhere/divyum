"use client";

import { useState } from "react";

/*
  One geometric form that resolves differently by layer. "The many": a ring of
  small circles. "The one": the same circles converge into a single centre.
  Four yogas are four approaches to the same centre — thin radial paths, each
  focusable, each described in one line. Restraint over ornament.
*/

const MANY_COUNT = 24;
const CENTER = 240;
const RING_RADIUS = 168;

const manyCircles = Array.from({ length: MANY_COUNT }, (_, index) => {
  const angle = (index / MANY_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    id: index,
    x: CENTER + Math.cos(angle) * RING_RADIUS,
    y: CENTER + Math.sin(angle) * RING_RADIUS,
  };
});

const yogas = [
  {
    id: "karma",
    label: "Karma",
    meaning: "the path of unselfish action",
    angle: -Math.PI / 4,
  },
  {
    id: "jnana",
    label: "Jnana",
    meaning: "the path of knowledge",
    angle: (-3 * Math.PI) / 4,
  },
  {
    id: "bhakti",
    label: "Bhakti",
    meaning: "the path of devotion",
    angle: (3 * Math.PI) / 4,
  },
  {
    id: "raja",
    label: "Raja",
    meaning: "the path of meditation",
    angle: Math.PI / 4,
  },
] as const;

const PATH_OUTER = 214;
const PATH_INNER = 26;

export function TatTvamAsi() {
  const [layer, setLayer] = useState<"many" | "one">("many");
  const [yoga, setYoga] = useState<(typeof yogas)[number] | null>(null);

  return (
    <div className="fw-visual fw-tta" data-layer={layer}>
      <svg
        className="fw-tta-svg"
        viewBox="0 0 480 480"
        role="img"
        aria-label="A ring of twenty-four small circles around one centre point, with four thin paths approaching the centre from four directions. One layer shows the many circles; the other resolves them into a single circle."
      >
        {yogas.map((item) => (
          <line
            className={`fw-tta-path${yoga?.id === item.id ? " is-active" : ""}`}
            key={item.id}
            x1={CENTER + Math.cos(item.angle) * PATH_OUTER}
            y1={CENTER + Math.sin(item.angle) * PATH_OUTER}
            x2={CENTER + Math.cos(item.angle) * PATH_INNER}
            y2={CENTER + Math.sin(item.angle) * PATH_INNER}
          />
        ))}
        <circle
          className="fw-tta-ring"
          cx={CENTER}
          cy={CENTER}
          r={RING_RADIUS}
        />
        {manyCircles.map((circle) => (
          <circle
            className="fw-tta-many"
            key={circle.id}
            cx={circle.x}
            cy={circle.y}
            r={9}
            style={{
              transform:
                layer === "one"
                  ? `translate(${CENTER - circle.x}px, ${CENTER - circle.y}px) scale(0.5)`
                  : undefined,
            }}
          />
        ))}
        <circle className="fw-tta-one" cx={CENTER} cy={CENTER} r={14} />
      </svg>

      <div className="fw-tta-controls">
        <div
          className="fw-toggle-group"
          role="group"
          aria-label="Choose a layer"
        >
          <button
            className="fw-toggle"
            type="button"
            aria-pressed={layer === "many"}
            onClick={() => setLayer("many")}
          >
            The many
          </button>
          <button
            className="fw-toggle"
            type="button"
            aria-pressed={layer === "one"}
            onClick={() => setLayer("one")}
          >
            The one
          </button>
        </div>
        <div
          className="fw-toggle-group"
          role="group"
          aria-label="Four yogas, four approaches to the same centre"
        >
          {yogas.map((item) => (
            <button
              className="fw-toggle fw-toggle-quiet"
              key={item.id}
              type="button"
              aria-pressed={yoga?.id === item.id}
              onClick={() => setYoga(yoga?.id === item.id ? null : item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <p className="fw-status" role="status">
        {yoga
          ? `${yoga.label} yoga — ${yoga.meaning}. A different approach, the same centre.`
          : layer === "many"
            ? "Seen through name and form: many."
            : "Seen as it is: one, without a second."}
      </p>
    </div>
  );
}
