import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const socialLinks = [
    { label: "X", href: siteConfig.social.x },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "GitHub", href: siteConfig.social.github },
    {
      label: "Email",
      href: siteConfig.social.email ? `mailto:${siteConfig.social.email}` : "",
    },
  ].filter((item) => item.href);

  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div>
          <Link className="footer-name" href="/">
            {siteConfig.name}
            <span className="footer-point" aria-hidden="true" />
          </Link>
          <p className="footer-location">{siteConfig.location}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="footer-links">
            {[
              "Essays",
              "Notes",
              "Frameworks",
              "Library",
              "Journey",
              "About",
            ].map((label) => (
              <li key={label}>
                <Link className="text-link" href={`/${label.toLowerCase()}`}>
                  {label}
                </Link>
              </li>
            ))}
            {siteConfig.projectsVisible && (
              <li>
                <Link className="text-link" href="/projects">
                  Projects
                </Link>
              </li>
            )}
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a className="text-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="page-shell" aria-hidden="true">
        <div className="footer-return">
          <span className="footer-return-line" />
          <span className="footer-return-point" />
        </div>
      </div>
    </footer>
  );
}
