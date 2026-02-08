import { SITE } from "../app/site.config.js";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE.productName} ${SITE.appName}`,
    url: SITE.origin,
    description: "Privacy-first image tools that run in your browser.",
    publisher: { "@type": "Organization", name: SITE.productName }
  };
}

export function toolJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    description,
    url: `${SITE.origin}${path}`,
    publisher: { "@type": "Organization", name: SITE.productName }
  };
}
