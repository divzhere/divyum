"use client";

import { motion, useReducedMotion } from "framer-motion";
import { currentlyItems } from "@/lib/currently";

export function Currently() {
  const reduceMotion = useReducedMotion();

  return (
    <dl className="currently-list">
      {currentlyItems.map((item) => (
        <motion.div
          className="currently-row"
          key={item.label}
          whileHover={reduceMotion ? undefined : { x: 7, z: 16, rotateX: -1.4 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={{ transformPerspective: 900 }}
        >
          <dt>{item.label}</dt>
          <dd>{item.detail}</dd>
        </motion.div>
      ))}
    </dl>
  );
}
