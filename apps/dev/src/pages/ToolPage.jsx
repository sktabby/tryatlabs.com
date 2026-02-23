

import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { DEV_TOOLS, SITE } from "../app/site.config.js";
import { SeoHead } from "../seo/SeoHead.jsx";
import { breadcrumbJsonLd, toolJsonLd } from "../seo/jsonld.js";
import { DEV_TOOL_COMPONENTS } from "../tools/index.jsx";
import"../styles/Toolpage.css"
import ToolsHub from "../components/common/ToolsHub.jsx";

export default function ToolPage() {
  const { slug } = useParams();

  const tool = useMemo(() => DEV_TOOLS.find((t) => t.slug === slug), [slug]);
  const ToolComp = DEV_TOOL_COMPONENTS[slug];

  if (!tool || !ToolComp) {
    return (
      <div className="section">
        <div className="sectionHead">
          <h1 className="h2">Tool not found</h1>
          <p className="muted">This tool doesn’t exist (yet).</p>
          <Link className="btnGhost" to="/">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const canonical = `${SITE.baseUrl}/tools/${tool.slug}`;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE.baseUrl}/` },
      { name: tool.title, url: canonical },
    ]),
    toolJsonLd({ title: tool.title, description: tool.description, url: canonical }),
  ];

  return (
    <>
      <SeoHead
        title={tool.title}
        description={tool.description}
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <section className="section">
     

        <div className="toolStage">
          <ToolComp />
        </div>
 <ToolsHub />
      
      </section>
    </>
  );
}
