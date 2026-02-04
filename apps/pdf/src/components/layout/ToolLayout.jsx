import { useLocation } from "react-router-dom";
import { SITE } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";

// ✅ import header & footer (no logic change)
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";

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
        {/* ✅ Header */}
        <Header />

        <main className="main">
          <div className="container">{children}</div>
        </main>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </>
  );
}
