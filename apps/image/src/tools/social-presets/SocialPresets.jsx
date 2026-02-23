import { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";
import { canvasToBlob, downloadBlob, fileToImage, niceBytes, drawToCanvas } from "../shared/imageUtils.jsx";

const PRESETS = [
  { id: "ig-post", name: "Instagram Post", w: 1080, h: 1080 },
  { id: "ig-story", name: "Instagram Story", w: 1080, h: 1920 },
  { id: "yt-thumb", name: "YouTube Thumbnail", w: 1280, h: 720 },
  { id: "x-header", name: "X Header", w: 1500, h: 500 },
  { id: "li-banner", name: "LinkedIn Banner", w: 1584, h: 396 }
];

export default function SocialPresets() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [fit, setFit] = useState("cover"); // cover | contain
  const [format, setFormat] = useState("image/jpeg");
  const [quality, setQuality] = useState(0.9);

  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId), [presetId]);

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
    const ext = format.includes("png") ? "png" : format.includes("webp") ? "webp" : "jpg";
    return `${base}-${presetId}.${ext}`;
  }, [file, format, presetId]);

  const render = async () => {
    if (!file || !preset) return;
    setBusy(true);
    setErr("");

    try {
      const img = await fileToImage(file);

      const tw = preset.w;
      const th = preset.h;

      // Fit math
      const ir = img.naturalWidth / img.naturalHeight;
      const tr = tw / th;

      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

      if (fit === "cover") {
        // crop to fill
        if (ir > tr) {
          // image wider
          sh = img.naturalHeight;
          sw = Math.round(sh * tr);
          sx = Math.round((img.naturalWidth - sw) / 2);
        } else {
          sw = img.naturalWidth;
          sh = Math.round(sw / tr);
          sy = Math.round((img.naturalHeight - sh) / 2);
        }
      } else {
        // contain with padding: draw onto target canvas
        // We'll first create target canvas and draw centered
        const canvas = document.createElement("canvas");
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // background subtle
        ctx.fillStyle = "rgba(12,8,10,1)";
        ctx.fillRect(0, 0, tw, th);

        let dw = tw, dh = th;
        if (ir > tr) {
          dw = tw;
          dh = Math.round(tw / ir);
        } else {
          dh = th;
          dw = Math.round(th * ir);
        }
        const dx = Math.round((tw - dw) / 2);
        const dy = Math.round((th - dh) / 2);

        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);

        const blob = await canvasToBlob(canvas, format, quality);
        if (!blob) throw new Error("Export failed");
        downloadBlob(blob, outName);
        setBusy(false);
        return;
      }

      const canvas = drawToCanvas(img, tw, th, { sx, sy, sw, sh });
      const blob = await canvasToBlob(canvas, format, quality);
      if (!blob) throw new Error("Export failed");
      downloadBlob(blob, outName);
    } catch (e) {
      setErr(e?.message || "Failed to export preset.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell title="Social Presets" description="One-click sizes for social platforms with clean framing.">
      <div className="tool">
        <div className="row">
          <label className="label">
            Pick image
            <input className="inputFile" type="file" accept="image/*" onChange={onPick} />
          </label>
          {file ? (
            <div className="metaLine">
              <span className="chip">{niceBytes(file.size)}</span>
              <span className="chip">{preset.w}×{preset.h}</span>
            </div>
          ) : null}
        </div>

        {previewUrl ? (
          <div className="preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        ) : null}

        <div className="divider" />

        <div className="row grid3">
          <label className="labelSm">
            Preset
            <select className="select" value={presetId} onChange={(e) => setPresetId(e.target.value)}>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.w}×{p.h})</option>
              ))}
            </select>
          </label>

          <label className="labelSm">
            Fit
            <select className="select" value={fit} onChange={(e) => setFit(e.target.value)}>
              <option value="cover">Cover (crop to fill)</option>
              <option value="contain">Contain (no crop)</option>
            </select>
          </label>

          <label className="labelSm">
            Output
            <select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WEBP</option>
              <option value="image/png">PNG</option>
            </select>
          </label>
        </div>

        <div className="row">
          <label className="labelSm" style={{ width: "100%" }}>
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
            <span className="rangeVal">{format === "image/png" ? "Lossless" : `${Math.round(quality * 100)}%`}</span>
          </label>
        </div>

        {err ? <div className="error">{err}</div> : null}

        <button className="btn btn--primary" onClick={render} disabled={!file || busy}>
          {busy ? "Exporting…" : "Export & Download"}
        </button>
      </div>
    </ToolShell>
  );
}
