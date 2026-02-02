import CaseConverter from "./case-converter/CaseConverter.jsx";
import WordCounter from "./word-counter/WordCounter.jsx";
import RemoveSpaces from "./remove-spaces/RemoveSpaces.jsx";
import SlugGenerator from "./slug-generator/SlugGenerator.jsx";
import MarkdownPreview from "./markdown-preview/MarkdownPreview.jsx";
import DiffChecker from "./diff-checker/DiffChecker.jsx";
import EmailExtractor from "./email-extractor/EmailExtractor.jsx";
import FindReplace from "./find-replace/FindReplace.jsx";

/* =========================
   SVG Icon Wrapper (PURE)
========================= */
const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="toolSvg"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/* =========================
   Premium SVG Icon Set
========================= */
export const TOOL_ICONS = {
  // Text Case: "Aa" vibe + baseline
  case: () => (
    <Icon>
      <path d="M6 17h6" />
      <path d="M8 17L10 7l2 10" />
      <path d="M7.4 14h3.2" />
      <path d="M14 10h4" />
      <path d="M16 10v7" />
      <path d="M14 17h4" />
    </Icon>
  ),

  // Counter: stacked lines + small tick marks
  counter: () => (
    <Icon>
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h10" />
      <path d="M5 8h.01" />
      <path d="M5 12h.01" />
      <path d="M5 16h.01" />
    </Icon>
  ),

  // Spaces: whitespace bars + arrows indicating trimming
  spaces: () => (
    <Icon>
      <path d="M7 10h10" />
      <path d="M7 14h10" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <path d="M6.5 12l-1.5-1.5" />
      <path d="M6.5 12l-1.5 1.5" />
      <path d="M17.5 12l1.5-1.5" />
      <path d="M17.5 12l1.5 1.5" />
    </Icon>
  ),

  // Slug: chain link + cursor hint
  slug: () => (
    <Icon>
      <path d="M10.5 13.5a3.5 3.5 0 0 1 0-5l1-1a3.5 3.5 0 1 1 5 5l-1 1" />
      <path d="M13.5 10.5a3.5 3.5 0 0 1 0 5l-1 1a3.5 3.5 0 1 1-5-5l1-1" />
      <path d="M8 18h3" />
      <path d="M9.5 16.5V19.5" />
    </Icon>
  ),

  // Markdown: stylized "M" + down arrow (render)
  markdown: () => (
    <Icon>
      <path d="M7 16V8l3 4 3-4v8" />
      <path d="M16 8v6" />
      <path d="M14.5 12.5L16 14l1.5-1.5" />
    </Icon>
  ),

  // Diff: left lines + plus/minus markers
  diff: () => (
    <Icon>
      <path d="M7 8h7" />
      <path d="M7 12h10" />
      <path d="M7 16h7" />
      <path d="M18 10h3" />
      <path d="M19.5 8.5v3" />
      <path d="M18 15h3" />
    </Icon>
  ),

  // Email: envelope flap + small badge dot
  email: () => (
    <Icon>
      <path d="M6 9l6 4 6-4" />
      <path d="M6 9v7" />
      <path d="M18 9v7" />
      <path d="M6 16h12" />
      <circle cx="18.5" cy="8" r="1.2" />
    </Icon>
  ),

  // Find/Replace: magnifier + swap arrows
  findReplace: () => (
    <Icon>
      <circle cx="10.5" cy="10.5" r="3.8" />
      <path d="M14.8 14.8L19 19" />
      <path d="M14 7h6" />
      <path d="M18.5 7l1.5 1.5" />
      <path d="M18.5 7l1.5-1.5" />
      <path d="M14 13h6" />
      <path d="M14 13l1.5 1.5" />
      <path d="M14 13l1.5-1.5" />
    </Icon>
  )
};


/* =========================
   Tool Registry
========================= */
export const TEXT_TOOLS = [
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case and more.",
    keywords: "case converter, uppercase, lowercase, title case, sentence case",
    component: CaseConverter,
    icon: "case"
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, paragraphs — instantly.",
    keywords: "word counter, character counter, sentence counter, paragraph counter",
    component: WordCounter,
    icon: "counter"
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    description: "Clean text by removing extra spaces, empty lines, and trimming edges.",
    keywords: "remove spaces, trim text, clean text, whitespace remover",
    component: RemoveSpaces,
    icon: "spaces"
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description: "Generate SEO-friendly URL slugs from any text.",
    keywords: "slug generator, seo url, permalink, url safe text",
    component: SlugGenerator,
    icon: "slug"
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    description: "Write Markdown and preview the rendered output live.",
    keywords: "markdown preview, md renderer, markdown editor",
    component: MarkdownPreview,
    icon: "markdown"
  },
  {
    slug: "diff-checker",
    name: "Compare texts",
    description: "Compare two texts and see what changed.",
    keywords: "diff checker, compare text, text difference",
    component: DiffChecker,
    icon: "diff"
  },
  {
    slug: "email-extractor",
    name: "Email Extractor",
    description: "Extract email addresses from text instantly.",
    keywords: "email extractor, extract emails from text, email finder",
    component: EmailExtractor,
    icon: "email"
  },
  {
    slug: "find-replace-remove-duplicates",
    name: "Find in Text",
    description: "Find and replace text or remove duplicate lines online.",
    keywords: "find and replace text, remove duplicate lines, text cleanup",
    component: FindReplace,
    icon: "findReplace"
  }
];

/* =========================
   Helpers
========================= */
export function getToolBySlug(slug) {
  return TEXT_TOOLS.find((t) => t.slug === slug);
}
