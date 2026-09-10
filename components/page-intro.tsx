import type { ReactNode } from "react";
import { PointRule } from "@/components/point-rule";

type PageIntroProps = {
  title: string;
  children: ReactNode;
};

export function PageIntro({ title, children }: PageIntroProps) {
  return (
    <header className="page-intro">
      <PointRule className="page-intro-label" />
      <div className="page-intro-copy">
        <h1>{title}</h1>
        <div className="page-intro-lede">{children}</div>
      </div>
    </header>
  );
}
