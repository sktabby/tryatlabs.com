import { BRAND } from "./brand.js";

export const SEO_DEFAULTS = {
  title: `${BRAND.name} — Fast, Free Online Tools`,
  description:
    "TryAtLabs is a privacy-first toolkit platform offering browser-based utilities like PDF, image, and text tools. Fast, secure, and easy to use.",
  canonical: BRAND.baseUrl,
  og: {
    type: "website",
    image: BRAND.ogImage
  }
};
