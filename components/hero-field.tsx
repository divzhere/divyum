"use client";

import { useEffect } from "react";

/*
  The manuscript wakes at the horizon. With a fine pointer over the hero this
  island writes two numbers onto the section: --hx (0..1, where the pointer
  sits along the horizon) and --px (-1..1, how far it is from the centre).
  CSS does everything visible with transitions; nothing here animates, so the
  reduced-motion kill switch and the arrival tests see no JS motion at all.
  It never binds under prefers-reduced-motion or on coarse pointers, and it
  unbinds the moment either preference changes.
*/

export function HeroField() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".home-hero");
    const horizon = hero?.querySelector<HTMLElement>(".hero-horizon");
    if (!hero || !horizon) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    let left = 0;
    let width = 1;
    let centre = 0;
    let half = 1;
    let bound = false;

    const rest = () => {
      hero.style.removeProperty("--hx");
      hero.style.removeProperty("--px");
      delete hero.dataset.awake;
    };

    const measure = () => {
      const rule = horizon.getBoundingClientRect();
      const box = hero.getBoundingClientRect();
      left = rule.left;
      width = Math.max(rule.width, 1);
      centre = box.left + box.width / 2;
      half = Math.max(box.width / 2, 1);
    };

    const move = (event: PointerEvent) => {
      const hx = Math.min(Math.max((event.clientX - left) / width, 0), 1);
      const px = Math.min(Math.max((event.clientX - centre) / half, -1), 1);
      hero.style.setProperty("--hx", hx.toFixed(4));
      hero.style.setProperty("--px", px.toFixed(4));
      hero.dataset.awake = "";
    };

    const bind = () => {
      if (bound) return;
      bound = true;
      hero.addEventListener("pointerenter", measure);
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", rest);
      window.addEventListener("resize", measure);
    };
    const unbind = () => {
      if (!bound) return;
      bound = false;
      hero.removeEventListener("pointerenter", measure);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", rest);
      window.removeEventListener("resize", measure);
      rest();
    };

    const sync = () => {
      if (!reduce.matches && fine.matches) bind();
      else unbind();
    };
    sync();
    reduce.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      unbind();
    };
  }, []);

  return null;
}
