// src/components/Header.jsx
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ✅ In Vite: files in /public are served at "/"
const LOGO_SRC = "/assets/tryatlabs-pdf-logo.jpg";

export default function Header() {
  const { pathname } = useLocation();
  const wrapRef = useRef(null);

  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside click + ESC
  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      const panel = wrapRef.current?.querySelector(".mDrawer__panel");
      if (panel && !panel.contains(e.target)) setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);

    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [open]);

  return (
    <header className="topbar" ref={wrapRef}>
      <div className="container topbar__inner">
        <Link to="/" className="brand" aria-label="TryAtLabs PDF home">
          <img
            src={LOGO_SRC}
            alt="TryAtLabs PDF"
            className="brand__logo"
            width={46}
            height={46}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="brand__text">
            <b>TryAtLabs</b> <span className="muted">PDF</span>
          </span>
        </Link>

        {/* ✅ Desktop nav */}
        <nav className="navDesk" aria-label="Primary navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`}
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `navItem ${isActive ? "navItem--active" : ""}`}
          >
            Contact
          </NavLink>
        </nav>

        <div className="topbar__right">
          {/* ✅ only one main site button on desktop */}
          <a
            className="btn btn--primary mainSiteBtn"
            href="https://tryatlabs.com"
            target="_blank"
            rel="noreferrer"
          >
            Main Site <ArrowRight size={16} />
          </a>

          {/* Mobile menu button */}
          <button
            className="mobileMenuBtn"
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ✅ MOBILE SIDE DRAWER */}
      {open && (
        <div className="mDrawer" aria-label="Mobile navigation overlay">
          <div className="mDrawer__panel" role="dialog" aria-label="Mobile navigation">
            <div className="mDrawer__top">
              <div className="mDrawer__title">Menu</div>
              <button
                className="mDrawer__close"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mDrawer__content">
              <Link className="mItem" to="/" onClick={() => setOpen(false)}>
                Home
              </Link>

              <Link className="mItem" to="/about" onClick={() => setOpen(false)}>
                About
              </Link>

              <Link className="mItem" to="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>

              <a
                className="mItem mItem--main"
                href="https://tryatlabs.com"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
              >
                Main Site <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Header-only CSS */}
      <style>{`
        .navDesk{
          display:flex;
          align-items:center;
          gap: 14px;
        }
        .navItem{
          font-weight: 900;
          font-size: 13px;
          color: var(--text);
          opacity: .92;
          padding: 10px 6px;
          border-radius: 12px;
          transition: opacity .12s ease, transform .12s ease;
          display:inline-flex;
          align-items:center;
          gap: 6px;
          white-space: nowrap;
        }
        .navItem:hover{
          opacity: 1;
          transform: translateY(-1px);
        }
        .navItem--active{
          opacity: 1;
        }

        .mainSiteBtn{
          display:inline-flex;
          align-items:center;
          gap: 8px;
          white-space: nowrap;
        }

        .mobileMenuBtn{
          display:none;
          width:40px;
          height:40px;
          border-radius:14px;
          border:1px solid var(--border);
          background:#fff;
          color:#0c1222;
          box-shadow: var(--shadow);
          cursor:pointer;
          align-items:center;
          justify-content:center;
        }

        .mDrawer{
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483000 !important;
          background: rgba(17,24,39,.38) !important;
          backdrop-filter: blur(6px) !important;
          animation: fadeIn .14s ease;
        }
        @keyframes fadeIn{ from{ opacity: 0; } to{ opacity: 1; } }

        .mDrawer__panel{
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          height: 100vh !important;
          width: min(360px, 86vw) !important;
          background: #fff !important;
          border-left: 1px solid rgba(17,24,39,.10) !important;
          box-shadow: -22px 0 60px rgba(17,24,39,.16) !important;
          padding: 14px 14px 18px !important;
          display:flex !important;
          flex-direction: column !important;
          animation: slideIn .18s ease;
        }
        @keyframes slideIn{
          from{ transform: translateX(16px); opacity: .6; }
          to{ transform: translateX(0); opacity: 1; }
        }

        .mDrawer__top{
          display:flex;
          align-items:center;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(17,24,39,.10);
        }
        .mDrawer__title{
          font-weight: 950;
          font-size: 16px;
          letter-spacing: -0.02em;
          color:#0c1222;
        }
        .mDrawer__close{
          width: 40px;
          height: 40px;
          border-radius: 14px;
          border: 1px solid rgba(17,24,39,.10);
          background: #fff;
          color:#0c1222;
          box-shadow: 0 14px 40px rgba(17,24,39,.10);
          cursor:pointer;
          display:grid;
          place-items:center;
        }

        .mDrawer__content{
          padding-top: 12px;
          overflow:auto;
          display:grid;
          gap: 10px;
        }

        .mItem{
          border: 1px solid rgba(17,24,39,.10);
          border-radius: 16px;
          padding: 12px 12px;
          font-weight: 900;
          color:#0c1222;
          background: rgba(255,255,255,.96);
          text-align:center;
          transition: transform .12s ease, border-color .12s ease, background .12s ease;
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 8px;
        }
        .mItem:hover{
          transform: translateY(-1px);
          border-color: color-mix(in srgb, var(--p1) 55%, rgba(17,24,39,.10));
          background: linear-gradient(135deg, rgba(255,255,255,1), color-mix(in srgb, var(--p4) 35%, #fff));
        }
        .mItem--main{
          background: linear-gradient(135deg, var(--p1), var(--p5));
          color:#0c1222;
          border-color: color-mix(in srgb, var(--p1) 55%, rgba(17,24,39,.10));
          box-shadow: 0 16px 40px rgba(17,24,39,.12);
        }

        @media (max-width: 980px){
          .navDesk{ display:none; }
          .mobileMenuBtn{ display:inline-flex; }
          .mainSiteBtn{ display:none; }
        }
      `}</style>
    </header>
  );
}
