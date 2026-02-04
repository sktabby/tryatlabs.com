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

// Add near top (after PDF_CATEGORIES) in site.config.js
export const ICONS = {
  merge: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 7h8M8 12h8M8 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 4h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M15 4v4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  split: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4h6l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M13 4v4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M18 10v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2.5 3.5"/>
    <path d="M16.5 12.5l-2 2 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  reorder: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 7h12M6 12h12M6 17h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 5l-2 2 2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 19l2-2-2-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  extract: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M15 4v4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 13h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 10v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  compress: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 6v5M17 18v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9.5 9.5L7 12 4.5 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.5 14.5L17 12l2.5 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  rotate: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 8.5A6 6 0 0 1 18 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M18 8v4h-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.5 15.5A6 6 0 0 1 6 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 16v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  numbers: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 5h10M7 19h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8 9h8M8 13h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8"/>
  </svg>`,

  watermark: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l7 4v10l-7 4-7-4V7l7-4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M8.5 12h7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M10 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  word: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4h9l3 3v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M15 4v4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M8 12l1.2 5 1.5-3.2L12.2 17l1.5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  crop: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 3v14a2 2 0 0 0 2 2h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M3 7h14a2 2 0 0 1 2 2v12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M9 7v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>
    <path d="M7 9h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>
  </svg>`
};

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
    keywords: "merge pdf, combine pdf, join pdf, merge pdf online",
    icon: ICONS.merge
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    desc: "Split by page ranges or extract single pages.",
    badge: "Fast",
    category: "organize",
    keywords: "split pdf, extract pages, split pdf online, separate pdf pages",
    icon: ICONS.split
  },
  {
    slug: "reorder-pages",
    title: "Reorder Pages",
    desc: "Drag & drop page thumbnails to reorder.",
    badge: "Pro",
    category: "organize",
    keywords: "reorder pdf pages, organize pdf, rearrange pdf pages",
    icon: ICONS.reorder
  },
  {
    slug: "extract-pages",
    title: "Extract Pages",
    desc: "Extract chosen pages into a new PDF.",
    badge: "Clean",
    category: "organize",
    keywords: "extract pdf pages, save selected pages, split pdf pages",
    icon: ICONS.extract
  },

  // OPTIMIZE PDF
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    desc: "Reduce size by rebuilding pages with quality control.",
    badge: "Smart",
    category: "optimize",
    keywords: "compress pdf, reduce pdf size, shrink pdf, optimize pdf",
    icon: ICONS.compress
  },

  // EDIT PDF
  {
    slug: "rotate-pages",
    title: "Rotate Pages",
    desc: "Rotate all pages (90/180/270).",
    badge: "Quick",
    category: "edit",
    keywords: "rotate pdf, rotate pdf pages, rotate pdf online",
    icon: ICONS.rotate
  },
  {
    slug: "add-page-numbers",
    title: "Add Page Numbers",
    desc: "Add neat page numbers (position + style).",
    badge: "Neat",
    category: "edit",
    keywords: "add page numbers pdf, paginate pdf, page numbering",
    icon: ICONS.numbers
  },

  // PDF SECURITY
  {
    slug: "add-watermark",
    title: "Add Watermark",
    desc: "Add text watermark with opacity + rotation.",
    badge: "Secure",
    category: "security",
    keywords: "watermark pdf, add watermark, confidential watermark pdf",
    icon: ICONS.watermark
  },

  {
    slug: "word-to-pdf",
    title: "Word to PDF",
    desc: "Convert DOCX to PDF — private, fast, and fully in your browser.",
    badge: "New",
    category: "convert",
    keywords: "word to pdf, docx to pdf, convert word to pdf online",
    icon: ICONS.word
  },

  {
    slug: "crop-pdf",
    title: "Crop PDF",
    desc: "Crop PDF margins (top/right/bottom/left) — fully private in your browser.",
    badge: "Clean",
    category: "edit",
    keywords: "crop pdf, remove margins pdf, trim pdf pages",
    icon: ICONS.crop
  }
];

// Helpers (optional but super useful everywhere)
export const getToolBySlug = (slug) => PDF_TOOLS.find((t) => t.slug === slug);

export const toolCanonical = (slug) => `${SITE.url}/${slug}`;
