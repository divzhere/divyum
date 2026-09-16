import { ViewTransition } from "react";
import type {} from "react/canary";
import type { ReactNode } from "react";

export function PointRule({
  className = "hero-rule",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <ViewTransition name="route-horizon" share="horizon-morph" default="none">
      <div className={className} data-horizon aria-hidden="true">
        <span className="hero-point" />
        <span className="hero-horizon" />
        {children}
      </div>
    </ViewTransition>
  );
}
