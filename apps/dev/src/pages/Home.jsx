import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DEV_TOOLS, SITE } from "../app/site.config.js";
import { SeoHead } from "../seo/SeoHead.jsx";
import { websiteJsonLd } from "../seo/jsonld.js";
import ToolsHub from "../components/common/ToolsHub.jsx";
import "../styles/home.css";

/* Premium inline SVG icons (clean, consistent stroke) */
function ToolIcon({ slug, className = "toolIcon" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (slug) {
    case "base64-tool":
      // "Code brackets + bytes" vibe
      return (
        <svg {...common}>
          <path d="M9 7 6 10l3 3" />
          <path d="M15 7l3 3-3 3" />
          <path d="M10.5 16.5h3" />
          <path d="M10 13.5h4" />
          <path d="M10.5 10.5h3" />
          <path d="M20 6.5V17.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
        </svg>
      );

    case "hash-generator":
      // Hash mark with nodes = "generated"
      return (
        <svg {...common}>
          <path d="M9 3 7 21" />
          <path d="M17 3l-2 18" />
          <path d="M4.5 9h16" />
          <path d="M3.5 15h16" />
          <path d="M6.2 6.5h0" />
          <path d="M17.8 17.5h0" />
          <path d="M6.2 6.5a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Z" />
          <path d="M17.8 17.5a.6.6 0 1 0 0 1.2.6.6 0 0 0 0-1.2Z" />
        </svg>
      );

    case "jwt-decoder":
      // Token ring + lock + split payload
      return (
        <svg {...common}>
          <path d="M12 3.5a6.5 6.5 0 0 1 6.5 6.5" />
          <path d="M12 3.5A6.5 6.5 0 0 0 5.5 10" />
          <path d="M18.5 10a6.5 6.5 0 0 1-10.2 5.4" />
          <path d="M5.5 10a6.5 6.5 0 0 0 10.2 5.4" />
          <path d="M9 11.2V10a3 3 0 0 1 6 0v1.2" />
          <path d="M8.3 11.2h7.4v7.2H8.3z" />
          <path d="M12 14.2v1.8" />
          <path d="M10.2 18.4v-7.2" />
          <path d="M13.8 18.4v-7.2" />
        </svg>
      );

    case "timestamp-generator":
      // Clock + spark (generate)
      return (
        <svg {...common}>
          <path d="M12 7.5v5l3 1.8" />
          <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />
          <path d="M5.5 4.8 4.2 3.5" />
          <path d="M18.5 4.8 19.8 3.5" />
          <path d="M12 2.8V1.6" />
          <path d="M20.4 12h1.2" />
          <path d="M2.4 12H1.2" />
        </svg>
      );

    case "url-encode-decode":
      // Link + arrows (encode/decode)
      return (
        <svg {...common}>
          <path d="M10 8.3 8.8 9.5a3.5 3.5 0 0 0 0 5l.7.7a3.5 3.5 0 0 0 5 0l1.2-1.2" />
          <path d="M14 15.7l1.2-1.2a3.5 3.5 0 0 0 0-5l-.7-.7a3.5 3.5 0 0 0-5 0L8.3 10" />
          <path d="M6 6h3" />
          <path d="M6 6l1.2-1.2" />
          <path d="M6 6l1.2 1.2" />
          <path d="M18 18h-3" />
          <path d="M18 18l-1.2-1.2" />
          <path d="M18 18l-1.2 1.2" />
        </svg>
      );

    case "uuid-generator":
      // ID card + dice pips (unique IDs)
      return (
        <svg {...common}>
          <path d="M7.2 6.2h9.6A2.2 2.2 0 0 1 19 8.4v9.2a2.2 2.2 0 0 1-2.2 2.2H7.2A2.2 2.2 0 0 1 5 17.6V8.4a2.2 2.2 0 0 1 2.2-2.2Z" />
          <path d="M8 10.5h8" />
          <path d="M8 13.5h6" />
          <path d="M8.7 17.1h0" />
          <path d="M11.2 17.1h0" />
          <path d="M13.7 17.1h0" />
          <path d="M8.7 17.1a.55.55 0 1 0 0 1.1.55.55 0 0 0 0-1.1Z" />
          <path d="M11.2 17.1a.55.55 0 1 0 0 1.1.55.55 0 0 0 0-1.1Z" />
          <path d="M13.7 17.1a.55.55 0 1 0 0 1.1.55.55 0 0 0 0-1.1Z" />
          <path d="M9 4.2h6" />
        </svg>
      );

    case "json-formatter":
      return (
        <svg {...common}>
          <path d="M6 4c-1.5 0-2.5 1-2.5 2.5V9c0 1-.5 1.5-1.5 1.5 1 0 1.5.5 1.5 1.5v2.5C3.5 16 4.5 17 6 17" />
          <path d="M18 4c1.5 0 2.5 1 2.5 2.5V9c0 1 .5 1.5 1.5 1.5-1 0-1.5.5-1.5 1.5v2.5C20.5 16 19.5 17 18 17" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
        </svg>
      );


    case "regex-tester":
      return (
        <svg {...common}>
          <path d="M4 12h6" />
          <path d="M14 12h6" />
          <circle cx="10" cy="12" r="1.6" />
          <circle cx="14" cy="8" r="1.4" />
          <circle cx="14" cy="16" r="1.4" />
          <path d="M10 12c3-2 3-4 4-4" />
          <path d="M10 12c3 2 3 4 4 4" />
        </svg>
      );


    case "lorem-ipsum-generator":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );


    case "random-string-generator":
      return (
        <svg {...common}>
          <path d="M4 8c4 0 4 8 8 8s4-8 8-8" />
          <path d="M4 16c4 0 4-8 8-8s4 8 8 8" />
          <circle cx="6" cy="8" r="1" />
          <circle cx="18" cy="16" r="1" />
        </svg>
      );



    case "url-parser":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
          <path d="M12 4c2.5 3 2.5 13 0 16" />
          <path d="M8 6h1M15 18h1" />
        </svg>
      );


    case "nanoid-generator":
      return (
        <svg {...common}>
          <rect x="4" y="7" width="4" height="4" rx="1" />
          <rect x="10" y="7" width="4" height="4" rx="1" />
          <rect x="16" y="7" width="4" height="4" rx="1" />
          <rect x="7" y="13" width="4" height="4" rx="1" />
          <rect x="13" y="13" width="4" height="4" rx="1" />
        </svg>
      );


    default:
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <path d="M7 7h0" />
          <path d="M17 17h0" />
        </svg>
      );
  }
}

function pickFeatured(list, count = 6) {
  const arr = [...list];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  arr.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
  return arr.slice(0, Math.min(count, arr.length));
}

export default function Home() {
  const [sp, setSp] = useSearchParams();
  const initialQ = sp.get("q") || "";
  const [q, setQ] = useState(initialQ);

  const canonical = `${SITE.baseUrl}/`;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DEV_TOOLS;
    return DEV_TOOLS.filter((t) => {
      const hay = `${t.title} ${t.description} ${(t.keywords || []).join(" ")}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q]);

  const featured = useMemo(() => pickFeatured(DEV_TOOLS, 6), []);

  const onChange = (v) => {
    setQ(v);
    const next = new URLSearchParams(sp);
    if (v.trim()) next.set("q", v);
    else next.delete("q");
    setSp(next, { replace: true });
  };

  return (
    <>
      <SeoHead
        title="Dev Tools"
        description="Fast, browser-first developer utilities: Base64, Hash, JWT decode, Timestamp, URL encode/decode, UUID. Privacy-first and SEO-clean."
        canonical={canonical}
        jsonLd={websiteJsonLd()}
      />

      {/* HERO */}
      <section className="hero">
        <div className="heroGrid">
          <div className="heroLeft">
            <div className="kicker">FREE DEV TOOLS, JUST FOR YOU!</div>

            <h1 className="h1">
              Everything you need to code better — <br />
              <span className="gradText">in one powerful workspace.</span>
            </h1>



            <div className="heroCtas">
              <a className="btnPrimary" href="#all-tools">
                Explore Tools
              </a>
              <a className="btnGhost" href="https://tryatlabs.com" target="_blank" rel="noreferrer">
                Main Site
              </a>
            </div>
          </div>

          {/* Right panel */}
          <div className="heroRight">
            <div className="quickPanel">
              <div className="quickPanelTop">

                <h3 className="quickTitle">Popular Dev Tools</h3>
              </div>

              <div className="quickGrid">
                {featured.map((t) => (
                  <Link key={t.slug} to={`/tools/${t.slug}`} className="quickTile">
                    <div className="quickIconWrap">
                      <ToolIcon slug={t.slug} className="quickIcon" />
                    </div>
                    <p className="quickName">{t.title}</p>
                  </Link>
                ))}
              </div>


            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ALL TOOLS + SEARCH (requested placement) */}
      <section id="all-tools" className="section">
        <div className="sectionHead">
          <div>
            <h2 className="h2">All Tools</h2>

          </div>
        </div>

        {/* ✅ Search bar in All Tools section */}
        <div className="searchRow">
          <div className="searchWrap">
            <div className="searchBox">
              <span className="searchIcon">⌕</span>
              <input
                value={q}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search tools... (jwt, hash, uuid)"
                aria-label="Search Dev Tools"
              />
              {q ? (
                <button className="searchClear" onClick={() => onChange("")} aria-label="Clear search">
                  ✕
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* ✅ WHO IS THIS FOR (below search) */}


        {/* TOOLS GRID */}
        <div className="toolGrid">
          {filtered.map((t) => (
            <div key={t.slug} className="toolCard">
              <div className="toolCardTop">
                <div className="toolTitleRow">
                  <div className="toolIconWrap">
                    <ToolIcon slug={t.slug} />
                  </div>
                  <div className="toolTitle">{t.title}</div>
                </div>

                {/* ONLY this redirects */}
                <Link
                  to={`/tools/${t.slug}`}
                  className="toolGo"
                  aria-label={`Open ${t.title}`}
                >
                  Open <span className="chev">→</span>
                </Link>
              </div>

              <div className="toolDesc">{t.description}</div>

              {t.badge ? (
                <div className="toolBadgeRow">
                  <span className="pill">{t.badge}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>


        <div className="dividerSoft" />
        <section className="who">
          <div className="whoInner">
            <div className="whoLeft">
              <h3 className="h3">Who is this for?</h3>
              <p className="muted">
                Built for developers, startups, students, and product teams who need fast utilities
                and reliable technical support. Beyond tools, TryAtLabs also offers custom web
                development, performance optimization, and scalable product engineering services.
              </p>
            </div>

            <div className="whoGrid">
              <div className="whoCard">
                <div className="whoK mono">DEV</div>
                <div className="whoT">Developers & Startups</div>
                <div className="whoD">
                  Use instant utilities and collaborate with us for full-stack web development.
                </div>
              </div>

              <div className="whoCard">
                <div className="whoK mono">STUDY</div>
                <div className="whoT">Students & Learners</div>
                <div className="whoD">
                  Practice, experiment, and understand concepts without installing tools.
                </div>
              </div>

              <div className="whoCard">
                <div className="whoK mono">QA</div>
                <div className="whoT">Product & QA Teams</div>
                <div className="whoD">
                  Validate data quickly and partner with us for scalable system solutions.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ ABOUT (separate section below who) */}
        <div className="dividerSoft" />

        <section className="about">
          <div className="aboutInner">
            <div className="aboutLeft">
              <h3 className="h3">About TryAtLabs Dev Tools</h3>
              <p className="muted">
                TryAtLabs delivers practical, no-nonsense developer tools designed to simplify
                everyday workflows. Whether you're encoding data, testing logic, or generating
                utilities, our tools help you move faster without distractions.
              </p>
            </div>

            <div className="aboutRight">
              <div className="aboutBox">
                <div className="aboutLine">
                  <span className="mono aboutKey">Security</span>
                  <span className="aboutVal">No signups, no data storage, complete user control</span>
                </div>
                <div className="aboutLine">
                  <span className="mono aboutKey">Efficiency</span>
                  <span className="aboutVal">Instant results for everyday development tasks</span>
                </div>
                <div className="aboutLine">
                  <span className="mono aboutKey">Utility</span>
                  <span className="aboutVal">Essential tools built for developers, testers, and teams</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="dividerSoft" />



        <ToolsHub />
      </section>
    </>
  );
}
