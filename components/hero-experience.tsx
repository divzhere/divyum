import Link from "next/link";
import { PointRule } from "@/components/point-rule";
import { siteConfig } from "@/lib/site";

export function HeroExperience() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <PointRule />
      <div className="hero-copy">
        <h1 id="home-title">Divyum Bhumra</h1>
        <p className="hero-role">{siteConfig.shortDescription}</p>
        <p className="hero-lede">
          I build software and write about technology, artificial intelligence,
          entrepreneurship, philosophy and consciousness.
        </p>
        <p className="hero-current">
          Currently exploring artificial intelligence, Indian philosophy and
          what humans choose to do when technology makes creation increasingly
          abundant.
        </p>
        <Link className="text-link hero-link" href="/essays">
          Read my essays
        </Link>
      </div>
    </section>
  );
}
