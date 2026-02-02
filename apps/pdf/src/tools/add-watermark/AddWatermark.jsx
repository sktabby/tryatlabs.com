import { useMemo, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { loadPdfFromFile, savePdfToBlob, addWatermarkText } from "../shared/pdfCore.js";
import { downloadBlob, niceBytes } from "../shared/fileUi.js";
import "./add-watermake.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function AddWatermark() {
  const [file, setFile] = useState(null);

  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.2);
  const [rotation, setRotation] = useState(35);
  const [fontSize, setFontSize] = useState(42);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // drag + preview
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMeta, setPreviewMeta] = useState("");

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const buildPreview = async (pdfBytes) => {
    try {
      const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
      const page = await doc.getPage(1);

      const viewport = page.getViewport({ scale: 0.95 });
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

    // Preview is optional (best-effort)
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
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    await addPickedFile(f);
  };

  const run = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file) throw new Error("Please upload a PDF first.");
      if (!text.trim()) throw new Error("Please enter watermark text.");

      const pdf = await loadPdfFromFile(file);
      await addWatermarkText(pdf, text.trim(), {
        opacity: Number(opacity),
        rotation: Number(rotation),
        fontSize: Number(fontSize)
      });

      const blob = await savePdfToBlob(pdf);
      downloadBlob(blob, "tryatlabs-watermarked.pdf");
    } catch (e) {
      setError(e?.message || "Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--watermark card">
      <div className="grid2">
        {/* Drop zone */}
        <div
          className={`drop ${dragging ? "isDragging" : ""}`}
          onDragEnter={() => setDragging(true)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
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
            <div className="muted">{file ? info : "Add a watermark across all pages."}</div>
          </div>
        </div>

        {/* Panel */}
        <div className="panel">
          {file && (
            <div className="previewRow">
              <div className="previewTop">
                <div className="previewTitle">Preview</div>
                <div className="muted">{previewMeta}</div>
              </div>

              {previewUrl ? (
                <div className="previewMedia">
                  <img src={previewUrl} alt="PDF preview page 1" />
                  {/* simulated overlay */}
                  <div
                    className="wmOverlay"
                    style={{
                      opacity: Number(opacity),
                      transform: `translate(-50%, -50%) rotate(${Number(rotation)}deg)`,
                      fontSize: Math.max(12, Math.min(72, Number(fontSize))) * 0.45
                    }}
                    aria-hidden="true"
                  >
                    {text || "WATERMARK"}
                  </div>
                </div>
              ) : (
                <div className="muted">Preview unavailable for this PDF.</div>
              )}

              <div className="hint">Preview is simulated on page 1 to show placement/rotation.</div>
            </div>
          )}

          <div className="field">
            <div className="field__label">Watermark text</div>
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <div className="grid3">
            <div className="field">
              <div className="field__label">Opacity</div>
              <input
                className="input"
                type="number"
                step="0.05"
                min="0.05"
                max="0.9"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field__label">Rotation</div>
              <input
                className="input"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field__label">Font size</div>
              <input
                className="input"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={8}
                max={120}
              />
            </div>
          </div>

          <div className="tip">
            Tip: Use lower opacity (0.10–0.25) for clean “professional” watermarking.
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={run}>
          {busy ? "Applying..." : "Apply & Download"}
        </button>
      </div>
    </div>
  );
}
