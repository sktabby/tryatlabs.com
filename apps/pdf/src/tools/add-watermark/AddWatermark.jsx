import { useMemo, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useNavigate } from "react-router-dom";
import { loadPdfFromFile, addWatermarkText } from "../shared/pdfCore.js";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./add-watermake.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function AddWatermark() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.2);
  const [rotation, setRotation] = useState(35);
  const [fontSize, setFontSize] = useState(42);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // dropStrip drag stability
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  // preview
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewMeta, setPreviewMeta] = useState("");

  const info = useMemo(() => (file ? `${file.name} • ${niceBytes(file.size)}` : ""), [file]);

  const clear = () => {
    setFile(null);
    setError("");
    setDragging(false);
    dragDepth.current = 0;
    setPreviewUrl("");
    setPreviewMeta("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const buildPreview = async (pdfBytes) => {
    try {
      const doc = await pdfjs.getDocument({ data: pdfBytes }).promise;
      const page = await doc.getPage(1);

      const viewport = page.getViewport({ scale: 0.95 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: false });

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
      setError("Please select a PDF file.");
      return;
    }

    setFile(f);

    // preview best-effort
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
    dragDepth.current = 0;
    setDragging(false);

    const f = e.dataTransfer.files?.[0];
    await addPickedFile(f);
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

  const run = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file) throw new Error("Please upload a PDF first.");
      if (!text.trim()) throw new Error("Please enter watermark text.");

      const pdf = await loadPdfFromFile(file);

      await addWatermarkText(pdf, text.trim(), {
        opacity: Number(opacity),
        rotation: Number(rotation),
        fontSize: Number(fontSize),
      });

      const bytes = await pdf.save();

      // ✅ Redirect to Result page
      goToResult(navigate, {
        slug: "add-watermark",
        title: "Watermark added!",
        fileName: "tryatlabs-watermarked.pdf",
        bytes,
      });
    } catch (e) {
      setError(e?.message || "Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--watermark card">
      {/* Top bar (ONE upload button) */}
      <div className="wmTop">
        <div className="wmTop__left">
         
          <div className="muted wmSub">Apply a text watermark to every page.</div>
        </div>

        <div className="wmTop__right">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple={false}
            onChange={onPick}
            style={{ display: "none" }}
          />

          <button
            className="btn btn--primary wmUploadBtn"
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
        {/* Preview (left) */}
        <div className="leftCol">
          <div className="previewCard">
            <div className="previewHead">
              <div className="previewTitle">Preview</div>
              <div className="muted">{file ? previewMeta || "Loading…" : "Page 1"}</div>
            </div>

            {/* ✅ EXACT previewBody block (as requested) */}
            <div className="previewBody">
              {previewUrl ? (
                <div className="previewFrame">
                  <img className="previewImg" src={previewUrl} alt="PDF preview page 1" />

                  {/* Overlay simulation */}
                  <div
                    className="wmOverlay"
                    style={{
                      opacity: Number(opacity),
                      transform: `translate(-50%, -50%) rotate(${Number(rotation)}deg)`,
                      fontSize: `${Math.max(12, Math.min(72, Number(fontSize) || 42)) * 0.45}px`,
                    }}
                    aria-hidden="true"
                  >
                    {text || "WATERMARK"}
                  </div>
                </div>
              ) : (
                <div className="previewPh">{file ? "Loading Preview" : " preview will appear here!"}</div>
              )}
            </div>

            <div className="previewFoot muted">Simulated on page 1 to show opacity + rotation.</div>
          </div>
        </div>

        {/* Options (right) */}
        <div className="panel">
          <div className="panelTitle">Watermark</div>

          <div className="field">
            <div className="field__label">Watermark text</div>
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} disabled={!file || busy} />
          </div>

          <div className="grid3">
            <div className="field">
              <div className="field__label">Opacity</div>
              <input
                className="input"
                type="number"
                step="0.05"
                min="0.05"
                max="0.9"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                disabled={!file || busy}
              />
              <div className="muted">0.10–0.25 looks professional.</div>
            </div>

            <div className="field">
              <div className="field__label">Rotation</div>
              <input
                className="input"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                disabled={!file || busy}
              />
              <div className="muted">Try 30–45 for diagonal.</div>
            </div>

            <div className="field">
              <div className="field__label">Font size</div>
              <input
                className="input"
                type="number"
                min={8}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                disabled={!file || busy}
              />
              <div className="muted">Large = better visibility.</div>
            </div>
          </div>

          <div className="statsRow">
            <div className="statCard">
              <div className="statLabel">File</div>
              <div className="statValue">{file ? niceBytes(file.size) : "—"}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">Opacity</div>
              <div className="statValue">{Number(opacity).toFixed(2)}</div>
            </div>
            <div className="statCard">
              <div className="statLabel">Rotation</div>
              <div className="statValue">{Number(rotation)}°</div>
            </div>
          </div>

          <div className="panelNote">
            Tip: Keep opacity low and use diagonal rotation for clean watermarking.
          </div>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={!file || busy} onClick={run}>
          {busy ? "Applying..." : "Apply & Continue"}
        </button>
      </div>
    </div>
  );
}
