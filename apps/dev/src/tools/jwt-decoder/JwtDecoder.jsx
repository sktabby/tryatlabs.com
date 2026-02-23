import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CopyButton, FieldLabel, Row, TextArea, Button } from "../shared/ui.jsx";
import "./jwt-decoder.css";

function b64UrlToJson(part) {
  const p = part.replace(/-/g, "+").replace(/_/g, "/");
  const pad = p.length % 4 ? "=".repeat(4 - (p.length % 4)) : "";
  const raw = atob(p + pad);
  const bytes = new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

function InfoSection({ title, children }) {
  return (
    <section className="jwtSection" aria-label={title}>
      <h2 className="jwtH2">{title}</h2>
      <div className="jwtP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`jwtFaqItem ${open ? "isOpen" : ""}`}>
      <button className="jwtFaqQ" onClick={() => setOpen((v) => !v)} type="button" aria-expanded={open}>
        <span>{q}</span>
        <span className="jwtFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="jwtFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [err, setErr] = useState("");

  const decoded = useMemo(() => {
    setErr("");
    const t = token.trim();
    if (!t) return { header: "", payload: "" };

    try {
      const [h, p] = t.split(".");
      if (!h || !p) throw new Error("Bad token");
      const header = JSON.stringify(b64UrlToJson(h), null, 2);
      const payload = JSON.stringify(b64UrlToJson(p), null, 2);
      return { header, payload };
    } catch {
      setErr("Invalid JWT. Paste a token in header.payload.signature format.");
      return { header: "", payload: "" };
    }
  }, [token]);

  const canClear = useMemo(() => !!token.trim() || !!err, [token, err]);

  const faq = [
    { q: "Is decoding the same as verifying?", a: "No. Decoding only reads the token. Verification checks the signature using the correct signing key." },
    { q: "Is it safe to paste a JWT here?", a: "This tool runs locally in your browser, so it doesn’t upload your token. Still, avoid pasting sensitive tokens on shared devices." },
    { q: "Why does it say Invalid JWT?", a: "Most commonly it’s not in header.payload.signature format, or the Base64URL parts are broken or incomplete." },
    { q: "What is shown in Header?", a: "Header usually contains metadata like the algorithm (alg) and token type (typ)." },
    { q: "What is shown in Payload?", a: "Payload contains claims like user info, issued time (iat), expiry (exp), and custom application data." },
    { q: "Can I edit the payload and re-use it?", a: "You can edit the text, but the signature will no longer match. A JWT must be re-signed to be valid." },
    { q: "Why is my payload empty?", a: "It can happen if the token is incomplete or contains invalid Base64URL encoding." },
    { q: "Does this tool store my JWT?", a: "No. It stays only in your browser memory. Nothing is sent to a server." },
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
        title="JWT Decoder"
      
        right={
          <Link className="btnGhost" to="/">
            ← All Tools
          </Link>
        }
      >
        {/* TOP BAR (Base64 style) */}
        <Row className="jwtTabs">
          <div className="jwtPill">JWT Decoder</div>

          <div className="jwtTabsSpacer" />

          <CopyButton text={decoded.payload} />

          <Button
            variant="soft"
            disabled={!canClear}
            onClick={() => {
              setToken("");
              setErr("");
            }}
          >
            Clear
          </Button>
        </Row>

        {/* WORKSPACE (equal height) */}
        <div className="jwtWorkspace">
          <div className="jwtCol">
            <FieldLabel hint="Paste JWT token">JWT</FieldLabel>

            <div className="jwtBox jwtBoxFill">
              <TextArea value={token} onChange={setToken} placeholder="eyJhbGciOi..." rows={4} />
            </div>

            {err ? <div className="jwtError">{err}</div> : null}
          </div>

          <div className="jwtGrid">
            <div className="jwtCol">
              <FieldLabel hint="Decoded header">Header</FieldLabel>

              <div className="jwtBox jwtBoxFill">
                <TextArea value={decoded.header} onChange={() => {}} placeholder="Header…" rows={12} />
              </div>
            </div>

            <div className="jwtCol">
              <FieldLabel hint="Decoded payload">Payload</FieldLabel>

              <div className="jwtBox jwtBoxFill">
                <TextArea value={decoded.payload} onChange={() => {}} placeholder="Payload…" rows={12} />
              </div>
            </div>
          </div>
        </div>

        <div className="mutedTiny jwtNote">
          Security note: Decoding is safe. Verification requires the signing key and is not done here.
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="jwtSteps">
            <li>Paste a token in <b>header.payload.signature</b> format.</li>
            <li>We decode and show <b>Header</b> and <b>Payload</b>.</li>
            <li>Use <b>Copy</b> to copy the payload instantly.</li>
            <li>Use <b>Clear</b> to reset the tool.</li>
          </ol>
        </InfoSection>

        {/* SAME CONTENT (Base64 template) */}
        <div className="jwtLong">
          <InfoSection title="Overview">
            A JWT (JSON Web Token) is a compact string used to pass identity and claims between systems.
            It’s commonly used for authentication sessions and API access.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="jwtList">
              <li><b>Debug tokens:</b> quickly inspect header and payload claims.</li>
              <li><b>API troubleshooting:</b> confirm expiry, issuer, and scopes.</li>
              <li><b>Frontend checks:</b> verify what the app is receiving before sending requests.</li>
              <li><b>Security review:</b> spot sensitive data accidentally placed inside payload.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="jwtList">
              <li><b>Instant:</b> results update as you paste a token.</li>
              <li><b>Private:</b> runs locally in your browser.</li>
              <li><b>Readable:</b> prints JSON with clean formatting.</li>
              <li><b>Quick copy:</b> copy payload with one click.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            We split the token by dots, Base64URL-decode the first two parts (header and payload),
            and then format them as readable JSON.
          </InfoSection>

          <InfoSection title="Limitations">
            This tool does not verify signatures and cannot tell you whether the token is trustworthy.
            It only decodes what’s inside.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your token is processed locally in your browser and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="jwtList">
              <li>If decoding fails, ensure there are exactly <b>two dots</b> in the token.</li>
              <li>JWT payload is readable by design—avoid storing secrets inside it.</li>
              <li>Expiry is often stored in <b>exp</b> (Unix timestamp seconds).</li>
            </ul>
          </InfoSection>

          <section className="jwtSection" aria-label="Frequently asked questions">
            <h2 className="jwtH2">FAQ</h2>
            <div className="jwtFaq">
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