export const SITE = {
  // Branding / identity
  brandName: "TryAtLabs",
  name: "TryAtLabs PDF",
  accent: "#809bce",

  // URLs (important for SEO canonicals + OG)
  // ✅ Always use full URL
  url: "https://pdf.tryatlabs.com",

  // Optional: used for shared assets
  defaultOgImage: "/assets/og-default.png",

  description:
    "Fast, privacy-first PDF tools in your browser: merge, split, rotate, reorder, watermark, compress & more."
};

export const PDF_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "organize", label: "Organize PDF" },
  { id: "optimize", label: "Optimize PDF" },
  { id: "convert", label: "Convert PDF" },
  { id: "edit", label: "Edit PDF" },
  { id: "security", label: "PDF Security" }
];

/**
 * category: organize | optimize | convert | edit | security
 * badge is optional
 *
 * ✅ SEO fields (recommended):
 * - keywords: comma-separated string
 * - seoTitle: optional override (else title is used)
 * - seoDesc: optional override (else desc is used)
 */
export const PDF_TOOLS = [
  // ORGANIZE PDF
  {
    slug: "merge-pdf",
    title: "Merge PDF",
    desc: "Combine PDFs into one file (drag & drop).",
    badge: "Popular",
    category: "organize",
    keywords: "merge pdf, combine pdf, join pdf, merge pdf online"
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    desc: "Split by page ranges or extract single pages.",
    badge: "Fast",
    category: "organize",
    keywords: "split pdf, extract pages, split pdf online, separate pdf pages"
  },
  {
    slug: "reorder-pages",
    title: "Reorder Pages",
    desc: "Drag & drop page thumbnails to reorder.",
    badge: "Pro",
    category: "organize",
    keywords: "reorder pdf pages, organize pdf, rearrange pdf pages"
  },
  {
    slug: "extract-pages",
    title: "Extract Pages",
    desc: "Extract chosen pages into a new PDF.",
    badge: "Clean",
    category: "organize",
    keywords: "extract pdf pages, save selected pages, split pdf pages"
  },

  // OPTIMIZE PDF
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    desc: "Reduce size by rebuilding pages with quality control.",
    badge: "Smart",
    category: "optimize",
    keywords: "compress pdf, reduce pdf size, shrink pdf, optimize pdf"
  },
  // {
  //   slug: "repair-pdf",
  //   title: "Repair PDF",
  //   desc: "Fix broken or unreadable PDFs by rebuilding the file structure — fully private in your browser.",
  //   badge: "Fix",
  //   category: "optimize",
  //   keywords: "repair pdf, fix pdf, corrupted pdf repair"
  // },

  // EDIT PDF
  {
    slug: "rotate-pages",
    title: "Rotate Pages",
    desc: "Rotate all pages (90/180/270).",
    badge: "Quick",
    category: "edit",
    keywords: "rotate pdf, rotate pdf pages, rotate pdf online"
  },
  {
    slug: "add-page-numbers",
    title: "Add Page Numbers",
    desc: "Add neat page numbers (position + style).",
    badge: "Neat",
    category: "edit",
    keywords: "add page numbers pdf, paginate pdf, page numbering"
  },

  // PDF SECURITY
  {
    slug: "add-watermark",
    title: "Add Watermark",
    desc: "Add text watermark with opacity + rotation.",
    badge: "Secure",
    category: "security",
    keywords: "watermark pdf, add watermark, confidential watermark pdf"
  },

  // {
  //   slug: "ocr-pdf",
  //   title: "OCR PDF",
  //   desc: "Make scanned PDFs searchable by extracting text — fully private in your browser.",
  //   badge: "New",
  //   category: "optimize",
  //   keywords: "ocr pdf, searchable pdf, extract text from scanned pdf"
  // },

  {
    slug: "word-to-pdf",
    title: "Word to PDF",
    desc: "Convert DOCX to PDF — private, fast, and fully in your browser.",
    badge: "New",
    category: "convert",
    keywords: "word to pdf, docx to pdf, convert word to pdf online"
  },

  {
    slug: "crop-pdf",
    title: "Crop PDF",
    desc: "Crop PDF margins (top/right/bottom/left) — fully private in your browser.",
    badge: "Clean",
    category: "edit",
    keywords: "crop pdf, remove margins pdf, trim pdf pages"
  },

  // {
  //   slug: "protect-pdf",
  //   title: "Protect PDF",
  //   desc: "Encrypt your PDF with a password (AES-128) — fully private in your browser.",
  //   badge: "Secure",
  //   category: "security",
  //   keywords: "protect pdf, encrypt pdf, password protect pdf"
  // }

  // CONVERT PDF (future)
  // { slug: "pdf-to-jpg", title: "PDF to JPG", desc: "Convert PDF pages to JPG images.", category: "convert" },
];

// Helpers (optional but super useful everywhere)
export const getToolBySlug = (slug) => PDF_TOOLS.find((t) => t.slug === slug);

export const toolCanonical = (slug) => `${SITE.url}/${slug}`;

