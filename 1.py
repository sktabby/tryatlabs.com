from pathlib import Path

ROOT = Path("tryatlabs")

# --------------------------
# DIRECTORIES (same structure)
# --------------------------
DIRS = [
    "apps/main/public/assets/icons",
    "apps/main/src/app/constants",
    "apps/main/src/app/providers",
    "apps/main/src/routes",
    "apps/main/src/pages",
    "apps/main/src/components/layout",
    "apps/main/src/components/common",
    "apps/main/src/seo/JsonLd",
    "apps/main/src/lib/analytics",
    "apps/main/src/lib/storage",
    "apps/main/src/styles",
    "apps/main/scripts",

    "apps/tools/public/assets",
    "apps/tools/src/app",
    "apps/tools/src/routes",
    "apps/tools/src/data",
    "apps/tools/src/pages/Home",
    "apps/tools/src/pages/Category",
    "apps/tools/src/pages/Tool",
    "apps/tools/src/pages/Static",
    "apps/tools/src/tools/shared",
    "apps/tools/src/tools/pdf-to-jpg",
    "apps/tools/src/tools/jpg-png-to-pdf",
    "apps/tools/src/tools/image-resize",
    "apps/tools/src/tools/image-compress",
    "apps/tools/src/tools/text-case-converter",
    "apps/tools/src/tools/word-counter",
    "apps/tools/src/tools/qr-generator",
    "apps/tools/src/tools/uuid-generator",
    "apps/tools/src/workers",
    "apps/tools/src/seo/JsonLd",
    "apps/tools/src/components/layout",
    "apps/tools/src/components/common",
    "apps/tools/src/components/ads",
    "apps/tools/src/lib/analytics",
    "apps/tools/src/lib/storage",
    "apps/tools/src/styles",
    "apps/tools/scripts",

    "apps/pdf/public",
    "apps/pdf/src/app",
    "apps/pdf/src/routes",
    "apps/pdf/src/data",
    "apps/pdf/src/pages",
    "apps/pdf/src/tools/shared",
    "apps/pdf/src/tools/merge-pdf",
    "apps/pdf/src/tools/split-pdf",
    "apps/pdf/src/tools/compress-pdf",
    "apps/pdf/src/tools/rotate-pages",
    "apps/pdf/src/tools/reorder-pages",
    "apps/pdf/src/tools/extract-pages",
    "apps/pdf/src/tools/add-watermark",
    "apps/pdf/src/tools/add-page-numbers",
    "apps/pdf/src/workers",
    "apps/pdf/src/seo",
    "apps/pdf/src/components",
    "apps/pdf/src/styles",
    "apps/pdf/scripts",

    "apps/image/public",
    "apps/image/src/app",
    "apps/image/src/routes",
    "apps/image/src/data",
    "apps/image/src/pages",
    "apps/image/src/tools/shared",
    "apps/image/src/tools/resize-image",
    "apps/image/src/tools/compress-image",
    "apps/image/src/tools/convert-image",
    "apps/image/src/tools/crop-image",
    "apps/image/src/tools/batch-processor",
    "apps/image/src/tools/social-presets",
    "apps/image/src/canvas",
    "apps/image/src/workers",
    "apps/image/src/seo",
    "apps/image/src/components",
    "apps/image/src/styles",
    "apps/image/scripts",

    "apps/text/public",
    "apps/text/src/app",
    "apps/text/src/routes",
    "apps/text/src/data",
    "apps/text/src/pages",
    "apps/text/src/tools/shared",
    "apps/text/src/tools/case-converter",
    "apps/text/src/tools/word-counter",
    "apps/text/src/tools/remove-spaces",
    "apps/text/src/tools/slug-generator",
    "apps/text/src/tools/markdown-preview",
    "apps/text/src/tools/diff-checker",
    "apps/text/src/utils",
    "apps/text/src/seo",
    "apps/text/src/components",
    "apps/text/src/styles",
    "apps/text/scripts",

    "apps/dev/public",
    "apps/dev/src/app",
    "apps/dev/src/routes",
    "apps/dev/src/data",
    "apps/dev/src/pages",
    "apps/dev/src/tools/shared",
    "apps/dev/src/tools/base64-tool",
    "apps/dev/src/tools/jwt-decoder",
    "apps/dev/src/tools/hash-generator",
    "apps/dev/src/tools/uuid-generator",
    "apps/dev/src/tools/timestamp-generator",
    "apps/dev/src/tools/url-encode-decode",
    "apps/dev/src/crypto",
    "apps/dev/src/seo",
    "apps/dev/src/components",
    "apps/dev/src/styles",
    "apps/dev/scripts",

    "packages/core-ui/src/layout",
    "packages/core-ui/src/ui",
    "packages/core-ui/src/common",
    "packages/core-ui/src/theme",

    "packages/core-seo/src/JsonLd",
    "packages/core-seo/src/build",

    "packages/core-ads/src",
    "packages/core-utils/src/registry",
    "packages/core-utils/src/file",
    "packages/core-utils/src/perf",
    "packages/core-utils/src/strings",

    "configs",
    "scripts",
    "docs",
]

# --------------------------
# FILES (same structure, but fix the invalid "a / b" line)
# --------------------------
FILES = [
    ".env.example",
    ".gitignore",
    ".editorconfig",
    "eslint.config.js",
    "prettier.config.js",
    "package.json",
    "README.md",

    # IMPORTANT FIX: create both as separate files (Windows-safe)
    "pnpm-workspace.yaml",
    "yarn-workspaces",

    # main app (important)
    "apps/main/index.html",
    "apps/main/vite.config.js",
    "apps/main/package.json",
    "apps/main/README.md",
    "apps/main/.env",
    "apps/main/public/favicon.ico",
    "apps/main/public/robots.txt",
    "apps/main/public/sitemap.xml",
    "apps/main/public/ads.txt",
    "apps/main/public/assets/logo.svg",
    "apps/main/public/assets/og-default.png",
    "apps/main/public/assets/icons/apple-touch-icon.png",
    "apps/main/public/assets/icons/icon-192.png",
    "apps/main/src/app/App.jsx",
    "apps/main/src/app/main.jsx",
    "apps/main/src/app/constants/brand.js",
    "apps/main/src/app/constants/urls.js",
    "apps/main/src/app/constants/seoDefaults.js",
    "apps/main/src/app/constants/env.js",
    "apps/main/src/app/providers/HelmetProvider.jsx",
    "apps/main/src/app/providers/AnalyticsProvider.jsx",
    "apps/main/src/app/providers/AdsProvider.jsx",
    "apps/main/src/routes/router.jsx",
    "apps/main/src/pages/Home.jsx",
    "apps/main/src/pages/Ecosystem.jsx",
    "apps/main/src/pages/Labs.jsx",
    "apps/main/src/pages/Studio.jsx",
    "apps/main/src/pages/Partnerships.jsx",
    "apps/main/src/pages/Talent.jsx",
    "apps/main/src/pages/Contact.jsx",
    "apps/main/src/pages/Privacy.jsx",
    "apps/main/src/pages/Terms.jsx",
    "apps/main/src/pages/NotFound.jsx",
    "apps/main/src/components/layout/Header.jsx",
    "apps/main/src/components/layout/Footer.jsx",
    "apps/main/src/components/layout/SiteLayout.jsx",
    "apps/main/src/seo/SeoHead.jsx",
    "apps/main/src/lib/analytics/subdomainRedirect.js",
    "apps/main/src/styles/globals.css",
    "apps/main/src/styles/main-theme.css",

    # tools app (important)
    "apps/tools/index.html",
    "apps/tools/vite.config.js",
    "apps/tools/package.json",
    "apps/tools/README.md",
    "apps/tools/public/favicon.ico",
    "apps/tools/public/robots.txt",
    "apps/tools/public/sitemap.xml",
    "apps/tools/public/ads.txt",
    "apps/tools/public/assets/logo.svg",
    "apps/tools/public/assets/og-default.png",
    "apps/tools/src/app/App.jsx",
    "apps/tools/src/app/main.jsx",
    "apps/tools/src/app/site.config.js",
    "apps/tools/src/routes/router.jsx",
    "apps/tools/src/components/layout/ToolLayout.jsx",
    "apps/tools/src/pages/Home/Home.jsx",
    "apps/tools/src/pages/Category/Category.jsx",
    "apps/tools/src/pages/Tool/Tool.jsx",
    "apps/tools/src/pages/NotFound.jsx",
    "apps/tools/src/pages/Static/About.jsx",
    "apps/tools/src/pages/Static/Privacy.jsx",
    "apps/tools/src/pages/Static/Terms.jsx",
    "apps/tools/src/pages/Static/Contact.jsx",
    "apps/tools/src/seo/SeoHead.jsx",
    "apps/tools/src/styles/globals.css",
    "apps/tools/src/styles/tools-theme.css",

    # minimal placeholders for other apps so you can extend later
    "apps/pdf/index.html",
    "apps/pdf/vite.config.js",
    "apps/pdf/package.json",
    "apps/pdf/src/app/App.jsx",
    "apps/pdf/src/app/main.jsx",
    "apps/pdf/src/app/site.config.js",
    "apps/pdf/src/routes/router.jsx",
    "apps/pdf/src/pages/Home.jsx",
    "apps/pdf/src/pages/ToolPage.jsx",
    "apps/pdf/src/pages/NotFound.jsx",
    "apps/pdf/src/seo/SeoHead.jsx",

    "apps/image/index.html",
    "apps/image/vite.config.js",
    "apps/image/package.json",
    "apps/image/src/app/App.jsx",
    "apps/image/src/app/main.jsx",
    "apps/image/src/app/site.config.js",
    "apps/image/src/routes/router.jsx",
    "apps/image/src/pages/Home.jsx",
    "apps/image/src/pages/ToolPage.jsx",
    "apps/image/src/pages/NotFound.jsx",

    "apps/text/index.html",
    "apps/text/vite.config.js",
    "apps/text/package.json",
    "apps/text/src/app/App.jsx",
    "apps/text/src/app/main.jsx",
    "apps/text/src/app/site.config.js",
    "apps/text/src/routes/router.jsx",
    "apps/text/src/pages/Home.jsx",
    "apps/text/src/pages/ToolPage.jsx",
    "apps/text/src/pages/NotFound.jsx",

    "apps/dev/index.html",
    "apps/dev/vite.config.js",
    "apps/dev/package.json",
    "apps/dev/src/app/App.jsx",
    "apps/dev/src/app/main.jsx",
    "apps/dev/src/app/site.config.js",
    "apps/dev/src/routes/router.jsx",
    "apps/dev/src/pages/Home.jsx",
    "apps/dev/src/pages/ToolPage.jsx",
    "apps/dev/src/pages/NotFound.jsx",
]

# --------------------------
# CONTENT FOR IMPORTANT FILES
# --------------------------
MAIN_INDEX_HTML = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/app/main.jsx"></script>
  </body>
</html>
"""

VITE_CONFIG = """import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
"""

MAIN_PKG = """{
  "name": "@tryatlabs/main",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.26.2",
    "react-helmet-async": "^2.0.5"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
"""

TOOLS_PKG = MAIN_PKG.replace("@tryatlabs/main", "@tryatlabs/tools")
PDF_PKG = MAIN_PKG.replace("@tryatlabs/main", "@tryatlabs/pdf")
IMAGE_PKG = MAIN_PKG.replace("@tryatlabs/main", "@tryatlabs/image")
TEXT_PKG = MAIN_PKG.replace("@tryatlabs/main", "@tryatlabs/text")
DEV_PKG = MAIN_PKG.replace("@tryatlabs/main", "@tryatlabs/dev")

MAIN_ENV = """# Local overrides so main redirects to localhost tools while developing
VITE_TOOLS_URL=http://localhost:5174
VITE_PDF_URL=http://localhost:5175
VITE_IMAGE_URL=http://localhost:5176
VITE_TEXT_URL=http://localhost:5177
VITE_DEV_URL=http://localhost:5178
"""

MAIN_URLS = """export const URLS = {
  MAIN: "https://tryatlabs.com",
  TOOLS: "https://tools.tryatlabs.com",
  PDF: "https://pdf.tryatlabs.com",
  IMAGE: "https://image.tryatlabs.com",
  TEXT: "https://text.tryatlabs.com",
  DEV: "https://dev.tryatlabs.com",
};
"""

MAIN_ENV_JS = """export const ENV = {
  MAIN_URL: import.meta.env.VITE_MAIN_URL,
  TOOLS_URL: import.meta.env.VITE_TOOLS_URL,
  PDF_URL: import.meta.env.VITE_PDF_URL,
  IMAGE_URL: import.meta.env.VITE_IMAGE_URL,
  TEXT_URL: import.meta.env.VITE_TEXT_URL,
  DEV_URL: import.meta.env.VITE_DEV_URL,
};
"""

MAIN_BRAND = """export const BRAND = {
  name: "TryAtLabs",
  tagline: "A frontend-first ecosystem of fast tools & products.",
};
"""

MAIN_SEO_DEFAULTS = """import { BRAND } from "./brand";

export const SEO_DEFAULTS = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: "TryAtLabs is a hub for tools, PDF, image, text and developer utilities.",
};
"""

MAIN_HELMET_PROVIDER = """import React from "react";
import { HelmetProvider as Provider } from "react-helmet-async";

export default function HelmetProvider({ children }) {
  return <Provider>{children}</Provider>;
}
"""

MAIN_ANALYTICS_PROVIDER = """import React from "react";

export default function AnalyticsProvider({ children }) {
  return <>{children}</>;
}
"""

MAIN_ADS_PROVIDER = """import React from "react";

export default function AdsProvider({ children }) {
  return <>{children}</>;
}
"""

MAIN_SUBDOMAIN_REDIRECT = """import { URLS } from "../../app/constants/urls";
import { ENV } from "../../app/constants/env";

const pick = (fallback, override) => (override && override.trim() ? override : fallback);

const BASE = {
  MAIN: pick(URLS.MAIN, ENV.MAIN_URL),
  TOOLS: pick(URLS.TOOLS, ENV.TOOLS_URL),
  PDF: pick(URLS.PDF, ENV.PDF_URL),
  IMAGE: pick(URLS.IMAGE, ENV.IMAGE_URL),
  TEXT: pick(URLS.TEXT, ENV.TEXT_URL),
  DEV: pick(URLS.DEV, ENV.DEV_URL),
};

export function goTo(target, path = "/", queryString = "") {
  const base = BASE[target];
  if (!base) throw new Error(`Unknown target: ${target}`);

  const p = path.startsWith("/") ? path : `/${path}`;
  const q = queryString ? (queryString.startsWith("?") ? queryString : `?${queryString}`) : "";
  window.location.assign(`${base}${p}${q}`);
}
"""

MAIN_SEO_HEAD = """import React from "react";
import { Helmet } from "react-helmet-async";
import { SEO_DEFAULTS } from "../app/constants/seoDefaults";

function getCanonicalBase() {
  if (typeof window === "undefined") return "https://tryatlabs.com";
  return `${window.location.protocol}//${window.location.host}`;
}

export default function SeoHead({ title, description, path = "/" }) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${getCanonicalBase()}${cleanPath}`;
  const finalTitle = title || SEO_DEFAULTS.title;
  const finalDesc = description || SEO_DEFAULTS.description;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
}
"""

MAIN_ROUTER = """import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import SiteLayout from "../components/layout/SiteLayout";
import Home from "../pages/Home";
import Ecosystem from "../pages/Ecosystem";
import Labs from "../pages/Labs";
import Studio from "../pages/Studio";
import Partnerships from "../pages/Partnerships";
import Talent from "../pages/Talent";
import Contact from "../pages/Contact";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import NotFound from "../pages/NotFound";

import { goTo } from "../lib/analytics/subdomainRedirect";

function SubdomainRedirect({ target }) {
  React.useEffect(() => {
    goTo(target, "/");
  }, [target]);
  return null;
}

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/ecosystem", element: <Ecosystem /> },
      { path: "/labs", element: <Labs /> },
      { path: "/studio", element: <Studio /> },
      { path: "/partnerships", element: <Partnerships /> },
      { path: "/talent", element: <Talent /> },
      { path: "/contact", element: <Contact /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },

      { path: "/tools", element: <SubdomainRedirect target="TOOLS" /> },
      { path: "/pdf", element: <SubdomainRedirect target="PDF" /> },
      { path: "/image", element: <SubdomainRedirect target="IMAGE" /> },
      { path: "/text", element: <SubdomainRedirect target="TEXT" /> },
      { path: "/dev", element: <SubdomainRedirect target="DEV" /> },

      { path: "/home", element: <Navigate to="/" replace /> },
      { path: "*", element: <NotFound /> }
    ],
  },
]);
"""

MAIN_APP = """import React from "react";
import { RouterProvider } from "react-router-dom";
import HelmetProvider from "./providers/HelmetProvider";
import AnalyticsProvider from "./providers/AnalyticsProvider";
import AdsProvider from "./providers/AdsProvider";
import { router } from "../routes/router";

export default function App() {
  return (
    <HelmetProvider>
      <AnalyticsProvider>
        <AdsProvider>
          <RouterProvider router={router} />
        </AdsProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  );
}
"""

MAIN_MAIN = """import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/globals.css";
import "../styles/main-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""

MAIN_LAYOUT = """import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
"""

MAIN_HEADER = """import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid #333" }}>
      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/">Home</Link>
        <Link to="/ecosystem">Ecosystem</Link>
        <Link to="/labs">Labs</Link>
        <Link to="/studio">Studio</Link>
        <Link to="/partnerships">Partnerships</Link>
        <Link to="/talent">Talent</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}
"""

MAIN_FOOTER = """import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ padding: 16, borderTop: "1px solid #333" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </div>
    </footer>
  );
}
"""

MAIN_HOME = """import React from "react";
import SeoHead from "../seo/SeoHead";
import { goTo } from "../lib/analytics/subdomainRedirect";

export default function Home() {
  return (
    <div>
      <SeoHead title="TryAtLabs — Main Hub" path="/" />
      <h1>TryAtLabs</h1>
      <p>Select a product hub:</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => goTo("TOOLS", "/")}>Tools</button>
        <button onClick={() => goTo("PDF", "/")}>PDF</button>
        <button onClick={() => goTo("IMAGE", "/")}>Image</button>
        <button onClick={() => goTo("TEXT", "/")}>Text</button>
        <button onClick={() => goTo("DEV", "/")}>Dev</button>
      </div>
    </div>
  );
}
"""

PLACEHOLDER_PAGE = lambda title, path: f"""import React from "react";
import SeoHead from "../seo/SeoHead";

export default function Page() {{
  return (
    <div>
      <SeoHead title="{title}" path="{path}" />
      <h2>{title}</h2>
      <p>Placeholder page.</p>
    </div>
  );
}}
"""

MAIN_NOTFOUND = """import React from "react";
import SeoHead from "../seo/SeoHead";

export default function NotFound() {
  return (
    <div>
      <SeoHead title="Not Found — TryAtLabs" path="/404" />
      <h2>404 — Page not found</h2>
      <p>This page doesn’t exist.</p>
    </div>
  );
}
"""

TOOLS_SITE_CONFIG = """export const SITE = {
  name: "TryAtLabs Tools",
  canonicalBase:
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "https://tools.tryatlabs.com",
};
"""

TOOLS_SEO_HEAD = """import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE } from "../app/site.config";

export default function SeoHead({ title, description, path = "/" }) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE.canonicalBase}${p}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
    </Helmet>
  );
}
"""

TOOLS_LAYOUT = """import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function ToolLayout() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/">Tools</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </header>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
"""

TOOLS_ROUTER = """import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import ToolLayout from "../components/layout/ToolLayout";
import Home from "../pages/Home/Home";
import Category from "../pages/Category/Category";
import Tool from "../pages/Tool/Tool";
import About from "../pages/Static/About";
import Privacy from "../pages/Static/Privacy";
import Terms from "../pages/Static/Terms";
import Contact from "../pages/Static/Contact";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <ToolLayout />,
    children: [
      { path: "/", element: <Home /> },

      // legacy patterns (optional)
      { path: "/category/:category", element: <Navigate to="/:category" replace /> },
      { path: "/tool/:slug", element: <Navigate to="/general/:slug" replace /> },

      // real patterns
      { path: "/:category", element: <Category /> },
      { path: "/:category/:slug", element: <Tool /> },

      { path: "/about", element: <About /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/contact", element: <Contact /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
"""

TOOLS_APP = """import React from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "../routes/router";

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
"""

TOOLS_MAIN = """import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/globals.css";
import "../styles/tools-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""

TOOLS_HOME = """import React from "react";
import SeoHead from "../../seo/SeoHead";

export default function Home() {
  return (
    <div>
      <SeoHead title="Tools — TryAtLabs" path="/" description="Browse all tools." />
      <h1>Tools</h1>
      <p>URL format: /:category/:slug</p>
      <p>Example: /pdf/pdf-to-jpg</p>
    </div>
  );
}
"""

TOOLS_CATEGORY = """import React from "react";
import { useParams, Link } from "react-router-dom";
import SeoHead from "../../seo/SeoHead";

export default function Category() {
  const { category } = useParams();
  return (
    <div>
      <SeoHead title={`${category} Tools — TryAtLabs`} path={`/${category}`} />
      <h2>Category: {category}</h2>
      <p>Example tool link:</p>
      <Link to={`/${category}/sample-tool`}>Open sample tool</Link>
    </div>
  );
}
"""

TOOLS_TOOL = """import React from "react";
import { useParams } from "react-router-dom";
import SeoHead from "../../seo/SeoHead";

export default function Tool() {
  const { category, slug } = useParams();
  return (
    <div>
      <SeoHead title={`${slug} — TryAtLabs Tools`} path={`/${category}/${slug}`} />
      <h2>{slug}</h2>
      <p>Category: {category}</p>
      <p>This is the dynamic tool page. Later you’ll load the tool component here.</p>
    </div>
  );
}
"""

TOOLS_NOTFOUND = """import React from "react";
import { Link } from "react-router-dom";
import SeoHead from "../seo/SeoHead";

export default function NotFound() {
  return (
    <div>
      <SeoHead title="Not Found — Tools" path="/404" />
      <h2>404 — Not Found</h2>
      <Link to="/">Back to Tools Home</Link>
    </div>
  );
}
"""

TOOLS_STATIC = lambda title, path: f"""import React from "react";
import SeoHead from "../../seo/SeoHead";

export default function Page() {{
  return (
    <div>
      <SeoHead title="{title}" path="{path}" />
      <h2>{title}</h2>
      <p>Placeholder page.</p>
    </div>
  );
}}
"""

# Minimal CSS (keep simple)
CSS_GLOBAL = """body { margin: 0; font-family: system-ui, Arial, sans-serif; } a { color: inherit; } button { padding: 10px 14px; cursor: pointer; }"""

# Minimal templates for other apps (so they run later if you want)
APP_TEMPLATE = """import React from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "../routes/router";

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
"""

MAIN_TEMPLATE = """import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""

SITE_CONFIG_TEMPLATE = lambda host: f"""export const SITE = {{
  name: "TryAtLabs",
  canonicalBase:
    typeof window !== "undefined"
      ? `${{window.location.protocol}}//${{window.location.host}}`
      : "https://{host}",
}};
"""

SEO_HEAD_TEMPLATE = """import React from "react";
import { Helmet } from "react-helmet-async";
import { SITE } from "../app/site.config";

export default function SeoHead({ title, description, path = "/" }) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE.canonicalBase}${p}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
}
"""

ROUTER_SLUG_TEMPLATE = """import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ToolPage from "../pages/ToolPage";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/:slug", element: <ToolPage /> },
  { path: "*", element: <NotFound /> },
]);
"""

HOME_TEMPLATE = """import React from "react";
export default function Home(){ return <div style={{padding:24}}><h1>Home</h1><p>Placeholder.</p></div>; }
"""
TOOLPAGE_TEMPLATE = """import React from "react";
import { useParams } from "react-router-dom";
export default function ToolPage(){ const {slug}=useParams(); return <div style={{padding:24}}><h2>{slug}</h2><p>Placeholder tool page.</p></div>; }
"""
NOTFOUND_TEMPLATE = """import React from "react";
export default function NotFound(){ return <div style={{padding:24}}><h2>404</h2><p>Not found.</p></div>; }
"""

# Map file path -> content
CONTENT = {
    # root
    "README.md": "# tryatlabs\n\nMonorepo skeleton generated by bootstrap script.\n",
    "pnpm-workspace.yaml": "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
    "yarn-workspaces": "apps/*\npackages/*\n",
    ".gitignore": "node_modules/\ndist/\n.env.local\n",
    ".env.example": "VITE_TOOLS_URL=\nVITE_PDF_URL=\nVITE_IMAGE_URL=\nVITE_TEXT_URL=\nVITE_DEV_URL=\n",

    # main
    "apps/main/index.html": MAIN_INDEX_HTML,
    "apps/main/vite.config.js": VITE_CONFIG,
    "apps/main/package.json": MAIN_PKG,
    "apps/main/.env": MAIN_ENV,
    "apps/main/src/app/constants/urls.js": MAIN_URLS,
    "apps/main/src/app/constants/env.js": MAIN_ENV_JS,
    "apps/main/src/app/constants/brand.js": MAIN_BRAND,
    "apps/main/src/app/constants/seoDefaults.js": MAIN_SEO_DEFAULTS,
    "apps/main/src/app/providers/HelmetProvider.jsx": MAIN_HELMET_PROVIDER,
    "apps/main/src/app/providers/AnalyticsProvider.jsx": MAIN_ANALYTICS_PROVIDER,
    "apps/main/src/app/providers/AdsProvider.jsx": MAIN_ADS_PROVIDER,
    "apps/main/src/lib/analytics/subdomainRedirect.js": MAIN_SUBDOMAIN_REDIRECT,
    "apps/main/src/seo/SeoHead.jsx": MAIN_SEO_HEAD,
    "apps/main/src/routes/router.jsx": MAIN_ROUTER,
    "apps/main/src/app/App.jsx": MAIN_APP,
    "apps/main/src/app/main.jsx": MAIN_MAIN,
    "apps/main/src/components/layout/SiteLayout.jsx": MAIN_LAYOUT,
    "apps/main/src/components/layout/Header.jsx": MAIN_HEADER,
    "apps/main/src/components/layout/Footer.jsx": MAIN_FOOTER,
    "apps/main/src/pages/Home.jsx": MAIN_HOME,
    "apps/main/src/pages/Ecosystem.jsx": PLACEHOLDER_PAGE("Ecosystem — TryAtLabs", "/ecosystem"),
    "apps/main/src/pages/Labs.jsx": PLACEHOLDER_PAGE("Labs — TryAtLabs", "/labs"),
    "apps/main/src/pages/Studio.jsx": PLACEHOLDER_PAGE("Studio — TryAtLabs", "/studio"),
    "apps/main/src/pages/Partnerships.jsx": PLACEHOLDER_PAGE("Partnerships — TryAtLabs", "/partnerships"),
    "apps/main/src/pages/Talent.jsx": PLACEHOLDER_PAGE("Talent — TryAtLabs", "/talent"),
    "apps/main/src/pages/Contact.jsx": PLACEHOLDER_PAGE("Contact — TryAtLabs", "/contact"),
    "apps/main/src/pages/Privacy.jsx": PLACEHOLDER_PAGE("Privacy — TryAtLabs", "/privacy"),
    "apps/main/src/pages/Terms.jsx": PLACEHOLDER_PAGE("Terms — TryAtLabs", "/terms"),
    "apps/main/src/pages/NotFound.jsx": MAIN_NOTFOUND,
    "apps/main/src/styles/globals.css": CSS_GLOBAL,
    "apps/main/src/styles/main-theme.css": "/* theme placeholder */\n",

    # tools
    "apps/tools/index.html": MAIN_INDEX_HTML,
    "apps/tools/vite.config.js": VITE_CONFIG,
    "apps/tools/package.json": TOOLS_PKG,
    "apps/tools/src/app/site.config.js": TOOLS_SITE_CONFIG,
    "apps/tools/src/seo/SeoHead.jsx": TOOLS_SEO_HEAD,
    "apps/tools/src/components/layout/ToolLayout.jsx": TOOLS_LAYOUT,
    "apps/tools/src/routes/router.jsx": TOOLS_ROUTER,
    "apps/tools/src/app/App.jsx": TOOLS_APP,
    "apps/tools/src/app/main.jsx": TOOLS_MAIN,
    "apps/tools/src/pages/Home/Home.jsx": TOOLS_HOME,
    "apps/tools/src/pages/Category/Category.jsx": TOOLS_CATEGORY,
    "apps/tools/src/pages/Tool/Tool.jsx": TOOLS_TOOL,
    "apps/tools/src/pages/NotFound.jsx": TOOLS_NOTFOUND,
    "apps/tools/src/pages/Static/About.jsx": TOOLS_STATIC("About — Tools", "/about"),
    "apps/tools/src/pages/Static/Privacy.jsx": TOOLS_STATIC("Privacy — Tools", "/privacy"),
    "apps/tools/src/pages/Static/Terms.jsx": TOOLS_STATIC("Terms — Tools", "/terms"),
    "apps/tools/src/pages/Static/Contact.jsx": TOOLS_STATIC("Contact — Tools", "/contact"),
    "apps/tools/src/styles/globals.css": CSS_GLOBAL,
    "apps/tools/src/styles/tools-theme.css": "/* tools theme placeholder */\n",

    # pdf minimal runnable skeleton
    "apps/pdf/index.html": MAIN_INDEX_HTML,
    "apps/pdf/vite.config.js": VITE_CONFIG,
    "apps/pdf/package.json": PDF_PKG,
    "apps/pdf/src/app/App.jsx": APP_TEMPLATE,
    "apps/pdf/src/app/main.jsx": MAIN_TEMPLATE,
    "apps/pdf/src/app/site.config.js": SITE_CONFIG_TEMPLATE("pdf.tryatlabs.com"),
    "apps/pdf/src/routes/router.jsx": ROUTER_SLUG_TEMPLATE,
    "apps/pdf/src/pages/Home.jsx": HOME_TEMPLATE,
    "apps/pdf/src/pages/ToolPage.jsx": TOOLPAGE_TEMPLATE,
    "apps/pdf/src/pages/NotFound.jsx": NOTFOUND_TEMPLATE,
    "apps/pdf/src/seo/SeoHead.jsx": SEO_HEAD_TEMPLATE,

    # image minimal
    "apps/image/index.html": MAIN_INDEX_HTML,
    "apps/image/vite.config.js": VITE_CONFIG,
    "apps/image/package.json": IMAGE_PKG,
    "apps/image/src/app/App.jsx": APP_TEMPLATE,
    "apps/image/src/app/main.jsx": MAIN_TEMPLATE,
    "apps/image/src/app/site.config.js": SITE_CONFIG_TEMPLATE("image.tryatlabs.com"),
    "apps/image/src/routes/router.jsx": ROUTER_SLUG_TEMPLATE,
    "apps/image/src/pages/Home.jsx": HOME_TEMPLATE,
    "apps/image/src/pages/ToolPage.jsx": TOOLPAGE_TEMPLATE,
    "apps/image/src/pages/NotFound.jsx": NOTFOUND_TEMPLATE,

    # text minimal
    "apps/text/index.html": MAIN_INDEX_HTML,
    "apps/text/vite.config.js": VITE_CONFIG,
    "apps/text/package.json": TEXT_PKG,
    "apps/text/src/app/App.jsx": APP_TEMPLATE,
    "apps/text/src/app/main.jsx": MAIN_TEMPLATE,
    "apps/text/src/app/site.config.js": SITE_CONFIG_TEMPLATE("text.tryatlabs.com"),
    "apps/text/src/routes/router.jsx": ROUTER_SLUG_TEMPLATE,
    "apps/text/src/pages/Home.jsx": HOME_TEMPLATE,
    "apps/text/src/pages/ToolPage.jsx": TOOLPAGE_TEMPLATE,
    "apps/text/src/pages/NotFound.jsx": NOTFOUND_TEMPLATE,

    # dev minimal
    "apps/dev/index.html": MAIN_INDEX_HTML,
    "apps/dev/vite.config.js": VITE_CONFIG,
    "apps/dev/package.json": DEV_PKG,
    "apps/dev/src/app/App.jsx": APP_TEMPLATE,
    "apps/dev/src/app/main.jsx": MAIN_TEMPLATE,
    "apps/dev/src/app/site.config.js": SITE_CONFIG_TEMPLATE("dev.tryatlabs.com"),
    "apps/dev/src/routes/router.jsx": ROUTER_SLUG_TEMPLATE,
    "apps/dev/src/pages/Home.jsx": HOME_TEMPLATE,
    "apps/dev/src/pages/ToolPage.jsx": TOOLPAGE_TEMPLATE,
    "apps/dev/src/pages/NotFound.jsx": NOTFOUND_TEMPLATE,
}

# --------------------------
# helpers
# --------------------------
def safe_mkdir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)

def safe_touch(path: Path) -> None:
    safe_mkdir(path.parent)
    if not path.exists():
        path.write_text("", encoding="utf-8")

def write_file(rel_path: str, content: str) -> None:
    p = ROOT / rel_path
    safe_mkdir(p.parent)
    p.write_text(content, encoding="utf-8")

def main() -> None:
    # Create dirs
    for d in DIRS:
        safe_mkdir(ROOT / d)

    # Create all files (empty first)
    for f in FILES:
        safe_touch(ROOT / f)

    # Fill important files with content
    for rel, text in CONTENT.items():
        write_file(rel, text)

    print(f"✅ Created + populated structure under: {ROOT.resolve()}")
    print(f"📁 Dirs created: {len(DIRS)}")
    print(f"📄 Files created: {len(FILES)}")
    print("✅ Important files populated with working routing + redirect logic (main + tools).")
    print("\nNext steps:")
    print("1) cd tryatlabs/apps/main && npm i && npm run dev")
    print("2) cd tryatlabs/apps/tools && npm i && npm run dev -- --port 5174")
    print("3) open http://localhost:5173 and click Tools (will redirect to localhost:5174 via apps/main/.env)")

if __name__ == "__main__":
    main()
