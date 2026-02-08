import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { IMAGE_TOOLS } from "../../tools/index.jsx";
import { SITE } from "../../app/site.config.js";

export default function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc.pathname]);

  const topLinks = useMemo(() => {
    // Keep it clean + minimal
    return IMAGE_TOOLS.slice(0, 4);
  }, []);

  return (
    <header className="header">
      <div className="container header__inner">
        <NavLink to="/" className="brand" aria-label={`${SITE.brand.name} Image Tools`}>
          <span className="brand__dot" />
          <span className="brand__text">
            {SITE.brand.name}
            <span className="brand__sub">/{SITE.subdomain}</span>
          </span>
        </NavLink>

        <nav className="nav nav--desktop" aria-label="Primary">
          {topLinks.map((t) => (
            <NavLink key={t.key} to={`/${t.key}`} className="nav__link">
              {t.name}
            </NavLink>
          ))}
          <NavLink to="/" className="nav__link nav__pill">
            All Tools
          </NavLink>
        </nav>

        <button
          className={`burger ${open ? "isOpen" : ""}`}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobileMenu ${open ? "open" : ""}`}>
        <div className="container mobileMenu__inner">
          <NavLink to="/" className="mobileMenu__title">
            Image Tools
          </NavLink>

          <div className="mobileMenu__grid">
            {IMAGE_TOOLS.map((t) => (
              <NavLink key={t.key} to={`/${t.key}`} className="mobileMenu__item">
                <div className="mobileMenu__icon" aria-hidden="true">
                  {t.icon}
                </div>
                <div className="mobileMenu__txt">
                  <div className="mobileMenu__name">{t.name}</div>
                  <div className="mobileMenu__desc">{t.description}</div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
