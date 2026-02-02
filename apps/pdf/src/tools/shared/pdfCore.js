import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export async function loadPdfFromFile(file) {
  const bytes = await file.arrayBuffer();
  return PDFDocument.load(bytes);
}

export async function savePdfToBlob(pdfDoc) {
  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

export async function copyPages(srcDoc, dstDoc, indices) {
  const pages = await dstDoc.copyPages(srcDoc, indices);
  pages.forEach((p) => dstDoc.addPage(p));
}

export async function addWatermarkText(pdfDoc, text, opts) {
  const {
    opacity = 0.2,
    rotation = 35,
    fontSize = 42
  } = opts || {};

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  pdfDoc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width * 0.1,
      y: height * 0.5,
      size: fontSize,
      font,
      color: rgb(0.35, 0.35, 0.35),
      rotate: degrees(rotation),
      opacity
    });
  });
}

export async function addPageNumbers(pdfDoc, opts) {
  const {
    startAt = 1,
    fontSize = 10,
    position = "bottom-center"
  } = opts || {};
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const label = String(startAt + i);

    let x = width / 2;
    let y = 18;

    if (position.includes("top")) y = height - 22;
    if (position.includes("left")) x = 20;
    if (position.includes("right")) x = width - 20;

    page.drawText(label, {
      x: position.includes("center") ? x - font.widthOfTextAtSize(label, fontSize) / 2 : x,
      y,
      size: fontSize,
      font,
      color: rgb(0.15, 0.15, 0.18),
      opacity: 0.9
    });
  });
}
