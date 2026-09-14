"use client";

import { useSyncExternalStore } from "react";

/*
  Presence line under the hero location. The server and no-JS readers see the
  reference zone ("IST · UTC +5:30"); after hydration the same slot shows the
  live clock ("14:09 IST"). Both strings share one fixed-width slot so the swap
  moves nothing. A 15-second tick is enough for a minute clock.
*/

const fallback = "IST · UTC +5:30";

const formatter = (() => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    return null;
  }
})();

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 15_000);
  return () => window.clearInterval(id);
}

function getSnapshot(): string | null {
  try {
    return formatter ? formatter.format(new Date()) : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <p className="hero-time">
      <span className="hero-time-slot">{time ? `${time} IST` : fallback}</span>
    </p>
  );
}
