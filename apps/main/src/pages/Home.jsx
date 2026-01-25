import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";
import { URLS } from "../app/constants/urls.js";
import { organizationJsonLd } from "../seo/JsonLd/organization.js";
import { websiteJsonLd } from "../seo/JsonLd/website.js";

export default function Home() {
  const canonical = `${BRAND.baseUrl}/`;

  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is TryAtLabs free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Most tools are free and run in your browser for speed and privacy."
          }
        },
        {
          "@type": "Question",
          name: "Do you upload my files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Many tools run client-side in your browser. For any future server features, we will clearly state it."
          }
        }
      ]
    }
  ];

  return (
    <>
      <SeoHead
        title="TryAtLabs "
        description="TryAtLabs is a privacy-first platform offering browser-based tools for PDF, image, and text tasks. Simple, fast, and secure."
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <section className="hero">
        <div className="container hero__inner">
          <div className="pill" style={{ alignSelf: "flex-start" }}>
            Desi Tools. Zero Drama. 100% Kaam.
          </div>

          <h1 className="hero__title">
            Tools kholo, <span style={{ color: "var(--brand)" }}>kaam bolo</span>. <br />
            Baaki TryAtLabs pe chodo!
          </h1>


          <p className="hero__sub">
            PDF, image, and text tools in one place. Privacy-first, thoughtfully designed,
            and fast enough to keep your workflow moving.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href={URLS.tools}>
              Chalo Tools Pe 🚀
            </a>
            <a className="btn btn--ghost" href={URLS.pdf}>
              PDF Ka Kaam 🧾
            </a>
          </div>

          <div className="hero__cards">
            <a className="card" href={URLS.pdf}>
              <div className="card__title">PDF</div>
              <div className="muted">
                Merge, split, compress, reorder — matlab “boss, PDF sambhal lo” wala full solution.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <span className="pill">Merge</span>
                <span className="pill">Split</span>
                <span className="pill">Compress</span>
              </div>
            </a>

            <a className="card" href={URLS.image}>
              <div className="card__title">Image</div>
              <div className="muted">
                Resize, compress, convert — “quality bhi rahe, size bhi kam” wala jugadu combo.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <span className="pill">Resize</span>
                <span className="pill">Compress</span>
                <span className="pill">Convert</span>
              </div>
            </a>

            <a className="card" href={URLS.text}>
              <div className="card__title">Text</div>
              <div className="muted">
                Case convert, word count, clean-up — text ko “seedha-saadha” banane ka full department.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <span className="pill">Case</span>
                <span className="pill">Count</span>
                <span className="pill">Clean</span>
              </div>
            </a>
          </div>

          <div
            className="panel"
            style={{
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 800 }}>No sign-up. No bakwaas.</div>
                <div className="muted">Bas tool kholo, kaam niptao, nikal jao. 😄</div>
              </div>
              <a className="btn btn--ghost" href={URLS.text}>
                “Mujhe abhi kaam hai” →
              </a>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="pill">Privacy-first</span>
              <span className="pill">Browser-based</span>
              <span className="pill">Fast AF*</span>
              <span className="muted" style={{ fontSize: 12 }}>
                *AF = “Actually Fast”, samjhe? 😌
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Built for speed + SEO (aur thoda swag)</h2>
            <p className="muted">
              Har subdomain ek focused tool hub hai. Result? Google ko samajh aata hai, users ko maza aata hai, aur aapko
              long run me better rankings + higher ad RPM milta hai. Win-win… bas chai ready rakho. ☕
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <div className="panel" style={{ padding: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>“Kyu TryAtLabs?”</div>
                <div className="muted">
                  Kyunki random sites pe popups + slow loading ka time nahi. Yaha tools ka kaam tools jaisa hota hai —
                  seedha, simple, solid.
                </div>
              </div>

              <div className="panel" style={{ padding: 14 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Desi-coded promise 😌</div>
                <div className="muted">
                  Aap bole “bhai jaldi kar” — hum already fast. Aap bole “privacy?” — hum browser-first. Aap bole “clean
                  UI?” — hum premium.
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__row">
              <span>Client-side tools</span>
              <span className="pill">Fast</span>
            </div>
            <div className="panel__row">
              <span>Subdomain strategy</span>
              <span className="pill">SEO</span>
            </div>
            <div className="panel__row">
              <span>AdSense-ready layout</span>
              <span className="pill">RPM</span>
            </div>

            <div style={{ marginTop: 12 }} className="muted">
              Pro tip: “Refresh pe 404” nahi aayega. Hostinger + .htaccess = sorted. ✅
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <a className="btn btn--primary" href={URLS.tools}>
                Start Now
              </a>
              <a className="btn btn--ghost" href={URLS.pdf}>
                PDF First
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );

}
