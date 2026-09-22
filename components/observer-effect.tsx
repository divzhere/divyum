"use client";

import { useState, type CSSProperties } from "react";

const particles = [
  [334, 83],
  [379, 92],
  [350, 124],
  [397, 142],
  [321, 158],
  [367, 174],
  [414, 189],
  [344, 215],
  [390, 232],
  [318, 250],
  [368, 270],
  [407, 285],
] as const;

export function ObserverEffect() {
  const [observed, setObserved] = useState(false);

  return (
    <figure className="observer-figure">
      <button
        className="observer-field"
        type="button"
        aria-label="Observe the energy field"
        aria-pressed={observed}
        data-observed={observed || undefined}
        onClick={() => setObserved((current) => !current)}
      >
        <svg className="observer-art" viewBox="0 0 720 360" aria-hidden="true">
          <g className="observer-slits">
            <path d="M102 54v102M102 204v102" />
            <path d="M128 54v102M128 204v102" />
          </g>

          <g className="observer-waves">
            <path
              className="observer-wave"
              d="M28 180c58-86 116-86 174 0s116 86 174 0 116-86 174 0 116 86 142 22"
            />
            <path
              className="observer-wave"
              d="M28 180c58-66 116-66 174 0s116 66 174 0 116-66 174 0 116 66 142 18"
            />
            <path
              className="observer-wave"
              d="M28 180c58-46 116-46 174 0s116 46 174 0 116-46 174 0 116 46 142 12"
            />
            <path
              className="observer-wave"
              d="M28 180c58-26 116-26 174 0s116 26 174 0 116-26 174 0 116 26 142 7"
            />
          </g>

          <g className="observer-human">
            <circle cx="366" cy="92" r="29" />
            <path d="M366 124c-37 0-63 26-63 68v36l-27 73m90-177v177m0-109 54 45m-54-45-54 45m54 64 45 41m-45-41-45 41" />
          </g>

          <g className="observer-particles">
            {particles.map(([cx, cy], index) => (
              <circle
                className="observer-particle"
                cx={cx}
                cy={cy}
                key={`${cx}-${cy}`}
                r={index % 3 === 0 ? 5 : 3.5}
                style={{ "--particle-index": index } as CSSProperties}
              />
            ))}
          </g>

          <circle className="observer-source" cx="28" cy="180" r="5" />
          <line className="observer-axis" x1="28" y1="326" x2="692" y2="326" />
        </svg>

        <span className="observer-instruction">
          {observed
            ? "Release to return to the wave"
            : "Move into the field to observe"}
        </span>
      </button>
      <figcaption>
        <span>Wave / possibility</span>
        <span role="status">
          {observed
            ? "Observed: particle and position."
            : "Unobserved: wave and possibility."}
        </span>
      </figcaption>
    </figure>
  );
}
