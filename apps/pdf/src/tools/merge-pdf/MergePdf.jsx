import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./merge-pdf.css";

export default function MergePdf() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [items, setItems] = useState([]); // { id, file }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Drop strip state
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

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
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const onPick = (e) => {
    addPickedFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDragging(false);
    addPickedFiles(e.dataTransfer.files);
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
      {/* ✅ Top bar (ONE upload button) */}
      <div className="mergeTop">
        <div className="mergeTop__left">
        
          <div className="muted mergeSub">
            Combine multiple PDFs into one — processed locally in your browser.
          </div>
        </div>

        <div className="mergeTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary mergeUploadBtn"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {items.length ? "Add more PDFs" : "Upload PDFs"}
          </button>

          <button
            className="btn btn--ghost"
            type="button"
            onClick={clear}
            disabled={busy || items.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ✅ Drop strip (drag + click to upload) */}
      <div
        className={`dropStrip ${dragging ? "isDragging" : ""} ${items.length ? "hasFile" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Drop PDFs"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="dropStrip__dot" />
        <div className="dropStrip__text">
          <div className="dropStrip__title">
            {items.length ? `${items.length} PDF${items.length > 1 ? "s" : ""} selected` : "Drop PDFs here"}
          </div>
          <div className="muted">{items.length ? "Reorder below, then merge." : "Or click to upload multiple PDFs"}</div>
        </div>

        <div className="dropStrip__pill">{items.length ? "Ready" : "Drag & drop"}</div>
      </div>

      {items.length > 0 && (
        <div className="mergeListWrap">
          <div className="mergeList">
            {items.map((it, idx) => (
              <div key={it.id} className="mergeItem">
                <div className="mergeItem__left">
                  <div className="mergeIndex">{idx + 1}</div>
                  <div className="mergeMeta">
                    <div className="mergeName" title={it.file.name}>
                      {it.file.name}
                    </div>
                    <div className="muted">{niceBytes(it.file.size)}</div>
                  </div>
                </div>

                <div className="mergeItem__actions">
                  <button
                    className="btn btn--ghost mergeArrow"
                    onClick={() => move(idx, idx - 1)}
                    disabled={busy || idx === 0}
                  >
                    ↑
                  </button>

                  <button
                    className="btn btn--ghost mergeArrow"
                    onClick={() => move(idx, idx + 1)}
                    disabled={busy || idx === items.length - 1}
                  >
                    ↓
                  </button>

                  <button
                    className="btn btn--ghost"
                    onClick={() => remove(it.id)}
                    disabled={busy}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={busy || items.length < 2} onClick={merge}>
          {busy ? "Merging..." : "Merge & Continue"}
        </button>
      </div>
    </div>
  );
}
