import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";
import { URLS } from "../app/constants/urls.js";
import { organizationJsonLd } from "../seo/JsonLd/organization.js";
import { websiteJsonLd } from "../seo/JsonLd/website.js";
import LabHeroAnimation from "../components/common/LabHeroAnimation.jsx";
import "../styles/home.css";

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
        title="TryAtLabs"
        description="TryAtLabs is a privacy-first platform offering browser-based tools for PDF, image, and text tasks. Simple, fast, and secure."
        canonical={canonical}
        jsonLd={jsonLd}
      />

      {/* HERO */}
      <section className="hero">
        <div
          className="container hero__inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 48,
            flexWrap: "nowrap"
          }}
        >
          {/* LEFT CONTENT */}
          <div
            className="hero__content"
            style={{
              flex: "0 0 55%",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              textAlign: "left"
            }}
          >
            <div className="pill" style={{ width: "fit-content" }}>
              FREE Tools Just For You!
            </div>

            <h1 className="hero__title" style={{ margin: 0 }}>
              Tools kholo, <span style={{ color: "var(--brand)" }}>kaam bolo</span>. <br />
              Baaki TryAtLabs pe chodo!
            </h1>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="hero__image"
            style={{
              flex: "0 0 45%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <section id="services">
              {/* SERVICES */}
              <div className="container servicesHome" style={{ marginTop: 40 }}>
                <h2 className="section__title">Services we offer</h2>

                <div className="hero__cards">
                  {/* PDF */}
                  <div className="card serviceCard">
                    <div className="serviceCard__head">
                      <span className="serviceCard__badge">PDF</span>
                      <div className="card__title">PDF Tools</div>
                    </div>

                    <div className="muted" data-mobile="hide">
                      Merge, split, compress, reorder, and manage PDF files directly in your browser.
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <a className="btn btn--ghost" href={URLS.pdf} >
                        Open 
                      </a>
                    </div>
                  </div>

                  {/* IMG */}
                  <div className="card serviceCard">
                    <div className="serviceCard__head">
                      <span className="serviceCard__badge">IMG</span>
                      <div className="card__title">Image Tools</div>
                    </div>

                    <div className="muted" data-mobile="hide">
                      Resize, compress, convert, and optimize images without losing quality.
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <a className="btn btn--ghost" href={URLS.image} >
                        Open 
                      </a>
                    </div>
                  </div>

                  {/* TXT */}
                  <div className="card serviceCard">
                    <div className="serviceCard__head">
                      <span className="serviceCard__badge">TXT</span>
                      <div className="card__title">Text Tools</div>
                    </div>

                    <div className="muted" data-mobile="hide">
                      Format, clean, analyze, and transform text for writing and productivity tasks.
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <a className="btn btn--ghost" href={URLS.text} >
                        Open 
                      </a>
                    </div>
                  </div>

                  {/* DEV */}
                  <div className="card serviceCard">
                    <div className="serviceCard__head">
                      <span className="serviceCard__badge">DEV</span>
                      <div className="card__title">Developer Tools</div>
                    </div>

                    <div className="muted" data-mobile="hide">
                      Handy utilities for developers to generate, encode, decode, and inspect data quickly.
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <a className="btn btn--ghost" href={URLS.dev}>
                        Open 
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="container" style={{ marginTop: 36 }}>
          <div className="trust-strip">
            <div className="trust-strip__track">
              <span>Free to use everyday tools</span>
              <span>PDF, Image, Text & Dev utilities</span>
              <span>your data stays local</span>

              {/* duplicate for seamless loop */}
              <span>Free to use everyday tools</span>
              <span>PDF, Image, Text & Dev utilities</span>
              <span>your data stays local</span>
            </div>
          </div>
        </div>

        {/* WHY TRYATLABS */}
       <div className="container" style={{ marginTop: 64 }}>
  <h2 className="section__title">Why TryAtLabs</h2>

  <div className="why-grid">
    <div className="panel">
      <h3>Performance-driven architecture</h3>
      <p>
        Every tool is engineered for fast load times and consistent performance, even on slower networks and low-end devices.
      </p>
    </div>

    <div className="panel">
      <h3>Privacy-first by default</h3>
      <p>
        Most tools run entirely in your browser, ensuring your files and data are never uploaded or stored on our servers.
      </p>
    </div>

    <div className="panel">
      <h3>Clean, focused user experience</h3>
      <p>
        A distraction-free interface designed to help you complete tasks quickly without unnecessary complexity.
      </p>
    </div>

    <div className="panel">
      <h3>Continuously evolving platform</h3>
      <p>
        We actively expand and refine our tool ecosystem based on real-world usage and practical feedback.
      </p>
    </div>
  </div>
</div>


        {/* HOW IT WORKS */}
        <div className="container" style={{ marginTop: 64 }}>
          <h2 className="section__title">How it works</h2>

          <div className="steps">
            <div className="step">
              <span className="step__num">01</span>
              <p>Choose a tool</p>
            </div>

            <div className="step">
              <span className="step__num">02</span>
              <p>Upload or paste your content</p>
            </div>

            <div className="step">
              <span className="step__num">03</span>
              <p>Get instant results — no account required</p>
            </div>
          </div>
        </div>

        {/* FOR WHOM */}
        <div className="container" style={{ marginTop: 64 }}>
          <h2 className="section__title">Who is this for?</h2>

          <div className="audience">
            <span>Students & educators</span>
            <span>Working professionals</span>
            <span>Content creators</span>
            <span>Developers & tech enthusiasts</span>
            <span>Anyone who needs quick, reliable tools online</span>
          </div>
        </div>

        {/* COMING SOON */}
        <div className="container" style={{ marginTop: 64 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h2 style={{ marginTop: 0 }}>Coming soon</h2>

            <p className="muted" style={{ maxWidth: 620, margin: "0 auto 14px" }}>
              We’re expanding TryAtLabs into a complete tool ecosystem with image processing, developer utilities,
              smarter workflows, and performance-optimized experiences.
            </p>

            <div className="audience" style={{ justifyContent: "center" }}>
              <span>Image tools</span>
              <span>Developer utilities</span>
              <span>Smarter workflows</span>
              <span>Performance-focused UX</span>
            </div>

            <div className="muted" style={{ marginTop: 14 }}>
              Stay tuned — we’re just getting started.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
