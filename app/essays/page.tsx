import type { Metadata } from "next";
import { EssayList } from "@/components/essay-list";
import { PageIntro } from "@/components/page-intro";
import { getAllContent } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Essays",
  description:
    "Essays by Divyum Bhumra on technology, AI, entrepreneurship, philosophy, consciousness and life.",
  path: "/essays",
});

export default async function EssaysPage() {
  const essays = await getAllContent("essays");

  return (
    <div className="page-shell inner-page">
      <PageIntro title="Essays">
        <p>
          Longer arguments about technology, human agency and the questions that
          connect them.
        </p>
      </PageIntro>
      <div className="index-content">
        <EssayList essays={essays} />
      </div>
    </div>
  );
}
