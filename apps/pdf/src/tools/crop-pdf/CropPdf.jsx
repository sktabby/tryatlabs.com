import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/build/pdf";
import { ensurePdfWorker } from "../shared/pdfWorker.js";
import { goToResult } from "../shared/goToResult.js";
import { niceBytes } from "../shared/fileUi.js";
import "./crop-pdf.css";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function rectFromPoints(a, b) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const w = Math.abs(a.x - b.x);
  const h = Math.abs(a.y - b.y);
  return { x, y, w, h };
}

export default function CropPdf() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(null);

  // which preview page the user is cropping
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [applyMode, setApplyMode] = useState("all"); // "all" | "single"

  // drag + drop
  const [dragging, setDragging] = useState(false);

  // preview canvas
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  // crop rect in stage-local px
  const [rect, setRect] = useState(null); // {x,y,w,h}
  const [dragMode, setDragMode] = useState(null); // "draw" | "move" | "resize"
  const dragStartRef = useRef(null);
  const baseRectRef = useRef(null);

  const canRun = !!file && !!rect && rect.w > 6 && rect.h > 6 && !busy;

  const hint = useMemo(() => {
    if (!file) return "Upload a PDF to start.";
    return "Drag to select the area you want to keep. Drag inside to move. Use the corner handle to resize.";
  }, [file]);

  const fileInfo = useMemo(() => {
    if (!file) return "";
    const p = pageCount != null ? ` • ${pageCount} pages` : "";
    return `${file.name} • ${niceBytes(file.size)}${p}`;
  }, [file, pageCount]);

  const addPickedFile = async (picked) => {
    setError("");
    if (!picked) return;

    if (picked.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setFile(picked);
    setRect(null);
    setPageCount(null);
    setPageIndex(0);
    setApplyMode("all");

    try {
      const bytes = await picked.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());

      await renderPreview(picked, 0);
    } catch {
      setError("Could not open this PDF. It may be corrupted or password-protected.");
      setFile(null);
      setRect(null);
      setPageCount(null);
      setPageIndex(0);
    }
  };

  const onPick = async (e) => {
    const picked = Array.from(e.target.files || []).find((f) => f.type === "application/pdf");
    e.target.value = "";
    await addPickedFile(picked);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const picked = Array.from(e.dataTransfer.files || []).find((f) => f.type === "application/pdf");
    if (!picked) {
      setError("Please drop a PDF file.");
      return;
    }
    await addPickedFile(picked);
  };

  const clear = () => {
    setFile(null);
    setRect(null);
    setPageCount(null);
    setPageIndex(0);
    setApplyMode("all");
    setError("");

    const c = canvasRef.current;
    if (c) {
      const ctx = c.getContext("2d");
      ctx && ctx.clearRect(0, 0, c.width, c.height);
    }
  };

  async function renderPreview(pdfFile, idx) {
    ensurePdfWorker();
    const buf = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: buf }).promise;

    const safeIdx = clamp(idx, 0, pdf.numPages - 1);
    const page = await pdf.getPage(safeIdx + 1);

    const stage = stageRef.current;
    const maxW = clamp(stage?.clientWidth || 820, 320, 1100);

    const viewport1 = page.getViewport({ scale: 1 });
    const scale = maxW / viewport1.width;
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    setCanvasSize({ w: canvas.width, h: canvas.height });

    const ctx = canvas.getContext("2d");
    await page.render({ canvasContext: ctx, viewport }).promise;

    // set a safe default rect
    setRect({
      x: canvas.width * 0.06,
      y: canvas.height * 0.06,
      w: canvas.width * 0.88,
      h: canvas.height * 0.88
    });
  }

  const goPrev = async () => {
    if (!file || busy) return;
    const next = Math.max(0, pageIndex - 1);
    setPageIndex(next);
    await renderPreview(file, next);
  };

  const goNext = async () => {
    if (!file || busy || pageCount == null) return;
    const next = Math.min(pageCount - 1, pageIndex + 1);
    setPageIndex(next);
    await renderPreview(file, next);
  };

  function getLocalPoint(ev) {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    const r = stage.getBoundingClientRect();
    const x = clamp(ev.clientX - r.left + stage.scrollLeft, 0, canvasSize.w);
    const y = clamp(ev.clientY - r.top + stage.scrollTop, 0, canvasSize.h);
    return { x, y };
  }

  function hitTestResizeHandle(p) {
    if (!rect) return false;
    const hx = rect.x + rect.w;
    const hy = rect.y + rect.h;
    const d = 18;
    return Math.abs(p.x - hx) <= d && Math.abs(p.y - hy) <= d;
  }

  function hitTestRect(p) {
    if (!rect) return false;
    return p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
  }

  const onPointerDown = (e) => {
    if (!file || busy) return;
    const p = getLocalPoint(e);

    if (rect && hitTestResizeHandle(p)) {
      setDragMode("resize");
      dragStartRef.current = p;
      baseRectRef.current = rect;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      return;
    }

    if (rect && hitTestRect(p)) {
      setDragMode("move");
      dragStartRef.current = p;
      baseRectRef.current = rect;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      return;
    }

    setDragMode("draw");
    dragStartRef.current = p;
    baseRectRef.current = null;
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragMode || !file || busy) return;
    const p = getLocalPoint(e);
    const start = dragStartRef.current;
    if (!start) return;

    if (dragMode === "draw") {
      setRect(rectFromPoints(start, p));
      return;
    }

    if (dragMode === "move") {
      const base = baseRectRef.current;
      if (!base) return;
      const dx = p.x - start.x;
      const dy = p.y - start.y;
      const nx = clamp(base.x + dx, 0, canvasSize.w - base.w);
      const ny = clamp(base.y + dy, 0, canvasSize.h - base.h);
      setRect({ ...base, x: nx, y: ny });
      return;
    }

    if (dragMode === "resize") {
      const base = baseRectRef.current;
      if (!base) return;
      const nw = clamp(base.w + (p.x - start.x), 8, canvasSize.w - base.x);
      const nh = clamp(base.h + (p.y - start.y), 8, canvasSize.h - base.y);
      setRect({ ...base, w: nw, h: nh });
      return;
    }
  };

  const onPointerUp = () => {
    setDragMode(null);
    dragStartRef.current = null;
    baseRectRef.current = null;
  };

  async function crop() {
    setBusy(true);
    setError("");
    try {
      if (!file) throw new Error("Please upload a PDF first.");
      if (!rect || rect.w < 6 || rect.h < 6) throw new Error("Please select an area to keep.");

      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      // ratios from preview canvas
      const rx = rect.x / canvasSize.w;
      const ry = rect.y / canvasSize.h;
      const rw = rect.w / canvasSize.w;
      const rh = rect.h / canvasSize.h;

      const applyTo = applyMode === "single" ? [pages[pageIndex]] : pages;

      for (const page of applyTo) {
        const { width, height } = page.getSize();

        const left = rx * width;
        const top = ry * height;
        const w = rw * width;
        const h = rh * height;

        const bottom = height - (top + h);

        if (w <= 1 || h <= 1) throw new Error("Crop area is too small.");

        page.setCropBox(left, bottom, w, h);
        if (page.setTrimBox) page.setTrimBox(left, bottom, w, h);
      }

      const outBytes = await pdfDoc.save();

      goToResult(navigate, {
        slug: "crop-pdf",
        title: "PDF cropped successfully!",
        fileName: "tryatlabs-cropped.pdf",
        bytes: outBytes
      });
    } catch (e) {
      setError(e?.message || "Failed to crop the PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool tool--crop card">
      <div className="toolHead">
        <div>
          <h2 className="toolTitle">Crop PDF</h2>
          <div className="muted">{hint}</div>
        </div>

        <div className="toolActions">
          <button className="btn btn--ghost" type="button" onClick={clear} disabled={!file || busy}>
            Clear
          </button>
        </div>
      </div>

      {/* Upload (drag + click) */}
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
          <div className="drop__title">Drop a PDF here or click to upload</div>
          <div className="muted">We’ll crop {applyMode === "single" ? "this page" : "all pages"} based on your selection.</div>
        </div>
      </div>

      {/* Layout: Viewer + right panel */}
      <div className="cropLayout">
        {/* Viewer */}
        <div className="cropViewer card">
          {file && (
            <div className="cropMeta">
              <div className="cropMeta__name">{fileInfo}</div>
              {pageCount != null && (
                <div className="muted">
                  Previewing: Page {pageIndex + 1} of {pageCount}
                </div>
              )}
            </div>
          )}

          <div
            ref={stageRef}
            className={`cropStage ${busy ? "cropStage--busy" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="application"
            aria-label="PDF crop selector"
          >
            <canvas ref={canvasRef} className="cropCanvas" />

            {rect && (
              <>
                <div
                  className="cropRect"
                  style={{
                    left: rect.x,
                    top: rect.y,
                    width: rect.w,
                    height: rect.h
                  }}
                >
                  <div className="cropHandle" title="Resize" />
                </div>

                <div className="cropMask cropMask--top" style={{ height: rect.y }} />
                <div className="cropMask cropMask--left" style={{ top: rect.y, height: rect.h, width: rect.x }} />
                <div
                  className="cropMask cropMask--right"
                  style={{ top: rect.y, height: rect.h, left: rect.x + rect.w, right: 0 }}
                />
                <div className="cropMask cropMask--bottom" style={{ top: rect.y + rect.h, bottom: 0 }} />
              </>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="cropPanel card">
          <div className="cropPanel__head">
            <div className="cropPanel__title">Crop settings</div>
            <div className="muted">Choose scope and adjust preview page.</div>
          </div>

          <div className="field">
            <div className="field__label">Apply crop to</div>
            <select
              className="input"
              value={applyMode}
              onChange={(e) => setApplyMode(e.target.value)}
              disabled={!file || busy}
            >
              <option value="all">All pages</option>
              <option value="single">This page only</option>
            </select>
          </div>

          <div className="cropPanel__actions">
            <button className="btn btn--ghost" onClick={goPrev} disabled={!file || busy || pageIndex <= 0}>
              ← Previous page
            </button>
            <button className="btn btn--ghost" onClick={goNext} disabled={!file || busy || pageCount == null || pageIndex >= pageCount - 1}>
              Next page →
            </button>

            <button className="btn btn--primary" type="button" disabled={!canRun} onClick={crop}>
              {busy ? "Cropping..." : "Crop & Continue"}
            </button>
          </div>

          <div className="tip">
            Tip: If your PDF pages have different sizes, “All pages” uses the same relative crop area on each page.
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}
    </div>
  );
}
