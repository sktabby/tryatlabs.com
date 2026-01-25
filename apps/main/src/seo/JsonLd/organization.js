import { BRAND } from "../../app/constants/brand.js";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: BRAND.baseUrl,
    logo: `${BRAND.baseUrl}${BRAND.logo}`,
    sameAs: []
  };
}
