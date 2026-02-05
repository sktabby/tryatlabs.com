import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { degrees } from "pdf-lib";
import { loadPdfFromFile, savePdfToBlob } from "../shared/pdfCore.js";
import { niceBytes } from "../shared/fileUi.js";
import "./rotate-pages.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TOOL_SLUG = "rotate-pages";
const TOOL_TITLE = "Rotate Pages";

/**
 * ✅ Sharp thumbnail render (same approach as SplitPdf)
 */
async function renderThumbFromPdf(pdfDoc, pageNo1Based, targetCssWidth = 320) {
  try {
    const pageNo = Math.max(1, Math.min(pageNo1Based, pdfDoc.numPages));
    const page = await pdfDoc.getPage(pageNo);

    const dpr = Math.max(1, Math.min(2.25, window.devicePixelRatio || 1));
    const baseViewport = page.getViewport({ scale: 1 });

    const scale = (targetCssWidth * dpr) / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL("image/png");
  } catch {
    return "";
  }
}

export default function RotatePages() {
  const nav = useNavigate();

  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const [angle, setAngle] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Drag UI (no flicker)
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  // Preview
  const [pageCount, setPageCount] = useState(0);
  const [previewPage, setPreviewPage] = useState(1);
  const [thumb, setThumb] = useState("");
  const [thumbBusy, setThumbBusy] = useState(false);

  const bytesRef = useRef(null);        // Uint8Array
  const pdfjsDocRef = useRef(null);     // pdfjs doc
  const previewWrapRef = useRef(null);  // measure width

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const clear = () => {
    setFile(null);
    setError("");
    setBusy(false);

    setDragging(false);
    dragDepth.current = 0;

    setPageCount(0);
    setPreviewPage(1);
    setThumb("");
    setThumbBusy(false);

    bytesRef.current = null;
    pdfjsDocRef.current = null;

    if (inputRef.current) inputRef.current.value = "";
  };

  const getPreviewTargetWidth = () => {
    const w = previewWrapRef.current?.clientWidth || 320;
    return Math.max(240, Math.min(360, Math.floor(w)));
  };

  const updateThumb = async (nextPage) => {
    const pdf = pdfjsDocRef.current;
    if (!pdf) return;

    const safe = Math.max(1, Math.min(nextPage, pageCount || pdf.numPages));
    setPreviewPage(safe);

    setThumbBusy(true);
    const t = await renderThumbFromPdf(pdf, safe, getPreviewTargetWidth());
    setThumb(t);
    setThumbBusy(false);
  };

  const loadPdfInfo = async (f) => {
    setError("");
    setFile(f);

    setPageCount(0);
    setPreviewPage(1);
    setThumb("");
    setThumbBusy(false);

    bytesRef.current = null;
    pdfjsDocRef.current = null;

    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf);
      bytesRef.current = bytes;

      // ✅ pdf-lib for page count (safe)
      const pdfLibDoc = await loadPdfFromFile(f);
      const count = pdfLibDoc.getPageCount();
      setPageCount(count);

      // ✅ pdfjs for preview
      try {
        const pdf = await pdfjs.getDocument({ data: bytes.slice() }).promise;
        pdfjsDocRef.current = pdf;
        await updateThumb(1);
      } catch {
        setThumb("");
      }
    } catch {
      setError("Could not read this PDF.");
      setFile(null);
      setPageCount(0);
      setPreviewPage(1);
      setThumb("");
      bytesRef.current = null;
      pdfjsDocRef.current = null;
    }
  };

  const addPickedFile = async (f) => {
    setError("");
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    await loadPdfInfo(f);
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
      pdf.getPages().forEach((p) =>
        p.setRotation(degrees((p.getRotation().angle + angle) % 360))
      );

      const blob = await savePdfToBlob(pdf);
      const blobUrl = URL.createObjectURL(blob);

      // ✅ Redirect to your existing Result.jsx
      nav("/result", {
        state: {
          slug: TOOL_SLUG,
          title: TOOL_TITLE,
          fileName: "tryatlabs-rotated.pdf",
          blobUrl,
          sizeBytes: blob.size,
        },
      });
    } catch (e) {
      setError(e?.message || "Rotate failed.");
    } finally {
      setBusy(false);
    }
  };

  // ✅ Re-render thumbnail on resize (stays crisp)
  useEffect(() => {
    if (!pdfjsDocRef.current || !file) return;

    const el = previewWrapRef.current;
    if (!el) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => updateThumb(previewPage));
    });

    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, previewPage]);

  return (
    <div className="tool tool--rotate card">
      {/* Top bar */}
      <div className="rotateTop">
        <div className="rotateTop__left">
        
          <div className="muted rotateSub">
            Preview updates instantly — rotate affects <b>all pages</b>.
          </div>
        </div>

        <div className="rotateTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary rotateUploadBtn"
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
              <div className="muted">
                {file
                  ? pageCount
                    ? `Page ${previewPage} of ${pageCount} • Rotating ${angle}°`
                    : "Loading…"
                  : "Upload a PDF to preview"}
              </div>
            </div>

            <div className="previewBody" ref={previewWrapRef}>
              {thumb ? (
                <div className="previewFrame">
                  {/* ✅ Instant rotation preview via CSS */}
                  <img
                    className="previewImg previewImg--rot"
                    src={thumb}
                    alt="PDF preview"
                    style={{ transform: `rotate(${angle}deg)` }}
                  />
                  {thumbBusy && <div className="previewOverlay">Rendering…</div>}
                </div>
              ) : (
                <div className="previewPh">{file ? "Preview unavailable (tool still works)" : "No preview"}</div>
              )}
            </div>

            <div className="previewNav">
              <button
                className="btn btn--ghost"
                type="button"
                disabled={!file || busy || previewPage <= 1}
                onClick={() => updateThumb(previewPage - 1)}
              >
                ← Prev
              </button>

              <button
                className="btn btn--ghost"
                type="button"
                disabled={!file || busy || !pageCount || previewPage >= pageCount}
                onClick={() => updateThumb(previewPage + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Options panel */}
        <div className="panel">
          <div className="panelTitle">Rotation</div>

          <div className="field">
            <div className="field__label">Rotate by</div>
            <select
              className="input"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              disabled={!file || busy}
            >
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
            <div className="muted">Applies to all pages.</div>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <div className="statLabel">Original</div>
              <div className="statValue">{file ? niceBytes(file.size) : "—"}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">Angle</div>
              <div className="statValue">{angle}°</div>
            </div>
            <div className="statCard">
              <div className="statLabel">Scope</div>
              <div className="statValue">All pages</div>
            </div>
          </div>

          <div className="panelNote">
            Tip: Use <b>90°</b> for sideways scans and <b>180°</b> for upside-down pages.
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={rotate}>
          {busy ? "Rotating..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
