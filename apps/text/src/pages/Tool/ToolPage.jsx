import React from "react";
import { Link, useParams } from "react-router-dom";
import { SITE } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { breadcrumbJsonLd } from "../../seo/jsonld.js";
import { getToolBySlug, TEXT_TOOLS } from "../../tools/index.jsx";
import AdSlot from "../../components/ads/AdSlot.jsx";

export default function ToolPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="container pagePad">
        <div className="contentCard">
          <h1 className="sectionTitle">Tool not found</h1>
          <p className="sectionSub">The tool URL might be wrong or moved.</p>
          <Link to="/" className="btn btnPrimary">Go Home</Link>
        </div>
      </div>
    );
  }

  const ToolComponent = tool.component;
  const canonical = `${SITE.url}/tools/${tool.slug}`;

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", item: SITE.url },
    { name: "Tools", item: SITE.url },
    { name: tool.name, item: canonical }
  ]);

  return (
    <>
      <SeoHead
        title={`${tool.name} • TryAtLabs Text Tools`}
        description={tool.description}
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <div className="container pagePad toolPageGrid">
        <div className="toolMain">
          <div className="toolTopBar">
            <div>
              <div className="kicker">Text Tool</div>
              <h1 className="toolH1">{tool.name}</h1>
            </div>

            <Link to="/" className="btn btnGhost toolBackBtn">
              Back
            </Link>
          </div>

          <div className="toolPanel">
            <ToolComponent />
          </div>
        </div>

        {/* Sticky rail */}
        <aside className="toolRail">
          <div className="contentCard">
            <h2 className="contentTitle">More tools</h2>
            <div className="miniGrid">
              {TEXT_TOOLS.filter((t) => t.slug !== tool.slug)
                .slice(0, 4)
                .map((t) => (
                  <Link key={t.slug} className="miniTool" to={`/tools/${t.slug}`}>
                    <div className="miniName">{t.name}</div>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* =========================
          Premium Scoped Styles
      ========================= */}
      <style>{`
        .toolRail {
          position: sticky;
          top: 84px;
          align-self: flex-start;
        }

        .toolRail .contentCard {
          padding: 16px;
          border-radius: 22px;
          background: linear-gradient(
            180deg,
            color-mix(in srgb, var(--card) 86%, transparent),
            color-mix(in srgb, var(--card) 94%, transparent)
          );
          box-shadow: 0 22px 60px rgba(80, 61, 92, 0.14);
        }

        .miniGrid {
          margin-top: 12px;
          display: grid;
          gap: 10px;
        }

        .miniTool {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          text-decoration: none;
          transition:
            transform 0.15s ease,
            background 0.15s ease,
            box-shadow 0.15s ease,
            border-color 0.15s ease;
        }

        .miniTool:hover {
          background: color-mix(in srgb, var(--p1) 14%, transparent);
          border-color: color-mix(in srgb, var(--p1) 40%, var(--border));
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(80, 61, 92, 0.22);
        }

        .miniName {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: var(--text);
          line-height: 1.2;
        }

        .miniTool:not(:last-child) {
          position: relative;
        }

        .miniTool:not(:last-child)::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 10px;
          right: 10px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.08),
            transparent
          );
        }

        @media (max-width: 900px) {
          .toolRail {
            position: static;
          }
        }
      `}</style>
    </>
  );
}
