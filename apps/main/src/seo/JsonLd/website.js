import { BRAND } from "../../app/constants/brand.js";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.name,
    url: BRAND.baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BRAND.baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}
