import React, { useState } from "react";
import ToolsHub from "../components/common/ToolsHub.jsx";

function ToolBlock({ title, short, full }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="toolBlock">
      <h3 className="toolTitle">{title}</h3>
      <p className="toolText">{open ? full : short}</p>
      <button className="readMore" onClick={() => setOpen(!open)}>
        {open ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}

export default function About() {
  return (
    <main className="aboutPage">
      <section className="aboutWrap">

        <header className="aboutHeader">
          <h1 className="aboutTitle">About TryAtLabs Dev Tools</h1>
          <p className="aboutLead">
            TryAtLabs Dev Tools is a practical collection of browser-based utilities
            built for engineers who need reliable outputs without friction.
            These tools support real workflows — debugging, validation,
            data inspection, and quick transformations — all in one place.
          </p>
        </header>

        <section className="panel">
          <h2 className="panelTitle">Our Approach</h2>
          <p className="panelText">
            We focus on clarity and predictability. Each tool is built to solve
            a specific technical need without unnecessary complexity.
            Whether you’re working in development, QA, or production support,
            these utilities are designed to save time and reduce context switching.
          </p>
        </section>

        <section className="panel">
          <h2 className="panelTitle">Tool Overview</h2>

          <ToolBlock
            title="Base64 & Hash Utilities"
            short="Used for encoding, decoding, and verifying data integrity during development and testing."
            full="The Base64 tool helps convert binary or structured data into transport-safe formats. Hash generation is commonly used for integrity checks, caching validation, and fingerprint comparisons. These tools are especially useful when working with APIs, tokens, and backend integrations."
          />

          <ToolBlock
            title="JWT Decoder"
            short="Inspect token payloads and claims for debugging authentication flows."
            full="JWT decoding allows you to quickly view header and payload information without needing backend access. It’s useful for validating expiration timestamps, checking roles and permissions, and confirming issuer or audience mismatches during integration testing."
          />

          <ToolBlock
            title="UUID & NanoID Generators"
            short="Generate unique identifiers for distributed systems and test environments."
            full="UUIDs and NanoIDs are commonly used for request tracking, database identifiers, and correlation IDs in logs. These generators provide quick, collision-resistant identifiers suitable for frontend and backend workflows."
          />

          <ToolBlock
            title="JSON Formatter & Regex Tester"
            short="Structure payloads clearly and validate patterns with confidence."
            full="JSON formatting improves readability and makes debugging API responses easier. The Regex Tester allows safe pattern experimentation, validation of inputs, and refinement of search expressions before implementation in production code."
          />

          <ToolBlock
            title="URL & Timestamp Tools"
            short="Parse URLs and manage time conversions across systems."
            full="URL parsing helps inspect query parameters, routes, and fragments accurately. Timestamp generation and conversion simplify working with Unix time formats, making it easier to debug distributed systems and logging pipelines."
          />

          <ToolBlock
            title="Random & Lorem Generators"
            short="Create placeholder content and test data instantly."
            full="Random string generation supports mock data creation and temporary identifiers. Lorem Ipsum text assists with layout testing and UI design validation without waiting for final copy."
          />
        </section>

        <section className="panel notePanel">
          <h2 className="panelTitle">Engineering Services</h2>
          <p className="panelText">
            In addition to these utilities, TryAtLabs offers professional web development
            and engineering support. We help teams build structured UI systems,
            improve performance, refine workflows, and develop custom internal tools.
          </p>

          <div className="ctaRow">
            <a className="ctaBtn" href="/contact">Contact TryAtLabs</a>
          </div>
        </section>

      </section>

      <ToolsHub />

      <style>{`
        .aboutPage{
          max-width: var(--max);
          margin: 0 auto;
          padding: 22px 16px 54px;
        }

        .aboutWrap{ display:grid; gap: 18px; }

        .aboutHeader{
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card2);
          padding: 18px;
        }

        .aboutTitle{
          margin: 0 0 6px;
          font-size: clamp(22px, 3vw, 36px);
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .aboutLead{
          margin: 0;
          color: var(--muted);
          font-weight: 500;
          line-height: 1.6;
          max-width: 85ch;
        }

        .panel{
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card2);
          padding: 16px;
        }

        .panelTitle{
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .panelText{
          margin: 0;
          color: var(--muted);
          font-weight: 500;
          line-height: 1.6;
        }

        .toolBlock{
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 12px 0;
        }

        .toolTitle{
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 600;
        }

        .toolText{
          margin: 0;
          color: var(--muted);
          font-weight: 500;
          line-height: 1.55;
        }

        .readMore{
          margin-top: 6px;
          background: none;
          border: none;
          color: var(--p2);
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .notePanel{
          background: linear-gradient(180deg, rgba(121,78,230,0.08), transparent 50%), var(--card2);
        }

        .ctaRow{
          margin-top: 10px;
        }

        .ctaBtn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 10px 14px;
          border-radius: 14px;
          font-weight: 600;
          border: 1px solid rgba(121,78,230,0.45);
          background: linear-gradient(135deg, var(--p2), var(--p1));
          color:#fff;
        }
      `}</style>
    </main>
  );
}