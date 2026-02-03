import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { SITE } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";

// ✅ In Vite: files in /public are served at "/"
const LOGO_SRC = "/assets/tryatlabs-pdf-logo.jpg";

export default function ToolLayout({ children }) {
  const { pathname } = useLocation();

  const cleanPath =
    pathname === "/" ? "Home" : pathname.replace("/", "").replace(/-/g, " ");

  const title =
    pathname === "/"
      ? `${SITE.name} — Browser PDF Tools`
      : `${SITE.name} — ${cleanPath}`;

  return (
    <>
      <SeoHead title={title} />

      <div className="appShell">
        <header className="topbar">
          <div className="container topbar__inner">
            <Link to="/" className="brand" aria-label="TryAtLabs PDF home">
              {/* ✅ LOGO */}
              <img
                src={LOGO_SRC}
                alt="TryAtLabs PDF"
                className="brand__logo"
                width={46}          // ✅ bigger
                height={46}         // ✅ bigger
                loading="eager"
                decoding="async"
                style={{
                  borderRadius: 12,
                  objectFit: "cover",
                  marginRight: 10,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <span className="brand__text">
                <b>TryAtLabs</b> <span className="muted">PDF</span>
              </span>
            </Link>

            <div className="topbar__right">
              <span className="pill">
                <Sparkles size={16} />
                Privacy-first
              </span>

              <a
                className="btn btn--ghost"
                href="https://tryatlabs.com"
                target="_blank"
                rel="noreferrer"
              >
                Main Site
              </a>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="container">{children}</div>
        </main>

        <footer className="footer">
          <div className="container footer__inner">
            <p className="muted">
              © {new Date().getFullYear()} TryAtLabs — PDF tools run in your browser (no uploads).
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
