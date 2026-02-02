import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  return (
    <>
      <header className="siteHeader">
        <div className="container headerRow">
          <Link to="/" className="brand">
            <img src="/assets/logo.png" className="brandLogo" alt="TryAtLabs" />
            <span className="brandText">
              <span className="brandTop">TryAtLabs</span>
              <span className="brandBottom">Text Tools</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {/* Desktop Nav */}
          <nav className="navDesktop">
            <NavLink to="/" className="navLink">Home</NavLink>

            <div className="navDropdown">
              <span className="navLink navDropdownBtn">Text Tools</span>

              <div className="navDropdownMenu">
                <NavLink to="/tools/word-counter" className="dropdownLink">Word Counter</NavLink>
                <NavLink to="/tools/text-case-converter" className="dropdownLink">Case Converter</NavLink>
                <NavLink to="/tools/remove-extra-spaces" className="dropdownLink">Remove Spaces</NavLink>
                <NavLink to="/tools/slug-generator" className="dropdownLink">Slug Generator</NavLink>
                <NavLink to="/tools/markdown-preview" className="dropdownLink">Markdown Preview</NavLink>
                <NavLink to="/tools/email-extractor" className="dropdownLink">Email Extractor</NavLink>
                <NavLink to="/tools/find-replace-remove-duplicates" className="dropdownLink">Find & Replace</NavLink>
              </div>
            </div>

            <a className="navLink" href="https://tryatlabs.com" target="_blank" rel="noreferrer">
             tryatlabs.com
            </a>
          </nav>


          {/* Mobile Burger */}
          <button className="navBurger" onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24">
              <path d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      <div className={`navOverlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />

      {/* Drawer */}
      <aside className={`navDrawer ${open ? "show" : ""}`}>
        <div className="drawerHead">
          <button className="drawerClose" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="drawerNav">
          <NavLink to="/" className="drawerLink">Home</NavLink>

          <NavLink to="/tools/word-counter" className="drawerLink">Word Counter</NavLink>
          <NavLink to="/tools/text-case-converter" className="drawerLink">Case Converter</NavLink>
          <NavLink to="/tools/remove-extra-spaces" className="drawerLink">Remove Spaces</NavLink>
          <NavLink to="/tools/email-extractor" className="drawerLink">Email Extractor</NavLink>
          <NavLink to="/tools/find-replace-remove-duplicates" className="drawerLink">Find & Replace</NavLink>

          <a className="drawerLink" href="https://tryatlabs.com" target="_blank" rel="noreferrer">
           tryatlabs.com
          </a>
        </nav>
      </aside>

      {/* CSS INLINE */}
      <style>{`
        .siteHeader {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--card);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(10px);
        }

        .headerRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brandLogo {
          width: 36px;
          height: 36px;
          border-radius: 10px;
        }

        .brandTop {
          font-weight: 950;
          color: var(--text);
        }

        .brandBottom {
          font-size: 12px;
          color: var(--muted);
        }

        .navDesktop {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .navLink {
          padding: 8px 12px;
          font-weight: 800;
          border-radius: 12px;
          color: var(--muted);
          transition: background .18s ease, color .18s ease, transform .18s ease;
          white-space: nowrap;
        }

        .navLink:hover {
          background: color-mix(in srgb, var(--p1) 18%, transparent);
          color: var(--text);
          transform: translateY(-1px);
        }

        /* Burger visible in light color */
        .navBurger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text);
          padding: 6px;
          border-radius: 12px;
          transition: background .18s ease, transform .18s ease;
        }

        .navBurger:hover {
          background: color-mix(in srgb, var(--p1) 14%, transparent);
        }

        .navBurger:active {
          transform: scale(0.96);
        }

        .navBurger svg {
          width: 26px;
          height: 26px;
          stroke: currentColor;
          stroke-width: 2.2;
          fill: none;
          stroke-linecap: round;
        }

        /* Overlay: smooth fade */
        .navOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity .22s ease;
          z-index: 55;
        }

        .navOverlay.show {
          opacity: 1;
          pointer-events: auto;
        }

        /* Drawer: pro slide + shadow + blur */
        .navDrawer {
          position: fixed;
          right: 0;
          top: 0;
          height: 100vh;
          width: min(320px, 86vw);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          border-left: 1px solid var(--border);
          transform: translateX(110%);
          transition: transform .28s cubic-bezier(.22, 1, .36, 1);
          padding: 14px;
          z-index: 60;
          box-shadow: -24px 0 80px rgba(0,0,0,0.35);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }

        .navDrawer.show {
          transform: translateX(0);
        }

        .drawerHead {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 14px;
        }

        .drawerClose {
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          width: 40px;
          height: 40px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 900;
          transition: background .18s ease, transform .18s ease, border-color .18s ease;
        }

        .drawerClose:hover {
          background: color-mix(in srgb, var(--p1) 14%, transparent);
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
        }

        .drawerClose:active {
          transform: scale(0.96);
        }

        .drawerNav {
          display: grid;
          gap: 10px;
        }

        .drawerLink {
          display: block;
          padding: 12px;
          border-radius: 14px;
          font-weight: 900;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 88%, transparent);
          color: var(--text);
          transition: background .18s ease, transform .18s ease, border-color .18s ease;
        }

        .drawerLink:hover {
          background: color-mix(in srgb, var(--p1) 20%, transparent);
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
          transform: translateY(-1px);
        }

        @media (max-width: 760px) {
          .navDesktop { display: none; }
          .navBurger { display: block; }
        }

        /* =========================
   Desktop Dropdown
========================= */

.navDropdown {
  position: relative;
}

.navDropdownBtn {
  cursor: pointer;
  user-select: none;
}

.navDropdownMenu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  padding: 10px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--card) 96%, transparent);
  border: 1px solid var(--border);
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  backdrop-filter: blur(10px);
  display: none;
  z-index: 80;
}

.navDropdown:hover .navDropdownMenu {
  display: block;
}

.dropdownLink {
  display: block;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 850;
  color: var(--text);
  transition: background .16s ease, transform .16s ease;
}

.dropdownLink:hover {
  background: color-mix(in srgb, var(--p1) 18%, transparent);
  transform: translateX(2px);
}

/* Hide dropdown on mobile (drawer already handles tools) */
@media (max-width: 760px) {
  .navDropdown {
    display: none;
  }
}

      `}</style>
    </>
  );
}
