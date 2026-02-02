import { useMemo, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import "./reorder-pages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function renderPdfThumbnails(file, scale = 0.25) {
  const buf = await file.arrayBuffer();

  // ✅ clone so pdf.js can't detach the one we use for pdf-lib
  const pdfjsData = buf.slice(0);

  const pdf = await pdfjsLib.getDocument({ data: pdfjsData }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL("image/png");

    pages.push({ pageNumber: i, thumb: dataUrl });
  }

  return { arrayBuffer: buf.slice(0), thumbs: pages };
}

async function appendPdfPages(targetPdfDoc, sourceArrayBuffer) {
  const srcDoc = await PDFDocument.load(sourceArrayBuffer);
  const copied = await targetPdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
  copied.forEach((p) => targetPdfDoc.addPage(p));
}

function insertBlankPage(pdfDoc, insertIndex) {
  const pageCount = pdfDoc.getPageCount();

  // Use previous page size if exists, else A4-ish
  let w = 595;
  let h = 842;

  if (pageCount > 0) {
    const refIndex = Math.min(Math.max(insertIndex - 1, 0), pageCount - 1);
    const refPage = pdfDoc.getPage(refIndex);
    const { width, height } = refPage.getSize();
    w = width;
    h = height;
  }

  // ✅ truly blank page
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // master pdf state
  const [pdfDoc, setPdfDoc] = useState(null);

  // UI pages state (derived)
  const [pages, setPages] = useState([]); // {id, kind:'pdf'|'blank', label, thumb, srcIndex?}
  const [selected, setSelected] = useState(new Set());

  // drag state for page reorder
  const dragIdRef = useRef(null);

  // drag state for file drop zone
  const [draggingFile, setDraggingFile] = useState(false);

  const canDownload = !!pdfDoc && pages.length > 0 && !busy;
  const selectedCount = selected.size;

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const handleMainFile = async (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") return setError("Please select a PDF.");

    setError("");
    setBusy(true);
    clearSelection();

    try {
      const { arrayBuffer, thumbs } = await renderPdfThumbnails(f, 0.32);
      const doc = await PDFDocument.load(arrayBuffer);

      const uiPages = thumbs.map((p, idx) => ({
        id: uid(),
        kind: "pdf",
        srcIndex: idx,
        label: `Page ${idx + 1}`,
        thumb: p.thumb
      }));

      setPdfDoc(doc);
      setPages(uiPages);
    } catch (err) {
      setError(err?.message || "Failed to load PDF.");
    } finally {
      setBusy(false);
    }
  };

  const onPickMain = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    await handleMainFile(f);
  };

  const onDropMainZone = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingFile(false);

    const f = e.dataTransfer.files?.[0];
    await handleMainFile(f);
  };

  const onAddMorePdfs = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    setError("");
    setBusy(true);

    try {
      if (!pdfDoc) {
        // If no base PDF exists, treat first file as base.
        const f = files[0];
        const { arrayBuffer, thumbs } = await renderPdfThumbnails(f, 0.32);
        const doc = await PDFDocument.load(arrayBuffer);
        const uiPages = thumbs.map((p, idx) => ({
          id: uid(),
          kind: "pdf",
          srcIndex: idx,
          label: `Page ${idx + 1}`,
          thumb: p.thumb
        }));

        setPdfDoc(doc);
        setPages(uiPages);

        // remaining files appended
        for (let i = 1; i < files.length; i++) {
          const fx = files[i];
          if (fx.type !== "application/pdf") continue;

          const res = await renderPdfThumbnails(fx, 0.32);
          await appendPdfPages(doc, res.arrayBuffer);

          const beforeCount = uiPages.filter((x) => x.kind === "pdf").length;
          res.thumbs.forEach((p, j) => {
            uiPages.push({
              id: uid(),
              kind: "pdf",
              srcIndex: beforeCount + j,
              label: `Page ${beforeCount + j + 1}`,
              thumb: p.thumb
            });
          });

          setPages([...uiPages]);
          setPdfDoc(doc);
        }
        return;
      }

      // Append each new PDF to current doc
      const updatedPages = [...pages];
      for (const f of files) {
        if (f.type !== "application/pdf") continue;

        const res = await renderPdfThumbnails(f, 0.32);

        const beforeCount = pdfDoc.getPageCount();
        await appendPdfPages(pdfDoc, res.arrayBuffer);

        res.thumbs.forEach((p, idx) => {
          updatedPages.push({
            id: uid(),
            kind: "pdf",
            srcIndex: beforeCount + idx,
            label: `Page ${beforeCount + idx + 1}`,
            thumb: p.thumb
          });
        });
      }

      setPages(updatedPages);
      setPdfDoc(pdfDoc);
    } catch (err) {
      setError(err?.message || "Failed to add files.");
    } finally {
      setBusy(false);
    }
  };

  const onDragStart = (id) => {
    dragIdRef.current = id;
  };

  const onDrop = (overId) => {
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

  const deleteSelected = () => {
    if (!selectedCount) return;
    setPages((prev) => prev.filter((p) => !selected.has(p.id)));
    clearSelection();
  };

  const insertBlankAfter = async () => {
    // Insert blank after first selected, else at end
    const ids = Array.from(selected);
    let insertAt = pages.length;
    if (ids.length) {
      const idx = pages.findIndex((p) => p.id === ids[0]);
      if (idx >= 0) insertAt = idx + 1;
    }

    const newItem = {
      id: uid(),
      kind: "blank",
      label: "Blank Page",
      thumb: ""
    };

    setPages((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, newItem);
      return next;
    });

    clearSelection();
  };

  const selectAll = () => {
    setSelected(new Set(pages.map((p) => p.id)));
  };

  const download = async () => {
    if (!pdfDoc) return;
    setBusy(true);
    setError("");

    try {
      const out = await PDFDocument.create();
      const maxIndex = pdfDoc.getPageCount() - 1;

      const pdfPageIndices = pages
        .filter((p) => p.kind === "pdf")
        .map((p) => Math.min(Math.max(p.srcIndex, 0), maxIndex));

      const copied = await out.copyPages(pdfDoc, pdfPageIndices);
      copied.forEach((p) => out.addPage(p));

      // Insert blank pages where needed
      let pdfCursor = 0;
      for (let i = 0; i < pages.length; i++) {
        if (pages[i].kind === "blank") {
          insertBlankPage(out, pdfCursor);
          pdfCursor += 1;
        } else {
          pdfCursor += 1;
        }
      }

      const bytes = await out.save();
      downloadBytes(bytes, "tryatlabs-organized.pdf");
    } catch (err) {
      setError(err?.message || "Failed to export PDF.");
    } finally {
      setBusy(false);
    }
  };

  const hasPdf = pages.some((p) => p.kind === "pdf");
  const empty = !hasPdf && pages.length === 0;

  const helpText = useMemo(() => {
    if (empty) return "Upload a PDF to start organizing.";
    return "Drag pages to reorder. Select pages to delete or insert blank pages.";
  }, [empty]);

  return (
    <div className="tool tool--reorder card">
      <div className="toolHead">
        <div>
          <h2 className="toolTitle">Organize PDF (Reorder + Delete + Blank Pages)</h2>
          <p className="muted">{helpText}</p>
        </div>

        <div className="toolActions">
          <label className="btn btn--ghost">
            <input hidden type="file" accept="application/pdf" onChange={onPickMain} />
            Upload PDF
          </label>

          <label className="btn btn--ghost">
            <input hidden type="file" multiple accept="application/pdf" onChange={onAddMorePdfs} />
            Add More PDFs
          </label>

          <button className="btn" onClick={selectAll} disabled={!pages.length || busy}>
            Select all
          </button>
          <button className="btn" onClick={clearSelection} disabled={!selectedCount || busy}>
            Clear
          </button>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="toolbar">
        <div className="toolbar__left">
          <span className="pill">{pages.length} items</span>
          <span className="pill">{selectedCount} selected</span>
        </div>

        <div className="toolbar__right">
          <button className="btn" onClick={insertBlankAfter} disabled={busy || !pages.length}>
            Insert blank page
          </button>
          <button className="btn btn--danger" onClick={deleteSelected} disabled={busy || !selectedCount}>
            Delete selected
          </button>
          <button className="btn btn--primary" onClick={download} disabled={!canDownload || !hasPdf}>
            {busy ? "Processing..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="pageGrid">
        {empty ? (
          <div
            className={`emptyBox ${draggingFile ? "isDragging" : ""}`}
            onDragEnter={() => setDraggingFile(true)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDraggingFile(true);
            }}
            onDragLeave={() => setDraggingFile(false)}
            onDrop={onDropMainZone}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.currentTarget.querySelector('input[type="file"]')?.click();
              }
            }}
          >
            <input className="emptyBox__input" type="file" accept="application/pdf" onChange={onPickMain} />
            <div className="emptyBox__title">Drop a PDF here</div>
            <div className="muted">Or click to upload. You can also add multiple PDFs later.</div>
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
                onDrop={() => onDrop(p.id)}
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
