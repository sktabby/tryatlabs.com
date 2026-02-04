import { useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import BusyOverlay from "../../components/BusyOverlay.jsx"; // ✅ adjust path if needed
import "./reorder-pages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function renderPdfThumbnails(file, targetCssWidth = 220) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);

  const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;

  const dpr = Math.max(1, Math.min(2.25, window.devicePixelRatio || 1));
  const thumbs = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const base = page.getViewport({ scale: 1 });
    const scale = (targetCssWidth * dpr) / base.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    thumbs.push({ pageNumber: i, thumb: canvas.toDataURL("image/png") });
  }

  return { bytes, thumbs, pageCount: pdf.numPages };
}

function insertBlankPage(pdfDoc, insertIndex) {
  const pageCount = pdfDoc.getPageCount();

  let w = 595;
  let h = 842;

  if (pageCount > 0) {
    const refIndex = Math.min(Math.max(insertIndex - 1, 0), pageCount - 1);
    const refPage = pdfDoc.getPage(refIndex);
    const { width, height } = refPage.getSize();
    w = width;
    h = height;
  }

  pdfDoc.insertPage(insertIndex, [w, h]);
}

function downloadBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReorderPages() {
  const inputRef = useRef(null);
  const dragIdRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayStep, setOverlayStep] = useState("Working…");
  const [error, setError] = useState("");

  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]); // {id, kind:'pdf'|'blank', label, thumb, srcIndex?}
  const [selected, setSelected] = useState(new Set());

  const empty = pages.length === 0;
  const hasPdf = pages.some((p) => p.kind === "pdf");
  const selectedCount = selected.size;
  const canExport = !!pdfDoc && hasPdf && !busy;

  const usage = useMemo(
    () => [
      "Upload your PDF.",
      "Drag page cards to reorder.",
      "Tap pages to select (multi-select supported).",
      "Delete removes selected pages.",
      "Insert Blank adds a blank page after your selection.",
      "Download the final organized PDF.",
    ],
    []
  );

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());
  const selectAll = () => setSelected(new Set(pages.map((p) => p.id)));

  const deleteSelected = () => {
    if (!selectedCount) return;
    setPages((prev) => prev.filter((p) => !selected.has(p.id)));
    clearSelection();
  };

  const insertBlankAfter = () => {
    const ids = Array.from(selected);
    let insertAt = pages.length;
    if (ids.length) {
      const idx = pages.findIndex((p) => p.id === ids[0]);
      if (idx >= 0) insertAt = idx + 1;
    }

    const newItem = { id: uid(), kind: "blank", label: "Blank Page", thumb: "" };

    setPages((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, newItem);
      return next;
    });

    clearSelection();
  };

  const onDragStart = (id) => {
    dragIdRef.current = id;
  };

  const onDropOver = (overId) => {
    const dragId = dragIdRef.current;
    dragIdRef.current = null;
    if (!dragId || dragId === overId) return;

    setPages((prev) => {
      const from = prev.findIndex((p) => p.id === dragId);
      const to = prev.findIndex((p) => p.id === overId);
      if (from < 0 || to < 0) return prev;

      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const clearAll = () => {
    setBusy(false);
    setOverlayOpen(false);
    setError("");
    setPdfDoc(null);
    setPages([]);
    clearSelection();
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setBusy(true);
    setError("");
    clearSelection();

    // ✅ show overlay immediately
    setOverlayStep("Uploading…");
    setOverlayOpen(true);

    try {
      const targetWidth = window.innerWidth < 520 ? 180 : 220;

      setOverlayStep("Reading file…");
      const { bytes, thumbs } = await renderPdfThumbnails(f, targetWidth);

      setOverlayStep("Preparing pages…");
      const doc = await PDFDocument.load(bytes.slice(), { ignoreEncryption: true });

      const uiPages = thumbs.map((p, idx) => ({
        id: uid(),
        kind: "pdf",
        srcIndex: idx,
        label: `Page ${idx + 1}`,
        thumb: p.thumb,
      }));

      setPdfDoc(doc);
      setPages(uiPages);
    } catch (err) {
      setError(err?.message || "Failed to load PDF.");
    } finally {
      setBusy(false);
      setOverlayOpen(false);
    }
  };

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    await handleUpload(f);
  };

  const download = async () => {
    if (!pdfDoc) return;

    setBusy(true);
    setError("");
    setOverlayStep("Building final PDF…");
    setOverlayOpen(true);

    try {
      const out = await PDFDocument.create();
      const maxIndex = pdfDoc.getPageCount() - 1;

      const pdfPageIndices = pages
        .filter((p) => p.kind === "pdf")
        .map((p) => Math.min(Math.max(p.srcIndex, 0), maxIndex));

      const copied = await out.copyPages(pdfDoc, pdfPageIndices);
      copied.forEach((p) => out.addPage(p));

      let cursor = 0;
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].kind === "blank") {
          insertBlankPage(out, cursor);
          cursor += 1;
        } else {
          cursor += 1;
        }
      }

      const bytes = await out.save();
      downloadBytes(bytes, "tryatlabs-organized.pdf");
    } catch (err) {
      setError(err?.message || "Failed to export PDF.");
    } finally {
      setBusy(false);
      setOverlayOpen(false);
    }
  };

  return (
    <div className="tool tool--reorder card">
      <BusyOverlay
        open={overlayOpen}
        stepLabel={overlayStep}
        title="Organizing your PDF"
        subtitle="Everything runs locally in your browser. Please keep this tab open."
      />

      <div className="reorderTop">
        <div className="reorderTop__left">
         
          <p className="muted reorderSub">
            Reorder pages, delete pages, and insert blank pages.
          </p>
        </div>

        <div className="reorderTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={onPick}
            style={{ display: "none" }}
          />

          
          {!empty && (
            <button type="button" className="btn btn--ghost" disabled={busy} onClick={clearAll}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="guideCard">
        <div className="guideHead">
          <div className="guideTitle">How to use</div>
          <div className="muted">
            {empty ? "Upload a PDF to begin." : `${pages.length} items loaded`}
          </div>
        </div>
        <ol className="guideList">
          {usage.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      {!empty && (
        <div className="toolbar">
          <div className="toolbar__left">
            <span className="pill">{pages.length} items</span>
            <span className="pill">{selectedCount} selected</span>
          </div>

          <div className="toolbar__right">
            <button type="button" className="btn" onClick={selectAll} disabled={busy || !pages.length}>
              Select all
            </button>
            <button type="button" className="btn" onClick={clearSelection} disabled={busy || !selectedCount}>
              Clear
            </button>
            <button type="button" className="btn" onClick={insertBlankAfter} disabled={busy || !pages.length}>
              Insert Blank
            </button>
            <button type="button" className="btn btn--danger" onClick={deleteSelected} disabled={busy || !selectedCount}>
              Delete
            </button>
            <button type="button" className="btn btn--primary" onClick={download} disabled={!canExport}>
              {busy ? "Processing…" : "Download"}
            </button>
          </div>
        </div>
      )}

      <div className="pageGrid">
        {empty ? (
          <div className="emptyState">
           
            <div className="emptyState__title">Upload a PDF to start</div>
            <div className="muted">After upload, drag cards to reorder and tap to select.</div>

            <button
              type="button"
              className="btn btn--primary emptyState__btn"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              Upload PDF
            </button>
          </div>
        ) : (
          pages.map((p) => {
            const isSel = selected.has(p.id);
            return (
              <div
                key={p.id}
                className={`pageCard ${isSel ? "pageCard--selected" : ""}`}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropOver(p.id)}
                onClick={() => toggleSelect(p.id)}
                role="button"
                tabIndex={0}
              >
                <div className="pageThumb">
                  {p.kind === "blank" ? (
                    <div className="blankThumb">
                      <div className="blankThumb__icon">＋</div>
                      <div className="blankThumb__txt">Blank</div>
                    </div>
                  ) : (
                    <img src={p.thumb} alt={p.label} />
                  )}
                </div>

                <div className="pageMeta">
                  <div className="pageLabel">{p.label}</div>
                  <div className="muted">{p.kind === "blank" ? "Inserted page" : "PDF page"}</div>
                </div>

                <div className="pageTick">{isSel ? "✓" : ""}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
