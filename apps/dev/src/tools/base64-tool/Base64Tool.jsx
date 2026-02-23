import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./Base64Tool.css";

function safeBtoa(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function safeAtob(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}

function InfoSection({ title, children }) {
  return (
    <section className="b64Section" aria-label={title}>
      <h2 className="b64H2">{title}</h2>
      <div className="b64P">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`b64FaqItem ${open ? "isOpen" : ""}`}>
      <button className="b64FaqQ" onClick={() => setOpen((v) => !v)} type="button" aria-expanded={open}>
        <span>{q}</span>
        <span className="b64FaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="b64FaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode"); // encode | decode
  const [err, setErr] = useState("");

  const output = useMemo(() => {
    setErr("");
    if (!input.trim()) return "";
    try {
      return mode === "encode" ? safeBtoa(input) : safeAtob(input.trim());
    } catch {
      setErr("That doesn't look like valid input for this action. Please check and try again.");
      return "";
    }
  }, [input, mode]);

  const faq = [
    { q: "Is Base64 encryption?", a: "No. Base64 is just an encoding format. It makes data safe to transport, but it does not hide or protect it." },
    { q: "Is this tool safe for secrets?", a: "It runs in your browser and nothing is uploaded. But Base64 is readable, so don’t treat it like encryption." },
    { q: "Why do I get an error while decoding?", a: "Usually the input isn’t valid Base64 (extra spaces, missing padding, or invalid characters). Try trimming and pasting again." },
    { q: "Can I encode or decode Unicode / emojis?", a: "Yes. This tool uses TextEncoder/TextDecoder, so Unicode (including emojis) is supported." },
    { q: "Does it work offline?", a: "Yes—after the page loads once, it typically works offline because everything runs locally." },
    { q: "Why is Base64 longer than the original?", a: "Base64 increases size by ~33% because it represents binary data using a restricted character set." },
    { q: "Can I use this for files?", a: "This version focuses on text. For files, you’d want a dedicated “File ↔ Base64” flow." },
    { q: "Does it store my input?", a: "No. It stays in your browser memory only. Nothing is sent to a server." },
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

      <Card title="Base64 Encoder / Decoder" right={ <Link className="btnGhost" to="/">
                    ← All Tools
                  </Link>}>
        {/* TOP BAR */}
        <Row className="b64Tabs">
          <button
            className={`b64Tab ${mode === "encode" ? "isActive" : ""}`}
            onClick={() => setMode("encode")}
            type="button"
          >
            Encode
          </button>
          <button
            className={`b64Tab ${mode === "decode" ? "isActive" : ""}`}
            onClick={() => setMode("decode")}
            type="button"
          >
            Decode
          </button>

          <div className="b64TabsSpacer" />

          {/* Copy BEFORE Clear (as you asked) */}
          <CopyButton text={output} />

          <Button
            variant="soft"
            onClick={() => {
              setInput("");
              setErr("");
            }}
            disabled={!input.trim() && !err}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE (equal height) */}
        <div className="b64Workspace">
          <div className="b64Col">
            <FieldLabel hint={mode === "encode" ? "Plain text" : "Base64 string"}>Input</FieldLabel>

            <div className="b64Box b64BoxFill">
              <TextArea value={input} onChange={setInput} placeholder="Paste here..." rows={10} />
            </div>

            {err ? <div className="b64Error">{err}</div> : null}
          </div>

          <div className="b64Col">
            <FieldLabel hint={mode === "encode" ? "Base64 output" : "Decoded text"}>Output</FieldLabel>

            <div className="b64Box b64BoxFill">
              <TextArea value={output} onChange={() => {}} placeholder="Output(output is read only)" rows={10} />
            </div>

         
          </div>
        </div>

        {/* HOW TO USE (added, clean) */}
        <InfoSection title="How to use">
          <ol className="b64Steps">
            <li>Select <b>Encode</b> or <b>Decode</b>.</li>
            <li>Paste your content into <b>Input</b>.</li>
            <li>Copy the result using the <b>Copy</b> button.</li>
            <li>Use <b>Clear</b> to reset both fields.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT (no extras) */}
        <div className="b64Long">
          <InfoSection title="Overview">
            Base64 is a lightweight way to turn text (or binary data) into a safe-to-transfer string.
            It’s commonly used in APIs, tokens, HTML/CSS embeds, and data pipelines where certain characters can break formatting.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="b64List">
              <li><b>API debugging:</b> quickly inspect or generate Base64 payloads.</li>
              <li><b>Email / headers:</b> keep content safe across transport layers.</li>
              <li><b>Dev workflows:</b> encode small config snippets without worrying about special characters.</li>
              <li><b>Web embeds:</b> prepare text for data URIs (when needed).</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="b64List">
              <li><b>Instant:</b> output updates as you type—no extra button clicks.</li>
              <li><b>Private:</b> runs locally in the browser (no server calls).</li>
              <li><b>Unicode-ready:</b> supports emojis and non-English text.</li>
              <li><b>Clean UX:</b> copy button stays exactly where you expect.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            This tool uses the browser’s <b>TextEncoder</b>/<b>TextDecoder</b> to reliably handle Unicode,
            then performs Base64 conversion using built-in browser functions.
          </InfoSection>

          <InfoSection title="Limitations">
            Base64 is not security. Anyone can decode it back. Also, very large content may feel slow in the browser depending on your device.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your input is processed locally in your browser and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="b64List">
              <li>If decoding fails, remove whitespace and try again.</li>
              <li>Base64 strings sometimes include padding (<b>=</b>) at the end—this is normal.</li>
              <li>Use Base64 for transport and formatting, not for hiding sensitive information.</li>
            </ul>
          </InfoSection>

          <section className="b64Section" aria-label="Frequently asked questions">
            <h2 className="b64H2">FAQ</h2>
            <div className="b64Faq">
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