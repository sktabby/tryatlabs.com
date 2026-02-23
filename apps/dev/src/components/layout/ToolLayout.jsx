import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import "../../styles/footer.css"

import { DEV_TOOLS } from "../../app/site.config.js";

export default function ToolLayout({ children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  const items = useMemo(() => DEV_TOOLS, []);

  return (
    <div className="appShell">
      <Header open={open} setOpen={setOpen} items={items} />

      {/* overlay for mobile drawer */}
      <div className={`shellOverlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

 

      <main className="shellMain">
        <div className="pageWrap">{children}</div>

    <footer className="footer">
  <div className="footerInner">

    <div className="footerLeft">
      <div className="footerBrand">
        <span className="dot" />
        <span>{new Date().getFullYear()} TryAtLabs — Dev Tools</span>
      </div>

      <p className="footerTagline">
        Fast, privacy-focused developer utilities built for speed and simplicity.
        No tracking. No clutter. Just tools that work.
      </p>

      
    </div>

    <div className="footerRight">
      <div className="footerLinks">
        <a href="https://tryatlabs.com" target="_blank" rel="noreferrer">
          tryatlabs.com
        </a>
        <a href="/About">About</a>
        <a href="/Contact">Contact</a>
      </div>

      <button
        className="backToTop"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ Back to Top
      </button>
    </div>

  </div>
</footer>
      </main>
    </div>
  );
}
