import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, DEV_TOOLS } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { toolJsonLd } from "../../seo/jsonld.js";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./JsonFormatter.css";

function InfoSection({ title, children }) {
  return (
    <section className="jsonSection" aria-label={title}>
      <h2 className="jsonH2">{title}</h2>
      <div className="jsonP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`jsonFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="jsonFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="jsonFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="jsonFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

/* =========================
   Helpers (no deps)
   ========================= */
function safeLineColFromJsonError(message = "") {
  // Chrome: "Unexpected token } in JSON at position 10"
  // Sometimes: "... at line 3 column 14"
  const m1 = message.match(/at position (\d+)/i);
  const m2 = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (m2) return { line: Number(m2[1]), col: Number(m2[2]) };
  if (m1) return { pos: Number(m1[1]) };
  return null;
}

function makeSampleJson() {
  return `{
  "user": {
    "id": "u_1029",
    "name": "Tabish",
    "role": "developer",
    "active": true
  },
  "projects": [
    { "name": "tryatlabs", "type": "tools", "status": "live" },
    { "name": "censorx", "type": "ai", "status": "wip" }
  ],
  "meta": {
    "generatedAt": "${new Date().toISOString()}",
    "count": 2
  }
}`;
}

export default function JsonFormatter() {
  const tool = DEV_TOOLS.find((t) => t.slug === "json-formatter");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const canClear = useMemo(
    () => !!input.trim() || !!output.trim() || !!error,
    [input, output, error]
  );

  const format = (space = 2) => {
    try {
      const obj = JSON.parse(input);
      setOutput(JSON.stringify(obj, null, space));
      setError("");
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  };

  const prettify = () => format(2);
  const prettify4 = () => format(4);
  const minify = () => format(0);

  const loadSample = () => {
    setInput(makeSampleJson());
    setOutput("");
    setError("");
  };

  const fixCommonIssues = () => {
    // Gentle “best effort” fixer (still strict JSON at the end).
    // - Removes trailing commas
    // - Converts smart quotes to normal quotes
    // - Trims leading BOM / whitespace
    const cleaned = input
      .replace(/^\uFEFF/, "")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/,\s*([}\]])/g, "$1")
      .trim();

    setInput(cleaned);

    try {
      const obj = JSON.parse(cleaned);
      setOutput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const errorHint = useMemo(() => {
    if (!error) return "";
    const info = safeLineColFromJsonError(error);
    if (!info) return "";
    if (info.line && info.col) return `Hint: check around line ${info.line}, column ${info.col}.`;
    if (typeof info.pos === "number") return `Hint: check near character position ${info.pos}.`;
    return "";
  }, [error]);

  const faq = [
    { q: "Does this tool validate JSON?", a: "Yes — formatting runs only if the JSON is valid. If not, you’ll see the exact parse error." },
    { q: "What’s the difference between Format and Minify?", a: "Format makes JSON readable with indentation. Minify removes spaces and line breaks to make it compact." },
    { q: "Is my JSON uploaded anywhere?", a: "No. Formatting happens in your browser. Nothing is sent to a server." },
    { q: "Why am I seeing an error?", a: "Most errors are due to missing quotes, extra commas, or unescaped characters. Fix the line mentioned in the message and try again." },
    { q: "Can it handle large JSON?", a: "It can, but extremely large JSON may feel slow depending on your device and browser memory." },
    { q: "Will key order change?", a: "No. This tool does not sort keys — it formats the JSON structure as provided." },
    { q: "Does it support JSON5 or comments?", a: "No. It follows strict JSON rules. Comments and trailing commas will fail." },
    { q: "Can I copy the output quickly?", a: "Yes — use the Copy button in the top bar to copy the formatted/minified output instantly." },
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
        <Row className="jsonTabs">
          <Button onClick={prettify}>Format</Button>
          <Button variant="ghost" onClick={prettify4}>
            Format (4)
          </Button>
          <Button variant="soft" onClick={minify}>
            Minify
          </Button>

          <Button variant="ghost" onClick={loadSample}>
            Sample
          </Button>

          <Button variant="ghost" onClick={fixCommonIssues} disabled={!input.trim()}>
            Auto-fix
          </Button>

          <div className="jsonTabsSpacer" />

          <CopyButton text={output} />

          <Button variant="soft" onClick={clearAll} disabled={!canClear}>
            Clear
          </Button>
        </Row>

        {/* WORKSPACE (equal height) */}
        <div className="jsonWorkspace">
          <div className="jsonCol">
            <FieldLabel hint="Paste JSON here (strict JSON only)">Input</FieldLabel>

            <div className="jsonBox jsonBoxFill">
              <TextArea
                value={input}
                onChange={(v) => {
                  setInput(v);
                  // UX: clear old output/error while typing
                  if (output) setOutput("");
                  if (error) setError("");
                }}
                placeholder={`Paste JSON here…

Tip: Click “Sample” to load an example.
Tip: If you get a trailing comma error, try “Auto-fix”.`}
                rows={12}
              />
            </div>

            {error ? (
              <div className="jsonError">
                <div className="jsonErrorTitle">Invalid JSON</div>
                <div className="jsonErrorMsg">{error}</div>
                {errorHint ? <div className="jsonErrorHint">{errorHint}</div> : null}
              </div>
            ) : null}
          </div>

          <div className="jsonCol">
            <FieldLabel hint="Formatted / Minified output (read-only)">Output</FieldLabel>

            <div className="jsonBox jsonBoxFill">
              <TextArea value={output} onChange={() => {}} placeholder="Output (read only)" rows={12} />
            </div>

            <div className="jsonMiniHelp">
              <div className="jsonMiniHelpTitle">Quick tips</div>
              <ul className="jsonMiniHelpList">
                <li>Use <b>Format</b> to debug nested structures.</li>
                <li>Use <b>Minify</b> for compact transport (APIs, env vars).</li>
                <li>If you pasted JSON with trailing commas or smart quotes, try <b>Auto-fix</b>.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="jsonSteps">
            <li>Paste JSON into <b>Input</b> (or click <b>Sample</b>).</li>
            <li>Click <b>Format</b> (pretty) or <b>Minify</b> (compact).</li>
            <li>If you see an error, use <b>Auto-fix</b> for common issues, then format again.</li>
            <li>Copy using the <b>Copy</b> button.</li>
            <li>Use <b>Clear</b> to reset.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT BLOCKS */}
        <div className="jsonLong">
          <InfoSection title="Overview">
            JSON formatting helps you read, debug, and share JSON without losing structure. A clean format makes nested
            objects, arrays, and keys easy to scan — especially when you’re working with APIs.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="jsonList">
              <li><b>API debugging:</b> quickly inspect responses.</li>
              <li><b>Config cleanup:</b> make settings files readable.</li>
              <li><b>Log analysis:</b> paste raw JSON logs and understand them fast.</li>
              <li><b>Sharing:</b> send formatted JSON in chats, tickets, or docs.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="jsonList">
              <li><b>Readable:</b> indentation makes structure obvious.</li>
              <li><b>Compact option:</b> minify when size matters.</li>
              <li><b>Private:</b> runs in your browser (no server calls).</li>
              <li><b>Helpful:</b> shows errors + hints when JSON is invalid.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            The tool parses your input using the browser’s JSON engine. If parsing succeeds, it prints the same object
            back as formatted JSON (with indentation) or minified JSON (no extra whitespace).
          </InfoSection>

          <InfoSection title="Limitations">
            This tool expects strict JSON. Comments, trailing commas, and JSON5-style inputs will fail. Extremely large
            JSON may slow down depending on your device.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your JSON stays in your browser. Nothing is uploaded or stored by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="jsonList">
              <li>If you see an error, fix the line mentioned and try again.</li>
              <li>Use <b>Minify</b> when you want a compact string for transport.</li>
              <li>Use <b>Format</b> when you’re debugging or reading deeply nested JSON.</li>
            </ul>
          </InfoSection>

          <section className="jsonSection" aria-label="Frequently asked questions">
            <h2 className="jsonH2">FAQ</h2>
            <div className="jsonFaq">
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