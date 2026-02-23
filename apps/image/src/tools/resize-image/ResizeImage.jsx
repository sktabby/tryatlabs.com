import { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";
import {
  canvasToBlob,
  downloadBlob,
  fileToImage,
  niceBytes,
  drawToCanvas,
  clamp
} from "../shared/imageUtils.jsx";

import "./resize-image.css";

export default function ResizeImage() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [orig, setOrig] = useState({ w: 0, h: 0 });

  const [mode, setMode] = useState("pixels"); // pixels | scale
  const [w, setW] = useState(1200);
  const [h, setH] = useState(1200);
  const [scale, setScale] = useState(0.75);
  const [keep, setKeep] = useState(true);

  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.9);

  const onPick = async (e) => {
    setErr("");
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    try {
      const img = await fileToImage(f);
      setOrig({ w: img.naturalWidth, h: img.naturalHeight });
      setW(img.naturalWidth);
      setH(img.naturalHeight);
    } catch {
      setErr("Could not load image.");
    }
  };

  const outName = useMemo(() => {
    if (!file) return "";
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext =
      format.includes("png")
        ? "png"
        : format.includes("webp")
        ? "webp"
        : "jpg";
    return `${base}-resized.${ext}`;
  }, [file, format]);

  const apply = async () => {
    if (!file) return;
    setBusy(true);
    setErr("");

    try {
      const img = await fileToImage(file);
      let tw = orig.w;
      let th = orig.h;

      if (mode === "scale") {
        const s = clamp(Number(scale) || 1, 0.05, 4);
        tw = Math.max(1, Math.round(orig.w * s));
        th = Math.max(1, Math.round(orig.h * s));
      } else {
        tw = Math.max(1, Math.round(Number(w) || 1));
        th = Math.max(1, Math.round(Number(h) || 1));

        if (keep) {
          const r = orig.w / orig.h;
          th = Math.max(1, Math.round(tw / r));
          setH(th);
        }
      }

      const canvas = drawToCanvas(img, tw, th);
      const blob = await canvasToBlob(canvas, format, quality);
      if (!blob) throw new Error("Export failed");

      downloadBlob(blob, outName);
    } catch (e) {
      setErr(e?.message || "Failed to resize image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Resize Image"
      description="Resize images by pixels or scale with high-quality output. Works fully in your browser."
    >
      <div className="tool">
        <div className="row">
          <label className="label">
            Pick image
            <input
              className="inputFile"
              type="file"
              accept="image/*"
              onChange={onPick}
            />
          </label>

          {file && (
            <div className="metaLine">
              <span className="chip">
                Original: {orig.w}×{orig.h}
              </span>
              <span className="chip">{niceBytes(file.size)}</span>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="preview">
            <img src={previewUrl} alt="Image preview" />
          </div>
        )}

        <div className="divider" />

        <div className="row row--split">
          <div className="seg">
            <button
              className={`segBtn ${mode === "pixels" ? "active" : ""}`}
              onClick={() => setMode("pixels")}
            >
              Pixels
            </button>
            <button
              className={`segBtn ${mode === "scale" ? "active" : ""}`}
              onClick={() => setMode("scale")}
            >
              Scale
            </button>
          </div>

          <div className="inline">
            <label className="labelSm">
              Format
              <select
                className="select"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WEBP</option>
                <option value="image/png">PNG</option>
              </select>
            </label>

            <label className="labelSm">
              Quality
              <input
                className="range"
                type="range"
                min="0.4"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
              <span className="rangeVal">
                {Math.round(quality * 100)}%
              </span>
            </label>
          </div>
        </div>

        {mode === "pixels" ? (
          <div className="row grid3">
            <label className="labelSm">
              Width (px)
              <input
                className="input"
                type="number"
                value={w}
                onChange={(e) => setW(e.target.value)}
              />
            </label>

            <label className="labelSm">
              Height (px)
              <input
                className="input"
                type="number"
                value={h}
                disabled={keep}
                onChange={(e) => setH(e.target.value)}
              />
            </label>

            <label className="check">
              <input
                type="checkbox"
                checked={keep}
                onChange={(e) => setKeep(e.target.checked)}
              />
              <span>Keep ratio</span>
            </label>
          </div>
        ) : (
          <div className="row">
            <label className="labelSm" style={{ width: "100%" }}>
              Scale
              <input
                className="range"
                type="range"
                min="0.1"
                max="2"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
              <span className="rangeVal">
                {Math.round(scale * 100)}%
              </span>
            </label>
          </div>
        )}

        {err && <div className="error">{err}</div>}

        <button
          className="btn btn--primary"
          onClick={apply}
          disabled={!file || busy}
        >
          {busy ? "Processing…" : "Resize & Download"}
        </button>
      </div>
    </ToolShell>
  );
}
