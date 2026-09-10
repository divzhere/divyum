import type { Metadata } from "next";
import { FrameworkIndex } from "@/components/framework-index";
import { PageIntro } from "@/components/page-intro";
import { getAllFrameworks } from "@/lib/frameworks";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Frameworks",
  description:
    "Thinking tools Divyum Bhumra actually uses, each rendered as a purpose-built interactive diagram.",
  path: "/frameworks",
});

export default async function FrameworksPage() {
  const frameworks = await getAllFrameworks();

  return (
    <div className="page-shell inner-page">
      <PageIntro title="Frameworks">
        <p>
          Thinking tools in actual use — from the West, from the East, and a few
          synthesised along the way. Each one is drawn, not just described.
        </p>
      </PageIntro>
      <div className="index-content">
        <FrameworkIndex
          entries={frameworks.map((framework) => ({
            slug: framework.slug,
            title: framework.title,
            subtitle: framework.subtitle,
            lineage: framework.lineage,
            domains: framework.domains,
            visual: framework.visual,
          }))}
        />
      </div>
    </div>
  );
}
