import { useMemo, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { loadPdfFromFile, addPageNumbers } from "../shared/pdfCore.js";
import { niceBytes } from "../shared/fileUi.js";
import { useNavigate } from "react-router-dom";
import { goToResult } from "../shared/goToResult.js";
import "./add-page-number.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TOOL_SLUG = "add-page-numbers";
const TOOL_TITLE = "Add Page Numbers";

export default function AddPageNumbers() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const [startAt, setStartAt] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [position, setPosition] = useState("bottom-center");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // drag (stable)
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  // preview
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMeta, setPreviewMeta] = useState("");

  const navigate = useNavigate();

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const clear = () => {
    setFile(null);
    setError("");
    setDragging(false);
    dragDepth.current = 0;
    setPreviewUrl("");
    setPreviewMeta("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const buildPreview = async (pdfBytes) => {
    try {
      const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
      const page = await doc.getPage(1);

      const viewport = page.getViewport({ scale: 0.95 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: false });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      setPreviewUrl(canvas.toDataURL("image/png"));
      setPreviewMeta(`Pages: ${doc.numPages}`);
    } catch {
      setPreviewUrl("");
      setPreviewMeta("");
    }
  };

  const addPickedFile = async (f) => {
    setError("");
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setFile(f);

    // preview (optional)
    try {
      const bytes = await f.arrayBuffer();
      await buildPreview(bytes);
    } catch {
      setPreviewUrl("");
      setPreviewMeta("");
    }
  };

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    await addPickedFile(f);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragging(false);

    const f = e.dataTransfer.files?.[0];
    await addPickedFile(f);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const run = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file) throw new Error("Please upload a PDF first.");

      const pdf = await loadPdfFromFile(file);
      await addPageNumbers(pdf, {
        startAt: Number(startAt),
        fontSize: Number(fontSize),
        position,
      });

      const bytes = await pdf.save();

      // ✅ Your existing helper
      goToResult(navigate, {
        slug: TOOL_SLUG,
        title: "Page numbers added!",
        fileName: "tryatlabs-page-numbers.pdf",
        bytes,
      });
    } catch (e) {
      setError(e?.message || "Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--pagenum card">
      {/* Top bar */}
      <div className="pagenumTop">
        <div className="pagenumTop__left">
         
          <div className="muted pagenumSub">
            Preview shows placement on page 1 — numbering increments automatically for next pages.
          </div>
        </div>

        <div className="pagenumTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary pagenumUploadBtn"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {file ? "Replace PDF" : "Upload PDF"}
          </button>

          <button
            className="btn btn--ghost"
            type="button"
            onClick={clear}
            disabled={busy || (!file && !error)}
          >
            Clear
          </button>
        </div>
      </div>

    
      <div className="grid2">
        {/* Preview */}
        <div className="leftCol">
          <div className="previewCard">
            <div className="previewHead">
              <div className="previewTitle">Preview</div>
              <div className="muted">{file ? previewMeta || "Loading…" : "Upload a PDF to preview"}</div>
            </div>

            <div className="previewBody">
              {previewUrl ? (
                <div className="previewFrame">
                  <img className="previewImg" src={previewUrl} alt="PDF preview page 1" />

                  {/* Overlay simulation */}
                  <div
                    className={`previewNum previewNum--${position}`}
                    style={{ fontSize: `${Math.max(8, Math.min(22, Number(fontSize) || 10))}px` }}
                  >
                    {Number(startAt) || 1}
                  </div>
                </div>
              ) : (
                <div className="previewPh">{file ? "Loading Preview" : " preview will appear here!"}</div>
              )}
            </div>

            <div className="previewFoot muted">
              Placement preview is approximate (real placement depends on page margins).
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div className="panel">
          <div className="panelTitle">Settings</div>

          <div className="panelGrid">
            <div className="field">
              <div className="field__label">Start number</div>
              <input
                className="input"
                type="number"
                value={startAt}
                min={1}
                onChange={(e) => setStartAt(Number(e.target.value))}
                disabled={!file || busy}
              />
            </div>

            <div className="field">
              <div className="field__label">Font size</div>
              <input
                className="input"
                type="number"
                value={fontSize}
                min={8}
                max={22}
                onChange={(e) => setFontSize(Number(e.target.value))}
                disabled={!file || busy}
              />
            </div>
          </div>

          <div className="field">
            <div className="field__label">Position</div>
            <select
              className="input"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={!file || busy}
            >
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-center">Top Center</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <div className="statLabel">File</div>
              <div className="statValue">{file ? niceBytes(file.size) : "—"}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">Start</div>
              <div className="statValue">{Number(startAt) || 1}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">Position</div>
              <div className="statValue">{position.replace("-", " ")}</div>
            </div>
          </div>

          <div className="panelNote">
            Tip: Bottom Center looks best for reports; Top Right is great for scanned docs.
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={run}>
          {busy ? "Adding..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
