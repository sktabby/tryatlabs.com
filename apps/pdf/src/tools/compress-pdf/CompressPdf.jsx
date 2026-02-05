import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument } from "pdf-lib";
import { niceBytes } from "../shared/fileUi.js";
import "./compresspdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TOOL_SLUG = "compress-pdf";
const TOOL_TITLE = "Compress PDF";

export default function CompressPdf() {
  const nav = useNavigate();

  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Controls
  const [quality, setQuality] = useState(0.7); // 0.3 - 0.9
  const [scale, setScale] = useState(1.0); // 0.6 - 1.2

  // Drag UI
  const [dragging, setDragging] = useState(false);

  // Stable bytes (prevents ArrayBuffer detach issues)
  const bytesRef = useRef(null); // Uint8Array

  const info = useMemo(
    () => (file ? `${file.name} • ${niceBytes(file.size)}` : ""),
    [file]
  );

  const clear = () => {
    setFile(null);
    setBusy(false);
    setError("");
    bytesRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  };

  const loadPdf = async (f) => {
    setError("");
    setFile(null);
    bytesRef.current = null;

    try {
      const buf = await f.arrayBuffer();
      bytesRef.current = new Uint8Array(buf);
      setFile(f);
    } catch {
      setError("Could not read this PDF.");
      setFile(null);
      bytesRef.current = null;
    }
  };

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    await loadPdf(f);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const f = e.dataTransfer.files?.[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please drop a PDF file only.");
      return;
    }

    await loadPdf(f);
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const compress = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file || !bytesRef.current) throw new Error("Please upload a PDF.");

      const q = clamp(Number(quality) || 0.7, 0.3, 0.9);
      const s = clamp(Number(scale) || 1.0, 0.6, 1.2);

      // ✅ pdfjs source for rendering pages (fresh bytes slice)
      const src = await pdfjs.getDocument({ data: bytesRef.current.slice() }).promise;

      const out = await PDFDocument.create();

      for (let i = 1; i <= src.numPages; i++) {
        const page = await src.getPage(i);
        const viewport = page.getViewport({ scale: 1.4 * s });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Canvas not supported in this browser.");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const jpgUrl = canvas.toDataURL("image/jpeg", q);
        const jpgBytes = await (await fetch(jpgUrl)).arrayBuffer();

        const jpg = await out.embedJpg(jpgBytes);
        const p = out.addPage([canvas.width, canvas.height]);
        p.drawImage(jpg, { x: 0, y: 0, width: canvas.width, height: canvas.height });
      }

      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // ✅ redirect to your existing Result.jsx
      nav("/result", {
        state: {
          slug: TOOL_SLUG,
          title: TOOL_TITLE,
          fileName: "tryatlabs-compressed.pdf",
          blobUrl,
          sizeBytes: outBytes?.byteLength ?? blob.size,
        },
      });
    } catch (e) {
      setError(e?.message || "Compress failed (some PDFs are restricted).");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--compress card">
      {/* Top bar */}
      <div className="compressTop">
        <div className="compressTop__left">
        
          <div className="muted compressSub">
            Reduce file size by re-rendering pages with controlled <b>quality</b> and <b>scale</b>.
          </div>
        </div>

        <div className="compressTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary compressUploadBtn"
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

      {/* Upload strip (header only, no preview) */}
   

      <div className="grid2">
        {/* File header card */}
        <div className="fileCard">
          <div className="fileCard__head">
            <div className="fileCard__title">File</div>
            <div className="fileCard__badge">{file ? "Loaded" : "No file"}</div>
          </div>

          <div className="fileCard__body">
            <div className="fileName">{file ? file.name : "Upload a PDF to start"}</div>
            <div className="muted">{file ? `Size: ${niceBytes(file.size)}` : "PDF remains on your device."}</div>
          </div>

          <div className="fileCard__foot muted">
            Tip: If your PDF is already optimized, size may not reduce much.
          </div>
        </div>

        {/* Settings Panel */}
        <div className="panel">
          <div className="panelTitle">Compression Settings</div>

          <div className="controlCard">
            <div className="controlTop">
              <div className="controlLabel">Quality</div>
              <div className="valuePill">{Number(quality).toFixed(2)}</div>
            </div>

            <input
              className="range"
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={!file || busy}
            />

            <div className="muted controlHint">Lower = smaller size, more blur.</div>
          </div>

          <div className="controlCard">
            <div className="controlTop">
              <div className="controlLabel">Scale</div>
              <div className="valuePill">{Number(scale).toFixed(1)}×</div>
            </div>

            <input
              className="range"
              type="range"
              min="0.6"
              max="1.2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              disabled={!file || busy}
            />

            <div className="muted controlHint">Lower scale reduces resolution.</div>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <div className="statLabel">Original</div>
              <div className="statValue">{file ? niceBytes(file.size) : "—"}</div>
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

          <div className="panelNote">
            Best range: <b>Quality 0.60–0.75</b> and <b>Scale 0.8–1.0</b>.
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={compress}>
          {busy ? "Compressing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
