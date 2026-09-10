import Link from "next/link";
import { PointRule } from "@/components/point-rule";
import { siteConfig } from "@/lib/site";

export function HeroExperience() {
  return (
    <section className="home-hero" aria-labelledby="home-title" data-signature>
      <h1 id="home-title" className="hero-name" aria-label="Divyum Bhumra">
        <span className="hero-name-line">
          <span data-name-word>Divyum</span>
        </span>
        <span className="hero-name-line">
          <span data-name-word>Bhumra</span>
        </span>
      </h1>
      <PointRule />
      <p className="hero-location">{siteConfig.location}</p>
      <div className="hero-support">
        <p className="hero-lede">
          I build software and write about technology, artificial intelligence,
          entrepreneurship, philosophy and consciousness.
        </p>
        <Link className="text-link hero-link" href="/essays">
          Read the writing
        </Link>
      </div>
    </section>
  );
}
