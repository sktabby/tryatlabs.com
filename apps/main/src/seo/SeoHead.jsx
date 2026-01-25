import { Helmet } from "react-helmet-async";
import { BRAND } from "../app/constants/brand.js";
import { SEO_DEFAULTS } from "../app/constants/seoDefaults.js";

export function SeoHead({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
  canonical = SEO_DEFAULTS.canonical,
  ogImage = BRAND.ogImage,
  noindex = false,
  jsonLd = null
}) {
  const fullTitle = title.includes(BRAND.name) ? title : `${title} — ${BRAND.name}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}

      {/* OpenGraph */}
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
