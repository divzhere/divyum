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
          <p className="footer-name">{siteConfig.name}</p>
          <p className="footer-location">{siteConfig.location}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="footer-links">
            <li>
              <Link className="text-link" href="/journey">
                Journey
              </Link>
            </li>
            <li>
              <Link className="text-link" href="/essays">
                Writing
              </Link>
            </li>
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
    </footer>
  );
}
