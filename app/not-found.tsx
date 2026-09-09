import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell not-found">
      <p className="not-found-code">404</p>
      <h1>This page is not part of the archive.</h1>
      <p>It may have moved, or it may not have been written yet.</p>
      <Link className="text-link" href="/">
        Return home
      </Link>
    </div>
  );
}
