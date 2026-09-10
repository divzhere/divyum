import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

const navigation = [
  { href: "/essays", label: "Essays" },
  { href: "/notes", label: "Notes" },
  { href: "/frameworks", label: "Frameworks" },
  { href: "/library", label: "Library" },
  { href: "/journey", label: "Journey" },
  ...(siteConfig.projectsVisible
    ? [{ href: "/projects", label: "Projects" }]
    : []),
  { href: "/about", label: "About" },
];

export function Navigation() {
  return (
    <header className="site-header">
      <div className="page-shell nav-inner">
        <Link
          className="brand-link"
          href="/"
          aria-label={`${siteConfig.name}, home`}
        >
          {siteConfig.name}
        </Link>

        <div className="nav-group">
          <nav className="primary-nav" aria-label="Primary navigation">
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link className="text-link nav-link" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
