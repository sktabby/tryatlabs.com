import { useMemo, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { loadPdfFromFile, addPageNumbers } from "../shared/pdfCore.js";
import { niceBytes } from "../shared/fileUi.js";
import "./add-page-number.css";
import { useNavigate } from "react-router-dom";
import { goToResult } from "../shared/goToResult.js";
import { useRef } from "react";


pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function AddPageNumbers() {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);


  // keep numeric
  const [startAt, setStartAt] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [position, setPosition] = useState("bottom-center");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // drag + preview
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMeta, setPreviewMeta] = useState("");

  const navigate = useNavigate();

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const buildPreview = async (pdfBytes) => {
    try {
      const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
      const page = await doc.getPage(1);

      const viewport = page.getViewport({ scale: 0.95 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      setPreviewUrl(canvas.toDataURL("image/png"));
      setPreviewMeta(`Pages: ${doc.numPages}`);
    } catch {
      setPreviewUrl("");
      setPreviewMeta("");
    }
  };

  const addPickedFile = async (f) => {
    setError("");
    if (!f) return;

    if (f.type !== "application/pdf") {
      setError("Please select a PDF.");
      return;
    }

    setFile(f);

    // preview (optional)
    try {
      const bytes = await f.arrayBuffer();
      await buildPreview(bytes);
    } catch {
      setPreviewUrl("");
      setPreviewMeta("");
    }
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

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      if (!file) throw new Error("Please upload a PDF first.");

      const pdf = await loadPdfFromFile(file);
      await addPageNumbers(pdf, {
        startAt: Number(startAt),
        fontSize: Number(fontSize),
        position
      });

      const bytes = await pdf.save();

      goToResult(navigate, {
        slug: "add-page-numbers",
        title: "Page numbers added!",
        fileName: "tryatlabs-page-numbers.pdf",
        bytes
      });
    } catch (e) {
      setError(e?.message || "Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--pagenum card">
      <div className="grid2">
        {/* Drop zone */}
        <div
          className={`drop ${dragging ? "isDragging" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
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
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false /* change to true for merge */}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <div className="drop__inner">
            <div className="drop__title">{file ? "Replace PDF" : "Upload PDF"}</div>
            <div className="muted">{file ? info : "Drop a PDF or click to upload"}</div>
          </div>
        </div>


        {/* Panel */}
        <div className="panel">
          {file && (
            <div className="previewRow">
              <div className="previewTop">
                <div className="previewTitle">Preview</div>
                <div className="muted">{previewMeta}</div>
              </div>

              {previewUrl ? (
                <div className="previewMedia">
                  <img src={previewUrl} alt="PDF preview page 1" />
                  {/* Overlay simulation of page number placement */}
                  <div className={`previewNum previewNum--${position}`}>
                    {Number(startAt)}
                  </div>
                </div>
              ) : (
                <div className="muted">Preview unavailable for this PDF.</div>
              )}

              <div className="hint">Preview shows placement on page 1 (number will increment on next pages).</div>
            </div>
          )}

          {/* Controls */}
          <div className="panelGrid">
            <div className="field">
              <div className="field__label">Start number</div>
              <input
                className="input"
                type="number"
                value={startAt}
                min={1}
                onChange={(e) => setStartAt(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <div className="field__label">Font size</div>
              <input
                className="input"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={8}
                max={20}
              />
            </div>
          </div>

          <div className="field">
            <div className="field__label">Position</div>
            <select className="input" value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-center">Top Center</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={run}>
          {busy ? "Adding..." : "Add & Continue"}
        </button>
      </div>
    </div>
  );
}
