"use client";

import { MotionConfig } from "framer-motion";

// Engine-level reduced-motion gate. Component-level useReducedMotion() checks
// start as null on the first client render, so infinite transform animations
// can begin before the hook resolves and keep running after the animate prop
// flips to undefined (observed in WebKit). MotionConfig checks the user's
// media query when each animation starts, which closes that race.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
