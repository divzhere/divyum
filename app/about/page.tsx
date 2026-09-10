import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "About Divyum Bhumra: a technologist, software engineer and independent thinker from India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="page-shell inner-page">
      <PageIntro title="About">
        <p>
          I build software and follow questions that don&apos;t fit neatly
          inside technology.
        </p>
      </PageIntro>

      <div className="story-layout">
        <div className="story-margin" aria-hidden="true">
          India
        </div>
        <div className="story-copy">
          <h2>Software</h2>
          <p>
            I started my career building software. Seven years of turning ideas
            into working products taught me how much technology can change, and
            how quickly.
          </p>
          <p>
            Over time, my curiosity moved beyond engineering. I became more
            interested in entrepreneurship, artificial intelligence, psychology,
            philosophy, travel and the study of consciousness.
          </p>

          <h2>Questions</h2>
          <blockquote className="story-question">
            If technology gives humans increasingly powerful tools, what should
            we actually use them for?
          </blockquote>

          <p>
            That question led me toward both modern AI and older traditions of
            human inquiry, particularly Vedanta, Yoga and Indian philosophy. I
            am not approaching these subjects as a master. I&apos;m trying to
            understand them through study, experience and conversation.
          </p>
          <h2>Today</h2>
          <p>
            Today I work in software, explore ideas across disciplines and write
            about what I learn. This site is where that thinking will collect
            over time.
          </p>
        </div>
      </div>
    </div>
  );
}
