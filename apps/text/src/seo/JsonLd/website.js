import { SITE } from "../../app/site.config.js";

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.baseUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});
