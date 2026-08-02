/**
 * NotFound.jsx — 404 page
 *
 * Shown for any web address that doesn't match a real route, so a bad link
 * gives a friendly message and a way home instead of a blank screen.
 */
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <p className="archive-eyebrow">Error 404</p>

      <h1>Page not found</h1>

      <p>
        We couldn&apos;t find the page you were looking for. It may have been
        moved or removed.
      </p>

      <Link className="back-home-link" to="/">
        ← Return to the Archive
      </Link>
    </main>
  );
}

export default NotFound;
