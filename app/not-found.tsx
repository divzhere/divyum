import Link from "next/link";

/*
  The lost point: a point whose horizon trails off as a dashed hairline.
  Plain markup, not the shared PointRule, so the 404 never joins the
  route-horizon morph.
*/

export default function NotFound() {
  return (
    <div className="page-shell not-found">
      <p className="not-found-code">404</p>
      <div className="not-found-mark" aria-hidden="true">
        <span className="hero-point" />
        <span className="not-found-trace" />
      </div>
      <h1>This page is not part of the archive.</h1>
      <p>It may have moved, or it may not have been written yet.</p>
      <Link className="text-link" href="/">
        Return home
      </Link>
    </div>
  );
}
