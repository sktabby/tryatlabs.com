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

import "./crop-image.css";

export default function CropImage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [orig, setOrig] = useState({ w: 0, h: 0 });

  // crop in percentages (0..100)
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);
  const [wP, setWP] = useState(80);
  const [hP, setHP] = useState(80);

  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.92);

  const onPick = async (e) => {
    setErr("");
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));

    try {
      const img = await fileToImage(f);
      setOrig({ w: img.naturalWidth, h: img.naturalHeight });
      setX(10);
      setY(10);
      setWP(80);
      setHP(80);
    } catch {
      setErr("Could not load image.");
    }
  };

  const outName = useMemo(() => {
    if (!file) return "";
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = format.includes("png")
      ? "png"
      : format.includes("webp")
      ? "webp"
      : "jpg";
    return `${base}-cropped.${ext}`;
  }, [file, format]);

  const crop = async () => {
    if (!file) return;
    setBusy(true);
    setErr("");

    try {
      const img = await fileToImage(file);

      const sx = Math.round((clamp(x, 0, 95) / 100) * img.naturalWidth);
      const sy = Math.round((clamp(y, 0, 95) / 100) * img.naturalHeight);

      const sw = Math.round((clamp(wP, 5, 100) / 100) * img.naturalWidth);
      const sh = Math.round((clamp(hP, 5, 100) / 100) * img.naturalHeight);

      const safeW = Math.max(1, Math.min(sw, img.naturalWidth - sx));
      const safeH = Math.max(1, Math.min(sh, img.naturalHeight - sy));

      const canvas = drawToCanvas(img, safeW, safeH, {
        sx,
        sy,
        sw: safeW,
        sh: safeH
      });

      const blob = await canvasToBlob(canvas, format, quality);
      if (!blob) throw new Error("Export failed");

      downloadBlob(blob, outName);
    } catch (e) {
      setErr(e?.message || "Failed to crop.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Crop Image"
      description="Precise crop controls with a clean, reliable output."
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
                {orig.w}×{orig.h}
              </span>
              <span className="chip">{niceBytes(file.size)}</span>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="preview preview--crop">
            <div className="cropFrame">
              <img src={previewUrl} alt="Image crop preview" />
              <div
                className="cropBox"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${wP}%`,
                  height: `${hP}%`
                }}
              />
            </div>
          </div>
        )}

        <div className="divider" />

        <div className="row grid2">
          <label className="labelSm">
            Output format
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
              min="0.5"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={format === "image/png"}
            />
            <span className="rangeVal">
              {format === "image/png"
                ? "Lossless"
                : `${Math.round(quality * 100)}%`}
            </span>
          </label>
        </div>

        <div className="row grid4">
          <label className="labelSm">
            X (%)
            <input
              className="range"
              type="range"
              min="0"
              max="95"
              step="1"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
            />
            <span className="rangeVal">{x}%</span>
          </label>

          <label className="labelSm">
            Y (%)
            <input
              className="range"
              type="range"
              min="0"
              max="95"
              step="1"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
            />
            <span className="rangeVal">{y}%</span>
          </label>

          <label className="labelSm">
            Width (%)
            <input
              className="range"
              type="range"
              min="5"
              max="100"
              step="1"
              value={wP}
              onChange={(e) => setWP(Number(e.target.value))}
            />
            <span className="rangeVal">{wP}%</span>
          </label>

          <label className="labelSm">
            Height (%)
            <input
              className="range"
              type="range"
              min="5"
              max="100"
              step="1"
              value={hP}
              onChange={(e) => setHP(Number(e.target.value))}
            />
            <span className="rangeVal">{hP}%</span>
          </label>
        </div>

        {err && <div className="error">{err}</div>}

        <button
          className="btn btn--primary"
          onClick={crop}
          disabled={!file || busy}
        >
          {busy ? "Cropping…" : "Crop & Download"}
        </button>
      </div>
    </ToolShell>
  );
}
