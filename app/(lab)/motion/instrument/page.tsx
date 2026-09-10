import type { Metadata } from "next";
import { MotionPrototype } from "@/components/motion-prototype";

export const metadata: Metadata = { title: "Motion study: Instrument" };

export default function InstrumentPage() {
  return <MotionPrototype variant="instrument" />;
}
