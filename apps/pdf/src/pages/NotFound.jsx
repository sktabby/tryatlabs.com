import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card">
      <h2>404</h2>
      <p className="muted">Page not found.</p>
      <Link to="/" className="btn btn--primary">
        Go Home
      </Link>
    </div>
  );
}
