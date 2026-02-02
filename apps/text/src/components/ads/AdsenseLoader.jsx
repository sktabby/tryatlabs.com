import { useEffect } from "react";
import { ADS } from "../../app/site.config.js";

export default function AdsenseLoader() {
  useEffect(() => {
    if (!ADS.enabled) return;
    if (!ADS.client) return;

    // Prevent duplicate script
    const id = "adsense-js";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      ADS.client
    )}`;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }, []);

  return null;
}
