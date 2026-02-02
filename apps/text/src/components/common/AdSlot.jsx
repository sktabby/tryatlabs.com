import { useEffect, useMemo, useRef } from "react";
import { ADS } from "../../app/site.config.js";

/**
 * AdSense ad slot wrapper
 * - In dev or when not approved: shows a premium "placeholder ad" box.
 * - After approval: renders <ins class="adsbygoogle"> and pushes.
 */
export default function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style = {}
}) {
  const ref = useRef(null);

  const showPlaceholder = useMemo(() => {
    // If ads disabled or missing ids, show placeholder.
    if (!ADS.enabled) return true;
    if (!ADS.client || !slot) return true;
    return false;
  }, [slot]);

  useEffect(() => {
    if (showPlaceholder) return;
    // Push only when the ins is in DOM
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, [showPlaceholder, slot]);

  if (showPlaceholder) {
    return (
      <div className={`adBox ${className}`} style={style}>
        <div className="adBox__badge">Ad</div>
        <div className="adBox__title">Sponsored space</div>
        <div className="adBox__hint">This area becomes an AdSense unit after approval.</div>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS.client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
