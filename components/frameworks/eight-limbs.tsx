"use client";

import { useRef, useState } from "react";

// All eight rings and definitions are server-rendered. Selection connects
// each named limb to its ring without hiding the rest of the progression.

const limbs = [
  { name: "Yama", gloss: "restraints — conduct toward others" },
  { name: "Niyama", gloss: "observances — conduct toward oneself" },
  { name: "Asana", gloss: "steady, comfortable posture" },
  { name: "Pranayama", gloss: "regulation of breath" },
  { name: "Pratyahara", gloss: "withdrawal of the senses" },
  { name: "Dharana", gloss: "concentration on a single point" },
  { name: "Dhyana", gloss: "sustained meditation" },
  { name: "Samadhi", gloss: "absorption" },
] as const;

export function EightLimbs() {
  const [selected, setSelected] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: React.KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: limbs.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const wrapped = (next + limbs.length) % limbs.length;
    setSelected(wrapped);
    buttonRefs.current[wrapped]?.focus();
  }

  return (
    <div className="fw-visual fw-limbs">
      <svg
        className="fw-limbs-rings"
        viewBox="0 0 120 120"
        role="img"
        aria-label={`Eight concentric rings from outer conduct to inner absorption. Ring ${selected + 1}, ${limbs[selected].name}, is selected.`}
      >
        {limbs.map((limb, index) => (
          <circle
            className="fw-limbs-ring"
            data-selected={selected === index}
            key={limb.name}
            cx={60}
            cy={60}
            r={56 - index * 7}
          />
        ))}
        <circle className="fw-limbs-centre" cx={60} cy={60} r={2.4} />
      </svg>
      <ol
        className="fw-limbs-list"
        aria-label="Eight limbs. Use arrow keys to move between them."
      >
        {limbs.map((limb, index) => (
          <li
            className="fw-limbs-item"
            key={limb.name}
            style={{ "--limb-depth": index } as React.CSSProperties}
          >
            <button
              className="fw-limbs-choice"
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              tabIndex={selected === index ? 0 : -1}
              aria-pressed={selected === index}
              aria-label={`Limb ${index + 1}: ${limb.name}, ${limb.gloss}`}
              onClick={() => setSelected(index)}
              onKeyDown={onKeyDown}
            >
              <span className="fw-limbs-name">{limb.name}</span>
              <span className="fw-limbs-gloss">{limb.gloss}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="fw-limbs-caption">
        Select a limb to trace its place from outer conduct to inner absorption.
      </p>
    </div>
  );
}
