"use client";

import { useSyncExternalStore } from "react";

/*
  Presence line under the hero location: India / elsewhere, made literal.
  The server and no-JS readers see the reference zone ("IST · UTC +5:30");
  after hydration the same slot shows India's clock ("07:53 IST") and, when
  the reader is somewhere else, their own ("· 03:23 here"). Both strings share
  one fixed-width slot so the swap moves nothing. A 15-second tick is enough
  for a minute clock. Nothing here claims availability: the site cannot know.
*/

const fallback = "IST · UTC +5:30";

function formatter(timeZone?: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    return null;
  }
}

const india = formatter("Asia/Kolkata");
const here = formatter();

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 15_000);
  return () => window.clearInterval(id);
}

function getSnapshot(): string | null {
  try {
    if (!india) return null;
    const now = new Date();
    const indiaNow = india.format(now);
    const hereNow = here ? here.format(now) : indiaNow;
    // Same wall clock means the reader is on India's time; say nothing more.
    return hereNow === indiaNow
      ? `${indiaNow} IST`
      : `${indiaNow} IST|${hereNow} here`;
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [ist, hereTime] = time ? time.split("|") : [null, null];

  return (
    <p className="hero-time">
      <span className="hero-time-slot">{ist ?? fallback}</span>
      {hereTime && (
        <span className="hero-time-here">
          <span aria-hidden="true"> · </span>
          {hereTime}
        </span>
      )}
    </p>
  );
}
