# TryAtLabs – Text Tools 🧪✍️

A modern, browser-based collection of **fast, privacy-first text utilities** built with React.  
All tools run client-side, require no sign-up, and are designed with a clean, premium UI.

This project is part of the **TryAtLabs monorepo** and specifically powers the **Text Tools** section.

---

## 📁 Project Location

tryatlabs/
└── apps/
└── text/


This README documents **only the `apps/text` application**.

---

## 🧠 What This App Does

The Text Tools app provides utilities such as:

- Case conversion
- Word & character counting
- Find & replace
- Diff checker
- Markdown preview
- Email extraction
- Text cleanup & formatting

All tools:
- Work fully in the browser
- Do not upload user data
- Are optimized for desktop and mobile
- Share a consistent UI/UX

---

## 🏗️ High-Level Structure

apps/text/
├── public/
│ └── assets/
│ ├── logo.png
│ └── og-default.png
│
├── src/
│ ├── app/
│ │ ├── main.jsx
│ │ ├── site.config.js
│ │ └── providers/
│ │
│ ├── components/
│ │ ├── ads/
│ │ │ └── AdSlot.jsx
│ │ └── layout/
│ │
│ ├── pages/
│ │ ├── Home/
│ │ │ ├── Home.jsx
│ │ │ └── home.css
│ │ └── ToolPage.jsx
│ │
│ ├── tools/
│ │ ├── index.jsx
│ │ ├── shared/
│ │ │ └── ToolShell.jsx
│ │ ├── diff-checker/
│ │ ├── find-replace/
│ │ ├── markdown-preview/
│ │ ├── email-extractor/
│ │ └── ...
│ │
│ ├── seo/
│ │ ├── SeoHead.jsx
│ │ └── jsonld.js
│ │
│ ├── styles/
│ │ └── global.css
│ │
│ └── routes/
│ └── routes.jsx
│
├── index.html
├── package.json
└── vite.config.js


---

## 📄 Key Files Explained

### `index.html`
- App entry HTML
- Defines favicon, default meta tags
- React overrides SEO dynamically via `SeoHead`

---

### `src/app/main.jsx`
- React entry point
- Mounts the app to `#root`
- Sets up router and global providers

---

### `src/app/site.config.js`
Global site metadata:
- App name
- Default description
- Canonical URL

Used by SEO and shared across pages.

---

## 🧭 Routing

### `src/pages/Home/Home.jsx`
- Landing page for all text tools
- Tool search
- Tool grid
- Intro & informational sections
- Inline ad placements (optional)

### `src/pages/ToolPage.jsx`
- Generic wrapper for **all tools**
- Loads tools dynamically using slug
- Handles:
  - Page title
  - SEO
  - Layout
  - Sticky “More tools” rail

---

## 🧰 Tools System

### `src/tools/index.jsx`
Central registry for all tools.

Each tool exports:
- `slug`
- `name`
- `description`
- `component`
- `icon`

This allows:
- Auto listing on Home page
- Auto routing
- Easy scalability

---

### `src/tools/shared/ToolShell.jsx`
Common wrapper used by **every tool**.

Handles:
- Padding & layout
- Consistent spacing
- Shared UI behavior
- Tool isolation (no global CSS leaks)

---

### Individual Tool Folders
Example:
src/tools/find-replace/
└── FindReplace.jsx


Each tool:
- Manages its own state
- Includes **scoped styles inside the component**
- Does not affect other tools

This keeps tools:
- Independent
- Easy to maintain
- Safe to modify

---

## 🎨 Styling System

### `src/styles/global.css`
Contains:
- CSS variables
- Base layout
- Buttons
- Inputs
- Cards
- Typography
- Shared UI primitives

### Tool-level styles
- Written **inside the tool component**
- Scoped using `<style>` tags
- Never modify global layout accidentally

---

## 🔍 SEO System

### `src/seo/SeoHead.jsx`
- Dynamically sets:
  - `<title>`
  - `<meta description>`
  - Canonical URL
  - JSON-LD

### `src/seo/jsonld.js`
- Schema.org structured data
- Improves search visibility

---

## 📢 Ads (Optional)

### `src/components/ads/AdSlot.jsx`
- Centralized ad rendering
- Supports:
  - Manual slots
  - Auto Ads compatibility
- Easy to remove or disable globally

---

## 📱 Mobile Support

- Responsive grid layouts
- Stack-based UI on small screens
- Scrollable result areas
- Touch-friendly buttons

No separate mobile codebase required.

---

## 🚀 Development

```bash
cd apps/text
npm install
npm run dev
Local server runs via Vite.

🧩 Design Principles
Privacy-first

Client-side processing

Clean and premium UI

Minimal distractions

Fast load times

Easy extensibility

📌 Part of TryAtLabs
This app is one module of the TryAtLabs ecosystem, alongside:

Main website

Other tool categories (PDF, Image, etc.)

All follow a shared design and architectural philosophy.

