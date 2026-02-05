# TryAtLabs – PDF Tools

Fast, privacy-first, client-side PDF tools built for modern browsers.  
No uploads. No servers. No compromises.

TryAtLabs PDF Tools let users **merge, split, crop, rotate, watermark, convert, and manage PDFs** instantly — all processing happens **inside the browser**.

---

## ✨ Features

- 🔒 **100% Client-Side Processing**
  - Files never leave the user’s device
  - No backend, no storage, no tracking

- ⚡ **Instant Results**
  - Powered by `pdf-lib`, `pdfjs`, and modern browser APIs
  - Optimized for large files and smooth UX

- 📱 **Mobile-First & Responsive**
  - Perfectly usable on phones, tablets, and desktops
  - Touch-friendly drag, crop, and reorder actions

- 🎨 **Premium UI**
  - Dark glass theme
  - Clean cards, subtle animations, and modern layout
  - Consistent UX across all tools

- 📥 **Dedicated Result Page**
  - Every tool redirects to a unified Result screen
  - Safe download with auto URL cleanup
  - Suggested next tools for better flow

---

## 🧰 Available PDF Tools

### Core Tools
- **Merge PDF**
  - Combine multiple PDFs
  - Reorder pages/files before merging
  - Scrollable selected file list

- **Split PDF**
  - Extract specific pages or ranges
  - Preview page thumbnails
  - Smart range parsing (`1-3,5,8`)

- **Crop PDF**
  - Visual crop selector (drag, resize, move)
  - Apply to all pages or selected page
  - Manual page navigation (Prev / Next / Go to page)

- **Rotate PDF**
  - Rotate all pages
  - Supports 90°, 180°, 270°

- **Add Page Numbers**
  - Custom start number
  - Font size & position control
  - Live preview overlay

- **Add Watermark**
  - Text watermark
  - Opacity, rotation, font size controls
  - Simulated preview before applying

### Conversion
- **Word to PDF**
  - DOCX → PDF (client-side)
  - Page size (A4 / Letter)
  - Margin & quality control
  - Layout-preserving preview

---

## 🧠 Architecture

Browser
├── UI (React + CSS)
├── PDF Preview (pdfjs-dist)
├── PDF Editing (pdf-lib)
├── Canvas Rendering
└── Result Page (Blob download)


- No backend required
- No file uploads
- No API keys
- Fully static deployable (Vite / Netlify / Cloudflare)

---

## 🔁 Result Page Flow

All tools follow the same pattern:

1. User uploads/selects file
2. Tool processes PDF in browser
3. Tool generates PDF bytes
4. Redirect to `/result` with:
   - tool slug
   - title
   - filename
   - blob URL / bytes
5. User downloads file safely

This ensures:
- Consistency
- Better UX
- Easy tool chaining

---

## 🛡️ Privacy & Security

- Files never leave the browser
- No analytics on file content
- Blob URLs revoked after download
- Works fully offline after load

---

## 🧩 Tech Stack

- **Frontend:** React + Vite
- **PDF Engine:** `pdf-lib`
- **PDF Preview:** `pdfjs-dist`
- **Canvas:** HTML5 Canvas API
- **DOCX Rendering:** `docx-preview`
- **Styling:** Custom CSS (dark glass theme)

---

## 🚀 Getting Started (Local)

```bash
npm install
npm run dev
Open http://localhost:5173

🌍 Deployment
This project can be deployed on:

Netlify

Vercel

Cloudflare Pages

GitHub Pages

No server configuration required.

🧭 Roadmap
Drag-to-reorder (gesture based)

OCR (client-side via WebAssembly)

Image to PDF

Compress PDF (client-side heuristics)

PWA offline mode

❤️ Philosophy
Your files are yours.
TryAtLabs is built on the principle that document tools should be:

Fast

Private

Simple

Beautiful

📄 License
MIT License
© TryAtLabs

