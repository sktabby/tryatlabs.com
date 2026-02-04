import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { niceBytes } from "../shared/fileUi.js";
import "./split-pdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TOOL_SLUG = "split-pdf";
const TOOL_TITLE = "Split PDF";

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

/**
 * ✅ Sharp thumbnail rendering:
 * - Uses container width
 * - Uses devicePixelRatio (retina)
 * - Uses fresh bytes (no detach)
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

export default function SplitPdf() {
  const nav = useNavigate();

  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const [ranges, setRanges] = useState("1-1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Preview
  const [previewPage, setPreviewPage] = useState(1);
  const [thumb, setThumb] = useState("");
  const [thumbBusy, setThumbBusy] = useState(false);

  // ✅ Store stable bytes (prevents ArrayBuffer detach issues)
  const bytesRef = useRef(null);       // Uint8Array
  const pdfjsDocRef = useRef(null);    // pdfjs doc
  const previewWrapRef = useRef(null); // measure width

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const selectedCount = useMemo(() => {
    if (!pageCount) return 0;
    return parseRanges(ranges, pageCount).length;
  }, [ranges, pageCount]);

  const getPreviewTargetWidth = () => {
    const w = previewWrapRef.current?.clientWidth || 320;
    return Math.max(240, Math.min(360, Math.floor(w))); // ✅ smaller preview
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
    setThumb("");
    setThumbBusy(false);
    setPreviewPage(1);
    setPageCount(0);
    bytesRef.current = null;
    pdfjsDocRef.current = null;

    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf);        // ✅ stable bytes
      bytesRef.current = bytes;

      // ✅ pdf-lib: pass a fresh copy (prevents detach / mutation issues)
      const src = await PDFDocument.load(bytes.slice(), { ignoreEncryption: true });
      const count = src.getPageCount();
      setPageCount(count);
      setRanges("1-1");

      // ✅ pdfjs: pass fresh copy (do NOT pass the same ArrayBuffer)
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
      setThumb("");
      setPreviewPage(1);
      bytesRef.current = null;
      pdfjsDocRef.current = null;
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
    setThumbBusy(false);
    bytesRef.current = null;
    pdfjsDocRef.current = null;

    if (inputRef.current) inputRef.current.value = "";
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

  const split = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file || !bytesRef.current) throw new Error("Please upload a PDF.");

      // ✅ fresh copy again (never reuse the same backing store)
      const src = await PDFDocument.load(bytesRef.current.slice(), { ignoreEncryption: true });
      const total = src.getPageCount();

      const selected = parseRanges(ranges, total);
      if (selected.length === 0) throw new Error("No valid pages in the range.");

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, selected.map((n) => n - 1));
      copied.forEach((p) => out.addPage(p));

      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // ✅ go to Result page (your Result screen handles download + revoke)
      nav("/result", {
        state: {
          slug: TOOL_SLUG,
          title: TOOL_TITLE,
          fileName: "tryatlabs-split.pdf",
          blobUrl,
          sizeBytes: outBytes?.byteLength ?? blob.size,
        },
      });
    } catch (e) {
      setError(e?.message || "Split failed.");
    } finally {
      setBusy(false);
    }
  };

  // ✅ Re-render thumbnail on resize (keeps crisp on responsive)
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
    <div className="tool tool--split card">
      {/* Top bar */}
      <div className="splitTop">
        <div className="splitTop__left">
          <div className="splitKicker">Split PDF</div>
         
        </div>

        <div className="splitTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary splitUploadBtn"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {file ? "Replace PDF" : "Upload PDF"}
          </button>

          <button className="btn btn--ghost" type="button" onClick={clear} disabled={busy || (!file && !error)}>
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
                {pageCount ? `Page ${previewPage} of ${pageCount}` : "Upload a PDF to preview"}
              </div>
            </div>

            <div className="previewBody" ref={previewWrapRef}>
              {thumb ? (
                <div className="previewFrame">
                  <img className="previewImg" src={thumb} alt="PDF preview" />
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
            Tip: Use commas for individual pages (<b>1,3,5</b>) and dashes for ranges (<b>2-8</b>).
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy || selectedCount === 0} onClick={split}>
          {busy ? "Splitting..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
