// apps/pdf/src/services/wordToPdfClient.js
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import { renderAsync } from "docx-preview";

const PAGE_PRESETS = {
  a4: { wIn: 8.27, hIn: 11.69, wPx: 794, hPx: 1123 },     // ~96dpi A4
  letter: { wIn: 8.5, hIn: 11, wPx: 816, hPx: 1056 },     // ~96dpi Letter
};

export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/**
 * Render DOCX into mountEl via docx-preview.
 * This is only for preview + a source DOM for the canvas capture.
 */
export async function renderDocxPreviewToEl(file, mountEl) {
  const ab = await file.arrayBuffer();
  mountEl.innerHTML = "";

  await renderAsync(ab, mountEl, null, {
    inWrapper: true,
    className: "docx",
    ignoreWidth: false,
    ignoreHeight: false,
  });
}

/**
 * ✅ Find "page" nodes produced by docx-preview.
 * Fallback to wrapper if not found.
 */
function detectDocxPages(previewEl) {
  const selectors = [
    ".docx .page",
    ".docx-wrapper .page",
    ".page",
  ];

  const pages = Array.from(previewEl.querySelectorAll(selectors.join(",")))
    .filter((el) => (el?.getBoundingClientRect?.().width || 0) > 80);

  if (pages.length) return pages;

  const wrapper =
    previewEl.querySelector(".docx-wrapper") ||
    previewEl.querySelector(".docx") ||
    previewEl;

  return wrapper ? [wrapper] : [];
}

/**
 * ✅ Offscreen staging container to avoid capturing app/theme wrappers.
 * We clone each page into a white "paper" environment.
 */
function createStage() {
  const stage = document.createElement("div");
  stage.setAttribute("data-tryatlabs-stage", "true");
  stage.style.position = "fixed";
  stage.style.left = "-10000px";
  stage.style.top = "0";
  stage.style.width = "1px";
  stage.style.height = "1px";
  stage.style.overflow = "hidden";
  stage.style.background = "#ffffff";
  stage.style.zIndex = "-1";
  document.body.appendChild(stage);
  return stage;
}

function cleanupStage(stage) {
  try {
    stage?.remove?.();
  } catch {}
}

/**
 * ✅ Capture a single DOM node to canvas at a locked width.
 * - Locks width to preset paper width (px) so wrapping matches paper.
 * - Forces white background + removes shadows/borders.
 */
async function captureNodeToCanvas(node, { paperWidthPx, scale }) {
  const stage = createStage();

  try {
    // Stage wrapper locked to paper width
    const wrapper = document.createElement("div");
    wrapper.style.width = `${paperWidthPx}px`;
    wrapper.style.background = "#ffffff";
    wrapper.style.padding = "0";
    wrapper.style.margin = "0";
    wrapper.style.overflow = "visible";
    wrapper.style.boxShadow = "none";
    wrapper.style.border = "0";

    // Clone node
    const clone = node.cloneNode(true);

    // Force clone to behave like printable content
    clone.style.width = "100%";
    clone.style.maxWidth = "none";
    clone.style.background = "#ffffff";
    clone.style.overflow = "visible";
    clone.style.boxShadow = "none";
    clone.style.border = "0";
    clone.style.margin = "0";

    wrapper.appendChild(clone);
    stage.appendChild(wrapper);

    // ✅ Important: real content size (prevents right-side clipping)
    // Use scrollWidth/scrollHeight, not getBoundingClientRect
    const capW = Math.max(wrapper.scrollWidth, wrapper.getBoundingClientRect().width);
    const capH = Math.max(wrapper.scrollHeight, wrapper.getBoundingClientRect().height);

    const w = Math.ceil(capW);
    const h = Math.ceil(capH);

    const canvas = await html2canvas(wrapper, {
      backgroundColor: "#ffffff",
      scale,
      useCORS: true,
      logging: false,

      // ✅ These 4 are the “no-crop” keys
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,

      scrollX: 0,
      scrollY: 0,

      onclone: (doc) => {
        // Force clone to not clip anything inside docx-preview markup
        const style = doc.createElement("style");
        style.textContent = `
          [data-tryatlabs-stage], [data-tryatlabs-stage] * {
            background: #fff !important;
            box-shadow: none !important;
          }

          /* docx-preview common wrappers */
          .docx-wrapper, .docx, .docx * {
            max-width: none !important;
            overflow: visible !important;
          }

          /* Pages sometimes have shadows/margins that cause capture mismatch */
          .page {
            box-shadow: none !important;
            overflow: visible !important;
            border: 0 !important;
          }
        `;
        doc.head.appendChild(style);
      },
    });

    return canvas;
  } finally {
    cleanupStage(stage);
  }
}


/**
 * ✅ Slice a tall canvas into multiple PDF pages (prevents "very lengthy" look).
 * Each slice fits in the PDF target area.
 */
async function embedCanvasAsPagedImages(pdf, canvas, {
  pageW,
  pageH,
  marginPt,
}) {
  const targetW = pageW - marginPt * 2;
  const targetH = pageH - marginPt * 2;

  const fullW = canvas.width;
  const fullH = canvas.height;

  // Scale to fit width inside targetW
  const scaleToFit = targetW / fullW;

  // How many source pixels fit into one PDF page height?
  const sliceHeightPx = Math.floor(targetH / scaleToFit);

  let y = 0;
  while (y < fullH) {
    const sliceH = Math.min(sliceHeightPx, fullH - y);

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = fullW;
    sliceCanvas.height = sliceH;

    const ctx = sliceCanvas.getContext("2d", { alpha: false });
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(canvas, 0, y, fullW, sliceH, 0, 0, fullW, sliceH);

    const pngUrl = sliceCanvas.toDataURL("image/png");
    const png = await pdf.embedPng(pngUrl);

    const page = pdf.addPage([pageW, pageH]);
    const drawW = targetW;
    const drawH = sliceH * scaleToFit;

    // draw from top of page down (Word-like)
    page.drawImage(png, {
      x: marginPt,
      y: pageH - marginPt - drawH,
      width: drawW,
      height: drawH,
    });

    y += sliceH;
  }
}

/**
 * ✅ High-end client-side DOCX -> PDF (best effort).
 * Fixes "very lengthy" output by:
 * 1) locking capture width to paper width
 * 2) slicing tall captures into proper PDF pages
 */
export async function convertDocxToPdfBytes({
  file,
  previewEl,
  pagePreset = "a4",
  marginIn = 0.35,
  quality = 2,
}) {
  if (!file) throw new Error("Missing DOCX file.");
  if (!previewEl) throw new Error("Missing preview element.");

  // Ensure preview exists
  if (!previewEl.querySelector(".docx")) {
    await renderDocxPreviewToEl(file, previewEl);
  }

  const preset = PAGE_PRESETS[pagePreset] || PAGE_PRESETS.a4;

  // PDF units: points (72 per inch)
  const pageW = preset.wIn * 72;
  const pageH = preset.hIn * 72;
  const marginPt = clamp(Number(marginIn || 0), 0, 2) * 72;

  // Capture scale (clamped)
  const captureScale = clamp(Number(quality || 2), 1, 3);

  const pdf = await PDFDocument.create();

  const pages = detectDocxPages(previewEl);
  if (!pages.length) throw new Error("Could not detect DOCX content.");

  // Capture each docx "page" (or wrapper fallback)
  for (const pageNode of pages) {
    const canvas = await captureNodeToCanvas(pageNode, {
      paperWidthPx: preset.wPx,
      scale: captureScale,
    });

    // ✅ If it’s taller than a single page after scaling, slice it properly.
    // This is what removes the “very lengthy” feel.
    await embedCanvasAsPagedImages(pdf, canvas, {
      pageW,
      pageH,
      marginPt,
    });
  }

  return await pdf.save({
    useObjectStreams: false,
    addDefaultPage: false,
    updateFieldAppearances: true,
  });
}
