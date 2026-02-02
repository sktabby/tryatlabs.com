import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
import { renderAsync } from "docx-preview";

import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./word-to-pdf.css";

const PAGE_PRESETS = {
  a4: { label: "A4", wIn: 8.27, hIn: 11.69 },
  letter: { label: "Letter", wIn: 8.5, hIn: 11 },
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function WordToPdf() {
  const navigate = useNavigate();
  const previewRef = useRef(null);

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Options
  const [pagePreset, setPagePreset] = useState("a4");
  const [margin, setMargin] = useState(0.35); // inches
  const [quality, setQuality] = useState(2);  // html2canvas scale

  const outName = useMemo(() => {
    if (!file) return "tryatlabs-word.pdf";
    const base = file.name.replace(/\.(docx|doc)$/i, "");
    return `${base}.pdf`;
  }, [file]);

  const onPick = async (e) => {
    setError("");
    const picked = Array.from(e.target.files || []).find(
      (f) =>
        f.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        /\.docx$/i.test(f.name)
    );
    setFile(picked || null);
    e.target.value = "";

    // Render preview automatically (for trust + better UX)
    if (picked) {
      try {
        const ab = await picked.arrayBuffer();
        if (previewRef.current) {
          previewRef.current.innerHTML = "";
          await renderAsync(ab, previewRef.current, null, {
            inWrapper: true,
            ignoreWidth: false,
            ignoreHeight: false,
            className: "docx",
          });
        }
      } catch (err) {
        setError("Could not preview this DOCX. You can still try converting.");
      }
    } else {
      if (previewRef.current) previewRef.current.innerHTML = "";
    }
  };

  const clear = () => {
    setFile(null);
    setError("");
    if (previewRef.current) previewRef.current.innerHTML = "";
  };

  const convert = async () => {
    setBusy(true);
    setError("");

    try {
      if (!file) throw new Error("Please upload a .docx file.");
      if (!previewRef.current) throw new Error("Preview container missing.");

      // Ensure preview exists (render if user skipped waiting)
      if (!previewRef.current.querySelector(".docx")) {
        const ab = await file.arrayBuffer();
        previewRef.current.innerHTML = "";
        await renderAsync(ab, previewRef.current, null, {
          inWrapper: true,
          className: "docx",
        });
      }

      // We capture the rendered doc content as an image and place into PDF pages
      const preset = PAGE_PRESETS[pagePreset] || PAGE_PRESETS.a4;

      // PDF units: points (72 per inch)
      const pageW = preset.wIn * 72;
      const pageH = preset.hIn * 72;
      const m = clamp(Number(margin || 0), 0, 2) * 72;

      const pdf = await PDFDocument.create();

      const targetW = pageW - m * 2;
      const targetH = pageH - m * 2;

      // Take one big screenshot of the document container, then slice into page-sized chunks.
      // This keeps conversion simple and reliable for client-side.
      const docEl = previewRef.current;

      const canvas = await html2canvas(docEl, {
        backgroundColor: "#ffffff",
        scale: clamp(Number(quality || 2), 1, 3),
        useCORS: true,
        logging: false,
        windowWidth: docEl.scrollWidth,
        windowHeight: docEl.scrollHeight,
      });

      const fullW = canvas.width;
      const fullH = canvas.height;

      // Compute scale factor to fit width into targetW
      const scaleToFit = targetW / fullW;
      const sliceHeightPx = Math.floor(targetH / scaleToFit);

      // Create page slices
      let y = 0;
      while (y < fullH) {
        const sliceH = Math.min(sliceHeightPx, fullH - y);

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = fullW;
        sliceCanvas.height = sliceH;

        const ctx = sliceCanvas.getContext("2d");
        ctx.drawImage(canvas, 0, y, fullW, sliceH, 0, 0, fullW, sliceH);

        const pngDataUrl = sliceCanvas.toDataURL("image/png");
        const png = await pdf.embedPng(pngDataUrl);

        const page = pdf.addPage([pageW, pageH]);

        const drawW = targetW;
        const drawH = sliceH * scaleToFit;

        page.drawImage(png, {
          x: m,
          y: pageH - m - drawH,
          width: drawW,
          height: drawH,
        });

        y += sliceH;
      }

      const outBytes = await pdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
        updateFieldAppearances: true,
      });

      goToResult(navigate, {
        slug: "word-to-pdf",
        title: "Word document converted to PDF!",
        fileName: outName,
        bytes: outBytes,
      });
    } catch (e) {
      setError(
        e?.message ||
          "Conversion failed. Try a smaller DOCX or reduce quality."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--word2pdf card">
      <div className="row">
        <label className="drop">
          <input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onPick}
          />
          <div>
            <div className="drop__title">Drop a Word (.docx) file here or click to upload</div>
            <div className="muted">
              Private conversion in your browser. Best results with DOCX (not legacy .doc).
            </div>
          </div>
        </label>
      </div>

      {file && (
        <div className="list">
          <div className="listItem">
            <div>
              <div className="listItem__title">{file.name}</div>
              <div className="muted">{niceBytes(file.size)}</div>

              <div className="wHint">
                <span className="hintChip">Client-side</span>
                <span className="hintChip">Layout-preserving</span>
                <span className="hintChip">No uploads</span>
              </div>
            </div>

            <button className="btn btn--ghost" onClick={clear} disabled={busy}>
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="wOptions">
        <div className="wOptions__title">Conversion settings</div>

        <div className="wGrid">
          <div className="field">
            <div className="field__label">Page size</div>
            <select
              className="input"
              value={pagePreset}
              onChange={(e) => setPagePreset(e.target.value)}
              disabled={busy}
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
            </select>
          </div>

          <div className="field">
            <div className="field__label">Margins (inch)</div>
            <input
              className="input"
              type="number"
              min={0}
              max={2}
              step={0.05}
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              disabled={busy}
            />
            <div className="muted small">0.35–0.5 looks best for most docs.</div>
          </div>

          <div className="field">
            <div className="field__label">Quality</div>
            <select
              className="input"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={busy}
            >
              <option value={1.5}>Balanced</option>
              <option value={2}>High (recommended)</option>
              <option value={2.5}>Max (slow)</option>
            </select>
            <div className="muted small">Higher quality = sharper PDF but slower.</div>
          </div>
        </div>

        <div className="wNote">
          Tip: If the PDF looks cropped, switch page size or reduce margins slightly.
        </div>
      </div>

      {/* Preview */}
      <div className="wPreviewWrap">
        <div className="wPreviewHead">
          <div className="wPreviewTitle">Preview</div>
          <div className="muted small">This preview is used to build your PDF.</div>
        </div>
        <div className="wPreview" ref={previewRef} />
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={busy || !file} onClick={convert}>
          {busy ? "Converting..." : "Convert & Continue"}
        </button>
        <button className="btn btn--ghost" disabled={busy || !file} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
