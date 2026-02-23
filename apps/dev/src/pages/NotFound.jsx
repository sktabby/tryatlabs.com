import React from "react";
import { Link } from "react-router-dom";
import { SeoHead } from "../seo/SeoHead.jsx";
import { SITE } from "../app/site.config.js";

export default function NotFound() {
  return (
    <>
      <SeoHead title="404" description="Page not found" canonical={`${SITE.baseUrl}/404`} noindex />
      <section className="section">
        <div className="sectionHead">
          <h1 className="h2">404 — Page not found</h1>
          <p className="muted">That link doesn’t exist.</p>
          <Link className="btnPrimary" to="/">
            Go Home
          </Link>
        </div>
      </section>
    </>
  );
}
