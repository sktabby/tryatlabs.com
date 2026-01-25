import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE } from "../app/site.config";

export default function SeoHead({ title, description, path = "/" }) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE.canonicalBase}${p}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
}
