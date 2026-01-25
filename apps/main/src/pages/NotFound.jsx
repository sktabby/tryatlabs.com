import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";
import { Link } from "react-router-dom";

export default function NotFound() {
  const canonical = `${BRAND.baseUrl}/404`;
  return (
    <>
      <SeoHead title="Page Not Found" description="The page you requested does not exist." canonical={canonical} noindex />
      <section className="section">
        <div className="container">
          <h1>404</h1>
          <p className="muted">This page doesn’t exist.</p>
          <Link className="btn btn--primary" to="/">
            Go Home
          </Link>
        </div>
      </section>
    </>
  );
}
