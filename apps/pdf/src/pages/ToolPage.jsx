import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { PDF_TOOLS, SITE } from "../app/site.config.js";
import { SeoHead } from "../seo/SeoHead.jsx";
import { websiteJsonLd, breadcrumbJsonLd, toolJsonLd } from "../seo/jsonld.js";

// Tools
import MergePdf from "../tools/merge-pdf/MergePdf.jsx";
import SplitPdf from "../tools/split-pdf/SplitPdf.jsx";
import CompressPdf from "../tools/compress-pdf/CompressPdf.jsx";
import ReorderPages from "../tools/reorder-pages/ReorderPages.jsx";
import RotatePages from "../tools/rotate-pages/RotatePages.jsx";
import ExtractPages from "../tools/extract-pages/ExtractPages.jsx";
import AddPageNumbers from "../tools/add-page-numbers/AddPageNumbers.jsx";
import AddWatermark from "../tools/add-watermark/AddWatermark.jsx";
import WordToPdf from "../tools/word-to-pdf/WordToPdf.jsx";
import CropPdf from "../tools/crop-pdf/CropPdf.jsx";

const MAP = {
  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "compress-pdf": CompressPdf,
  "reorder-pages": ReorderPages,
  "rotate-pages": RotatePages,
  "extract-pages": ExtractPages,
  "add-page-numbers": AddPageNumbers,
  "add-watermark": AddWatermark,
  "word-to-pdf": WordToPdf,
  "crop-pdf": CropPdf,
};

const CATEGORY_LABEL = {
  organize: "Organize PDF",
  optimize: "Optimize PDF",
  convert: "Convert PDF",
  edit: "Edit PDF",
  security: "PDF Security",
};

export default function ToolPage() {
  const { toolSlug } = useParams();

  const meta = useMemo(() => PDF_TOOLS.find((x) => x.slug === toolSlug), [toolSlug]);
  const Tool = MAP[toolSlug];

  // ✅ Not found page
  if (!meta) {
    const canonical = `${SITE.url}/${toolSlug || ""}`;

    return (
      <div className="toolPage">
        <SeoHead
          title="Tool not found"
          description="That PDF tool doesn’t exist or was moved."
          canonical={canonical}
          robots="noindex,follow"
          jsonLd={{
            website: websiteJsonLd(),
            breadcrumb: breadcrumbJsonLd([
              { name: "Home", url: `${SITE.url}/` },
              { name: "Tool not found", url: canonical },
            ]),
          }}
        />

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Tool not found</h2>
          <p className="muted">That PDF tool doesn’t exist or was moved.</p>
          <Link className="btn btn--primary" to="/">
            Back to PDF Home
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Canonical for tool pages
  const canonical = `${SITE.url}/${meta.slug}`;

  // ✅ If route exists in config but component missing
  const comingSoon = !Tool;

  return (
    <div className="toolPage">
      <SeoHead
        title={meta.seoTitle || meta.title}
        description={meta.seoDesc || meta.desc || SITE.description}
        canonical={canonical}
        keywords={meta.keywords}
        jsonLd={{
          website: websiteJsonLd(),
          breadcrumb: breadcrumbJsonLd([
            { name: "Home", url: `${SITE.url}/` },
            { name: meta.title, url: canonical },
          ]),
          tool: toolJsonLd({
            name: meta.title,
            description: meta.desc || SITE.description,
            url: canonical,
          }),
        }}
      />

      {/* ✅ Tool header UI */}
      <div className="toolHeader">
        <div>
          <div className="kicker">{CATEGORY_LABEL[meta.category] || "PDF Tool"}</div>
          <h1 className="toolTitle">{meta.title}</h1>
          <p className="muted">{meta.desc || "Fast, private PDF processing — runs in your browser."}</p>
        </div>

        <Link className="btn btn--ghost" to="/">
          ← All Tools
        </Link>
      </div>

      {/* ✅ Tool body */}
      {comingSoon ? (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Coming soon</h2>
          <p className="muted">
            We’re building <b>{meta.title}</b>. Meanwhile, try one of these popular tools:
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            <Link className="btn btn--primary" to="/merge-pdf">
              Merge PDF
            </Link>
            <Link className="btn btn--ghost" to="/compress-pdf">
              Compress PDF
            </Link>
            <Link className="btn btn--ghost" to="/reorder-pages">
              Reorder Pages
            </Link>
          </div>
        </div>
      ) : (
        <Tool />
      )}
    </div>
  );
}
