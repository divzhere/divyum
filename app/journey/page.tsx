import type { Metadata } from "next";
import Link from "next/link";
import { JourneyExplorer } from "@/components/journey-explorer";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Journey",
  description:
    "Follow Divyum Bhumra's journey through travel, technology, community service and inner exploration.",
  path: "/journey",
});

export default function JourneyPage() {
  return (
    <div className="page-shell inner-page journey-page">
      <PageIntro title="Journey">
        <p>
          A life can be understood through more than one thread. Choose the part
          of mine you want to follow.
        </p>
        <p className="journey-overview-link">
          <Link href="/experience">Professional overview</Link>
        </p>
      </PageIntro>
      <JourneyExplorer />
    </div>
  );
}
