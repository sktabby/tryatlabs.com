import { useEffect, useMemo, useRef, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";
import {
  canvasToBlob,
  downloadBlob,
  fileToImage,
  niceBytes,
  drawToCanvas,
  clamp,
} from "../shared/imageUtils.jsx";
import "./compress-image.css";

const TOOL_TITLE = "Compress Image";

export default function CompressImage() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [format, setFormat] = useState("image/webp");

  // Modes: "quality" | "size" | "reduction"
  const [mode, setMode] = useState("quality");

  // quality mode
  const [quality, setQuality] = useState(0.8); // 0.35-0.95

  // target size mode
  const [targetSize, setTargetSize] = useState(300);
  const [targetUnit, setTargetUnit] = useState("KB"); // KB | MB

  // reduction mode (try to save X%)
  const [reduction, setReduction] = useState(50); // 1..95

  // resize
  const [maxW, setMaxW] = useState(1600);

  // cleanup preview URL (avoid memory leaks)
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetStateForNewFile = () => {
    setErr("");
    setInfo(null);
    setBusy(false);
  };

  const setPickedFile = (f) => {
    resetStateForNewFile();

    if (!f) return;

    if (!f.type?.startsWith("image/")) {
      setErr("Please choose an image file.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const clearFile = () => {
    resetStateForNewFile();
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onInputPick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    setPickedFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const f = e.dataTransfer.files?.[0];
    setPickedFile(f);
  };

  const outName = useMemo(() => {
    if (!file) return "";
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = format.includes("webp") ? "webp" : "jpg";
    return `${base}-compressed.${ext}`;
  }, [file, format]);

  const qPct = useMemo(() => {
    // used only for slider fill UI
    const pct = ((quality - 0.35) / (0.95 - 0.35)) * 100;
    return `${clamp(pct, 0, 100)}%`;
  }, [quality]);

  const toBytes = (n, unit) => {
    const v = Number(n) || 0;
    return unit === "MB" ? Math.round(v * 1024 * 1024) : Math.round(v * 1024);
  };

  async function exportOnce(img, tw, th, fmt, q) {
    const canvas = drawToCanvas(img, tw, th);
    const blob = await canvasToBlob(canvas, fmt, q);
    if (!blob) throw new Error("Export failed");
    return blob;
  }

  async function exportBestFitByTargetBytes(img, tw, th, targetBytes) {
    const target = clamp(targetBytes, 10 * 1024, 50 * 1024 * 1024);

    let low = 0.35;
    let high = 0.95;
    let best = null;

    // best-effort: binary search on quality
    for (let i = 0; i < 7; i++) {
      const mid = (low + high) / 2;
      const blob = await exportOnce(img, tw, th, format, mid);

      const diff = Math.abs(blob.size - target);
      if (!best || diff < best.diff) best = { blob, q: mid, diff };

      if (blob.size > target) high = mid;
      else low = mid;
    }

    return best; // { blob, q, diff }
  }

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setErr("");
    setInfo(null);

    try {
      const img = await fileToImage(file);
      const ow = img.naturalWidth;
      const oh = img.naturalHeight;

      const mw = clamp(Number(maxW) || ow, 64, 8000);
      const down = ow > mw ? mw / ow : 1;
      const tw = Math.max(1, Math.round(ow * down));
      const th = Math.max(1, Math.round(oh * down));

      let blob = null;
      let usedQuality = null;
      let note = "";

      if (mode === "quality") {
        const q = clamp(Number(quality) || 0.8, 0.35, 0.95);
        usedQuality = q;
        blob = await exportOnce(img, tw, th, format, q);
        note = "Quality mode";
      }

      if (mode === "size") {
        const targetBytes = toBytes(targetSize, targetUnit);
        const best = await exportBestFitByTargetBytes(img, tw, th, targetBytes);
        if (!best?.blob) throw new Error("Export failed");
        blob = best.blob;
        usedQuality = best.q;
        note = `Target ~${targetSize}${targetUnit}`;
      }

      if (mode === "reduction") {
        // reduction means "try to save X%" => output ~ (1 - X%) of original
        const r = clamp(Number(reduction) || 50, 1, 95);
        const targetBytes = Math.round(file.size * (1 - r / 100));
        const best = await exportBestFitByTargetBytes(img, tw, th, targetBytes);
        if (!best?.blob) throw new Error("Export failed");
        blob = best.blob;
        usedQuality = best.q;
        note = `Target save ~${r}%`;
      }

      if (!blob) throw new Error("Export failed");

      setInfo({
        before: file.size,
        after: blob.size,
        dims: `${tw}×${th}`,
        usedQuality: usedQuality == null ? null : usedQuality,
        note,
      });

      downloadBlob(blob, outName);
    } catch (e) {
      setErr(e?.message || "Failed to compress.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title={TOOL_TITLE}
      description="Reduce image file size with premium controls. Runs 100% in your browser."
    >
      <div className="ci-tool">
        {/* Dropzone */}
        <div
          className={`ci-drop ${dragging ? "is-drag" : ""} ${file ? "has-file" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only end drag if leaving the drop container (not moving over children)
            if (e.currentTarget === e.target) setDragging(false);
          }}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            className="ci-fileInput"
            type="file"
            accept="image/*"
            onChange={onInputPick}
          />

          <div className="ci-dropInner">
            <div className="ci-hintRow">
              <div className="ci-dropIcon">⬆</div>

              <div className="ci-dropText">
                <div className="ci-dropTitle">{file ? "Image selected" : "Drop image here"}</div>
                <div className="ci-dropSub">
                  {file ? `${file.name} • ${niceBytes(file.size)}` : "or click to browse • stays private"}
                </div>
              </div>

              {file ? (
                <button
                  type="button"
                  className="ci-clearBtn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    clearFile();
                  }}
                  disabled={busy}
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="ci-fileMeta">
              {file ? <span className="ci-pill">Before: {niceBytes(file.size)}</span> : null}
              <span className="ci-pill">{format.includes("webp") ? "WEBP" : "JPG"} output</span>
              <span className="ci-pill">Client-side</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        {previewUrl ? (
          <div className="ci-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        ) : null}

        <div className="ci-divider" />

        {/* Controls */}
        <div className="ci-controls">
          {/* Output */}
          <div className="ci-card">
            <div className="ci-cardTitle">Output</div>
            <div className="ci-control">
              <select className="ci-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="image/webp">WEBP (recommended)</option>
                <option value="image/jpeg">JPG</option>
              </select>
              <div className="ci-help">WEBP is smaller for most images.</div>
            </div>
          </div>

          {/* Mode */}
          <div className="ci-card">
            <div className="ci-cardTitle">Compression mode</div>

            <div className="ci-toggleRow ci-toggleRow--3">
              <button
                type="button"
                className={`ci-toggle ${mode === "quality" ? "is-on" : ""}`}
                onClick={() => setMode("quality")}
              >
                Quality
              </button>

              <button
                type="button"
                className={`ci-toggle ${mode === "size" ? "is-on" : ""}`}
                onClick={() => setMode("size")}
              >
                Target size
              </button>

              <button
                type="button"
                className={`ci-toggle ${mode === "reduction" ? "is-on" : ""}`}
                onClick={() => setMode("reduction")}
              >
                Reduce %
              </button>
            </div>

            {mode === "quality" ? (
              <div className="ci-control">
                <div className="ci-rangeTop">
                  <span className="ci-pill">Quality (visual)</span>
                  <span className="ci-rangeVal">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  className="ci-range"
                  style={{ "--pct": qPct }}
                  type="range"
                  min="0.35"
                  max="0.95"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  disabled={!file || busy}
                />
                <div className="ci-help">
                  Quality controls appearance (not “saved %”). Use Reduce % to target savings.
                </div>
              </div>
            ) : null}

            {mode === "size" ? (
              <div className="ci-control">
                <div className="ci-targetRow">
                  <input
                    className="ci-input"
                    type="number"
                    min="10"
                    step="10"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    disabled={!file || busy}
                  />
                  <select
                    className="ci-select"
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                    disabled={!file || busy}
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
                <div className="ci-help">Best-effort sizing. Output may vary slightly.</div>
              </div>
            ) : null}

            {mode === "reduction" ? (
              <div className="ci-control">
                <div className="ci-rangeTop">
                  <span className="ci-pill">Target savings</span>
                  <span className="ci-rangeVal">{clamp(Number(reduction) || 50, 1, 95)}%</span>
                </div>
                <input
                  className="ci-range"
                  style={{ "--pct": `${clamp(Number(reduction) || 50, 1, 95)}%` }}
                  type="range"
                  min="1"
                  max="95"
                  step="1"
                  value={reduction}
                  onChange={(e) => setReduction(Number(e.target.value))}
                  disabled={!file || busy}
                />
                <div className="ci-help">
                  Tries to save about {clamp(Number(reduction) || 50, 1, 95)}% of the original size.
                </div>
              </div>
            ) : null}
          </div>

          {/* Max width */}
          <div className="ci-card">
            <div className="ci-cardTitle">Resize</div>
            <div className="ci-control">
              <div className="ci-numberWrap">
                <input
                  className="ci-input"
                  type="number"
                  min="64"
                  max="8000"
                  value={maxW}
                  onChange={(e) => setMaxW(e.target.value)}
                  disabled={!file || busy}
                />
                <span className="ci-suffix">px</span>
              </div>
              <div className="ci-help">Downscales large images for extra savings.</div>
            </div>
          </div>
        </div>

        {/* Result */}
        {info ? (
          <div className="ci-note">
            <div className="ci-noteRow">
              <span className="ci-pill">Output: {info.dims}</span>
              <span className="ci-pill">After: {niceBytes(info.after)}</span>
              <span className="ci-pill">
                Saved: {Math.max(0, Math.round((1 - info.after / info.before) * 100))}%
              </span>
              {info.usedQuality != null ? (
                <span className="ci-pill">Used Q: {Math.round(info.usedQuality * 100)}%</span>
              ) : null}
              {info.note ? <span className="ci-pill">{info.note}</span> : null}
            </div>
          </div>
        ) : null}

        {err ? <div className="ci-error">{err}</div> : null}

        <div className="ci-actions">
          <button className="btn btn--primary" onClick={compress} disabled={!file || busy}>
            {busy ? "Compressing…" : "Compress & Download"}
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
