import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./HashGenerator.css";

const ALGS = [
  { id: "SHA-256", label: "SHA-256" },
  { id: "SHA-1", label: "SHA-1" },
  { id: "SHA-384", label: "SHA-384" },
  { id: "SHA-512", label: "SHA-512" },
];

function toHex(buffer) {
  const arr = new Uint8Array(buffer);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashText(alg, text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(alg, data);
  return toHex(digest);
}

function InfoSection({ title, children }) {
  return (
    <section className="hgSection" aria-label={title}>
      <h2 className="hgH2">{title}</h2>
      <div className="hgP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hgFaqItem ${open ? "isOpen" : ""}`}>
      <button className="hgFaqQ" onClick={() => setOpen((v) => !v)} type="button" aria-expanded={open}>
        <span>{q}</span>
        <span className="hgFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="hgFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function HashGenerator() {
  const [alg, setAlg] = useState("SHA-256");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const canRun = useMemo(() => !!input.trim(), [input]);

  const run = async () => {
    setErr("");
    if (!canRun) return;
    setBusy(true);
    try {
      const v = await hashText(alg, input);
      setOut(v);
    } catch {
      setErr("Hashing failed in this browser context.");
    } finally {
      setBusy(false);
    }
  };

  const faq = [
    { q: "Is hashing the same as encryption?", a: "No. Hashing is one-way. Encryption is meant to be reversed with a key." },
    { q: "Can I get my original text back from the hash?", a: "No. A hash can’t be reversed back into the original text." },
    { q: "Which algorithm should I choose?", a: "For most cases, SHA-256 is the best default. It’s widely used and supported." },
    { q: "Why does the same input always give the same hash?", a: "That consistency is the whole point—so you can verify nothing changed." },
    { q: "Does this tool upload my text anywhere?", a: "No. Hashing runs locally in your browser using Web Crypto." },
    { q: "Why is my hash different from someone else’s?", a: "Usually it’s hidden whitespace or different line breaks. Even one character changes the hash." },
    { q: "Can I hash very large text here?", a: "Yes, but huge inputs can feel slower depending on your device and browser." },
    { q: "Is SHA-1 safe?", a: "SHA-1 is considered weak for security use. It’s mainly for legacy compatibility." },
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
        title="Hash Generator"
      
        right={
          <Link className="btnGhost" to="/">
            ← All Tools
          </Link>
        }
      >
        {/* TOP BAR (Base64 style) */}
        <Row className="hgTabs">
          {ALGS.map((a) => (
            <button
              key={a.id}
              className={`hgTab ${alg === a.id ? "isActive" : ""}`}
              onClick={() => setAlg(a.id)}
              type="button"
            >
              {a.label}
            </button>
          ))}

          <div className="hgTabsSpacer" />

          {/* Copy BEFORE Clear */}
          <CopyButton text={out} />

          <Button
            variant="soft"
            onClick={() => {
              setAlg("SHA-256");
              setInput("");
              setOut("");
              setErr("");
            }}
            disabled={!input.trim() && !out.trim() && !err}
          >
            Clear
          </Button>
           <Row className="hgActions">
              <Button onClick={run} disabled={busy || !canRun}>
                {busy ? "Hashing…" : "Generate Hash"}
              </Button>
            </Row>
        </Row>

        {/* WORKSPACE (equal height) */}
        <div className="hgWorkspace">
          <div className="hgCol">
            <FieldLabel hint="Text to hash">Input</FieldLabel>

            <div className="hgBox hgBoxFill">
              <TextArea value={input} onChange={setInput} placeholder="Type or paste..." rows={10} />
            </div>

            {err ? <div className="hgError">{err}</div> : null}

           
          </div>

          <div className="hgCol">
            <FieldLabel hint={`${alg} output (hex)`}>Hash</FieldLabel>

            <div className="hgBox hgBoxFill">
              <TextArea value={out} onChange={() => {}} placeholder="Output(output is read only)" rows={10} />
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="hgSteps">
            <li>Select a hashing algorithm (recommended: <b>SHA-256</b>).</li>
            <li>Paste your text into <b>Input</b>.</li>
            <li>Click <b>Generate Hash</b> to create the hash.</li>
            <li>Copy the result using the <b>Copy</b> button.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT BLOCKS AS BASE64 (no extra sections) */}
        <div className="hgLong">
          <InfoSection title="Overview">
            A hash is like a fingerprint for your text. If even one character changes, the output changes too.
            That makes hashing useful when you want a quick “did this change?” check.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="hgList">
              <li><b>Integrity checks:</b> confirm text hasn’t been edited or corrupted.</li>
              <li><b>Development work:</b> compare outputs across tools and environments.</li>
              <li><b>Stable identifiers:</b> generate consistent values from content.</li>
              <li><b>Verification flows:</b> store hashes instead of raw values when appropriate.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="hgList">
              <li><b>Fast:</b> hashes generate quickly in modern browsers.</li>
              <li><b>Consistent:</b> same input always returns the same output.</li>
              <li><b>Private:</b> everything runs locally in your browser.</li>
              <li><b>Clean UX:</b> output is copy-ready and easy to reuse.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            This tool uses the browser’s Web Crypto API. Your input is encoded using <b>TextEncoder</b>,
            hashed with the selected algorithm, then shown as a hex string.
          </InfoSection>

          <InfoSection title="Limitations">
            Hashing is one-way, so you can’t recover the original text from the hash.
            Very large inputs may feel slower depending on your device.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your input is processed locally in your browser and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="hgList">
              <li>Whitespace matters—trailing spaces will change the result.</li>
              <li>Different line breaks can produce different hashes.</li>
              <li>Use SHA-1 only when you need legacy compatibility.</li>
            </ul>
          </InfoSection>

          <section className="hgSection" aria-label="Frequently asked questions">
            <h2 className="hgH2">FAQ</h2>
            <div className="hgFaq">
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