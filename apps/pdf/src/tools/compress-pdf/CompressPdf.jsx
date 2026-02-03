import { useEffect, useMemo, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { PDFDocument } from "pdf-lib";
import { downloadBlob, niceBytes } from "../shared/fileUi.js";
import "./compresspdf.css";
import { useRef } from "react";


pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);


  // keep numeric
  const [quality, setQuality] = useState(0.7); // 0.3 - 0.9
  const [scale, setScale] = useState(1.0); // 0.6 - 1.2

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resultInfo, setResultInfo] = useState("");

  // drag + preview
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(""); // first page png dataURL
  const [previewMeta, setPreviewMeta] = useState(""); // pages count or hint

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const clearAll = () => {
    setFile(null);
    setError("");
    setResultInfo("");
    setPreviewUrl("");
    setPreviewMeta("");
  };

  const buildPreview = async (pdfBytes) => {
    try {
      const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
      const page = await doc.getPage(1);

      // small preview render (fast)
      const viewport = page.getViewport({ scale: 0.9 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      setPreviewUrl(canvas.toDataURL("image/png"));
      setPreviewMeta(`Pages: ${doc.numPages}`);
    } catch {
      // preview is optional
      setPreviewUrl("");
      setPreviewMeta("");
    }
  };

  const addPickedFile = async (f) => {
    setError("");
    setResultInfo("");

    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please select a PDF.");
      return;
    }

    setFile(f);

    // build preview (first page)
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

  const compress = async () => {
    setBusy(true);
    setError("");
    setResultInfo("");

    try {
      if (!file) throw new Error("Please upload a PDF first.");

      const bytes = await file.arrayBuffer();
      const src = await pdfjs.getDocument({ data: bytes }).promise;

      const out = await PDFDocument.create();

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale: 1.4 * Number(scale) });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpgUrl = canvas.toDataURL("image/jpeg", Number(quality));
        const jpgBytes = await (await fetch(jpgUrl)).arrayBuffer();

        const jpg = await out.embedJpg(jpgBytes);
        const p = out.addPage([canvas.width, canvas.height]);
        p.drawImage(jpg, { x: 0, y: 0, width: canvas.width, height: canvas.height });
      }

      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });

      setResultInfo(`Original: ${niceBytes(file.size)} • New: ${niceBytes(blob.size)}`);
      downloadBlob(blob, "tryatlabs-compressed.pdf");
    } catch (e) {
      setError(e?.message || "Compress failed (some PDFs are restricted).");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--compress card">
      <div className="grid2">
        {/* Drop Zone */}
        <div
          className={`drop ${dragging ? "isDragging" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={() => setDragging(true)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            if (e.currentTarget.contains(e.relatedTarget)) return;
            setDragging(false);
          }}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false /* change to true for merge */}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <div className="drop__inner">
            <div className="drop__title">{file ? "Replace PDF" : "Upload PDF"}</div>
            <div className="muted">{file ? info : "Drop a PDF or click to upload"}</div>
          </div>
        </div>


        {/* Settings Panel */}
        <div className="panel">
          {/* Preview */}
          {file && (
            <div className="previewCard">
              <div className="previewTop">
                <div className="previewTitle">Preview</div>
                <div className="muted">{previewMeta}</div>
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

          <div className="qualityRow">
            <div className="field">
              <div className="field__label">Quality (JPEG)</div>
              <input
                className="input"
                type="number"
                min="0.3"
                max="0.9"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
              <div className="muted">Lower = smaller size, more blur.</div>
            </div>

            <div className="field">
              <div className="field__label">Scale</div>
              <input
                className="input"
                type="number"
                min="0.6"
                max="1.2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
              <div className="muted">Lower scale reduces resolution (smaller file).</div>
            </div>
          </div>

          {file && (
            <div className="statRow">
              <div className="statCard">
                <div className="statLabel">Original size</div>
                <div className="statValue">{niceBytes(file.size)}</div>
              </div>
              <div className="statCard">
                <div className="statLabel">Quality</div>
                <div className="statValue">{Number(quality).toFixed(2)}</div>
              </div>
              <div className="statCard">
                <div className="statLabel">Scale</div>
                <div className="statValue">{Number(scale).toFixed(1)}×</div>
              </div>
            </div>
          )}

          {file && (
            <div className="panelActions">
              <button className="btn btn--ghost" disabled={busy} onClick={clearAll}>
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {resultInfo && <div className="alert alert--ok">{resultInfo}</div>}
      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={compress}>
          {busy ? "Compressing..." : "Compress & Download"}
        </button>
      </div>
    </div>
  );
}
