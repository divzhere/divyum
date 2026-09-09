"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type PageIntroProps = {
  title: string;
  children: ReactNode;
};

export function PageIntro({ title, children }: PageIntroProps) {
  const reduceMotion = useReducedMotion();

  const copyMotion: Variants = {
    hidden: { opacity: 0, y: 18, rotateX: 6 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.header
      className="page-intro"
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <motion.div
        className="page-intro-label"
        aria-hidden="true"
        variants={copyMotion}
      >
        <motion.span
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <motion.div
        className="page-intro-copy"
        variants={copyMotion}
        style={{ transformPerspective: 900, transformOrigin: "50% 100%" }}
      >
        <h1>{title}</h1>
        <div className="page-intro-lede">{children}</div>
      </motion.div>
    </motion.header>
  );
}
