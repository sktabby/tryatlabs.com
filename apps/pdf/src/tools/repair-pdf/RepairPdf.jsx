import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./repair-pdf.css";

export default function RepairPdf() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onPick = (e) => {
    setError("");
    const picked = Array.from(e.target.files || []).find((f) => f.type === "application/pdf");
    setFile(picked || null);
    e.target.value = "";
  };

  const clear = () => setFile(null);

  const repair = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file) throw new Error("Please upload a PDF file to repair.");

      const inBytes = await file.arrayBuffer();

      // Load with tolerant options (helps on odd PDFs)
      const src = await PDFDocument.load(inBytes, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      const out = await PDFDocument.create();

      const indices = src.getPageIndices(); // [0..n-1]
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));

      // These save options increase compatibility for "repaired" PDFs
      const outBytes = await out.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: true,
      });

      const baseName = file.name.replace(/\.pdf$/i, "") || "tryatlabs";
      const outName = `${baseName}-repaired.pdf`;

      goToResult(navigate, {
        slug: "repair-pdf",
        title: "PDF has been repaired!",
        fileName: outName,
        bytes: outBytes,
      });
    } catch (e) {
      setError(
        e?.message ||
          "Failed to repair this PDF. It may be heavily corrupted, password-protected, or unsupported."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--repair card">
      <div className="row">
        <label className="drop">
          <input type="file" accept="application/pdf" onChange={onPick} />
          <div>
            <div className="drop__title">Drop a PDF here or click to upload</div>
            <div className="muted">
              We’ll rebuild the PDF structure safely in your browser. Nothing is uploaded.
            </div>
          </div>
        </label>
      </div>

      {file && (
        <div className="list">
          <div className="listItem">
            <div>
              <div className="listItem__title">{file.name}</div>
              <div className="muted">{niceBytes(file.size)}</div>

              <div className="repairHint">
                <span className="hintChip">Privacy-first</span>
                <span className="hintChip">Client-side repair</span>
                <span className="hintChip">Best for minor corruption</span>
              </div>
            </div>

            <button className="btn btn--ghost" onClick={clear} disabled={busy}>
              Remove
            </button>
          </div>
        </div>
      )}

      {!file && (
        <div className="repairInfo">
          <div className="repairInfo__title">What Repair PDF can help with</div>
          <ul className="repairInfo__list">
            <li>PDF won’t open properly in some viewers</li>
            <li>Pages show blank / errors due to broken structure</li>
            <li>PDF loads slowly because of corrupted internal references</li>
          </ul>
        </div>
      )}

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={busy || !file} onClick={repair}>
          {busy ? "Repairing..." : "Repair & Continue"}
        </button>

        <button className="btn btn--ghost" disabled={busy || !file} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
