import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import {
  convertDocxToPdfBytes,
  renderDocxPreviewToEl,
  clamp,
} from "../../Services/wordToPdfClient.js";
import "./word-to-pdf.css";

export default function WordToPdf() {
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [pagePreset, setPagePreset] = useState("a4");
  const [margin, setMargin] = useState(0.35);
  const [quality, setQuality] = useState(2);

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const outName = useMemo(() => {
    if (!file) return "tryatlabs-word.pdf";
    const base = file.name.replace(/\.docx$/i, "");
    return `${base}.pdf`;
  }, [file]);

  const isDocx = (f) =>
    !!f &&
    (f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      /\.docx$/i.test(f.name));

  const onPick = async (e) => {
    setError("");
    const picked = Array.from(e.target.files || []).find(isDocx);
    e.target.value = "";

    if (!picked) {
      setFile(null);
      if (previewRef.current) previewRef.current.innerHTML = "";
      setError("Please upload a DOCX file (.docx).");
      return;
    }

    setFile(picked);

    // render preview (best effort)
    try {
      if (previewRef.current) await renderDocxPreviewToEl(picked, previewRef.current);
    } catch {
      setError("Could not preview this DOCX. You can still try converting.");
    }
  };

  const clear = () => {
    setFile(null);
    setError("");
    if (previewRef.current) previewRef.current.innerHTML = "";
    if (inputRef.current) inputRef.current.value = "";
  };

  const convert = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file) throw new Error("Please upload a DOCX file first.");
      if (!previewRef.current) throw new Error("Preview container missing.");

      const bytes = await convertDocxToPdfBytes({
        file,
        previewEl: previewRef.current,
        pagePreset,
        marginIn: clamp(Number(margin || 0), 0, 2),
        quality: clamp(Number(quality || 2), 1, 3),
      });

      goToResult(navigate, {
        slug: "word-to-pdf",
        title: "Word document converted to PDF!",
        fileName: outName,
        bytes,
      });
    } catch (e) {
      setError(e?.message || "Conversion failed. Try reducing quality.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--word2pdf card">
      <div className="wTop">
        <div className="wTop__left">
          <div className="wKicker">Word to PDF</div>
          <div className="muted wSub">Client-side conversion (layout may slightly differ).</div>
        </div>

        <div className="wTop__right">
          <input
            ref={inputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onPick}
            style={{ display: "none" }}
          />
          <button className="btn btn--primary" onClick={() => inputRef.current?.click()} disabled={busy}>
            {file ? "Replace DOCX" : "Upload DOCX"}
          </button>
          <button className="btn btn--ghost" onClick={clear} disabled={busy || (!file && !error)}>
            Clear
          </button>
        </div>
      </div>

      {file && (
        <div className="fileBar">
          <div className="fileDot" />
          <div className="fileText">
            <div className="fileName">{file.name}</div>
            <div className="muted">{niceBytes(file.size)}</div>
          </div>
          <div className="filePill">Ready</div>
        </div>
      )}

      <div className="grid2">
        <div className="panel">
          <div className="panelTitle">Conversion settings</div>

          <div className="wGrid">
            <div className="field">
              <div className="field__label">Page size</div>
              <select className="input" value={pagePreset} onChange={(e) => setPagePreset(e.target.value)} disabled={busy}>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </div>

            <div className="field">
              <div className="field__label">Margins (inch)</div>
              <input
                className="input"
                type="number"
                min={0}
                max={2}
                step={0.05}
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                disabled={busy}
              />
            </div>

            <div className="field">
              <div className="field__label">Quality</div>
              <select className="input" value={quality} onChange={(e) => setQuality(Number(e.target.value))} disabled={busy}>
                <option value={1.25}>Balanced</option>
                <option value={2}>High</option>
                <option value={2.75}>Max</option>
              </select>
            </div>
          </div>

          <div className="panelNote">
            Tip: For a cleaner look, keep margins ~0.35–0.50 and quality at High.
          </div>
        </div>

        <div className="previewCard">
          <div className="previewHead">
            <div className="previewTitle">Preview</div>
            <div className="muted small">Used for PDF capture.</div>
          </div>

          <div className={`wPreview wPreview--${pagePreset}`} ref={previewRef} />
          {!file && <div className="previewPh">Upload a DOCX to preview it here.</div>}
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" onClick={convert} disabled={!file || busy}>
          {busy ? "Converting..." : "Convert & Continue"}
        </button>
      </div>
    </div>
  );
}
