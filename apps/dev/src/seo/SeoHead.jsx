import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE } from "../app/site.config.js";

export function SeoHead({
  title,
  description,
  canonical,
  noindex = false,
  jsonLd = null,
  ogImage = SITE.ogImage,
}) {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} ${SITE.product}`;
  const desc =
    description ||
    "Fast, private, browser-first developer tools by TryAtLabs. No uploads. No tracking gimmicks. Just clean utilities.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical || SITE.baseUrl} />

      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || SITE.baseUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd ? (
        Array.isArray(jsonLd) ? (
          jsonLd.map((obj, idx) => (
            <script key={idx} type="application/ld+json">
              {JSON.stringify(obj)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )
      ) : null}
    </Helmet>
  );
}
