import React, { useEffect } from "react";
import { ADSENSE } from "../../app/site.config.js";

function injectAdSense(client) {
  if (!client) return;
  if (document.querySelector('script[data-adsbygoogle="true"]')) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    client
  )}`;
  s.crossOrigin = "anonymous";
  s.dataset.adsbygoogle = "true";
  document.head.appendChild(s);
}

export default function AdsProvider({ children }) {
  useEffect(() => {
    // Load only when client exists (after approval you set env)
    injectAdSense(ADSENSE.client);
  }, []);

  return children;
}
