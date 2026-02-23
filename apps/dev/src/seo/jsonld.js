import { SITE } from "../app/site.config.js";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE.name} ${SITE.product}`,
    url: SITE.baseUrl,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.baseUrl}${SITE.brandLogo}`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function toolJsonLd({ title, description, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript. Works in modern browsers.",
    isAccessibleForFree: true,
    description,
    url,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.baseUrl}${SITE.brandLogo}`,
      },
    },
  };
}
