import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, DEV_TOOLS } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { toolJsonLd } from "../../seo/jsonld.js";
import { nanoid } from "nanoid";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./NanoidGenerator.css";

function InfoSection({ title, children }) {
  return (
    <section className="nidSection" aria-label={title}>
      <h2 className="nidH2">{title}</h2>
      <div className="nidP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`nidFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="nidFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="nidFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="nidFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function NanoidGenerator() {
  const tool = DEV_TOOLS.find((t) => t.slug === "nanoid-generator");

  const [value, setValue] = useState(() => nanoid());

  const output = useMemo(() => value, [value]);
  const canClear = useMemo(() => !!value.trim(), [value]);

  const faq = [
    { q: "What is NanoID?", a: "NanoID is a small, secure, URL-friendly unique ID generator used as an alternative to UUIDs." },
    { q: "Is NanoID safe for IDs?", a: "Yes. NanoID uses strong randomness and is commonly used for database keys and public identifiers." },
    { q: "Does it include special characters?", a: "The default NanoID alphabet is URL-safe, so it avoids problematic characters." },
    { q: "Is this the same as UUID?", a: "Not exactly. UUID has a fixed format. NanoID is shorter, flexible, and still collision-resistant." },
    { q: "Does this tool send anything to a server?", a: "No. Generation happens locally in your browser bundle." },
    { q: "Can I generate multiple IDs?", a: "This version generates one at a time. We can add multi-generate like UUID tool if you want." },
    { q: "Will it work offline?", a: "Yes, after the page loads once, it continues working offline." },
    { q: "Does Clear remove history?", a: "There’s no stored history. Clear just empties the visible output." },
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
        <Row className="nidTabs">
          <Button onClick={() => setValue(nanoid())}>Generate</Button>

          <div className="nidTabsSpacer" />

          <CopyButton text={output} />

          <Button
            variant="soft"
            onClick={() => setValue("")}
            disabled={!canClear}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE */}
        <div className="nidWorkspace">
          <div className="nidCol">
            <FieldLabel hint="Generated NanoID (read-only)">NanoID</FieldLabel>

            <div className="nidBox nidBoxFill">
              <TextArea
                value={output}
                onChange={() => {}}
                placeholder="Click Generate…"
                rows={10}
              />
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="nidSteps">
            <li>Click <b>Generate</b> to create a new NanoID.</li>
            <li>Use <b>Copy</b> to copy it instantly.</li>
            <li>Use <b>Clear</b> to reset the output.</li>
          </ol>
        </InfoSection>

        {/* CONTENT */}
        <div className="nidLong">
          <InfoSection title="Overview">
            NanoID generates short, URL-safe unique IDs designed for modern web apps. It’s a popular alternative to UUIDs when you want cleaner, shorter IDs.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="nidList">
              <li><b>Database keys:</b> short unique identifiers for rows/documents.</li>
              <li><b>Public links:</b> shareable IDs inside URLs.</li>
              <li><b>Client-side IDs:</b> temporary IDs before server save.</li>
              <li><b>Tracking:</b> lightweight event/session identifiers.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="nidList">
              <li><b>Short:</b> cleaner than UUIDs for UI + links.</li>
              <li><b>Safe:</b> URL-friendly alphabet by default.</li>
              <li><b>Fast:</b> instant generation locally.</li>
              <li><b>Private:</b> no server calls.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Privacy Note">
            This tool runs fully in your browser — nothing is uploaded or stored on a server.
          </InfoSection>

          <section className="nidSection" aria-label="Frequently asked questions">
            <h2 className="nidH2">FAQ</h2>
            <div className="nidFaq">
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