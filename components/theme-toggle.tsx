"use client";

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
        <span className="theme-knob" />
      </span>
      <span aria-hidden="true">{nextThemeLabel}</span>
    </button>
  );
}
