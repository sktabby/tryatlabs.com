import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { useMemo } from "react";
import { PDF_TOOLS } from "../app/site.config.js";
import "./result.css";

function pickSuggestions(currentSlug, count = 6) {
  const other = PDF_TOOLS.filter((t) => t.slug !== currentSlug);
  const score = (t) => (t.badge?.toLowerCase().includes("popular") ? 10 : 0);
  return other.sort((a, b) => score(b) - score(a)).slice(0, count);
}

function bytesToSize(bytes) {
  if (bytes == null) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(k)));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function Result() {
  const nav = useNavigate();
  const { state } = useLocation();

  // If user refreshed or opened directly
  if (!state?.blobUrl) {
    return (
      <section className="section">
        <div className="card resultCard">
          <h1 className="resultTitle">Result expired</h1>
          <p className="muted">
            This download link is no longer available. Please run the tool again.
          </p>

          <div className="actions">
            <Link className="btn btn--primary" to="/">
              Go to tools
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { slug, title, fileName, blobUrl, sizeBytes } = state;
  const suggestions = useMemo(() => pickSuggestions(slug, 6), [slug]);

  const download = () => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // ✅ revoke AFTER click (critical)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
  };

  return (
    <section className="section">
      <div className="card resultCard">
        <div className="resultTop">
          <button className="btn btn--ghost" onClick={() => nav(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="muted">TryAtLabs PDF</div>
        </div>

        <h1 className="resultTitle">{title}</h1>

        <div className="resultMain">
          <button className="btn btn--primary resultDownload" onClick={download}>
            <Download size={18} /> Download {fileName}
          </button>

          {sizeBytes != null && (
            <div className="muted resultMeta">
              File size: {bytesToSize(sizeBytes)}
            </div>
          )}
        </div>

        <div className="resultContinue">
          <div className="resultContinue__head">
            <div className="resultContinue__title">Continue to…</div>
            <Link to="/" className="resultSeeMore">
              All tools <ArrowRight size={16} />
            </Link>
          </div>

          <div className="resultGrid">
            {suggestions.map((t) => (
              <Link key={t.slug} to={`/${t.slug}`} className="resultItem">
                <div>
                  <div className="resultItem__title">{t.title}</div>
                  <div className="muted">{t.desc}</div>
                </div>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
