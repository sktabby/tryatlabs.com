import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, DEV_TOOLS } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { toolJsonLd } from "../../seo/jsonld.js";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./LoremIpsumGenerator.css";

const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit.";

/* =========================
   ADVANCED LOCAL GENERATOR
   (no server, no deps)
   ========================= */
const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","ut",
  "enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris",
  "nisi","ut","aliquip","ex","ea","commodo","consequat","duis","aute","irure","dolor",
  "in","reprehenderit","in","voluptate","velit","esse","cillum","dolore","eu","fugiat",
  "nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt",
  "in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function makeSentence() {
  const len = randInt(8, 16);
  const w = [];
  for (let i = 0; i < len; i++) w.push(pick(WORDS));

  // light “natural” structure (optional dash)
  if (len > 11 && Math.random() < 0.35) w.splice(randInt(3, 6), 0, "—");

  let s = w.join(" ").replace(" — ", "—");

  // occasional comma
  if (len > 10 && Math.random() < 0.5) {
    const idx = randInt(4, Math.min(9, len - 2));
    const parts = s.split(" ");
    parts[idx] = parts[idx] + ",";
    s = parts.join(" ");
  }

  const end = Math.random() < 0.15 ? "!" : Math.random() < 0.12 ? "?" : ".";
  return cap(s) + end;
}
function makeParagraph() {
  const sentences = randInt(3, 6);
  const out = [];
  for (let i = 0; i < sentences; i++) out.push(makeSentence());
  return out.join(" ");
}
function generateAdvancedLorem() {
  const paras = randInt(2, 4);
  const p = [];
  for (let i = 0; i < paras; i++) p.push(makeParagraph());
  return p.join("\n\n");
}

function InfoSection({ title, children }) {
  return (
    <section className="liSection" aria-label={title}>
      <h2 className="liH2">{title}</h2>
      <div className="liP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`liFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="liFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="liFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="liFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function LoremIpsumGenerator() {
  const tool = DEV_TOOLS.find((t) => t.slug === "lorem-ipsum-generator");

  const [text, setText] = useState(LOREM);

  const output = useMemo(() => text, [text]);
  const canClear = useMemo(() => !!text.trim(), [text]);

  const faq = [
    { q: "What is Lorem Ipsum used for?", a: "It’s placeholder text used in design and development to preview layout, typography, and spacing without needing final content." },
    { q: "Is Lorem Ipsum meaningful text?", a: "Not really. It’s derived from Latin-like text, but it’s primarily used as filler so designs don’t look empty." },
    { q: "Can I use it in production?", a: "Avoid it in production UI. It’s intended for mockups and drafts, not final user-facing copy." },
    { q: "Is this tool private?", a: "Yes. Everything runs locally in your browser—no server calls are made." },
    { q: "Why is it read-only sometimes?", a: "Some generators lock output. Here, you can still edit the text if you want to customize it." },
    { q: "Can I generate paragraphs and longer text?", a: "This version keeps it simple. If you want configurable paragraphs/words, we can add controls later." },
    { q: "Does it work offline?", a: "Yes—after the page loads once, it typically continues to work offline since it runs locally." },
    { q: "Does it store my text?", a: "No. It stays in browser memory only and is not uploaded." },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };

  return (
    <>
      <SeoHead
        title={tool.title}
        description={tool.description}
        canonical={`${SITE.baseUrl}/tools/${tool.slug}`}
        jsonLd={toolJsonLd({
          title: tool.title,
          description: tool.description,
          url: `${SITE.baseUrl}/tools/${tool.slug}`,
        })}
      />

      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <Card
        title={tool.title}
        right={
          <Link className="btnGhost" to="/">
            ← All Tools
          </Link>
        }
      >
        {/* TOP BAR */}
        <Row className="liTabs">
          <Button onClick={() => setText(generateAdvancedLorem())}>Generate</Button>

          <div className="liTabsSpacer" />

          <CopyButton text={output} />

          <Button
            variant="soft"
            onClick={() => setText("")}
            disabled={!canClear}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE */}
        <div className="liWorkspace">
          <div className="liCol">
            <div className="liBox liBoxFill">
              <TextArea
                value={text}
                onChange={setText}
                placeholder="Lorem ipsum…"
                rows={10}
              />
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="liSteps">
            <li>Use the text area to view (or edit) the placeholder text.</li>
            <li>Click <b>Copy</b> to copy it instantly.</li>
            <li>Use <b>Clear</b> to reset the box.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT SECTIONS */}
        <div className="liLong">
          <InfoSection title="Overview">
            Lorem Ipsum is a classic placeholder text used to preview layouts without needing final content.
            It helps you focus on design, spacing, and typography.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="liList">
              <li><b>UI mockups:</b> preview how text blocks look in cards, pages, and forms.</li>
              <li><b>Typography checks:</b> test font sizes, line-heights, and readability.</li>
              <li><b>Component layouts:</b> verify spacing and alignment in responsive views.</li>
              <li><b>Prototypes:</b> keep screens realistic before real copy is available.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="liList">
              <li><b>Instant:</b> copy-ready placeholder text anytime.</li>
              <li><b>Flexible:</b> you can edit the text for custom filler.</li>
              <li><b>Private:</b> runs locally in your browser (no server calls).</li>
              <li><b>Clean UX:</b> consistent styling with the tool suite.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            This tool simply provides a placeholder string and lets you copy it quickly.
            Any edits remain only in your browser.
          </InfoSection>

          <InfoSection title="Limitations">
            This version is intentionally simple and does not generate configurable paragraphs or word counts.
            If you need controls (words/lines/paragraphs), we can add them later.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your text is processed locally in your browser and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="liList">
              <li>Use placeholder text for <b>layout testing</b>, not real communication.</li>
              <li>Replace filler before publishing any page.</li>
              <li>Keep line length readable for better UI results.</li>
            </ul>
          </InfoSection>

          <section className="liSection" aria-label="Frequently asked questions">
            <h2 className="liH2">FAQ</h2>
            <div className="liFaq">
              {faq.map((x) => (
                <FAQItem key={x.q} q={x.q} a={x.a} />
              ))}
            </div>
          </section>
        </div>
      </Card>
    </>
  );
}