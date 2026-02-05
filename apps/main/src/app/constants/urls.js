// src/app/constants/urls.js


export const SUBDOMAINS = {
  pdf: "https://ilovepdf.tryatlabs.com",
  text: "https://text.tryatlabs.com",
  image: "https://image.tryatlabs.com",
  dev: "https://dev.tryatlabs.com"
};


/** =========================
 * Primary site routes (used by Header/Footer)
 * ========================= */
export const URLS = {
  home: "/",
  tools: "/tools",

  // ✅ add these
  labs: "/labs",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",

  // subdomain entry points (optional but useful)
  pdf: SUBDOMAINS.pdf,
  text: SUBDOMAINS.text,
  image: SUBDOMAINS.image,
  dev: SUBDOMAINS.dev
};


/** =========================
 * Subdomains (absolute)
 * ========================= */

/** =========================
 * Tool links per category
 * ========================= */
export const PDF_TOOLS_LINKS = [
  { slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one — fast, private, in-browser." },
  { slug: "split-pdf", name: "Split PDF", description: "Split by page ranges or extract pages cleanly." },
  { slug: "reorder-pages", name: "Reorder Pages", description: "Drag & drop pages to rearrange instantly." },
  { slug: "extract-pages", name: "Extract Pages", description: "Extract selected pages into a new PDF." },
  { slug: "compress-pdf", name: "Compress PDF", description: "Reduce PDF size without messy uploads." },
  { slug: "rotate-pages", name: "Rotate Pages", description: "Rotate pages and export a corrected PDF." },
  { slug: "add-page-numbers", name: "Add Page Numbers", description: "Number pages with clean, consistent placement." },
  { slug: "add-watermark", name: "Add Watermark", description: "Add text watermark to protect & brand PDFs." },
  { slug: "crop-pdf", name: "Crop PDF", description: "Crop margins and fix page framing." },
  { slug: "word-to-pdf", name: "Word to PDF", description: "Convert DOC/DOCX to PDF in a simple flow." }
];

export const TEXT_TOOLS_LINKS = [
  { slug: "text-case-converter", name: "Text Case Converter", description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case and more." },
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, paragraphs — instantly." },
  { slug: "remove-extra-spaces", name: "Remove Extra Spaces", description: "Clean text by removing extra spaces, empty lines, and trimming edges." },
  { slug: "slug-generator", name: "Slug Generator", description: "Generate SEO-friendly URL slugs from any text." },
  { slug: "markdown-preview", name: "Markdown Preview", description: "Write Markdown and preview the rendered output live." },
  { slug: "diff-checker", name: "Compare Texts", description: "Compare two texts and see what changed." },
  { slug: "email-extractor", name: "Email Extractor", description: "Extract email addresses from text instantly." },
  { slug: "find-replace-remove-duplicates", name: "Find / Replace / Remove Duplicates", description: "Find and replace text or remove duplicate lines online." }
];

export const IMAGE_TOOLS_LINKS = [
  { slug: "image-compress", name: "Compress Image", description: "Reduce image size without losing quality." },
  { slug: "image-resize", name: "Resize Image", description: "Resize images with presets and custom sizes." },
  { slug: "convert-image", name: "Convert Image", description: "Convert between JPG, PNG, WEBP and more." },
  { slug: "crop-image", name: "Crop Image", description: "Crop images precisely with a clean UI." },
  { slug: "batch-processor", name: "Batch Processor", description: "Process multiple images in one go." },
  { slug: "social-presets", name: "Social Presets", description: "Ready-to-use sizes for social platforms." }
];

export const DEV_TOOLS_LINKS = [
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate UUIDs instantly." },
  { slug: "hash-generator", name: "Hash Generator", description: "Create MD5/SHA hashes quickly." },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode JWTs locally in your browser." },
  { slug: "timestamp-generator", name: "Timestamp Generator", description: "Convert dates ↔ timestamps quickly." },
  { slug: "url-encode-decode", name: "URL Encode/Decode", description: "Encode or decode URLs safely." },
  { slug: "base64-tool", name: "Base64 Tool", description: "Encode/decode Base64 text instantly." }
];

/** =========================
 * Helper: build absolute tool url
 * ========================= */
export function toolUrl(category, slug) {
  const base = SUBDOMAINS[category];
  if (!base) return "/";
  return slug ? `${base}/${slug}` : `${base}/`;
}
