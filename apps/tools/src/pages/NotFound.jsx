import React from "react";
import { Link } from "react-router-dom";
import SeoHead from "../seo/SeoHead";

export default function NotFound() {
  return (
    <div>
      <SeoHead title="Not Found — Tools" path="/404" />
      <h2>404 — Not Found</h2>
      <Link to="/">Back to Tools Home</Link>
    </div>
  );
}
