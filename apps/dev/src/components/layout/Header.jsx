import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE } from "../../app/site.config.js";

export default function Header({ open, setOpen, items = [] }) {
  const loc = useLocation();
  const ddRef = useRef(null);
  const drawerRef = useRef(null);

  const [dd, setDd] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(true);

  useEffect(() => {
    setDd(false);
    setToolsOpen(false);
  }, [loc.pathname]);

  // Close desktop dropdown on outside click + ESC
  useEffect(() => {
    const onDown = (e) => {
      if (e.key === "Escape") {
        setDd(false);
        setOpen(false);
        setToolsOpen(false);
      }
    };

    const onClick = (e) => {
      // desktop dropdown
      if (ddRef.current && !ddRef.current.contains(e.target)) setDd(false);

      // mobile drawer outside click
      if (open && drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", onDown);
    document.addEventListener("pointerdown", onClick, { capture: true });
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("pointerdown", onClick, { capture: true });
    };
  }, [open, setOpen]);

  return (
    <>
      <header className="siteHeader">
        <div className="navContainer headerRow">
          <Link to="/" className="brand" aria-label="TryAtLabs Dev Tools Home">
            <img src={SITE.brandLogo} className="brandLogo" alt="TryAtLabs" />
            <span className="brandText">
              <span className="brandTop">TryAtLabs</span>
              <span className="brandBottom">Dev Tools</span>
            </span>
          </Link>

          {/* ✅ Desktop Navbar */}
          <nav className="navDesktop" aria-label="Primary">
            <NavLink to="/" className="navPill">
              Home
            </NavLink>

            <div className="navDropdown" ref={ddRef}>
              <button
                className="navPill navDropdownBtn"
                onClick={() => setDd((v) => !v)}
                aria-expanded={dd}
                aria-haspopup="menu"
                type="button"
              >
                <span className="navDdText">Dev Tools</span>
                <span className="caret">▾</span>
              </button>

              <div className={`navDropdownMenu ${dd ? "show" : ""}`} role="menu">
                {items.map((t) => (
                  <NavLink
                    key={t.slug}
                    to={`/tools/${t.slug}`}
                    className="dropdownLink"
                    role="menuitem"
                  >
                    <span>{t.title}</span>
                    {t.badge ? <span className="pill">{t.badge}</span> : null}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/about" className="navPill">About</NavLink>
            <NavLink to="/contact" className="navPill">Contact</NavLink>
          
            <NavLink to="/faqs" className="navPill">FAQs</NavLink>

            {/* ✅ Unique designed button at last */}
            <a
              className="navSpecial"
              href="https://tryatlabs.com"
              target="_blank"
              rel="noreferrer"
            >
              TryAtLabs.com
            </a>
          </nav>

          {/* ✅ Mobile burger */}
          <button
            className="navBurger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            type="button"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* ✅ Overlay */}
      <div className={`shellOverlay ${open ? "show" : ""}`} />

      {/* ✅ Drawer from RIGHT */}
      <aside ref={drawerRef} className={`mobileDrawer ${open ? "show" : ""}`} aria-label="Mobile menu">
        <div className="mobileDrawerHead">
          <div className="mobileDrawerTitle">Menu</div>
          <button className="mobileDrawerClose" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="mobileDrawerNav">
          <NavLink to="/" className="drawerLink">Home</NavLink>

          {/* ✅ Mobile "All Tools" dropdown */}
       

     
          <NavLink to="/about" className="drawerLink">About</NavLink>
          <NavLink to="/contact" className="drawerLink">Contact</NavLink>
          <NavLink to="/team" className="drawerLink">Team</NavLink>
          <NavLink to="/support" className="drawerLink">Support</NavLink>

          <a className="drawerLink" href="https://tryatlabs.com" target="_blank" rel="noreferrer">
            TryAtLabs.com
          </a>
        </nav>
      </aside>

      {/* ✅ Component-scoped CSS */}
      <style>{`
        /* =============== NAVBAR (SOLID) =============== */
        .siteHeader{
          position: sticky;
          top:0;
          z-index:60;
          background: var(--card2);
          border-bottom: 1px solid var(--border);
        }

        .navContainer{
          max-width: var(--max);
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (max-width: 980px){
          .navContainer{ padding: 0 18px; }
        }

        .headerRow{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 12px;
          padding: 14px 14px;
        }

        .brand{ display:flex; align-items:center; gap: 10px; min-width:0; }
        .brandLogo{
          width: 40px; height: 40px;
          border-radius: 14px;
          box-shadow: var(--glow);
        }
        .brandText{ display:flex; flex-direction:column; line-height:1.05; min-width:0; }
        .brandTop{ font-weight: 950; letter-spacing: .2px; color: var(--text); }
        .brandBottom{ font-size: 12px; font-weight: 800; color: var(--muted); }

        .navDesktop{ display:flex; align-items:center; gap: 12px; }

        .navPill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--card);
          box-shadow: var(--shadow2);
          color: var(--text);
          font-weight: 900;
          transition: transform .15s ease, border-color .15s ease, background .15s ease;
          white-space: nowrap;
        }

        .navPill:hover{
          transform: translateY(-1px);
          border-color: rgba(121,78,230,0.45);
          background: rgba(121,78,230,0.10);
        }

        .navPill.active{
          border-color: rgba(121,78,230,0.55);
          box-shadow: var(--glow);
        }

        /* Dev Tools white + caret hover emphasis */
        .navDropdownBtn .navDdText{ color: #fff; }
        .caret{
          font-weight: 950;
          opacity: 0.88;
          transform: translateY(-1px);
          transition: opacity .15s ease, transform .15s ease;
          color: #fff;
        }
        .navDropdownBtn:hover .caret{
          opacity: 1;
          transform: translateY(-1px) scale(1.04);
        }

        .navDropdown{ position: relative; }
        .navDropdownBtn{
          cursor: pointer;
          user-select: none;
          outline: none;
        }

        .navDropdownMenu{
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: min(420px, 86vw);
          padding: 14px;
          border-radius: 22px;
          border: 1px solid var(--border);
          background: var(--card2); /* SOLID */
          box-shadow: var(--shadow);
          display: none;
          z-index: 100;
        }
        .navDropdownMenu.show{ display:block; }

        .dropdownLink{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 16px;
          font-weight: 900;
          color: var(--text);
          border: 1px solid transparent;
          transition: background .15s ease, transform .15s ease, border-color .15s ease;
        }
        .dropdownLink:hover{
          background: rgba(121,78,230,0.12);
          border-color: rgba(121,78,230,0.35);
          transform: translateX(2px);
        }

        /* Unique CTA button */
        .navSpecial{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid rgba(121,78,230,0.55);
          background: linear-gradient(135deg, var(--p2), var(--p1));
          color:#fff;
          font-weight: 950;
          box-shadow: var(--glow);
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .navSpecial:hover{
          transform: translateY(-1px);
          box-shadow: 0 0 0 6px rgba(121,78,230,0.16), 0 18px 80px rgba(121,78,230,0.14);
        }

        .navBurger{
          display:none;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--card);
          box-shadow: var(--shadow2);
          cursor: pointer;
          color: #fff;
        }
        .navBurger svg{
          width: 26px;
          height: 26px;
          stroke: #fff;
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
        }

        @media (max-width: 980px){
          .navDesktop{ display:none; }
          .navBurger{ display:grid; place-items:center; }
        }

        /* =============== DRAWER + OVERLAY =============== */
        .shellOverlay{
          position:fixed;
          inset:0;
          background:#000;
          opacity:0;
          pointer-events:none;
          transition: opacity .2s ease;
          z-index:55;
        }
        .shellOverlay.show{ opacity:0.55; pointer-events:auto; }

        .mobileDrawer{
          position: fixed;
          top: 10vh;
          right: 0;
          border-radius: 10px;
          height: fit-content;
          width: min(360px, 90vw);
          padding: 16px;
          background: var(--card2); /* SOLID */
          border-left: 1px solid var(--border);
          transform: translateX(110%);
          transition: transform .28s cubic-bezier(.22, 1, .36, 1);
          z-index: 70;
          box-shadow: -24px 0 90px rgba(0,0,0,0.55);
          display:flex;
          flex-direction:column;
        }
        .mobileDrawer.show{ transform: translateX(0); }

        .mobileDrawerHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding: 6px 6px 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .mobileDrawerTitle{ font-weight: 950; letter-spacing: -0.2px; }
        .mobileDrawerClose{
          border: 1px solid var(--border);
          background: var(--card);
          color: #fff;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 950;
        }

        .mobileDrawerNav{
          display:flex;
          flex-direction:column;
          gap: 10px;
          padding: 6px;
          overflow:hidden;
        }

        .drawerLink{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding: 12px 12px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--card);
          box-shadow: var(--shadow2);
          font-weight: 900;
          color: #fff;
        }

        .drawerDropBtn{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding: 12px 12px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: var(--card);
          box-shadow: var(--shadow2);
          font-weight: 950;
          color:#fff;
          cursor:pointer;
        }

        .drawerCaret{
          transition: transform .18s ease, opacity .18s ease;
          opacity: .9;
        }
        .drawerCaret.open{ transform: rotate(180deg); opacity: 1; }

        .drawerToolsWrap{
          display:none;
          margin-top: -4px;
          padding: 10px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.10);
          background: #140e24;
        }
        .drawerToolsWrap.show{ display:block; }

        .drawerToolsScroll{
          max-height: 260px;
          overflow:auto;
          display:flex;
          flex-direction:column;
          gap: 8px;
          padding-right: 4px;
        }

        .drawerToolsScroll::-webkit-scrollbar{ width: 6px; }
        .drawerToolsScroll::-webkit-scrollbar-thumb{
          background: rgba(121,78,230,0.65);
          border-radius: 8px;
        }

        @media (min-width: 981px){
          .shellOverlay{ display:none; }
          .mobileDrawer{ display:none; }
        }
      `}</style>
    </>
  );
}