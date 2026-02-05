import { useMemo, useState } from "react";
import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";
import "../styles/Tools.css";

import {
  SUBDOMAINS,
  PDF_TOOLS_LINKS,
  TEXT_TOOLS_LINKS,
  IMAGE_TOOLS_LINKS,
  DEV_TOOLS_LINKS,
  toolUrl
} from "../app/constants/urls.js";

function IconBadge({ type }) {
  if (type === "pdf")
    return (
      <svg viewBox="0 0 24 24">
        <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M14 3v6h6" />
      </svg>
    );

  if (type === "img")
    return (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 16l5-5 4 4 3-3 6 6" />
        <circle cx="9" cy="9" r="1.5" />
      </svg>
    );

  if (type === "txt")
    return (
      <svg viewBox="0 0 24 24">
        <path d="M4 6h16" />
        <path d="M4 12h10" />
        <path d="M4 18h7" />
      </svg>
    );

  return (
    <svg viewBox="0 0 24 24">
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </svg>
  );
}

function ToolGrid({ items, category }) {
  return (
    <div className="subtoolsScroll" role="region" aria-label={`${category} tools`}>
      <div className="subtoolsGrid">
        {items.map((t) => (
          <a
            key={t.slug}
            className="subtoolCard"
            href={toolUrl(category, t.slug)}
            aria-label={`Open ${t.name}`}
          >
            <div className="subtoolTop">
              <div className="subtoolName">{t.name}</div>
              <span className="subtoolPill">Open</span>
            </div>

            {t.description ? <p className="subtoolDesc">{t.description}</p> : null}
          </a>
        ))}
      </div>
    </div>
  );
}

function ExpandSection({ open, children }) {
  return (
    <div className={`expandWrap ${open ? "isOpen" : ""}`}>
      <div className="expandInner">{children}</div>
    </div>
  );
}

export default function Tools() {
  const canonical = `${BRAND.baseUrl}/tools`;

  const categories = useMemo(
    () => [
      {
        key: "pdf",
        type: "pdf",
        title: "PDF Tools",
        desc: "Fast, private PDF workflows in your browser.",
        href: SUBDOMAINS.pdf,
        items: PDF_TOOLS_LINKS
      },
      {
        key: "image",
        type: "img",
        title: "Image Tools",
        desc: "Compress, resize and optimize images instantly.",
        href: SUBDOMAINS.image,
        items: IMAGE_TOOLS_LINKS
      },
      {
        key: "text",
        type: "txt",
        title: "Text Utilities",
        desc: "Text cleanup, counters, converters and helpers.",
        href: SUBDOMAINS.text,
        items: TEXT_TOOLS_LINKS
      },
      {
        key: "dev",
        type: "dev",
        title: "Developer Tools",
        desc: "Everyday dev helpers: tokens, encoding, UUIDs.",
        href: SUBDOMAINS.dev,
        items: DEV_TOOLS_LINKS
      }
    ],
    []
  );

  const [openKey, setOpenKey] = useState(""); // ✅ hidden by default

  const toggle = (key) => {
    setOpenKey((prev) => (prev === key ? "" : key));
  };

  return (
    <>
      <SeoHead
        title="Tools"
        description="Explore TryAtLabs tools: PDF, Image, Text, and Developer utilities — fast, browser-first, privacy-friendly."
        canonical={canonical}
      />

      <section className="section">
        <div className="container toolsWrap">
          <div className="toolsHeader">
            <h1 className="toolsTitle">
              TryAtLabs <span className="toolsTitleAccent">Tools</span>
            </h1>
          </div>

          <div className="toolsGrid">
            {categories.map((c) => {
              const isOpen = openKey === c.key;

              return (
                <div key={c.key} className={`card toolCard toolCardFixed ${isOpen ? "isExpanded" : ""}`}>
                  {/* icon + title in same row */}
                  <div className="toolHeadRow">
                    <span className="toolIcon">
                      <IconBadge type={c.type} />
                    </span>
                    <div className="toolHeadText">
                      <div className="toolTitleRow">
                        <h2 className="toolTitle">{c.title}</h2>
                        <span className="toolCount">{c.items.length}</span>
                      </div>
                      <p className="toolMiniDesc">{c.desc}</p>
                    </div>
                  </div>

                  <div className="toolActions">
                    <button
                      type="button"
                      className={`btn btn--primary btnSeeTools ${isOpen ? "isActive" : ""}`}
                      onClick={() => toggle(c.key)}
                      aria-expanded={isOpen}
                      aria-controls={`expand-${c.key}`}
                    >
                      {isOpen ? "Hide tools" : "See tools"}
                    </button>

                    {/* optional: open subdomain home (kept minimal) */}
                    <a className="btn btn--ghost btnVisit" href={c.href}>
                      Visit →
                    </a>
                  </div>

                  <ExpandSection open={isOpen}>
                    <div id={`expand-${c.key}`} className="expandContent">
                      <ToolGrid items={c.items} category={c.key} />
                    </div>
                  </ExpandSection>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
