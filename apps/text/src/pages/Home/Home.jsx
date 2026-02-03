import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { websiteJsonLd } from "../../seo/jsonld.js";
import { SITE } from "../../app/site.config.js";
import { TEXT_TOOLS } from "../../tools/index.jsx";
import AdSlot from "../../components/ads/AdSlot.jsx";
import { TOOL_ICONS } from "../../tools/index.jsx";
import "./Home.css";


export default function Home() {
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TEXT_TOOLS;
    return TEXT_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        (t.keywords || "").toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <>
      <SeoHead
        title={`${SITE.name} • Fast, Free, Browser-Based`}
        description={SITE.description}
        canonical={`${SITE.url}/`}
        jsonLd={websiteJsonLd()}
      />

      <section className="hero">
        <div className="container heroGrid">
          <div className="heroLeft">
  <div className="pill" style={{ width: "fit-content" }}>
             Free to use tools, JUST FOR YOU!
            </div>
            <h1 className="heroTitle heroTitleAccent">
              <span className="heroSmall">
                Text ke chote-mote kaam,
              </span>
              <br />
              <span className="heroSmall"> yaad rakho</span>
              <span className="heroBrand">TryAtLabs</span>
              <span className="heroSmall"> ka naam!</span>
            </h1>


            <div className="searchRow">
              <div className="searchInputWrap">
                <input
                  className="searchInput"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search tools… (case, word, duplicates)"
                  aria-label="Search text tools"
                />

                <button
                  className="searchIconBtn"
                  onClick={() => setQ("")}
                  aria-label="Clear search"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
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



          </div>

        </div>
      </section>

      <section className="container section">
        <div className="sectionHead sectionHeadCard">
          <h2 className="sectionTitle">All Text Tools</h2>
        </div>

        <div className="gridCards">
          {filtered.map((t) => (
            <div key={t.slug} className="toolCard">

              <div className="toolCardTop">
                <div className="toolIcon" aria-hidden="true">
                  {TOOL_ICONS[t.icon]?.()}
                </div>

                <div className="toolTitleRow">
                  <div className="toolName">{t.name}</div>

                  <Link
                    to={`/tools/${t.slug}`}
                    className="toolOpenBtn"
                  >
                    Open
                  </Link>
                </div>
              </div>

              <div className="toolDesc">{t.description}</div>

            </div>
          ))}
        </div>


        {/* Inline ad between grids/sections */}

        <div className="contentCard aboutCard">
  <h2 className="contentTitle">About TryAtLabs</h2>

  <ul className="aboutList">
    <li>
      A modern, browser-based productivity platform designed for fast, everyday digital tasks.
    </li>
    <li>
      Tools work instantly without downloads, registrations, or unnecessary setup.
    </li>
    <li>
      Built with a clean interface that stays consistent across desktop and mobile devices.
    </li>
  </ul>

  {!open && (
    <button
      className="btn btnGhost aboutReadMore"
      onClick={() => setOpen(true)}
      type="button"
    >
      Read more
    </button>
  )}

  {open && (
    <>
      <ul className="aboutList aboutListSecondary">
        <li>
          Includes a growing collection of text utilities such as formatting, cleanup,
          comparison, and extraction tools.
        </li>
        <li>
          Each tool is focused on solving real-world problems with minimal steps and clear output.
        </li>
        <li>
          Designed with a privacy-first mindset, ensuring predictable behavior and reliable
          performance across use cases.
        </li>
      </ul>
    </>
  )}
</div>

      </section>
    </>


  );
}
