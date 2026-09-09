"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const themeEvent = "divyum-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(themeEvent, onStoreChange);
  return () => window.removeEventListener(themeEvent, onStoreChange);
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const reduceMotion = useReducedMotion();

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("divyum-theme", nextTheme);
    window.dispatchEvent(new Event(themeEvent));
  }

  const nextTheme = theme === "dark" ? "light" : "dark";
  const nextThemeLabel = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)}`;

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Use ${nextTheme} theme`}
    >
      <span className="theme-track" aria-hidden="true">
        <motion.span
          className="theme-knob"
          animate={{ x: theme === "dark" ? 12 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </span>
      <span aria-hidden="true">{nextThemeLabel}</span>
    </button>
  );
}
