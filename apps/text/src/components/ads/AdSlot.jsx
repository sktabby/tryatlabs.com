import React, { useEffect, useRef } from "react";
import { ADSENSE } from "../../app/site.config.js";

export default function AdSlot({
  slot = "",
  format = "auto",
  layout = "",
  layoutKey = "",
  className = ""
}) {
  const ref = useRef(null);
  const enabled = Boolean(ADSENSE.client && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      // push once per mount
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, [enabled]);

  if (!enabled) {
    // Premium-looking placeholder while waiting for AdSense approval
    return (
      <div className={`adPlaceholder ${className}`}>
        <div className="adPhTop">Ad space</div>
        <div className="adPhBottom">Will appear after AdSense approval</div>
      </div>
    );
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle adSlot ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE.client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout || undefined}
      data-ad-layout-key={layoutKey || undefined}
      data-full-width-responsive="true"
    />
  );
}
