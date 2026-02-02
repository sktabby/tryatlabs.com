import { SITE } from "../../app/site.config.js";

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TryAtLabs",
  url: SITE.brandUrl,
  sameAs: []
});
