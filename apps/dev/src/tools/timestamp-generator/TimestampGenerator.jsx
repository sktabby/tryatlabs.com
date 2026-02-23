import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, FieldLabel, Row, Input, Button, CopyButton } from "../shared/ui.jsx";
import "./TimestampGenerator.css";

function toUnixSeconds(date) {
  return Math.floor(date.getTime() / 1000);
}
function toUnixMillis(date) {
  return date.getTime();
}

function InfoSection({ title, children }) {
  return (
    <section className="tsSection" aria-label={title}>
      <h2 className="tsH2">{title}</h2>
      <div className="tsP">{children}</div>
    </section>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`tsFaqItem ${open ? "isOpen" : ""}`}>
      <button className="tsFaqQ" onClick={() => setOpen((v) => !v)} type="button" aria-expanded={open}>
        <span>{q}</span>
        <span className="tsFaqIcon" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      <div className="tsFaqA" style={{ display: open ? "block" : "none" }}>
        {a}
      </div>
    </div>
  );
}

export default function TimestampGenerator() {
  const [iso, setIso] = useState(() => new Date().toISOString().slice(0, 19));
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));

  const isoResult = useMemo(() => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { sec: "", ms: "", human: "" };
    return {
      sec: String(toUnixSeconds(d)),
      ms: String(toUnixMillis(d)),
      human: d.toString(),
    };
  }, [iso]);

  const tsResult = useMemo(() => {
    const raw = ts.trim();
    if (!raw) return { iso: "", human: "" };
    const n = Number(raw);
    if (!Number.isFinite(n)) return { iso: "", human: "" };

    // heuristics: seconds vs ms
    const d = new Date(n < 10_000_000_000 ? n * 1000 : n);
    if (Number.isNaN(d.getTime())) return { iso: "", human: "" };
    return { iso: d.toISOString(), human: d.toString() };
  }, [ts]);

  const copyText = tsResult.iso || isoResult.sec || "";
  const canClear = useMemo(() => !!iso.trim() || !!ts.trim(), [iso, ts]);

  const faq = [
    { q: "Seconds vs milliseconds — how do I know?", a: "Seconds are usually 10 digits, milliseconds are usually 13 digits. This tool also auto-detects based on size." },
    { q: "Why does the “Human” value look different on other machines?", a: "Human-readable output depends on your device locale and timezone. ISO output is consistent." },
    { q: "What timezone is ISO using here?", a: "ISO format uses UTC (ends with Z when full). Your local time may differ depending on timezone." },
    { q: "Why is my ISO input called “local-ish”?", a: "Because a plain ISO string without timezone can be interpreted slightly differently by browsers. It’s best for quick conversions." },
    { q: "Can I paste a timestamp with spaces?", a: "Yes, trimming is applied. Just avoid extra non-numeric characters." },
    { q: "Does this tool support future dates?", a: "Yes. UNIX timestamps work for future dates as long as your browser Date supports it." },
    { q: "Is anything uploaded to a server?", a: "No. Everything runs inside your browser." },
    { q: "Does it store my inputs?", a: "No. It stays only in your current session." },
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
        title="Timestamp Generator"
        right={
          <Link className="btnGhost" to="/">
            ← All Tools
          </Link>
        }
      >
        {/* TOP BAR */}
        <Row className="tsTabs">


          <div className="tsTabsSpacer" />

          <div className="tsTopActions">
            <CopyButton text={copyText} />
            <Button
              variant="soft"
              disabled={!canClear}
              onClick={() => {
                setIso(new Date().toISOString().slice(0, 19));
                setTs(String(Math.floor(Date.now() / 1000)));
              }}
            >
              Reset
            </Button>

          </div>
          <div className="mutedTiny tsHuman"></div>
        </Row>



        {/* WORKSPACE */}
        <div className="tsWorkspace">
          {/* LEFT */}
          <div className="tsCol">
            <div className="tsHeadRow">
              <div className="tsHeadTitle">Date → Timestamp</div>
              <div className="tsHeadChip">YYYY-MM-DDTHH:mm:ss</div>
            </div>

            <div className="tsBox">
              <Input value={iso} onChange={setIso} placeholder="2026-02-06T12:00:00" />
            </div>

            <div className="tsMiniGrid">
              <div className="tsMiniStat">
                <div className="tsMiniK">
                  Seconds <span className="tsBadge">sec</span>
                </div>
                <div className="tsMiniV">{isoResult.sec || "—"}</div>
              </div>

              <div className="tsMiniStat">
                <div className="tsMiniK">
                  Milliseconds <span className="tsBadge">ms</span>
                </div>
                <div className="tsMiniV">{isoResult.ms || "—"}</div>
              </div>
            </div>

            <div className="mutedTiny tsHuman"></div>

            <Row className="tsActions">
              <Button variant="soft" onClick={() => setIso(new Date().toISOString().slice(0, 19))}>
                Now
              </Button>
            </Row>
          </div>

          {/* RIGHT */}
          <div className="tsCol">
            <div className="tsHeadRow">
              <div className="tsHeadTitle">Timestamp → Date</div>

            </div>

            <div className="tsBox">
              <Input value={ts} onChange={setTs} placeholder="1700000000 or 1700000000000" />
            </div>

            <div className="tsMiniGrid">
              <div className="tsMiniStat">
                <div className="tsMiniK">
                  ISO <span className="tsBadge">sec→</span>
                </div>
                <div className="tsMiniV tsMono">{tsResult.iso || "—"}</div>
              </div>

              <div className="tsMiniStat">
                <div className="tsMiniK">Human</div>
                <div className="tsMiniV">{tsResult.human || "—"}</div>
              </div>
            </div>
            <div className="mutedTiny tsHuman"></div>

            <Row className="tsActions">
              <Button onClick={() => setTs(String(Math.floor(Date.now() / 1000)))} variant="soft">
                Now (sec)
              </Button>
              <Button onClick={() => setTs(String(Date.now()))} variant="soft">
                Now (ms)
              </Button>
            </Row>
          </div>

             {/* QUICK STRIP */}
        <div className="tsQuick">
          <div className="tsHint">
            Paste an <b>ISO date</b> or a <b>UNIX timestamp</b>. We’ll convert instantly (sec + ms + ISO + Human).
          </div>

          <div className="tsQuickRow">
            <Button variant="soft" onClick={() => setIso(new Date().toISOString().slice(0, 19))}>
              Now (ISO)
            </Button>
            <Button variant="soft" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>
              Now (sec)
            </Button>
            <Button variant="soft" onClick={() => setTs(String(Date.now()))}>
              Now (ms)
            </Button>
          </div>
        </div>
        </div>

        {/* HOW TO USE */}
        <InfoSection title="How to use">
          <ol className="tsSteps">
            <li>Enter an ISO date in <b>Date → Timestamp</b> to get seconds and milliseconds.</li>
            <li>Paste a UNIX timestamp in <b>Timestamp → Date</b> to get ISO and human time.</li>
            <li>Use <b>Copy</b> to copy the main result instantly.</li>
            <li>Use <b>Now</b> buttons to quickly fill current time.</li>
          </ol>
        </InfoSection>

        <div className="tsLong">
          <InfoSection title="Overview">
            UNIX timestamps are a simple, consistent way to represent time as a number.
            They’re widely used in APIs, databases, logs, and authentication systems.
          </InfoSection>

          <InfoSection title="Use Cases">
            <ul className="tsList">
              <li><b>API testing:</b> convert dates while building requests.</li>
              <li><b>Log debugging:</b> quickly read timestamps from server logs.</li>
              <li><b>Database checks:</b> interpret stored time fields.</li>
              <li><b>Auth flows:</b> inspect expiry/issue times in tokens and sessions.</li>
            </ul>
          </InfoSection>

          <InfoSection title="Benefits">
            <ul className="tsList">
              <li><b>Fast:</b> instant conversion without page reloads.</li>
              <li><b>Practical:</b> supports both seconds and milliseconds.</li>
              <li><b>Readable:</b> shows ISO and human output.</li>
              <li><b>Private:</b> runs locally in your browser.</li>
            </ul>
          </InfoSection>

          <InfoSection title="How It Works">
            We parse ISO input using the browser Date engine, then convert to seconds and milliseconds.
            For timestamps, we auto-detect seconds vs milliseconds and convert back into ISO and human time.
          </InfoSection>

          <InfoSection title="Limitations">
            Plain ISO strings without timezone can be interpreted differently by different environments.
            For exact timezone handling, always include a timezone offset in the input.
          </InfoSection>

          <InfoSection title="Privacy Note">
            Your input is processed locally in your browser and is not uploaded anywhere by this tool.
          </InfoSection>

          <InfoSection title="Practical implementation notes">
            <ul className="tsList">
              <li>Seconds are usually 10 digits, milliseconds are usually 13 digits.</li>
              <li>If a date looks “shifted”, it’s likely a timezone interpretation issue.</li>
              <li>ISO output is best for consistent storage and debugging.</li>
            </ul>
          </InfoSection>

          <section className="tsSection" aria-label="Frequently asked questions">
            <h2 className="tsH2">FAQ</h2>
            <div className="tsFaq">
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