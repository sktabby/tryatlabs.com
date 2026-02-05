import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/build/pdf";
import { ensurePdfWorker } from "../shared/pdfWorker.js";
import { goToResult } from "../shared/goToResult.js";
import { niceBytes } from "../shared/fileUi.js";
import "./crop-pdf.css";

/* ---------------- helpers ---------------- */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function rectFromPoints(a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  };
}

/* ---------------- component ---------------- */
export default function CropPdf() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [pageCount, setPageCount] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [applyMode, setApplyMode] = useState("all"); // all | single

  const [jumpTo, setJumpTo] = useState("1");

  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [rect, setRect] = useState(null);

  const [dragMode, setDragMode] = useState(null);
  const dragStartRef = useRef(null);
  const baseRectRef = useRef(null);

  const canRun = !!file && rect && rect.w > 6 && rect.h > 6 && !busy;

  const hint = useMemo(() => {
    if (!file) return "Upload a PDF to start cropping.";
    return "Drag to select area. Drag inside to move. Use corner to resize.";
  }, [file]);

  const fileInfo = useMemo(() => {
    if (!file) return "";
    const p = pageCount ? ` • ${pageCount} pages` : "";
    return `${file.name} • ${niceBytes(file.size)}${p}`;
  }, [file, pageCount]);

  /* ---------------- preview rendering ---------------- */
  async function renderPreview(pdfFile, idx) {
    ensurePdfWorker();
    const buf = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: buf }).promise;

    const page = await pdf.getPage(idx + 1);
    const stage = stageRef.current;

    const maxW = clamp(stage?.clientWidth || 820, 320, 1100);
    const base = page.getViewport({ scale: 1 });
    const scale = maxW / base.width;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    setCanvasSize({ w: canvas.width, h: canvas.height });

    const ctx = canvas.getContext("2d", { alpha: false });
    await page.render({ canvasContext: ctx, viewport }).promise;

    setRect({
      x: canvas.width * 0.06,
      y: canvas.height * 0.06,
      w: canvas.width * 0.88,
      h: canvas.height * 0.88,
    });
  }

  /* ---------------- file handling ---------------- */
  const addPickedFile = async (picked) => {
    if (!picked || picked.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    setError("");
    setFile(picked);
    setPageIndex(0);
    setApplyMode("all");

    const buf = await picked.arrayBuffer();
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    setPageCount(doc.getPageCount());
    setJumpTo("1");

    await renderPreview(picked, 0);
  };

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    await addPickedFile(f);
  };

  /* ---------------- page navigation ---------------- */
  const goPrev = async () => {
    if (!file || busy || pageIndex <= 0) return;
    const idx = pageIndex - 1;
    setPageIndex(idx);
    setJumpTo(String(idx + 1));
    await renderPreview(file, idx);
  };

  const goNext = async () => {
    if (!file || busy || pageIndex >= pageCount - 1) return;
    const idx = pageIndex + 1;
    setPageIndex(idx);
    setJumpTo(String(idx + 1));
    await renderPreview(file, idx);
  };

  const jump = async () => {
    if (!file || pageCount == null) return;

    const n = Number(jumpTo);
    if (!Number.isFinite(n)) return;

    const safe = clamp(Math.floor(n), 1, pageCount);
    const idx = safe - 1;

    setPageIndex(idx);
    setJumpTo(String(safe));
    await renderPreview(file, idx);
  };

  /* ---------------- crop interaction ---------------- */
  function getLocalPoint(e) {
    const r = stageRef.current.getBoundingClientRect();
    return {
      x: clamp(e.clientX - r.left, 0, canvasSize.w),
      y: clamp(e.clientY - r.top, 0, canvasSize.h),
    };
  }

  const onPointerDown = (e) => {
    if (!file || busy) return;
    const p = getLocalPoint(e);

    setDragMode("draw");
    dragStartRef.current = p;
    baseRectRef.current = null;
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  };

  const onPointerMove = (e) => {
    if (!dragMode || !file || busy) return;
    const p = getLocalPoint(e);
    const start = dragStartRef.current;
    setRect(rectFromPoints(start, p));
  };

  const onPointerUp = () => {
    setDragMode(null);
  };

  /* ---------------- crop logic ---------------- */
  async function crop() {
    setBusy(true);
    setError("");

    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      const pages = pdf.getPages();

      const rx = rect.x / canvasSize.w;
      const ry = rect.y / canvasSize.h;
      const rw = rect.w / canvasSize.w;
      const rh = rect.h / canvasSize.h;

      const target = applyMode === "single" ? [pages[pageIndex]] : pages;

      for (const p of target) {
        const { width, height } = p.getSize();
        const left = rx * width;
        const w = rw * width;
        const h = rh * height;
        const bottom = height - (ry * height + h);

        p.setCropBox(left, bottom, w, h);
        p.setTrimBox(left, bottom, w, h);
      }

      const out = await pdf.save();

      goToResult(navigate, {
        slug: "crop-pdf",
        title: "PDF cropped successfully!",
        fileName: "tryatlabs-cropped.pdf",
        bytes: out,
      });
    } catch (e) {
      setError(e.message || "Crop failed.");
    } finally {
      setBusy(false);
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="tool tool--crop card">
      {/* Top bar */}
      <div className="cropTop">
        <div>
         
          <div className="muted">{hint}</div>
        </div>

        <div className="cropTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={onPick}
          />
          <button
            className="btn btn--primary"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {file ? "Replace PDF" : "Upload PDF"}
          </button>
        </div>
      </div>

      <div className="cropLayout">
        {/* Viewer */}
        <div
          ref={stageRef}
          className="cropStage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {!file && <div className="cropEmpty">Upload a PDF</div>}
          <canvas ref={canvasRef} className="cropCanvas" />

          {rect && (
            <div
              className="cropRect"
              style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
            />
          )}
        </div>

        {/* Panel */}
        <div className="cropPanel card">
          <div className="field">
            <div className="field__label">Go to page</div>
            <div className="jumpRow">
              <input
                className="input"
                value={jumpTo}
                onChange={(e) => setJumpTo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && jump()}
                placeholder={pageCount ? `1-${pageCount}` : "—"}
              />
              <button className="btn btn--ghost" onClick={jump}>Go</button>
            </div>
          </div>

          <div className="field">
            <div className="field__label">Apply crop to</div>
            <select
              className="input"
              value={applyMode}
              onChange={(e) => setApplyMode(e.target.value)}
            >
              <option value="all">All pages</option>
              <option value="single">This page</option>
            </select>
          </div>

          <div className="cropPanel__actions">
            <button className="btn btn--ghost" onClick={goPrev}>← Prev</button>
            <button className="btn btn--ghost" onClick={goNext}>Next →</button>
            <button className="btn btn--primary" disabled={!canRun} onClick={crop}>
              Crop & Continue
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}
    </div>
  );
}
