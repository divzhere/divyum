"use client";

import { MotionConfig } from "framer-motion";
import { editorialTransition } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={editorialTransition}>
      {children}
    </MotionConfig>
  );
}
