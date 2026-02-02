import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE } from "../app/site.config.js";

export function SeoHead({ title, description, canonical, jsonLd }) {
  const finalTitle = title || SITE.name;
  const finalDesc = description || SITE.description;
  const finalCanonical = canonical || SITE.url;

  return (
    <Helmet>
      <html lang="en" />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalCanonical} />
      <meta name="theme-color" content={SITE.themeColor} />

      {/* OpenGraph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={`${SITE.url}${SITE.ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={`${SITE.url}${SITE.ogImage}`} />

      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
