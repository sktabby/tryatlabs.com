import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Tesseract from "tesseract.js";

// ✅ pdf.js (Vite-safe, no fake worker)
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./ocr-pdf.css";

// ✅ attach worker correctly
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


// Tesseract paths (CDN) — reliable on static hosting
const TESS = {
  workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js",
  corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js",
  langPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/lang-data",
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function OcrPdf() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [lang, setLang] = useState("eng");
  const [pageMode, setPageMode] = useState("all"); // all | first
  const [firstN, setFirstN] = useState(3);
  const [scale, setScale] = useState(2); // render scale (quality/perf)

  const outName = useMemo(() => {
    if (!file) return "tryatlabs-ocr.pdf";
    const base = file.name.replace(/\.pdf$/i, "");
    return `${base}-ocr.pdf`;
  }, [file]);

  const onPick = (e) => {
    setError("");
    const picked = Array.from(e.target.files || []).find(
      (f) => f.type === "application/pdf"
    );
    setFile(picked || null);
    e.target.value = "";
  };

  const clear = () => setFile(null);

  async function renderPageToCanvas(pdf, pageIndex, scaleFactor) {
    const page = await pdf.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale: scaleFactor });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return { canvas, viewport };
  }

  async function canvasToPngBytes(canvas) {
    const blob = await new Promise((res) => canvas.toBlob(res, "image/png", 1.0));
    const ab = await blob.arrayBuffer();
    return new Uint8Array(ab);
  }

  async function doOcr() {
    if (!file || busy) return;
    setBusy(true);
    setError("");

    try {
      const pdfBytes = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      const totalPages = pdf.numPages;

      const pageCount =
        pageMode === "first"
          ? clamp(Number(firstN || 1), 1, totalPages)
          : totalPages;

      // Output PDF
      const out = await PDFDocument.create();
      const font = await out.embedFont(StandardFonts.Helvetica);

      // One Tesseract worker for all pages (faster)
      const worker = await Tesseract.createWorker(lang, 1, {
        workerPath: TESS.workerPath,
        corePath: TESS.corePath,
        langPath: TESS.langPath,
        logger: () => {}, // keep silent (we show our own UI)
      });

      for (let i = 0; i < pageCount; i++) {
        // 1) Render page to canvas (image background)
        const { canvas, viewport } = await renderPageToCanvas(pdf, i, scale);

        const pngBytes = await canvasToPngBytes(canvas);
        const png = await out.embedPng(pngBytes);

        // PDF page size in points: we map image px -> points
        // Use viewport size to keep correct proportions.
        const pageW = viewport.width;
        const pageH = viewport.height;

        const page = out.addPage([pageW, pageH]);

        // Draw the image full-page
        page.drawImage(png, { x: 0, y: 0, width: pageW, height: pageH });

        // 2) OCR the canvas image
        const { data } = await worker.recognize(canvas);

        // 3) Add invisible text layer (searchable PDF)
        // Tesseract gives bbox in image px with origin top-left.
        // pdf-lib uses origin bottom-left.
        const words = data?.words || [];

        for (const w of words) {
          const txt = (w.text || "").trim();
          if (!txt) continue;

          const x0 = w.bbox.x0;
          const y0 = w.bbox.y0;
          const x1 = w.bbox.x1;
          const y1 = w.bbox.y1;

          const boxW = x1 - x0;
          const boxH = y1 - y0;

          // Map y: top-left -> bottom-left
          const pdfX = x0;
          const pdfY = pageH - y1;

          const fontSize = clamp(boxH * 0.9, 6, 36);

          page.drawText(txt, {
            x: pdfX,
            y: pdfY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            opacity: 0.0, // invisible but searchable
            // NOTE: opacity 0 keeps it selectable/searchable in most viewers
          });
        }
      }

      await worker.terminate();

      const outBytes = await out.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: true,
      });

      goToResult(navigate, {
        slug: "ocr-pdf",
        title: "OCR completed! Searchable PDF is ready.",
        fileName: outName,
        bytes: outBytes,
      });
    } catch (e) {
      console.error(e);
      setError(
        e?.message ||
          "OCR failed. Try fewer pages, lower quality, or another PDF."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool tool--ocr card">
      <div className="row">
        <label className="drop">
          <input type="file" accept="application/pdf" onChange={onPick} />
          <div>
            <div className="drop__title">Drop a PDF here or click to upload</div>
            <div className="muted">
              Convert scanned PDFs into searchable text — processed locally in your browser.
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

              <div className="ocrHint">
                <span className="hintChip">Searchable PDF</span>
                <span className="hintChip">Client-side OCR</span>
                <span className="hintChip">Best for scanned files</span>
              </div>
            </div>

            <button className="btn btn--ghost" onClick={clear} disabled={busy}>
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="ocrOptions">
        <div className="ocrOptions__title">OCR settings</div>

        <div className="ocrGrid">
          <div className="field">
            <div className="field__label">Language</div>
            <select
              className="input"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              disabled={busy}
            >
              <option value="eng">English</option>
              <option value="hin">Hindi</option>
              <option value="eng+hin">English + Hindi</option>
            </select>
            <div className="muted small">
              Tip: “English + Hindi” is slower but more accurate for mixed text.
            </div>
          </div>

          <div className="field">
            <div className="field__label">Pages</div>
            <div className="segRow">
              <button
                type="button"
                className={`seg ${pageMode === "all" ? "seg--on" : ""}`}
                onClick={() => setPageMode("all")}
                disabled={busy}
              >
                All pages
              </button>
              <button
                type="button"
                className={`seg ${pageMode === "first" ? "seg--on" : ""}`}
                onClick={() => setPageMode("first")}
                disabled={busy}
              >
                First pages
              </button>
            </div>

            {pageMode === "first" && (
              <div className="inlineRow">
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={50}
                  value={firstN}
                  onChange={(e) => setFirstN(e.target.value)}
                  disabled={busy}
                  style={{ width: 120 }}
                />
                <div className="muted small">pages (faster)</div>
              </div>
            )}
          </div>

          <div className="field">
            <div className="field__label">Quality</div>
            <select
              className="input"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              disabled={busy}
            >
              <option value={1.5}>Balanced</option>
              <option value={2}>High (recommended)</option>
              <option value={2.5}>Max (slow)</option>
            </select>
            <div className="muted small">
              Higher quality improves OCR but uses more time/memory.
            </div>
          </div>
        </div>

        <div className="ocrNote">
          OCR happens on your device. For large PDFs, use “First pages” to test speed.
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={busy || !file} onClick={doOcr}>
          {busy ? "Running OCR..." : "OCR & Continue"}
        </button>

        <button className="btn btn--ghost" disabled={busy || !file} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
