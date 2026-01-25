import React from "react";
import SeoHead from "../../seo/SeoHead";

export default function Home() {
  return (
    <div>
      <SeoHead title="Tools — TryAtLabs" path="/" description="Browse all tools." />
      <h1>Tools</h1>
      <p>URL format: /:category/:slug</p>
      <p>Example: /pdf/pdf-to-jpg</p>
    </div>
  );
}
