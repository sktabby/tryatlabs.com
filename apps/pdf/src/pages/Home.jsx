import { Link } from "react-router-dom";
import { PDF_CATEGORIES, PDF_TOOLS, SITE } from "../app/site.config.js";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { SeoHead } from "../seo/SeoHead.jsx";
import { websiteJsonLd } from "../seo/jsonld.js";
import "../styles/home.css";

const SECTION_META = {
  all: {
    title: "All PDF Tools",
    sub: "Pick a tool — each one opens a dedicated page with controls."
  },
  organize: {
    title: "Organize PDF",
    sub: "Merge, split, extract and reorder pages."
  },
  optimize: {
    title: "Optimize PDF",
    sub: "Compress PDFs for better performance."
  },
  convert: {
    title: "Convert PDF",
    sub: "Convert to/from PDF formats."
  },
  edit: {
    title: "Edit PDF",
    sub: "Rotate, add page numbers, crop and quick edits."
  },
  security: {
    title: "PDF Security",
    sub: "Watermark tools."
  }
};

export default function Home() {
  const [activeCat, setActiveCat] = useState("all");
  const [q, setQ] = useState("");

  const filteredTools = useMemo(() => {
    const base = activeCat === "all" ? PDF_TOOLS : PDF_TOOLS.filter((t) => t.category === activeCat);

    const query = (q || "").trim().toLowerCase();
    if (!query) return base;

    return base.filter((t) => {
      const hay = `${t.title} ${t.desc} ${t.keywords || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [activeCat, q]);

  const head = SECTION_META[activeCat] || SECTION_META.all;

  // ✅ SEO (ALWAYS full URL)
  const canonical = `${SITE.url}/`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SITE.name,
    url: canonical,
    description: SITE.description,
    hasPart: PDF_TOOLS.map((t) => ({
      "@type": "SoftwareApplication",
      name: t.title,
      url: `${SITE.url}/${t.slug}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web"
    }))
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PDF Tools",
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: PDF_TOOLS.map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.title,
      url: `${SITE.url}/${t.slug}`
    }))
  };

  const homeKeywords = PDF_TOOLS.map((t) => t.keywords).filter(Boolean).join(", ");

  // ✅ necessary: hero 4 tools (and allows icons usage cleanly)
  const heroTools = useMemo(() => {
    return [...PDF_TOOLS].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);

  const [catOpen, setCatOpen] = useState(false);


  return (
    <>
      <SeoHead
        title="Free PDF Tools"
        description={SITE.description}
        canonical={canonical}
        keywords={homeKeywords}
        jsonLd={{
          website: websiteJsonLd(),
          collection: collectionJsonLd,
          list: itemListJsonLd
        }}
      />

      {/* HERO */}
      <section className="hero hero--light">
        <div className="hero__grid">
         <div className="hero__left">
  <div className="kicker">Free PDF Tools, Just For You!</div>

  <h1 className="hero__title">
    All Your PDF Work,
    <br />
    Made <span className="grad">Available</span> in One Place.
  </h1>

 

  <div className="hero__cta">
    <a className="btn btn--primary" href="#all-tools">
      Explore PDF Tools <ArrowRight size={18} />
    </a>
  </div>
</div>


          {/* RIGHT: 4 quick services */}
          <div className="hero__right">
            <div className="glassCard glassCard--light heroServices">
              <div className="heroServices__head">
                <div className="heroServices__kicker">Quick Access</div>
                <div className="heroServices__title">Popular PDF Tools</div>
              </div>

              <div className="heroServices__grid">
                {heroTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/${tool.slug}`}
                    className="heroServiceCard"
                    aria-label={tool.title}
                  >
                    <span
                      className="toolIcon toolIcon--sm"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: tool.icon || "" }}
                    />
                    <span className="heroServiceCard__text">{tool.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="all-tools" className="section allTools">
        <div className="section__head">
          <h2>{head.title}</h2>
          
        </div>

        {/* ✅ Search bar ABOVE categories */}
        <div className="searchRow">
          <div className="searchInputWrap">
            <input
              className="searchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools… (merge, compress, split)"
              aria-label="Search PDF tools"
            />

            <button
              className="searchIconBtn"
              onClick={() => setQ("")}
              aria-label="Clear search"
              type="button"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <line
                  x1="16.65"
                  y1="16.65"
                  x2="21"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Pills */}
        <div className="tabsRow tabsRow--desktop" role="tablist" aria-label="PDF categories">
          {PDF_CATEGORIES.map((c) => {
            const isActive = activeCat === c.id;
            return (
              <button
                key={c.id}
                className={`tabPill ${isActive ? "tabPill--active" : ""}`}
                onClick={() => setActiveCat(c.id)}
                type="button"
                role="tab"
                aria-selected={isActive}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown (below search bar) */}
       {/* Mobile Category Dropdown (Custom UI) */}
<div className="tabsRowMobile">
  <span className="tabsRowMobile__label">Category</span>

  <div className="uiSelect" role="button" tabIndex={0}>
    <button
      type="button"
      className="uiSelect__trigger"
      onClick={() => setCatOpen((v) => !v)}
      aria-haspopup="listbox"
      aria-expanded={catOpen}
    >
      <span>
        {PDF_CATEGORIES.find((c) => c.id === activeCat)?.label}
      </span>

      <svg
        className={`uiSelect__chevron ${catOpen ? "isOpen" : ""}`}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M6 9l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    {catOpen && (
      <div className="uiSelect__menu" role="listbox">
        {PDF_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`uiSelect__item ${
              activeCat === c.id ? "active" : ""
            }`}
            onClick={() => {
              setActiveCat(c.id);
              setCatOpen(false);
            }}
            role="option"
            aria-selected={activeCat === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>
    )}
  </div>
</div>


        {/* One grid only */}
        <div className="toolGrid toolGrid--home">
          {filteredTools.length === 0 ? (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <h3 style={{ marginTop: 0 }}>No results</h3>
              <p className="muted">Try a different keyword or switch category.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <button className="btn btn--ghost" onClick={() => setQ("")} type="button">
                  Clear search
                </button>
                <button className="btn btn--ghost" onClick={() => setActiveCat("all")} type="button">
                  Show all
                </button>
              </div>
            </div>
          ) : (
            filteredTools.map((t) => (
              <div key={t.slug} className="toolCard toolCard--light toolCard--split">
                <div className="toolCard__top">
                  {t.badge ? <span className="toolCard__badge">{t.badge}</span> : <span />}
                </div>

                {/* ✅ necessary: icon + title row */}
                <div className="toolCard__row">
                  <span
                    className="toolIcon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: t.icon || "" }}
                  />
                  <div className="toolCard__title">{t.title}</div>
                </div>

                <div className="toolCard__desc">{t.desc}</div>

                {/* ✅ only button is clickable */}
                <div className="toolCard__actions">
                  <Link to={`/${t.slug}`} className="btn btn--primary toolOpenBtn">
                    Open
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
