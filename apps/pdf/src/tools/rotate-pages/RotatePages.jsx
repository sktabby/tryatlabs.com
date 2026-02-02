import { useMemo, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { degrees } from "pdf-lib";
import { loadPdfFromFile, savePdfToBlob } from "../shared/pdfCore.js";
import { downloadBlob, niceBytes } from "../shared/fileUi.js";
import "./rotate-pages.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function RotatePages() {
  const [file, setFile] = useState(null);
  const [angle, setAngle] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // drag + preview
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMeta, setPreviewMeta] = useState("");

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const clear = () => {
    setFile(null);
    setError("");
    setPreviewUrl("");
    setPreviewMeta("");
    setDragging(false);
    dragDepth.current = 0;
  };

  const buildPreview = async (pdfBytes) => {
    try {
      const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
      const page = await doc.getPage(1);

      // lightweight preview render
      const viewport = page.getViewport({ scale: 0.9 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

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
      setError("Please select a PDF.");
      return;
    }

    setFile(f);

    // preview
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

  const rotate = async () => {
    setBusy(true);
    setError("");
    try {
      if (!file) throw new Error("Please upload a PDF first.");

      const pdf = await loadPdfFromFile(file);
      pdf.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + angle) % 360)));

      const blob = await savePdfToBlob(pdf);
      downloadBlob(blob, "tryatlabs-rotated.pdf");
    } catch (e) {
      setError(e?.message || "Rotate failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--rotate card">
      <div className="grid2">
        {/* Drop zone */}
        <div
          className={`drop ${dragging ? "isDragging" : ""}`}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragEnd={() => {
            dragDepth.current = 0;
            setDragging(false);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.currentTarget.querySelector('input[type="file"]')?.click();
            }
          }}
        >
          <input type="file" accept="application/pdf" onChange={onPick} />
          <div className="drop__inner">
            <div className="drop__title">{file ? "Replace PDF" : "Upload PDF"}</div>
            <div className="muted">{file ? info : "Drop a PDF or click to upload. Rotates all pages."}</div>
          </div>
        </div>

        {/* Panel */}
        <div className="panel">
          {file && (
            <div className="previewCard">
              <div className="previewTop">
                <div className="previewTitle">Preview</div>
                <div className="muted">{previewMeta || `Will rotate by ${angle}°`}</div>
              </div>

              {previewUrl ? (
                <div className="previewMedia">
                  <img src={previewUrl} alt="PDF preview page 1" />
                </div>
              ) : (
                <div className="muted">Preview unavailable for this PDF.</div>
              )}
            </div>
          )}

          <div className="field">
            <div className="field__label">Rotation</div>
            <select className="input" value={angle} onChange={(e) => setAngle(Number(e.target.value))}>
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
            <div className="muted">Applies to all pages.</div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={rotate}>
          {busy ? "Rotating..." : "Rotate & Download"}
        </button>
        <button className="btn btn--ghost" disabled={busy && !!file} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
