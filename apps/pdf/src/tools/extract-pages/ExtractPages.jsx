import { useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { downloadBlob, niceBytes } from "../shared/fileUi.js";
import "./extract-pages.css";

export default function ExtractPages() {
  const [file, setFile] = useState(null);
  const [pagesStr, setPagesStr] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [dragging, setDragging] = useState(false);

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

  const loadPdfInfo = async (f) => {
    setFile(f);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read this PDF.");
      setFile(null);
      setPageCount(0);
    }
  };

  const addPickedFile = async (f) => {
    setError("");
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please select a PDF.");
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
    setDragging(false);

    const f = e.dataTransfer.files?.[0];
    await addPickedFile(f);
  };

  const extract = async () => {
    setBusy(true);
    setError("");
    try {
      if (!file) throw new Error("Please upload a PDF first.");

      const src = await PDFDocument.load(await file.arrayBuffer());
      const total = src.getPageCount();
      const list = parseList(pagesStr, total);

      if (!list.length) throw new Error("Enter valid page numbers like 1,3,5.");

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, list.map((n) => n - 1));
      copied.forEach((p) => out.addPage(p));

      const bytes = await out.save();
      downloadBlob(new Blob([bytes], { type: "application/pdf" }), "tryatlabs-extracted.pdf");
    } catch (e) {
      setError(e?.message || "Extract failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--extract card">
      <div className="grid2">
        {/* Drop zone with real drag & drop */}
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
            <div className="muted">{file ? info : "Drop or pick one PDF to extract pages."}</div>
          </div>
        </div>

        <div className="panel">
          <div className="field">
            <div className="field__label">Pages (comma-separated)</div>
            <input
              className="input"
              value={pagesStr}
              onChange={(e) => setPagesStr(e.target.value)}
              placeholder="e.g. 1,3,5"
              disabled={!file}
            />
            <div className="muted">{pageCount ? `Total pages: ${pageCount}` : "Upload a PDF first."}</div>

            {/* Optional help box (keeps your existing class) */}
            <div className="rangeHelp">
              Tip: Enter pages like <b>1,3,5</b>. Duplicates will be ignored.
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={extract}>
          {busy ? "Extracting..." : "Extract & Download"}
        </button>
      </div>
    </div>
  );
}
