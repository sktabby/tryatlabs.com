import { useEffect } from "react";
import { ENV } from "../constants/env.js";

function loadScript(src) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
  return s;
}

export function AnalyticsProvider({ children }) {
  useEffect(() => {
    if (!ENV.IS_PROD) return;
    if (!ENV.GA_MEASUREMENT_ID) return;

    // gtag loader
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${ENV.GA_MEASUREMENT_ID}`);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", ENV.GA_MEASUREMENT_ID, { anonymize_ip: true });
  }, []);

  return children;
}
