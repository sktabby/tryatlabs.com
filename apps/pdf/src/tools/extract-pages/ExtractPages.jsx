import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { niceBytes } from "../shared/fileUi.js";
import "./extract-pages.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const TOOL_SLUG = "extract-pages";
const TOOL_TITLE = "Extract Pages";

/** ✅ Sharp thumbnail rendering (same as SplitPdf style) */
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

export default function ExtractPages() {
  const nav = useNavigate();

  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const [pagesStr, setPagesStr] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);

  // Preview
  const [previewPage, setPreviewPage] = useState(1);
  const [thumb, setThumb] = useState("");
  const [thumbBusy, setThumbBusy] = useState(false);

  // ✅ stable bytes + pdfjs doc (prevents detach + keeps preview fast)
  const bytesRef = useRef(null); // Uint8Array
  const pdfjsDocRef = useRef(null); // pdfjs doc
  const previewWrapRef = useRef(null); // measure width

  const [gotoPage, setGotoPage] = useState("1");

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const parseList = (input, total) => {
    const nums = input
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= total);
    return Array.from(new Set(nums)).sort((a, b) => a - b);
  };

  useEffect(() => {
    setGotoPage(String(previewPage));
  }, [previewPage]);

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

  const commitGoto = () => {
    if (!pageCount) return;
    const n = Number(String(gotoPage).trim());
    if (!Number.isFinite(n)) return;

    const safe = Math.max(1, Math.min(n, pageCount));
    setGotoPage(String(safe));
    updateThumb(safe);
  };

  const loadPdfInfo = async (f) => {
    setError("");
    setFile(f);

    setPageCount(0);
    setPagesStr("1");

    setThumb("");
    setThumbBusy(false);
    setPreviewPage(1);

    bytesRef.current = null;
    pdfjsDocRef.current = null;

    try {
      const buf = await f.arrayBuffer();
      const bytes = new Uint8Array(buf); // ✅ stable bytes
      bytesRef.current = bytes;

      // ✅ pdf-lib uses fresh copy
      const src = await PDFDocument.load(bytes.slice(), { ignoreEncryption: true });
      const count = src.getPageCount();
      setPageCount(count);

      // ✅ pdfjs uses fresh copy
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

  const clear = () => {
    setFile(null);
    setPagesStr("1");
    setBusy(false);
    setError("");
    setPageCount(0);

    setPreviewPage(1);
    setThumb("");
    setThumbBusy(false);

    bytesRef.current = null;
    pdfjsDocRef.current = null;

    if (inputRef.current) inputRef.current.value = "";
  };

  const extract = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file || !bytesRef.current) throw new Error("Please upload a PDF first.");

      // ✅ fresh copy again
      const src = await PDFDocument.load(bytesRef.current.slice(), { ignoreEncryption: true });
      const total = src.getPageCount();

      const list = parseList(pagesStr, total);
      if (!list.length) throw new Error("Enter valid pages like 1,3,5.");

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, list.map((n) => n - 1));
      copied.forEach((p) => out.addPage(p));

      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // ✅ redirect to Result
      nav("/result", {
        state: {
          slug: TOOL_SLUG,
          title: TOOL_TITLE,
          fileName: "tryatlabs-extracted.pdf",
          blobUrl,
          sizeBytes: outBytes?.byteLength ?? blob.size,
        },
      });
    } catch (e) {
      setError(e?.message || "Extract failed.");
    } finally {
      setBusy(false);
    }
  };

  // ✅ keep preview sharp when container width changes
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
    <div className="tool tool--extract card">
      {/* Top bar */}
      <div className="extractTop">
        <div className="extractTop__left">
          <div className="muted extractSmall">Create a new PDF from selected pages.</div>
        </div>

        <div className="extractTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary extractUploadBtn"
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

      <div className="extractGrid">
        {/* Preview */}
        <div className="extractCard">
          <div className="previewHead">
            <div className="previewTitle">Preview</div>
            <div className="muted">{pageCount ? `Page ${previewPage} of ${pageCount}` : "Upload a PDF to preview"}</div>
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

            <div className="gotoWrap">
              <span className="muted gotoLabel">Go to</span>

              <input
                className="gotoInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1"
                disabled={!file || busy || !pageCount}
                value={gotoPage}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^\d]/g, "");
                  setGotoPage(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitGoto();
                  }
                }}
                onBlur={() => {
                  if (gotoPage !== "") commitGoto();
                }}
              />

              <span className="muted gotoSlash">/</span>
              <span className="muted gotoTotal">{pageCount || "—"}</span>

              <button
                className="btn btn--ghost gotoBtn"
                type="button"
                disabled={!file || busy || !pageCount || gotoPage === ""}
                onClick={commitGoto}
              >
                Go
              </button>
            </div>

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

        {/* Options */}
        <div className="extractCard extractCard--right">
          <div className="field">
            <div className="field__label">Pages to extract</div>
            <input
              className="input"
              value={pagesStr}
              onChange={(e) => setPagesStr(e.target.value)}
              placeholder="e.g. 1,3,5"
              disabled={!file || busy}
            />
            <div className="muted">{pageCount ? `Total pages: ${pageCount}` : "Upload a PDF to enable extraction."}</div>
          </div>

          {/* ✅ 2 tips only */}
          <div className="miniTips">
            <div className="miniTip">
              <span className="miniDot" /> Use commas: <b>1,3,5</b>
            </div>
            <div className="miniTip">
              <span className="miniDot" /> Range: <b>1</b>–<b>{pageCount || "…"}</b>
            </div>
          </div>

          <div className="extractActions">
            <button className="btn btn--primary" disabled={!file || busy} onClick={extract}>
              {busy ? "Extracting..." : "Continue"}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}
    </div>
  );
}
