export function niceBytes(bytes = 0) {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function extFromMime(mime = "") {
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "img";
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

export async function fileToImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = url;
    await new Promise((res, rej) => {
      img.onload = () => res();
      img.onerror = rej;
    });
    return img;
  } finally {
    // keep url until draw completes in caller; caller can revoke if needed
  }
}

export function drawToCanvas(img, width, height, opts = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));
  const ctx = canvas.getContext("2d", { willReadFrequently: false });

  // clean upscale/downscale
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const { sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight } = opts;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  return canvas;
}

export function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, quality);
  });
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
