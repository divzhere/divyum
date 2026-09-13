import Link from "next/link";
import { LocalTime } from "@/components/local-time";
import { PointRule } from "@/components/point-rule";
import { siteConfig } from "@/lib/site";

/*
  The signature composition. The point sits at the corner of the second name
  line and its horizon runs beneath the letters; location and time hang from
  the same origin (--horizon-start). The margin spine reads bottom-up like a
  book spine and is decorative: the name is already the h1.
*/

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
      <div className="hero-presence">
        <p className="hero-location">{siteConfig.location}</p>
        <LocalTime />
      </div>
      <div className="hero-support">
        <p className="hero-lede">
          I build software and write about technology, artificial intelligence,
          entrepreneurship, philosophy and consciousness.
        </p>
        <Link className="text-link hero-link" href="/frameworks">
          Explore the frameworks
        </Link>
      </div>
      <p className="hero-spine" aria-hidden="true">
        Divyum Bhumra — Est. Punjab
      </p>
    </section>
  );
}
