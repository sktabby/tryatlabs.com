import { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";
import { canvasToBlob, downloadBlob, fileToImage, niceBytes, drawToCanvas, clamp } from "../shared/imageUtils.jsx";

export default function BatchProcessor() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState([]);

  const [mode, setMode] = useState("compress"); // compress | resize | convert
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(0.8);
  const [maxW, setMaxW] = useState(1600);

  const totalBytes = useMemo(() => files.reduce((a, f) => a + (f.size || 0), 0), [files]);

  const onPick = (e) => {
    setErr("");
    setDone([]);
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    setFiles(picked);
    e.target.value = "";
  };

  const processOne = async (file) => {
    const img = await fileToImage(file);
    const ow = img.naturalWidth;
    const oh = img.naturalHeight;

    let tw = ow;
    let th = oh;

    if (mode === "compress") {
      const mw = clamp(Number(maxW) || ow, 64, 8000);
      const s = ow > mw ? mw / ow : 1;
      tw = Math.round(ow * s);
      th = Math.round(oh * s);
    }

    if (mode === "resize") {
      const mw = clamp(Number(maxW) || ow, 64, 8000);
      const s = ow > mw ? mw / ow : 1;
      tw = Math.round(ow * s);
      th = Math.round(oh * s);
    }

    if (mode === "convert") {
      // keep original size
      tw = ow;
      th = oh;
    }

    const canvas = drawToCanvas(img, tw, th);
    const blob = await canvasToBlob(canvas, format, quality);
    if (!blob) throw new Error("Export failed");

    const base = file.name.replace(/\.[^.]+$/, "");
    const ext = format.includes("png") ? "png" : format.includes("jpeg") ? "jpg" : "webp";
    const suffix = mode === "compress" ? "cmp" : mode === "resize" ? "rsz" : "cnv";

    return { file, blob, name: `${base}-${suffix}.${ext}` };
  };

  const run = async () => {
    if (!files.length) return;
    setBusy(true);
    setErr("");
    setDone([]);

    try {
      const results = [];
      for (const f of files) {
        const r = await processOne(f);
        results.push({
          name: r.name,
          before: f.size,
          after: r.blob.size,
          blob: r.blob
        });
      }
      setDone(results);
    } catch (e) {
      setErr(e?.message || "Batch processing failed.");
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = () => {
    done.forEach((d) => downloadBlob(d.blob, d.name));
  };

  return (
    <ToolShell title="Batch Processor" description="Process multiple images and download outputs—clean and fast.">
      <div className="tool">
        <div className="row">
          <label className="label">
            Pick images (multiple)
            <input className="inputFile" type="file" accept="image/*" multiple onChange={onPick} />
          </label>

          {files.length ? (
            <div className="metaLine">
              <span className="chip">{files.length} files</span>
              <span className="chip">{niceBytes(totalBytes)}</span>
            </div>
          ) : null}
        </div>

        <div className="divider" />

        <div className="row row--split">
          <div className="seg">
            <button className={`segBtn ${mode === "compress" ? "active" : ""}`} onClick={() => setMode("compress")}>
              Compress
            </button>
            <button className={`segBtn ${mode === "resize" ? "active" : ""}`} onClick={() => setMode("resize")}>
              Resize
            </button>
            <button className={`segBtn ${mode === "convert" ? "active" : ""}`} onClick={() => setMode("convert")}>
              Convert
            </button>
          </div>

          <div className="inline">
            <label className="labelSm">
              Output
              <select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
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
              <span className="rangeVal">{format === "image/png" ? "Lossless" : `${Math.round(quality * 100)}%`}</span>
            </label>

            {(mode === "compress" || mode === "resize") ? (
              <label className="labelSm">
                Max width
                <input className="input" type="number" value={maxW} onChange={(e) => setMaxW(e.target.value)} />
              </label>
            ) : null}
          </div>
        </div>

        {err ? <div className="error">{err}</div> : null}

        <div className="row" style={{ gap: 10 }}>
          <button className="btn btn--primary" onClick={run} disabled={!files.length || busy}>
            {busy ? "Processing…" : "Process batch"}
          </button>
          <button className="btn btn--ghost" onClick={downloadAll} disabled={!done.length}>
            Download all
          </button>
        </div>

        {done.length ? (
          <div className="table card card--glass" style={{ marginTop: 14 }}>
            <div className="table__head">
              <div>Name</div>
              <div>Before</div>
              <div>After</div>
              <div>Saved</div>
              <div />
            </div>
            {done.map((d) => (
              <div className="table__row" key={d.name}>
                <div className="mono">{d.name}</div>
                <div>{niceBytes(d.before)}</div>
                <div>{niceBytes(d.after)}</div>
                <div>{Math.max(0, Math.round((1 - d.after / d.before) * 100))}%</div>
                <div>
                  <button className="btn btn--tiny" onClick={() => downloadBlob(d.blob, d.name)}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <style>{`
          .table{
            padding: 0;
            overflow:hidden;
          }
          .table__head, .table__row{
            display:grid;
            grid-template-columns: 1.6fr .6fr .6fr .5fr .5fr;
            gap: 10px;
            padding: 12px 14px;
            align-items:center;
          }
          .table__head{
            background: rgba(255,255,255,0.03);
            border-bottom: 1px solid var(--border);
            font-size: 12px;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: rgba(255,255,255,.72);
          }
          .table__row{
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .table__row:last-child{ border-bottom: 0; }
          @media (max-width: 760px){
            .table__head{ display:none; }
            .table__row{
              grid-template-columns: 1fr;
              gap: 8px;
            }
          }
        `}</style>
      </div>
    </ToolShell>
  );
}
