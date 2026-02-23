import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CopyButton, Row, Button, FieldLabel, TextArea } from "../shared/ui.jsx";
import "./UuidGenerator.css";

function uuidv4() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20)}`;
}

function InfoSection({ title, children }) {
  return (
    <section className="uuidSection" aria-label={title}>
      <h2 className="uuidH2">{title}</h2>
      <div className="uuidP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`uuidFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="uuidFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="uuidFaqIcon" aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      <div className="uuidFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState(() => Array.from({ length: 5 }, uuidv4));

  const output = useMemo(() => list.join("\n"), [list]);

  const gen = () =>
    setList(Array.from({ length: Math.max(1, Math.min(100, count)) }, uuidv4));

  const canClear = list.length > 0;

  const faq = [
    { q: "What is a UUID?", a: "A UUID (Universally Unique Identifier) is a 128-bit value used to uniquely identify data." },
    { q: "What does v4 mean?", a: "Version 4 UUIDs are randomly generated using secure random numbers." },
    { q: "Are these secure?", a: "Yes. They use the browser’s crypto API for randomness." },
    { q: "Can two UUIDs collide?", a: "Extremely unlikely. The probability is practically negligible." },
    { q: "Can I generate more than 100?", a: "This tool limits to 100 per batch to keep UI smooth." },
    { q: "Is anything uploaded?", a: "No. Generation happens entirely in your browser." },
    { q: "Can I use these in databases?", a: "Yes. UUID v4 is widely supported in modern databases and APIs." },
    { q: "Why are they formatted with hyphens?", a: "The hyphenated format improves readability and follows standard UUID formatting." },
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
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <Card
        title="UUID Generator"

        right={
          <Link className="btnGhost" to="/">
            ← All Tools
          </Link>
        }
      >
        {/* TOP BAR */}
        <Row className="uuidTabs">
          <div className="uuidSeg" role="group" aria-label="UUID count">
            {[1, 5, 10, 25].map((n) => (
              <button
                key={n}
                type="button"
                className={`uuidSegBtn ${count === n ? "isActive" : ""}`}
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                title={`Generate ${n} UUIDs`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="uuidTabsSpacer" />

          
             <Button variant="soft" onClick={() => setList([])} disabled={!canClear}>
            Clear
          </Button>
          <CopyButton text={output} />
<Button onClick={gen}>Generate</Button>
         
        </Row>

     

        <div className="uuidBox">
          <TextArea value={output} onChange={() => {}} placeholder="UUIDs…" rows={12} />
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="uuidSteps">
            <li>Select how many UUIDs you want (1–25).</li>
            <li>Click <b>Generate</b> to create a fresh batch.</li>
            <li>Use <b>Copy</b> to copy all UUIDs instantly.</li>
            <li>Use <b>Clear</b> to reset the output.</li>
          </ol>
        </InfoSection>

        <div className="uuidLong">
          <InfoSection title="Overview">
            UUID v4 generates random 128-bit identifiers commonly used in distributed systems,
            APIs, and databases.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="uuidList">
              <li><b>Database primary keys:</b> unique identifiers for rows/documents.</li>
              <li><b>Session identifiers:</b> safe IDs for sessions and tokens.</li>
              <li><b>API request tracking:</b> correlate logs across services.</li>
              <li><b>Distributed system IDs:</b> create IDs without coordination.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="uuidList">
              <li><b>Highly unique:</b> collision probability is practically negligible.</li>
              <li><b>Secure randomness:</b> uses browser crypto APIs.</li>
              <li><b>No server dependency:</b> runs locally in your browser.</li>
              <li><b>Instant:</b> generate multiple IDs in one click.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            Uses the browser’s <b>crypto.randomUUID()</b> (when available) or a secure random fallback
            to generate compliant version 4 UUIDs.
          </InfoSection>

          <InfoSection title="Limitations">
            UUID v4 is random-based. If deterministic IDs are required,
            a different version (like v5) should be used.
          </InfoSection>

          <InfoSection title="Privacy Note">
            UUID generation runs locally in your browser and does not transmit data anywhere.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="uuidList">
              <li>Use UUID v4 when you need randomness-based IDs.</li>
              <li>Hyphen format is standard (8-4-4-4-12) and improves readability.</li>
              <li>Store UUIDs as strings in most databases for compatibility.</li>
            </ul>
          </InfoSection>

          <section className="uuidSection" aria-label="Frequently asked questions">
            <h2 className="uuidH2">FAQ</h2>
            <div className="uuidFaq">
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