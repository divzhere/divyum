"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { currentlyItems } from "@/lib/currently";
import { siteConfig } from "@/lib/site";

export const motionPrototypeVariants = [
  "paper-depth",
  "point-line",
  "instrument",
] as const;

export type MotionPrototypeVariant = (typeof motionPrototypeVariants)[number];

const easeOut = [0.22, 1, 0.36, 1] as const;

function HeroCopy() {
  return (
    <div className="motion-study-copy">
      <h1 id="motion-study-title">Divyum Bhumra</h1>
      <p className="motion-study-role">{siteConfig.shortDescription}</p>
      <p className="motion-study-lede">
        I build software and write about technology, artificial intelligence,
        entrepreneurship, philosophy and consciousness.
      </p>
      <p className="motion-study-current">
        Currently exploring artificial intelligence, Indian philosophy and what
        humans choose to do when technology makes creation increasingly
        abundant.
      </p>
      <Link className="text-link motion-study-link" href="/essays">
        Read my essays
      </Link>
    </div>
  );
}

type AnimatedNumber = number | MotionValue<number>;

function PaperDepth({ x, y }: { x: AnimatedNumber; y: AnimatedNumber }) {
  return (
    <div className="motion-paper-stage" data-testid="paper-depth-visual">
      <motion.div className="motion-paper-stack" style={{ x, y }}>
        <span className="motion-paper-sheet motion-paper-sheet-back" />
        <span className="motion-paper-sheet motion-paper-sheet-middle" />
        <div className="motion-paper-sheet motion-paper-sheet-front">
          <HeroCopy />
          <motion.svg
            className="motion-paper-grain"
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ x, y }}
          >
            <filter id="paper-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.72"
                numOctaves="3"
                seed="18"
              />
            </filter>
            <rect width="100" height="100" filter="url(#paper-noise)" />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  );
}

function PointLine({ animateLine }: { animateLine: boolean }) {
  return (
    <div className="motion-line-composition" data-testid="point-line-visual">
      <div className="motion-line-hero">
        <div className="motion-bindu-track" aria-hidden="true">
          <motion.span
            className="motion-bindu"
            key={animateLine ? "bindu-animated" : "bindu-static"}
            initial={animateLine ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: 0.18, ease: easeOut }}
          />
          <motion.span
            className="motion-horizon"
            key={animateLine ? "line-animated" : "line-static"}
            initial={animateLine ? { scaleX: 0 } : false}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.12, ease: easeOut }}
          />
        </div>
        <HeroCopy />
      </div>

      <section
        className="motion-line-currently"
        aria-labelledby="motion-currently-title"
      >
        <h2 id="motion-currently-title">Currently</h2>
        <dl>
          {currentlyItems.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function Instrument({
  rotateX,
  rotateY,
}: {
  rotateX: AnimatedNumber;
  rotateY: AnimatedNumber;
}) {
  return (
    <motion.div
      className="motion-instrument-stage"
      data-testid="instrument-visual"
      style={{ rotateX, rotateY }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 320" role="presentation">
        <g className="motion-instrument-muted">
          <circle cx="110" cy="150" r="78" />
          <circle cx="110" cy="150" r="52" />
          <path d="M32 150h156M110 72v156" />
          <path d="M54 96l112 108M166 96L54 204" />
        </g>
        <g className="motion-instrument-ink">
          <path d="M110 36v228" />
          <path d="M72 266h76" />
          <path d="M86 266l24-116 25 116" />
          <circle cx="110" cy="150" r="7" />
        </g>
        <g className="motion-instrument-accent">
          <path d="M110 150L164 96" />
          <circle cx="164" cy="96" r="5" />
          <path d="M103 43h14M103 257h14" />
        </g>
      </svg>
      <span className="motion-instrument-shadow" />
    </motion.div>
  );
}

export function MotionPrototype({
  variant,
}: {
  variant: MotionPrototypeVariant;
}) {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const paperX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-0.8, 0.8]), {
    stiffness: 150,
    damping: 24,
  });
  const paperY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-0.7, 0.7]), {
    stiffness: 150,
    damping: 24,
  });
  const instrumentRotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [2, -2]),
    { stiffness: 140, damping: 22 },
  );
  const instrumentRotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-2, 2]),
    { stiffness: 140, damping: 22 },
  );

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || !finePointer) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  if (variant === "paper-depth") {
    return (
      <section
        className="motion-study motion-study-paper"
        aria-labelledby="motion-study-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <PaperDepth
          x={reduceMotion || !finePointer ? 0 : paperX}
          y={reduceMotion || !finePointer ? 0 : paperY}
        />
      </section>
    );
  }

  if (variant === "point-line") {
    return (
      <section
        className="motion-study motion-study-line"
        aria-labelledby="motion-study-title"
      >
        <PointLine animateLine={!reduceMotion && finePointer} />
      </section>
    );
  }

  return (
    <section
      className="motion-study motion-study-instrument"
      aria-labelledby="motion-study-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <Instrument
        rotateX={reduceMotion || !finePointer ? 0 : instrumentRotateX}
        rotateY={reduceMotion || !finePointer ? 0 : instrumentRotateY}
      />
      <HeroCopy />
    </section>
  );
}
