import { SITE } from "../app/site.config.js";

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function SeoHead({
  title,
  description,
  path = "/",
  image = "/assets/og-default.png",
  jsonLd = null
}) {
  const fullTitle = title ? `${title} — ${SITE.productName}` : `${SITE.productName} ${SITE.appName}`;
  const url = `${SITE.origin}${path.startsWith("/") ? path : `/${path}`}`;
  const ogImage = image.startsWith("http") ? image : `${SITE.origin}${image}`;

  // Minimal head injection without extra deps
  // (Vite will keep this stable in SPA; it’s fine for your use-case + AdSense + indexing)
  document.title = fullTitle;

  const upsert = (selector, elFactory) => {
    const existing = document.head.querySelector(selector);
    if (existing) return existing;
    const el = elFactory();
    document.head.appendChild(el);
    return el;
  };

  upsert(`meta[name="description"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("name", "description");
    return m;
  }).setAttribute("content", description || "");

  upsert(`link[rel="canonical"]`, () => {
    const l = document.createElement("link");
    l.setAttribute("rel", "canonical");
    return l;
  }).setAttribute("href", url);

  const setOg = (prop, content) => {
    upsert(`meta[property="${prop}"]`, () => {
      const m = document.createElement("meta");
      m.setAttribute("property", prop);
      return m;
    }).setAttribute("content", content);
  };

  setOg("og:type", "website");
  setOg("og:title", fullTitle);
  setOg("og:description", description || "");
  setOg("og:url", url);
  setOg("og:image", ogImage);

  const setTw = (name, content) => {
    upsert(`meta[name="${name}"]`, () => {
      const m = document.createElement("meta");
      m.setAttribute("name", name);
      return m;
    }).setAttribute("content", content);
  };

  setTw("twitter:card", "summary_large_image");
  setTw("twitter:title", fullTitle);
  setTw("twitter:description", description || "");
  setTw("twitter:image", ogImage);

  if (jsonLd) {
    const id = "jsonld-main";
    const script = upsert(`script#${id}`, () => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = id;
      return s;
    });
    script.text = escapeHtml(JSON.stringify(jsonLd));
  }

  return null;
}
