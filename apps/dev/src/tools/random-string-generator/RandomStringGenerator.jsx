import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, DEV_TOOLS } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { toolJsonLd } from "../../seo/jsonld.js";
import { Card, CopyButton, FieldLabel, Row, Input, Button } from "../shared/ui.jsx";
import "./RandomStringGenerator.css";

function InfoSection({ title, children }) {
  return (
    <section className="rsgSection" aria-label={title}>
      <h2 className="rsgH2">{title}</h2>
      <div className="rsgP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rsgFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="rsgFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="rsgFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="rsgFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function RandomStringGenerator() {
  const tool = DEV_TOOLS.find((t) => t.slug === "random-string-generator");
  const [value, setValue] = useState("");

  const generate = () => {
    const arr = crypto.getRandomValues(new Uint8Array(16));
    setValue([...arr].map((x) => x.toString(16).padStart(2, "0")).join(""));
  };

  const output = useMemo(() => value, [value]);
  const canClear = useMemo(() => !!value.trim(), [value]);

  const faq = [
    { q: "Is this cryptographically secure?", a: "It uses the browser’s crypto.getRandomValues(), which is designed for cryptographically strong randomness." },
    { q: "What format is generated?", a: "A 32-character hexadecimal string (16 bytes / 128 bits), often used as tokens or IDs." },
    { q: "Can I use it as a password?", a: "You can, but hex-only strings aren’t the most user-friendly. For passwords, mixed charset and length controls are better." },
    { q: "Is this the same as UUID?", a: "Not exactly. UUID v4 has a standardized format with specific bits. This tool generates a raw random hex string." },
    { q: "Is it safe for API keys?", a: "It’s strong randomness, but real API keys usually have rotation, storage, and scope rules. Use this for dev/testing or as a component." },
    { q: "Does it store my generated value?", a: "No. It stays in your browser memory only and is not uploaded anywhere." },
    { q: "Can I generate longer strings?", a: "This version is fixed-length. If you want length controls, we can add a slider + presets." },
    { q: "Does it work offline?", a: "Yes—after the page loads once, it typically works offline since everything runs locally." },
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
        <Row className="rsgTabs">
          <Button onClick={generate}>Generate</Button>

          <div className="rsgTabsSpacer" />

          <CopyButton text={output} />

          <Button variant="soft" onClick={() => setValue("")} disabled={!canClear}>
            Clear
          </Button>
        </Row>

        {/* WORKSPACE */}
        <div className="rsgWorkspace">
          <div className="rsgCol">
           
            <div className="rsgBox rsgBoxFill">
              <div className="rsgPad">
                <Input value={value} onChange={() => {}} placeholder="Click Generate…" />
              </div>
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="rsgSteps">
            <li>Click <b>Generate</b> to create a new random hex string.</li>
            <li>Use <b>Copy</b> to copy it instantly.</li>
            <li>Use <b>Clear</b> to reset the field.</li>
          </ol>
        </InfoSection>

        {/* CONTENT SECTIONS */}
        <div className="rsgLong">
          <InfoSection title="Overview">
            This tool generates a cryptographically strong random value using your browser’s secure random generator.
            The output is a compact hex string that’s easy to paste into code, configs, and test data.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="rsgList">
              <li><b>Dev testing:</b> generate quick tokens for demos and QA.</li>
              <li><b>Session identifiers:</b> temporary IDs for local apps and prototypes.</li>
              <li><b>Sample secrets:</b> placeholder keys for configs (non-production).</li>
              <li><b>Data seeding:</b> unique-ish values for fixtures and mocks.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="rsgList">
              <li><b>Strong randomness:</b> uses <b>crypto.getRandomValues()</b>.</li>
              <li><b>Instant:</b> generate + copy with one click.</li>
              <li><b>Private:</b> runs locally in your browser (no server calls).</li>
              <li><b>Clean UX:</b> consistent tool styling across your suite.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            The browser generates 16 random bytes securely, then we convert each byte to a 2-digit hex value and join them into a 32-character string.
          </InfoSection>

          <InfoSection title="Limitations">
            This version generates a fixed 128-bit hex string. If you need variable length, different encodings (Base64url), or presets, those can be added.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your generated value stays in your browser memory only and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="rsgList">
              <li>For production secrets, also consider <b>rotation</b> and secure storage.</li>
              <li>Hex strings are great for machines, but not ideal for humans to type.</li>
              <li>If you need URL-safe tokens, consider Base64url output.</li>
            </ul>
          </InfoSection>

          <section className="rsgSection" aria-label="Frequently asked questions">
            <h2 className="rsgH2">FAQ</h2>
            <div className="rsgFaq">
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