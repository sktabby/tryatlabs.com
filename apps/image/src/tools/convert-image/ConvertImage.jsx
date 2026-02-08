import { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";
import {
  canvasToBlob,
  downloadBlob,
  fileToImage,
  niceBytes,
  drawToCanvas
} from "../shared/imageUtils.jsx";

/* ✅ Tool-specific styles */
import "./convert-image.css";

export default function ConvertImage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(0.92);

  const onPick = (e) => {
    setErr("");
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const outName = useMemo(() => {
    if (!file) return "";
    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = format.includes("png")
      ? "png"
      : format.includes("jpeg")
      ? "jpg"
      : "webp";

    return `${base}-converted.${ext}`;
  }, [file, format]);

  const convert = async () => {
    if (!file) return;

    setBusy(true);
    setErr("");

    try {
      const img = await fileToImage(file);
      const canvas = drawToCanvas(
        img,
        img.naturalWidth,
        img.naturalHeight
      );

      const blob = await canvasToBlob(canvas, format, quality);
      if (!blob) throw new Error("Export failed");

      downloadBlob(blob, outName);
    } catch (e) {
      setErr(e?.message || "Failed to convert.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Convert Image"
      description="Convert image formats instantly in your browser with clean, high-quality output."
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
              <span className="chip">{file.type || "image"}</span>
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

        <div className="row grid2">
          <label className="labelSm">
            Output format
            <select
              className="select"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="image/webp">WEBP</option>
              <option value="image/jpeg">JPG</option>
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
              disabled={format === "image/png"}
            />
            <span className="rangeVal">
              {format === "image/png"
                ? "Lossless"
                : `${Math.round(quality * 100)}%`}
            </span>
          </label>
        </div>

        {err && <div className="error">{err}</div>}

        <button
          className="btn btn--primary"
          onClick={convert}
          disabled={!file || busy}
        >
          {busy ? "Converting…" : "Convert & Download"}
        </button>
      </div>
    </ToolShell>
  );
}
