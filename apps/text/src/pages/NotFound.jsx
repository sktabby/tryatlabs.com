import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container pagePad">
      <div className="contentCard">
        <h1 className="sectionTitle">404 — Page not found</h1>
        <p className="sectionSub">That link doesn’t exist here.</p>
        <Link to="/" className="btn btnPrimary">Back to Home</Link>
      </div>
    </div>
  );
}
