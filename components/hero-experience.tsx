"use client";

import Link from "next/link";
import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { siteConfig } from "@/lib/site";

const easeOut = [0.22, 1, 0.36, 1] as const;

const heroVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
};

const copyVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: easeOut },
  },
};

const artifactVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotateY: -18 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { duration: 0.9, ease: easeOut },
  },
};

const planeMotion = (delay: number) => ({
  y: [0, -5, 0],
  transition: {
    duration: 5.5,
    delay,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
  },
});

export function HeroExperience() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), {
    stiffness: 130,
    damping: 18,
    mass: 0.45,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 130,
    damping: 18,
    mass: 0.45,
  });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.section
      className="home-hero"
      aria-labelledby="home-title"
      variants={heroVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <motion.div className="hero-margin" variants={artifactVariants} aria-hidden="true">
        <div
          className="artifact-frame"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <motion.div
            className="artifact-scene"
            style={reduceMotion ? undefined : { rotateX, rotateY }}
          >
            <span className="artifact-axis" />

            <motion.span
              className="artifact-orbit-rotor artifact-orbit-rotor-one"
              animate={reduceMotion ? undefined : { rotateZ: 360 }}
              transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <span className="artifact-orbit artifact-orbit-one">
                <span className="artifact-satellite" />
              </span>
            </motion.span>

            <motion.span
              className="artifact-orbit-rotor artifact-orbit-rotor-two"
              animate={reduceMotion ? undefined : { rotateZ: -360 }}
              transition={{ duration: 32, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <span className="artifact-orbit artifact-orbit-two" />
            </motion.span>

            <span className="artifact-plane-position artifact-plane-software">
              <motion.span
                className="artifact-plane"
                animate={reduceMotion ? undefined : planeMotion(0)}
              >
                <span>software</span>
                <span className="artifact-plane-rule" />
              </motion.span>
            </span>

            <span className="artifact-plane-position artifact-plane-intelligence">
              <motion.span
                className="artifact-plane artifact-plane-accent"
                animate={reduceMotion ? undefined : planeMotion(0.7)}
              >
                <span>intelligence</span>
                <span className="artifact-plane-rule" />
              </motion.span>
            </span>

            <span className="artifact-plane-position artifact-plane-philosophy">
              <motion.span
                className="artifact-plane"
                animate={reduceMotion ? undefined : planeMotion(1.4)}
              >
                <span>philosophy</span>
                <span className="artifact-plane-rule" />
              </motion.span>
            </span>

            <span className="artifact-core-position">
              <motion.span
                className="artifact-core"
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.16, 1], opacity: [0.8, 1, 0.8] }
                }
                transition={{
                  duration: 3.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </span>
          </motion.div>
        </div>
      </motion.div>

      <div className="hero-copy">
        <motion.h1 id="home-title" variants={copyVariants}>
          Divyum Bhumra
        </motion.h1>
        <motion.p className="hero-role" variants={copyVariants}>
          {siteConfig.shortDescription}
        </motion.p>
        <motion.p className="hero-lede" variants={copyVariants}>
          I build software and write about technology, artificial intelligence,
          entrepreneurship, philosophy and consciousness.
        </motion.p>
        <motion.p className="hero-current" variants={copyVariants}>
          Currently exploring artificial intelligence, Indian philosophy and what
          humans choose to do when technology makes creation increasingly abundant.
        </motion.p>
        <motion.div variants={copyVariants}>
          <Link className="text-link hero-link" href="/essays">
            Read my essays
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
