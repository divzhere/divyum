"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { useAnimate } from "framer-motion/mini";
import { editorialTransition } from "@/lib/motion";

export function PointRule() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // The server sends the finished composition. Animate only after the user's
    // motion preference is known; no JavaScript leaves the complete rule visible.
    if (reduceMotion !== false) return;

    const point = animate(
      ".hero-point",
      { opacity: [0, 1] },
      editorialTransition,
    );
    const line = animate(
      ".hero-horizon",
      { transform: ["scaleX(0)", "scaleX(1)"] },
      { ...editorialTransition, delay: 0.05 },
    );
    return () => {
      point.stop();
      line.stop();
    };
  }, [animate, reduceMotion]);

  return (
    <div className="hero-rule" ref={scope} aria-hidden="true">
      <span className="hero-point" />
      <span className="hero-horizon" />
    </div>
  );
}
