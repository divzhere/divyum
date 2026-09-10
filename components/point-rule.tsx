"use client";

import { useEffect } from "react";
import { useAnimate } from "framer-motion/mini";
import { editorialTransition } from "@/lib/motion";

export function PointRule() {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    // The server sends the finished composition. Animate only after the user's
    // motion preference is known; no JavaScript leaves the complete rule visible.
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

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
    const finish = () => {
      point.complete();
      line.complete();
    };
    preference.addEventListener("change", finish);
    return () => {
      preference.removeEventListener("change", finish);
      finish();
    };
  }, [animate]);

  return (
    <div className="hero-rule" ref={scope} aria-hidden="true">
      <span className="hero-point" />
      <span className="hero-horizon" />
    </div>
  );
}
