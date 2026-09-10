"use client";

import { useRef, useState } from "react";

/*
  Eight stages on an expanding spiral — deliberately not a straight arrow.
  Each loop returns wider. Stages are focusable buttons in a roving-tabindex
  sequence with arrow-key navigation; selecting a stage expands its short
  definition. The definitions are the owner's short glosses; the real depth
  is still to be written (see TODO(divyum) in the MDX source).
*/

const stages = [
  { id: 1, name: "Sankalp", gloss: "resolve, intention" },
  { id: 2, name: "Abhyas", gloss: "consistent practice" },
  { id: 3, name: "Tapas", gloss: "disciplined heat, voluntary difficulty" },
  { id: 4, name: "Swadhyaya", gloss: "self-study" },
  { id: 5, name: "CBT", gloss: "examining and rewiring thought" },
  { id: 6, name: "Proof of Work", gloss: "visible, verifiable output" },
  {
    id: 7,
    name: "Ishvara Pranidhana",
    gloss: "surrender of attachment to outcome",
  },
  {
    id: 8,
    name: "Building Leverage",
    gloss: "compounding through code, media, capital, relationships",
  },
] as const;

const CENTER_X = 250;
const CENTER_Y = 235;
const TURNS = 2.05;
const START_RADIUS = 22;
const GROWTH = 34;

function spiralPoint(progress: number) {
  const angle = -Math.PI / 2 + progress * TURNS * Math.PI * 2;
  const radius = START_RADIUS + progress * TURNS * GROWTH * 2.2;
  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y + Math.sin(angle) * radius * 0.86,
  };
}

const spiralPath = Array.from({ length: 121 }, (_, index) => {
  const point = spiralPoint(index / 120);
  return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
}).join(" ");

const stagePoints = stages.map((stage, index) => ({
  ...stage,
  ...spiralPoint(index / (stages.length - 0.55)),
}));

export function VisionToLeverage() {
  const [selected, setSelected] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: stages.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const clamped = (next + stages.length) % stages.length;
    setSelected(clamped);
    buttonRefs.current[clamped]?.focus();
  }

  const stage = stages[selected];

  return (
    <div className="fw-visual fw-v2l">
      <svg
        className="fw-v2l-svg"
        viewBox="0 0 500 470"
        role="img"
        aria-label="Eight stages placed along a spiral that widens with each turn, from Sankalp at the centre to Building Leverage at the outer edge."
      >
        <path className="fw-v2l-spiral" d={spiralPath} />
        {stagePoints.map((point, index) => (
          <g key={point.id}>
            <circle
              className={`fw-v2l-node${selected === index ? " is-active" : ""}`}
              cx={point.x}
              cy={point.y}
              r={selected === index ? 11 : 8}
            />
            <text
              className="fw-v2l-num"
              x={point.x}
              y={point.y + 3.4}
              textAnchor="middle"
            >
              {point.id}
            </text>
          </g>
        ))}
      </svg>

      <div
        className="fw-v2l-hotspots"
        role="group"
        aria-label="Eight stages. Use the arrow keys to move between them."
        onKeyDown={onKeyDown}
      >
        {stagePoints.map((point, index) => (
          <button
            className="fw-hotspot fw-hotspot-stage"
            key={point.id}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            tabIndex={selected === index ? 0 : -1}
            aria-pressed={selected === index}
            aria-label={`Stage ${point.id}: ${point.name}, ${point.gloss}`}
            onClick={() => setSelected(index)}
            style={{
              left: `${(point.x / 500) * 100}%`,
              top: `${(point.y / 470) * 100}%`,
            }}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="fw-v2l-detail" role="status">
        <span className="fw-v2l-detail-stage">
          {stage.id} · {stage.name}
        </span>
        <span className="fw-v2l-detail-gloss">{stage.gloss}</span>
      </div>
    </div>
  );
}
