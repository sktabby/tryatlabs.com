import { Link } from "react-router-dom";
import { PDF_CATEGORIES, PDF_TOOLS, SITE } from "../app/site.config.js";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { SeoHead } from "../seo/SeoHead.jsx";
import { websiteJsonLd } from "../seo/jsonld.js";

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

  const filteredTools = useMemo(() => {
    if (activeCat === "all") return PDF_TOOLS;
    return PDF_TOOLS.filter((t) => t.category === activeCat);
  }, [activeCat]);

  const head = SECTION_META[activeCat] || SECTION_META.all;

  // ✅ SEO (ALWAYS full URL)
  const canonical = `${SITE.url}/`;

  // ✅ Collection / list of tools
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
      operatingSystem: "Web",
    })),
  };

  // ✅ ItemList (extra helpful for SEO on a tools directory)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PDF Tools",
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: PDF_TOOLS.map((t, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: t.title,
      url: `${SITE.url}/${t.slug}`,
    })),
  };

  // ✅ Home keywords (optional)
  const homeKeywords = PDF_TOOLS.map((t) => t.keywords).filter(Boolean).join(", ");

  return (
    <>
      <SeoHead
        title="Free PDF Tools"
        description={SITE.description}
        canonical={canonical}
        keywords={homeKeywords} // ✅ optional (only works if you add keywords prop in SeoHead)
        jsonLd={{
          website: websiteJsonLd(),
          collection: collectionJsonLd,
          list: itemListJsonLd,
        }}
      />

      {/* HERO */}
      <section className="hero hero--light">
        <div className="hero__grid">
          <div className="hero__left">
            <div className="kicker">pdf.tryatlabs.com</div>
            <h1 className="hero__title">
              PDF ka kaam tha mushkil kabhi,
              <br />
              ab ek jagah pe, <span className="grad">aasaan sabhi.</span>
            </h1>

            <p className="hero__sub">
              Fast tools, clean design, aur poori privacy.
              <br />
              PDFs rahein tumhare device pe — hamesha.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary" href="#all-tools">
                Explore PDF Tools <ArrowRight size={18} />
              </a>

              <div className="hero__trust">
                <span className="pill">
                  <ShieldCheck size={16} /> Local processing
                </span>
                <span className="pill">
                  <Lock size={16} /> No uploads
                </span>
                <span className="pill">
                  <Zap size={16} /> Instant results
                </span>
              </div>
            </div>
          </div>

          <div className="hero__right">
            <div className="glassCard glassCard--light">
              <div className="glassCard__top">
                <div>
                  <div className="muted">TryAtLabs</div>
                  <div className="glassCard__title">PDF Toolkit</div>
                </div>
                <span className="badge">Light + Fast</span>
              </div>

              <div className="glassCard__body">
                <ul className="checklist">
                  <li>Production-ready tools for everyday PDFs</li>
                  <li>Runs fully in your browser (privacy-first)</li>
                  <li>Fast, clean UI on mobile + desktop</li>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="all-tools" className="section">
        <div className="section__head">
          <h2>{head.title}</h2>
          <p className="muted">{head.sub}</p>
        </div>

        {/* Pills */}
        <div className="tabsRow" role="tablist" aria-label="PDF categories">
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

        {/* One grid only */}
        <div className="toolGrid toolGrid--home">
          {filteredTools.length === 0 ? (
            <div className="card" style={{ gridColumn: "1 / -1" }}>
              <h3 style={{ marginTop: 0 }}>Coming soon</h3>
              <p className="muted">
                We’re adding more tools to this category. For now, try Merge PDF or Compress PDF.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                <Link className="btn btn--primary" to="/merge-pdf">Merge PDF</Link>
                <Link className="btn btn--ghost" to="/compress-pdf">Compress PDF</Link>
              </div>
            </div>
          ) : (
            filteredTools.map((t) => (
              <Link key={t.slug} to={`/${t.slug}`} className="toolCard toolCard--light">
                <div className="toolCard__top">
                  {t.badge ? <span className="toolCard__badge">{t.badge}</span> : <span />}
                </div>
                <div className="toolCard__title">{t.title}</div>
                <div className="toolCard__desc">{t.desc}</div>
                <div className="toolCard__go">
                  Open <ArrowRight size={16} />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}

