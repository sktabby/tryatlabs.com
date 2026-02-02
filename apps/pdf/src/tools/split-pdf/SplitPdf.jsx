import { useEffect, useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

import { downloadBlob, niceBytes } from "../shared/fileUi.js";
import "./split-pdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function parseRanges(input, totalPages) {
  const parts = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const pages = new Set();
  for (const p of parts) {
    if (/^\d+$/.test(p)) {
      const n = Number(p);
      if (n >= 1 && n <= totalPages) pages.add(n);
    } else if (/^\d+\s*-\s*\d+$/.test(p)) {
      const [a, b] = p.split("-").map((x) => Number(x.trim()));
      const start = Math.min(a, b);
      const end = Math.max(a, b);
      for (let i = start; i <= end; i++) if (i >= 1 && i <= totalPages) pages.add(i);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}

async function renderThumb(file, pageNo1Based = 1, scale = 0.38) {
  try {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
    const pageNo = Math.max(1, Math.min(pageNo1Based, pdf.numPages));
    const page = await pdf.getPage(pageNo);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL("image/png");
  } catch {
    return "";
  }
}

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState("1-1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Preview
  const [previewPage, setPreviewPage] = useState(1);
  const [thumb, setThumb] = useState("");

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const selectedCount = useMemo(() => {
    if (!pageCount) return 0;
    return parseRanges(ranges, pageCount).length;
  }, [ranges, pageCount]);

  const loadPdfInfo = async (f) => {
    setError("");
    setFile(f);
    setThumb("");
    setPreviewPage(1);

    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPageCount(count);

      // keep safe default
      setRanges("1-1");

      // generate initial thumb
      const t = await renderThumb(f, 1, 0.38);
      setThumb(t);
    } catch {
      setError("Could not read this PDF.");
      setFile(null);
      setPageCount(0);
      setThumb("");
      setPreviewPage(1);
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
    await loadPdfInfo(f);
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
    await loadPdfInfo(f);
  };

  const clear = () => {
    setFile(null);
    setRanges("1-1");
    setBusy(false);
    setError("");
    setPageCount(0);
    setDragging(false);
    setPreviewPage(1);
    setThumb("");
  };

  const setQuick = (mode) => {
    if (!pageCount) return;

    if (mode === "all") return setRanges(`1-${pageCount}`);
    if (mode === "first5") return setRanges(`1-${Math.min(5, pageCount)}`);
    if (mode === "last") return setRanges(`${pageCount}`);
    if (mode === "odd") {
      const odds = [];
      for (let i = 1; i <= pageCount; i += 2) odds.push(i);
      return setRanges(odds.join(","));
    }
    if (mode === "even") {
      const evens = [];
      for (let i = 2; i <= pageCount; i += 2) evens.push(i);
      return setRanges(evens.join(","));
    }
  };

  const updatePreview = async (nextPage) => {
    if (!file || !pageCount) return;
    const safe = Math.max(1, Math.min(nextPage, pageCount));
    setPreviewPage(safe);
    const t = await renderThumb(file, safe, 0.38);
    setThumb(t);
  };

  const split = async () => {
    setBusy(true);
    setError("");
    try {
      if (!file) throw new Error("Please upload a PDF.");
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();

      const selected = parseRanges(ranges, total);
      if (selected.length === 0) throw new Error("No valid pages in the range.");

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, selected.map((n) => n - 1));
      copied.forEach((p) => out.addPage(p));

      const outBytes = await out.save();
      downloadBlob(new Blob([outBytes], { type: "application/pdf" }), "tryatlabs-split.pdf");
    } catch (e) {
      setError(e?.message || "Split failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--split card">
      <div className="grid2">
        {/* Upload + Preview */}
        <div className="leftCol">
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
              <div className="muted">{file ? info : "Drop or pick one PDF to split"}</div>
            </div>
          </div>

          {/* Preview */}
          <div className="previewCard">
            <div className="previewHead">
              <div className="previewTitle">Preview</div>
              <div className="muted">{pageCount ? `Page ${previewPage} of ${pageCount}` : "Upload a PDF to preview"}</div>
            </div>

            <div className="previewBody">
              {thumb ? (
                <img className="previewImg" src={thumb} alt="PDF preview" />
              ) : (
                <div className="previewPh">No preview</div>
              )}
            </div>

            <div className="previewNav">
              <button
                className="btn btn--ghost"
                type="button"
                disabled={!file || busy || previewPage <= 1}
                onClick={() => updatePreview(previewPage - 1)}
              >
                ← Prev
              </button>
              <button
                className="btn btn--ghost"
                type="button"
                disabled={!file || busy || !pageCount || previewPage >= pageCount}
                onClick={() => updatePreview(previewPage + 1)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Options Panel */}
        <div className="panel">
          <div className="field">
            <div className="field__label">Pages to extract</div>
            <input
              className="input"
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder="e.g. 1-3,5,7-9"
              disabled={!file}
            />
            <div className="muted">
              {pageCount ? `Total pages: ${pageCount} • Selected: ${selectedCount}` : "Upload a PDF first."}
            </div>
          </div>

          <div className="quickRow">
            <button className="btn btn--ghost" type="button" disabled={!file || busy} onClick={() => setQuick("all")}>
              All
            </button>
            <button className="btn btn--ghost" type="button" disabled={!file || busy} onClick={() => setQuick("first5")}>
              1–5
            </button>
            <button className="btn btn--ghost" type="button" disabled={!file || busy} onClick={() => setQuick("last")}>
              Last
            </button>
            <button className="btn btn--ghost" type="button" disabled={!file || busy} onClick={() => setQuick("odd")}>
              Odd
            </button>
            <button className="btn btn--ghost" type="button" disabled={!file || busy} onClick={() => setQuick("even")}>
              Even
            </button>
          </div>

          <div className="panelNote">
            Tip: Use commas for individual pages (e.g., <b>1,3,5</b>) and dashes for ranges (e.g., <b>2-8</b>).
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy || selectedCount === 0} onClick={split}>
          {busy ? "Splitting..." : "Split & Download"}
        </button>
        <button className="btn btn--ghost" disabled={busy || (!file && !error)} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
