import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./UrlEncodeDecode.css";

function InfoSection({ title, children }) {
  return (
    <section className="urlSection" aria-label={title}>
      <h2 className="urlH2">{title}</h2>
      <div className="urlP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`urlFaqItem ${open ? "isOpen" : ""}`}>
      <button className="urlFaqQ" onClick={() => setOpen((v) => !v)} type="button" aria-expanded={open}>
        <span>{q}</span>
        <span className="urlFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="urlFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function UrlEncodeDecode() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("encode"); // encode | decode
  const [err, setErr] = useState("");

  const output = useMemo(() => {
    setErr("");
    if (!input.trim()) return "";
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      setErr("Invalid escape sequence for decoding.");
      return "";
    }
  }, [input, mode]);

  const canClear = useMemo(() => !!input.trim() || !!err, [input, err]);

  const faq = [
    { q: "What does URL encoding do?", a: "It converts special characters into a safe format so they can be placed inside a URL without breaking it." },
    { q: "When should I use Encode?", a: "Use Encode when you’re putting text into a query parameter, like ?q=hello world." },
    { q: "When should I use Decode?", a: "Use Decode when you already have an encoded string (like hello%20world) and want to read the original value." },
    { q: "Why do I see %20 instead of spaces?", a: "That’s normal. %20 is the encoded form of a space." },
    { q: "Why does decoding sometimes fail?", a: "If the text contains incomplete or invalid % sequences (like %E0 without enough bytes), decoding will throw an error." },
    { q: "Is this the same as encoding a full URL?", a: "This is best for URL components (query values, paths). Full-URL encoding rules differ depending on what you’re encoding." },
    { q: "Is anything uploaded to a server?", a: "No. This tool runs fully in your browser." },
    { q: "Does it store my input?", a: "No. Your text stays only in your current browser session." },
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
        title="URL Encode / Decode"
      
        right={
          <Link className="btnGhost" to="/">
            ← All Tools
          </Link>
        }
      >
        {/* TOP BAR (Base64 style) */}
        <Row className="urlTabs">
          <button
            className={`urlTab ${mode === "encode" ? "isActive" : ""}`}
            onClick={() => setMode("encode")}
            type="button"
          >
            Encode
          </button>

          <button
            className={`urlTab ${mode === "decode" ? "isActive" : ""}`}
            onClick={() => setMode("decode")}
            type="button"
          >
            Decode
          </button>

          <div className="urlTabsSpacer" />

          {/* Copy BEFORE Clear */}
          <CopyButton text={output} />

          <Button
            variant="soft"
            onClick={() => {
              setInput("");
              setErr("");
            }}
            disabled={!canClear}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE (equal height) */}
        <div className="urlWorkspace">
          <div className="urlCol">
            <FieldLabel hint={mode === "encode" ? "Plain text" : "Encoded string"}>Input</FieldLabel>

            <div className="urlBox urlBoxFill">
              <TextArea value={input} onChange={setInput} placeholder="Paste here..." rows={10} />
            </div>

            {err ? <div className="urlError">{err}</div> : null}
          </div>

          <div className="urlCol">
            <FieldLabel hint={mode === "encode" ? "Encoded output" : "Decoded output"}>Output</FieldLabel>

            <div className="urlBox urlBoxFill">
              <TextArea value={output} onChange={() => {}} placeholder="Output(output is read only)" rows={10} />
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="urlSteps">
            <li>Select <b>Encode</b> or <b>Decode</b>.</li>
            <li>Paste your content into <b>Input</b>.</li>
            <li>Copy the result using the <b>Copy</b> button.</li>
            <li>Use <b>Clear</b> to reset.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT STRUCTURE AS BASE64 */}
        <div className="urlLong">
          <InfoSection title="Overview">
            URL encoding makes text safe to use inside URLs by converting special characters into percent-encoded sequences
            (like space → <b>%20</b>). It’s commonly used in query parameters and path segments.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="urlList">
              <li><b>Query parameters:</b> safely send user input like names, search queries, and filters.</li>
              <li><b>API debugging:</b> quickly inspect encoded values used in requests.</li>
              <li><b>Redirect URLs:</b> encode nested URLs inside a URL parameter.</li>
              <li><b>Form handling:</b> prepare values before sending them across systems.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="urlList">
              <li><b>Instant:</b> output updates automatically.</li>
              <li><b>Clean:</b> simple input/output layout.</li>
              <li><b>Safe:</b> prevents special characters from breaking your URL.</li>
              <li><b>Private:</b> runs locally in your browser.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            This tool uses the browser’s built-in <b>encodeURIComponent</b> and <b>decodeURIComponent</b>.
            Encode converts unsafe characters to percent format, and Decode reverses it back to readable text.
          </InfoSection>

          <InfoSection title="Limitations">
            If your input includes invalid percent sequences (like incomplete <b>%</b> patterns),
            decoding will fail. Also, full URL encoding rules can differ depending on what part of the URL you’re encoding.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your input is processed locally in your browser and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="urlList">
              <li>Use Encode for values inside <b>?key=value</b> query strings.</li>
              <li>Use Decode to read values copied from URLs.</li>
              <li>If decoding fails, check for broken or partial <b>%xx</b> sequences.</li>
            </ul>
          </InfoSection>

          <section className="urlSection" aria-label="Frequently asked questions">
            <h2 className="urlH2">FAQ</h2>
            <div className="urlFaq">
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