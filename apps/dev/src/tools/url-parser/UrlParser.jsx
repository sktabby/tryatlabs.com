import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SITE, DEV_TOOLS } from "../../app/site.config.js";
import { SeoHead } from "../../seo/SeoHead.jsx";
import { toolJsonLd } from "../../seo/jsonld.js";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button, Input } from "../shared/ui.jsx";
import "./UrlParser.css";

function InfoSection({ title, children }) {
  return (
    <section className="upSection" aria-label={title}>
      <h2 className="upH2">{title}</h2>
      <div className="upP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`upFaqItem ${open ? "isOpen" : ""}`}>
      <button
        className="upFaqQ"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="upFaqIcon">{open ? "–" : "+"}</span>
      </button>
      <div className="upFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function UrlParser() {
  const tool = DEV_TOOLS.find((t) => t.slug === "url-parser");

  const [url, setUrl] = useState("");
  const [out, setOut] = useState(null);

  const parse = () => {
    try {
      const u = new URL(url);
      setOut(u);
    } catch {
      setOut(null);
    }
  };

  const output = useMemo(() => {
    if (!out) return "";
    return JSON.stringify(
      {
        protocol: out.protocol,
        hostname: out.hostname,
        host: out.host,
        port: out.port,
        pathname: out.pathname,
        search: out.search,
        hash: out.hash,
      },
      null,
      2
    );
  }, [out]);

  const faq = [
    { q: "What does this tool do?", a: "It breaks a URL into its core components like protocol, host, path, query string, and hash." },
    { q: "Does it validate URLs?", a: "Yes. If the URL constructor fails, the tool simply won’t return parsed output." },
    { q: "Does it send my URL anywhere?", a: "No. Everything runs locally in your browser." },
    { q: "Why is my URL not parsing?", a: "It may be missing protocol (like https://). Try including the full URL." },
    { q: "Does it extract query parameters individually?", a: "This version shows the raw search string. We can extend it to split params if needed." },
    { q: "Does it support localhost URLs?", a: "Yes, as long as they are valid URLs." },
    { q: "Can I use it for API debugging?", a: "Yes, it’s useful for quickly checking path and query values." },
    { q: "Does it work offline?", a: "Yes. After loading once, it runs entirely in your browser." },
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
        <Row className="upTabs">
          <Button onClick={parse} disabled={!url.trim()}>
            Parse
          </Button>

          <div className="upTabsSpacer" />

          <CopyButton text={output} />

          <Button
            variant="soft"
            onClick={() => {
              setUrl("");
              setOut(null);
            }}
            disabled={!url.trim() && !out}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE */}
        <div className="upWorkspace">
          <div className="upCol">
        

            <div className="upBox upBoxTight">
              <div className="upPad">
                <Input
                  value={url}
                  onChange={setUrl}
                  placeholder="https://example.com/path?query=1#hash"
                />
              </div>
            </div>

            <div className="upGap" />

            <FieldLabel hint="Parsed output (JSON)">Parsed Result</FieldLabel>

            <div className="upBox upBoxFill">
              <TextArea
                value={output}
                onChange={() => {}}
                placeholder="Parsed output..."
                rows={10}
              />
            </div>
          </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="upSteps">
            <li>Paste a complete URL including protocol.</li>
            <li>Click <b>Parse</b>.</li>
            <li>Copy the structured output if needed.</li>
          </ol>
        </InfoSection>

        <div className="upLong">
          <InfoSection title="Overview">
            The URL Parser tool breaks a URL into structured components using the browser’s native URL API.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="upList">
              <li><b>API debugging</b> – inspect query strings and routes.</li>
              <li><b>Routing logic</b> – verify paths and segments.</li>
              <li><b>Security review</b> – quickly check host and protocol.</li>
              <li><b>Frontend dev</b> – test URL transformations.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="upList">
              <li>Instant structured breakdown.</li>
              <li>No server calls.</li>
              <li>Clean, readable JSON output.</li>
              <li>Works offline.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Privacy Note">
            All parsing happens locally in your browser.
          </InfoSection>

          <section className="upSection">
            <h2 className="upH2">FAQ</h2>
            <div className="upFaq">
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