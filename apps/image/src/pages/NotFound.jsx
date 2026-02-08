import { Link } from "react-router-dom";
import { SeoHead } from "../seo/SeoHead.jsx";

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="Not Found"
        description="The page you are looking for does not exist."
        path="/404"
      />
      <div className="card card--glass">
        <h1 className="h1">404</h1>
        <p className="muted">This page isn’t available.</p>
        <Link to="/" className="btn btn--primary">Go to Image Tools</Link>
      </div>
    </>
  );
}
