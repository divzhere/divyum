import type { Metadata } from "next";
import { MotionPrototype } from "@/components/motion-prototype";

export const metadata: Metadata = {
  title: "Motion study: Point becoming line",
};

export default function PointLinePage() {
  return <MotionPrototype variant="point-line" />;
}
