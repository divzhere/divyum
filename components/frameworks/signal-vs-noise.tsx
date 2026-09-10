"use client";

import { useState } from "react";

/*
  A dense field of marks, most of them noise-grey. A handful resolve into a
  legible shape — a point extending into a horizon line, the site's signature —
  only once the visitor filters. The interaction is the argument: the signal
  is invisible until things are removed.

  Positions come from a seeded generator so the server render and the client
  render are identical (no hydration drift, no visual-test flake).
*/

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20260910);

const noiseMarks = Array.from({ length: 150 }, (_, index) => {
  const x = 24 + random() * 592;
  const y = 24 + random() * 312;
  const size = 1.2 + random() * 2.4;
  const kind = random();
  return { id: `n${index}`, x, y, size, dash: kind > 0.62 };
});

const signalLine = Array.from({ length: 17 }, (_, index) => ({
  id: `s${index}`,
  x: 96 + index * 28,
  y: 236 + Math.sin(index / 3.2) * 5,
}));

const bindu = { x: 96, y: 236 };

const levels = [
  { id: 0, label: "Everything" },
  { id: 1, label: "Half the noise" },
  { id: 2, label: "Only what matters" },
] as const;

export function SignalVsNoise() {
  const [level, setLevel] = useState<0 | 1 | 2>(0);

  return (
    <div className="fw-visual fw-signal" data-level={level}>
      <svg
        className="fw-signal-field"
        viewBox="0 0 640 360"
        role="img"
        aria-label="A field of one hundred and fifty grey noise marks concealing seventeen signal points. Filtering the noise reveals the signal points forming a single horizon line extending from a point."
      >
        {noiseMarks.map((mark) =>
          mark.dash ? (
            <line
              className="fw-noise"
              key={mark.id}
              x1={mark.x - mark.size * 1.6}
              y1={mark.y + mark.size}
              x2={mark.x + mark.size * 1.6}
              y2={mark.y - mark.size}
            />
          ) : (
            <circle
              className="fw-noise"
              key={mark.id}
              cx={mark.x}
              cy={mark.y}
              r={mark.size}
            />
          ),
        )}
        <polyline
          className="fw-signal-line"
          points={signalLine.map((point) => `${point.x},${point.y}`).join(" ")}
        />
        {signalLine.map((point) => (
          <circle
            className="fw-signal-mark"
            key={point.id}
            cx={point.x}
            cy={point.y}
            r={2.4}
          />
        ))}
        <circle className="fw-signal-bindu" cx={bindu.x} cy={bindu.y} r={5} />
      </svg>

      <div
        className="fw-signal-controls"
        role="group"
        aria-label="Filter the field"
      >
        {levels.map((option) => (
          <button
            className="fw-toggle"
            key={option.id}
            type="button"
            aria-pressed={level === option.id}
            onClick={() => setLevel(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="fw-status" role="status">
        {level === 0 &&
          "One hundred and fifty marks. Somewhere in here is a signal."}
        {level === 1 && "Less noise. Something is starting to line up."}
        {level === 2 &&
          "Seventeen points, one line. It was there the whole time."}
      </p>
    </div>
  );
}
