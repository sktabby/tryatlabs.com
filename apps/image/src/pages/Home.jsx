import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SITE } from "../app/site.config.js";
import { SeoHead } from "../seo/SeoHead.jsx";
import { websiteJsonLd } from "../seo/jsonld.js";
import { IMAGE_TOOLS } from "../tools/index.jsx";

export default function Home() {
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);

  const featured = useMemo(() => {
    const list = IMAGE_TOOLS;
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return IMAGE_TOOLS;
    return IMAGE_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        (t.keywords || "").toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <>
      <SeoHead
        title="Image Tools"
        description="Premium, privacy-first image tools: resize, crop, compress, convert, and batch process—directly in your browser."
        path="/"
        jsonLd={websiteJsonLd()}
      />

      <section className="hero">
        <div className="hero__inner">
          <div className="hero__left">
            <div className="pill">
              <span className="pill__dot" />
              <span>{SITE.brand.tagline}</span>
            </div>

            <h1 className="hero__title">
              Premium <span className="grad">Image Tools</span> that run locally.
            </h1>

            <p className="hero__text">
              Resize, crop, compress, convert, and batch process with clean outputs—without uploading your files.
            </p>

            <div className="hero__actions">
              <a href="#tools" className="btn btn--primary">Explore tools</a>
              <a className="btn btn--ghost" href="https://tryatlabs.com">TryAtLabs</a>
            </div>

            <div className="hero__meta">
              <div className="stat">
                <div className="stat__k">Client-side</div>
                <div className="stat__v">No uploads</div>
              </div>
              <div className="stat">
                <div className="stat__k">Clean outputs</div>
                <div className="stat__v">High quality</div>
              </div>
              <div className="stat">
                <div className="stat__k">Made for speed</div>
                <div className="stat__v">Instant</div>
              </div>
            </div>
          </div>

          <div className="hero__right">
            <div className="card card--glass card--glow heroCard">
              <div className="heroCard__top">
                <div className="heroCard__icon">{featured.icon}</div>
                <div className="heroCard__txt">
                  <div className="heroCard__tag">Featured (random)</div>
                  <div className="heroCard__name">{featured.name}</div>
                </div>
              </div>

              <p className="muted">{featured.description}</p>

              <Link to={`/${featured.key}`} className="btn btn--primary btn--wide">
                Open {featured.name}
              </Link>

              <div className="heroCard__mini">
                {IMAGE_TOOLS.slice(0, 3).map((t) => (
                  <Link key={t.key} to={`/${t.key}`} className="miniLink">
                    <span className="miniIcon">{t.icon}</span>
                    <span className="miniText">{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ✅ Sponsored removed completely */}
          </div>
        </div>
      </section>

      <section id="tools" className="tools">
        <div className="tools__top">
          <h2 className="h2">All Image Tools</h2>
          <div className="search">
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools…"
              aria-label="Search tools"
            />
          </div>
        </div>

        <div className="gridCards">
          {filtered.map((t) => (
            <Link key={t.key} to={`/${t.key}`} className="card card--glass cardLink">
              <div className="cardLink__head">
                <div className="cardLink__icon">{t.icon}</div>
                <div className="cardLink__title">{t.name}</div>
              </div>
              <div className="cardLink__desc">{t.description}</div>
              <div className="cardLink__cta">Open tool →</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
