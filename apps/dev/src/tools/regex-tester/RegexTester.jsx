import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, DEV_TOOLS } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { toolJsonLd } from "../../seo/jsonld.js";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./RegexTester.css";

function InfoSection({ title, children }) {
  return (
    <section className="rxSection" aria-label={title}>
      <h2 className="rxH2">{title}</h2>
      <div className="rxP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rxFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="rxFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="rxFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="rxFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function RegexTester() {
  const tool = DEV_TOOLS.find((t) => t.slug === "regex-tester");

  const [pattern, setPattern] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [err, setErr] = useState("");

  const canRun = useMemo(() => !!pattern.trim() && !!text.trim(), [pattern, text]);
  const canClear = useMemo(() => !!pattern.trim() || !!text.trim() || !!result.trim() || !!err, [pattern, text, result, err]);

  const test = () => {
    setErr("");
    try {
      const re = new RegExp(pattern, "g");
      const matches = text.match(re);
      setResult(matches ? matches.join(", ") : "No matches");
    } catch (e) {
      setErr(e.message);
      setResult("");
    }
  };

  const faq = [
    { q: "Does this support flags like i, m, s?", a: "This version uses the global flag (g) by default. If you need extra flags, you can include them inside the pattern using inline constructs or we can add a flags input later." },
    { q: "Why am I getting an invalid regex error?", a: "Usually it’s an unescaped character, an unfinished group, or a broken character class. Fix the pattern and try again." },
    { q: "What does “No matches” mean?", a: "It means your regex ran correctly, but nothing in the test text matched it." },
    { q: "Is my text uploaded anywhere?", a: "No. Everything runs locally in your browser. Nothing is sent to a server." },
    { q: "Can this show match groups?", a: "Right now it lists the matched strings. If you want groups and indices, we can extend it — but this tool stays simple." },
    { q: "Why do I see repeated matches?", a: "That’s normal when your regex matches multiple parts of the text. The output lists them in order." },
    { q: "Does it support multiline text?", a: "Yes. You can paste multiline text in the box and regex will run on the full content." },
    { q: "Is this tool safe for sensitive data?", a: "It runs in your browser, so it’s safer than server tools — but still avoid pasting secrets into any browser tool if you don’t trust the environment." },
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
        <Row className="rxTabs">
          <Button onClick={test} disabled={!canRun}>
            Test Regex
          </Button>

          <div className="rxTabsSpacer" />

          <CopyButton text={result} />

          <Button
            variant="soft"
            onClick={() => {
              setPattern("");
              setText("");
              setResult("");
              setErr("");
            }}
            disabled={!canClear}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE */}
        <div className="rxWorkspace">
          <div className="rxCol">
            <FieldLabel hint="Regex pattern (JavaScript)">Pattern</FieldLabel>

            <div className="rxBox rxBoxTight">
              <TextArea
                value={pattern}
                onChange={setPattern}
                placeholder="e.g. \\b\\w+@\\w+\\.\\w+\\b"
                rows={3}
              />
            </div>

            <div className="rxGap" />

            <FieldLabel hint="Paste the text you want to test">Test Text</FieldLabel>

            <div className="rxBox rxBoxFill">
              <TextArea value={text} onChange={setText} placeholder="Paste text here…" rows={10} />
            </div>

            {err ? <div className="rxError">{err}</div> : null}
          </div>

          <div className="rxCol">
            <FieldLabel hint="Matches (comma-separated)">Result</FieldLabel>

            <div className="rxBox rxBoxFill">
              <TextArea value={result} onChange={() => {}} placeholder="Matches…" rows={12} />
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="rxSteps">
            <li>Type your <b>Regex Pattern</b>.</li>
            <li>Paste your <b>Test Text</b>.</li>
            <li>Click <b>Test Regex</b> to see matches.</li>
            <li>Use <b>Copy</b> to copy the result, or <b>Clear</b> to reset.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT SECTIONS */}
        <div className="rxLong">
          <InfoSection title="Overview">
            A regex tester helps you quickly check whether a pattern matches the text you expect.
            It’s especially useful while validating inputs, parsing logs, and building reliable search rules.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="rxList">
              <li><b>Validation:</b> emails, phone numbers, IDs, usernames.</li>
              <li><b>Text cleanup:</b> find repeated spaces, special characters, unwanted words.</li>
              <li><b>Log parsing:</b> extract consistent fields from messy strings.</li>
              <li><b>Search rules:</b> build strong matching for filters and scanners.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="rxList">
              <li><b>Fast testing:</b> adjust a pattern and re-check instantly.</li>
              <li><b>Private:</b> runs locally in the browser (no server calls).</li>
              <li><b>Simple output:</b> shows the raw matches clearly.</li>
              <li><b>Clean UX:</b> copy stays where you expect.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            This tool builds a JavaScript <b>RegExp</b> using your pattern and runs it globally across the test text.
            If matches exist, it lists them in order. If not, it shows <b>No matches</b>.
          </InfoSection>

          <InfoSection title="Limitations">
            This is a simple matcher output. It doesn’t display capture groups, match indices, or custom flags input.
            If your pattern is invalid, you’ll see the browser’s regex error message.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your regex and text stay in your browser. Nothing is uploaded or stored by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="rxList">
              <li>If your pattern includes backslashes, escape them like <b>\\d</b>, <b>\\b</b>, <b>\\w</b>.</li>
              <li>Use <b>^</b> and <b>$</b> to match start/end of text lines.</li>
              <li>If you need case-insensitive matching, we can add a flag input later.</li>
            </ul>
          </InfoSection>

          <section className="rxSection" aria-label="Frequently asked questions">
            <h2 className="rxH2">FAQ</h2>
            <div className="rxFaq">
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