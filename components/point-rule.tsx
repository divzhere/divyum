import { ViewTransition } from "react";
import type {} from "react/canary";

export function PointRule({ className = "hero-rule" }: { className?: string }) {
  return (
    <ViewTransition name="route-horizon" share="horizon-morph" default="none">
      <div className={className} data-horizon aria-hidden="true">
        <span className="hero-point" />
        <span className="hero-horizon" />
      </div>
    </ViewTransition>
  );
}
