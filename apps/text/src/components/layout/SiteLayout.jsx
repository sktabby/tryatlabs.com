import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { SITE } from "../../app/site.config.js";

export default function SiteLayout() {
  const loc = useLocation();
  const canonical = `${SITE.url}${loc.pathname}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [loc.pathname]);

  return (
    <>
      <SeoHead
        title={loc.pathname === "/" ? SITE.name : `${SITE.shortName} • TryAtLabs`}
        description={SITE.description}
        canonical={canonical}
      />
      <div className="appShell">
        <Header />
        <main className="mainWrap">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
