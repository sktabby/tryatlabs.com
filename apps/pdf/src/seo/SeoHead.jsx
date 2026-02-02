import { useEffect } from "react";
import { SITE } from "../app/site.config.js";

function setOrUpdateMeta(attr, key, value) {
  if (value === undefined || value === null || value === "") return;
  const selector = attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", String(value));
}

function setCanonical(href) {
  if (!href) return;
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function absoluteUrl(maybePathOrUrl) {
  if (!maybePathOrUrl) return "";
  if (/^https?:\/\//i.test(maybePathOrUrl)) return maybePathOrUrl;
  const path = maybePathOrUrl.startsWith("/") ? maybePathOrUrl : `/${maybePathOrUrl}`;
  return `${SITE.url}${path}`;
}

function setJsonLd(id, obj) {
  if (!obj) return;
  let el = document.head.querySelector(`script[data-jsonld="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-jsonld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

function removeJsonLd(ids = []) {
  ids.forEach((id) => {
    const el = document.head.querySelector(`script[data-jsonld="${id}"]`);
    if (el) el.remove();
  });
}

export function SeoHead({
  title,
  description,
  canonical,
  ogImage,
  robots = "index,follow",
  keywords,
  jsonLd = {},
}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE.brandName}` : SITE.brandName;
    const desc = description || SITE.description;
    const url = canonical || SITE.url;
    const og = absoluteUrl(ogImage || SITE.defaultOgImage);

    document.title = pageTitle;
    setCanonical(url);

    // Basic SEO
    setOrUpdateMeta("name", "description", desc);
    setOrUpdateMeta("name", "robots", robots);
    setOrUpdateMeta("name", "keywords", keywords); // ✅ added

    // Open Graph
    setOrUpdateMeta("property", "og:title", pageTitle);
    setOrUpdateMeta("property", "og:description", desc);
    setOrUpdateMeta("property", "og:url", url);
    setOrUpdateMeta("property", "og:type", "website");
    setOrUpdateMeta("property", "og:site_name", SITE.name);
    setOrUpdateMeta("property", "og:image", og);

    // Twitter
    setOrUpdateMeta("name", "twitter:card", "summary_large_image");
    setOrUpdateMeta("name", "twitter:title", pageTitle);
    setOrUpdateMeta("name", "twitter:description", desc);
    setOrUpdateMeta("name", "twitter:image", og);

    // JSON-LD
    const ids = Object.keys(jsonLd || {});
    ids.forEach((id) => setJsonLd(id, jsonLd[id]));

    return () => removeJsonLd(ids);
  }, [title, description, canonical, ogImage, robots, keywords, jsonLd]);

  return null;
}
