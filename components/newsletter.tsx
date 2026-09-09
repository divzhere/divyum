import { siteConfig } from "@/lib/site";

export function Newsletter() {
  if (!siteConfig.newsletterUrl) {
    return null;
  }

  return (
    <aside className="newsletter" aria-labelledby="newsletter-title">
      <div>
        <h2 id="newsletter-title">New essays, occasionally.</h2>
        <p>One email when something is worth reading.</p>
      </div>
      <a className="text-link" href={siteConfig.newsletterUrl}>
        Subscribe by email
      </a>
    </aside>
  );
}
