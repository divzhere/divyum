import type { Metadata } from "next";
import { MotionPrototype } from "@/components/motion-prototype";

export const metadata: Metadata = { title: "Motion study: Paper depth" };

export default function PaperDepthPage() {
  return <MotionPrototype variant="paper-depth" />;
}
