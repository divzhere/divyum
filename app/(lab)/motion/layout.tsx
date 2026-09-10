import type { Metadata } from "next";
import "./motion.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MotionLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="motion-lab-page page-shell">{children}</div>;
}
