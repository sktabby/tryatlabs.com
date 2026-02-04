import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./merge-pdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function renderThumb(file, scale = 0.35) {
  try {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    const page = await pdf.getPage(1);

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

export default function MergePdf() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const files = useMemo(() => items.map((x) => x.file), [items]);

  const addPickedFiles = async (fileList) => {
    setError("");

    const picked = Array.from(fileList || []).filter((f) => f.type === "application/pdf");
    if (picked.length === 0) {
      setError("Please upload PDF files only.");
      return;
    }

    const newItems = picked.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(16).slice(2)}`,
      file: f,
      thumb: "",
    }));

    setItems((prev) => [...prev, ...newItems]);

    for (const it of newItems) {
      const thumb = await renderThumb(it.file, 0.32);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, thumb } : p)));
    }
  };

  const onPick = (e) => {
    addPickedFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    addPickedFiles(e.dataTransfer.files);
  };

  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => {
    setItems([]);
    setError("");
  };

  const move = (from, to) => {
    setItems((prev) => {
      if (from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const merge = async () => {
    const MIN_TIME = 700;
    const start = Date.now();

    setBusy(true);
    setError("");

    try {
      if (files.length < 2) throw new Error("Please add at least 2 PDF files.");

      const merged = await PDFDocument.create();

      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }

      const outBytes = await merged.save();

      goToResult(navigate, {
        slug: "merge-pdf",
        title: "PDFs have been merged!",
        fileName: "tryatlabs-merged.pdf",
        bytes: outBytes,
      });
    } catch (e) {
      setError(e?.message || "Failed to merge PDFs.");
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_TIME - elapsed);
      setTimeout(() => setBusy(false), remaining);
    }
  };

  return (
    <div className="tool tool--merge card">
      {/* Drop area (drag only) */}
      <div className="row">
        <div
          className={`drop ${dragging ? "isDragging" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Drop PDFs"
          onDragEnter={() => setDragging(true)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            if (e.currentTarget.contains(e.relatedTarget)) return;
            setDragging(false);
          }}
          onDrop={onDrop}
        >
          <div className="drop__inner">
            <div className="drop__title">Drop PDFs here</div>
            <div className="muted">Drag & drop multiple PDF files</div>
          </div>
        </div>
      </div>

      {/* Separate upload button */}
      <div style={{ marginTop: 12 }}>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          Upload PDFs
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={onPick}
          style={{ display: "none" }}
        />
      </div>

      {/* Fixed-height list */}
      {items.length > 0 && (
        <div className="list" style={{ maxHeight: 320, overflowY: "auto" }}>
          {items.map((it, idx) => (
            <div key={it.id} className="listItem">
              <div className="fileMain">
                <div className="thumb">
                  {it.thumb ? <img src={it.thumb} alt="PDF preview page 1" /> : <div className="thumb__ph">PDF</div>}
                </div>

                <div className="fileInfo">
                  <div className="listItem__title" title={it.file.name}>
                    {it.file.name}
                  </div>
                  <div className="muted">{niceBytes(it.file.size)}</div>
                </div>
              </div>

              <div className="fileActions">
                <button className="btn btn--ghost" onClick={() => move(idx, idx - 1)} disabled={busy || idx === 0}>↑</button>
                <button className="btn btn--ghost" onClick={() => move(idx, idx + 1)} disabled={busy || idx === items.length - 1}>↓</button>
                <button className="btn btn--ghost" onClick={() => remove(it.id)} disabled={busy}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={busy || items.length < 2} onClick={merge}>
          {busy ? "Merging..." : "Merge & Continue"}
        </button>
        <button className="btn btn--ghost" disabled={busy || items.length === 0} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
