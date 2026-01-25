import { useEffect } from "react";
import { ENV } from "../constants/env.js";

export function AdsProvider({ children }) {
  useEffect(() => {
    // Only load after AdSense approval + only in production
    if (!ENV.IS_PROD) return;
    if (!ENV.ADSENSE_CLIENT) return;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ENV.ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }, []);

  return children;
}
