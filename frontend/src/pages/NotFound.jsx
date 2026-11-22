import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main id="main-content" className="container error-page">
      <p className="eyebrow">404 / GAME OVER</p>
      <div className="pixel-error" aria-hidden="true">
        404
      </div>
      <h1>Page not found.</h1>
      <p>This level doesn’t exist. There’s plenty to explore back home.</p>
      <Link to="/" className="button primary">
        Return to title screen
      </Link>
    </main>
  );
}
