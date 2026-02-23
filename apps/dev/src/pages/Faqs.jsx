import React, { useMemo, useState } from "react";
import ToolsHub from "../components/common/ToolsHub.jsx";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faqItem ${open ? "open" : ""}`}>
      <button className="faqQ" type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faqCaret">{open ? "–" : "+"}</span>
      </button>
      {open ? <div className="faqA">{a}</div> : null}
    </div>
  );
}

export default function Faqs() {
  const data = useMemo(
    () => [
      {
        title: "Base64 Tool",
        items: [
          {
            q: "When should I use Base64 encoding?",
            a: "Use Base64 when you need to represent binary data (or arbitrary bytes) as safe text—commonly for transport in JSON, URLs (with proper encoding), headers, or when systems only accept printable characters. It’s not encryption; it’s an encoding format."
          },
          {
            q: "Why does decoding fail sometimes?",
            a: "Decoding fails if the input contains invalid characters, incorrect padding, or a broken copy. Check for missing '=' padding, line breaks, and whether the input is Base64URL vs standard Base64."
          },
          {
            q: "Is Base64 secure?",
            a: "No. Base64 is reversible and provides no confidentiality. If you need security, use encryption and key management; Base64 is only for representation and transport."
          }
        ]
      },
      {
        title: "Hash Generator",
        items: [
          {
            q: "What is a hash used for in real projects?",
            a: "Hashes are used for integrity checks, deduplication, fingerprints, cache keys, and comparisons. A hash changes drastically when the input changes, which makes it useful to detect accidental or malicious modifications."
          },
          {
            q: "Can I use a hash to store passwords?",
            a: "Don’t use generic hashes for passwords. Password storage should use a slow password hashing scheme (e.g., bcrypt/scrypt/Argon2) with salt. Generic hashes are too fast and vulnerable to brute force."
          },
          {
            q: "Why do two similar inputs produce totally different hashes?",
            a: "That’s expected due to the avalanche effect—small changes in input lead to large changes in output, which is a desirable property in cryptographic hash functions."
          }
        ]
      },
      {
        title: "JWT Decoder",
        items: [
          {
            q: "Does decoding a JWT validate it?",
            a: "Decoding only reads the header/payload; it does not verify the signature. Signature verification requires the secret/public key and algorithm rules. Decoding is still useful for quick inspection during debugging and QA."
          },
          {
            q: "What should I check inside a JWT payload?",
            a: "Common claims include exp (expiry), iat (issued-at), aud (audience), iss (issuer), sub (subject/user id), and custom roles/permissions. During incidents, exp and aud mismatches often explain auth failures."
          },
          {
            q: "Why is my token rejected even though it looks correct?",
            a: "Often due to expiration (exp), clock skew, incorrect issuer/audience, wrong signing key, or mismatched algorithm configuration. Decode the token and compare claims against your service expectations."
          }
        ]
      },
      {
        title: "Timestamp Generator",
        items: [
          {
            q: "Why do systems use Unix timestamps?",
            a: "Unix timestamps are timezone-agnostic and easy to compare/sort. They reduce formatting ambiguity across clients and services."
          },
          {
            q: "Milliseconds vs seconds—how do I know which one I have?",
            a: "Seconds are usually 10 digits (e.g., 1700000000). Milliseconds are usually 13 digits (e.g., 1700000000000). Incorrect units cause huge date offsets."
          },
          {
            q: "When do I need UTC conversion?",
            a: "UTC is the most reliable baseline for logs, distributed systems, and APIs. Convert to local time only at the UI layer for display and user understanding."
          }
        ]
      },
      {
        title: "URL Encode/Decode",
        items: [
          {
            q: "What’s the difference between URL encoding and Base64?",
            a: "URL encoding ensures characters are safe within URLs by replacing unsafe characters with percent-encoded sequences. Base64 converts arbitrary bytes into text—useful for transport but not necessarily URL-safe without Base64URL or additional encoding."
          },
          {
            q: "Why does my URL break when I paste JSON into a query parameter?",
            a: "Because characters like { } : \" and spaces must be encoded. Use URL encoding for query strings, and avoid excessively long URLs if possible."
          },
          {
            q: "What should I encode: the whole URL or only values?",
            a: "Typically encode parameter values, not the whole URL structure. Encoding the entire URL can break separators like '?' '&' '=' which are meaningful."
          }
        ]
      },
      {
        title: "UUID Generator",
        items: [
          {
            q: "When should I use UUIDs?",
            a: "UUIDs are great for unique identifiers across distributed systems—client-generated IDs, request tracking, database primary keys (with caution), and correlation IDs for logs."
          },
          {
            q: "Are UUIDs random?",
            a: "Some versions are random-based; others include time and node information. Either way, they’re designed to minimize collisions at scale."
          },
          {
            q: "Should UUIDs be used as security tokens?",
            a: "Not by default. UUIDs are identifiers, not secrets. For security tokens, use cryptographically strong random secrets with appropriate length and storage rules."
          }
        ]
      },
      {
        title: "JSON Formatter",
        items: [
          {
            q: "Why format JSON instead of leaving it minified?",
            a: "Readable JSON helps debugging, code review, QA validation, and quick spotting of missing fields. It’s also helpful for consistent diffs and comparing payloads."
          },
          {
            q: "What causes JSON parsing errors?",
            a: "Trailing commas, missing quotes, invalid escape sequences, or mixed single quotes. Valid JSON is strict—objects must use double quotes for keys/strings."
          },
          {
            q: "Does formatting change the data?",
            a: "Formatting should only change whitespace and ordering where applicable. If you rely on key ordering in downstream logic, that’s a smell—JSON objects are not meant to be order-dependent."
          }
        ]
      },
      {
        title: "Regex Tester",
        items: [
          {
            q: "Why does my regex work in one tool but not another?",
            a: "Regex engines differ (JavaScript vs PCRE vs Python). Features like lookbehind support, unicode classes, and flags can behave differently."
          },
          {
            q: "What’s a safe approach to avoid catastrophic backtracking?",
            a: "Avoid nested quantifiers on ambiguous patterns, anchor when possible, and test against worst-case strings. If performance matters, choose simpler expressions and validate in realistic workloads."
          },
          {
            q: "When should I use regex vs parsing?",
            a: "Regex is ideal for pattern matching and validation; parsing is better for structured content like full URLs/JSON/HTML where grammar rules matter."
          }
        ]
      },
      {
        title: "Lorem Ipsum Generator",
        items: [
          {
            q: "When is Lorem Ipsum useful in real development?",
            a: "Use it to test layout density, typography, spacing, and responsive wrapping without waiting for final copy. It helps you design with realistic text flow."
          },
          {
            q: "Can placeholder text mislead stakeholders?",
            a: "Yes—always label it clearly as placeholder in client demos to avoid confusion. Replace with realistic copy before final review."
          },
          {
            q: "Why not just repeat the same sentence?",
            a: "Repeated text doesn’t emulate natural word lengths and breaks. Lorem Ipsum helps approximate realistic reading rhythm for layout testing."
          }
        ]
      },
      {
        title: "Random String Generator",
        items: [
          {
            q: "What should I use random strings for?",
            a: "Mock data, test keys, non-sensitive tokens for QA, placeholders, and unique labels. For secrets, use cryptographically secure random generation rules."
          },
          {
            q: "Is every random string safe to use as an API key?",
            a: "No. Keys require secure entropy, proper length, safe storage, and rotation policies. Treat keys as secrets, not simple random values."
          },
          {
            q: "How do I choose length and charset?",
            a: "For readability: shorter + constrained charset. For collision resistance: longer length. For security: use cryptographic randomness and avoid weak patterns."
          }
        ]
      },
      {
        title: "URL Parser",
        items: [
          {
            q: "Why parse URLs instead of splitting by '/' and '?'?",
            a: "Manual splitting breaks with edge cases: encoded characters, missing components, fragments, unusual ports, and nested query strings. Parsing is safer and more predictable."
          },
          {
            q: "What parts of a URL are most useful in debugging?",
            a: "Protocol, host, pathname, query parameters, and fragment. In production, query values often explain tracking, filters, and state restoration issues."
          },
          {
            q: "How do I handle encoded query values?",
            a: "Decode parameter values before interpreting them. Keep raw and decoded versions when debugging to avoid losing the original input."
          }
        ]
      },
      {
        title: "NanoID Generator",
        items: [
          {
            q: "Why use NanoID instead of UUID?",
            a: "NanoID can be shorter and more URL-friendly while still maintaining good uniqueness properties. It’s often nicer for readable links, lightweight IDs, and frontend-generated identifiers."
          },
          {
            q: "Can NanoID be used for database primary keys?",
            a: "Yes in many cases, especially when you want shorter IDs. Choose length based on collision tolerance, scale, and whether IDs are generated across multiple clients."
          },
          {
            q: "How do I choose the NanoID length?",
            a: "Longer IDs reduce collision risk. If IDs are public and must be unguessable, increase length and treat it as a security decision, not only a uniqueness decision."
          }
        ]
      }
    ],
    []
  );

  return (
    <main className="faqPage">
      <section className="faqWrap">
        <header className="faqHeader">
          <h1 className="faqTitle">FAQs</h1>
          <p className="faqLead">
            These FAQs cover practical usage, edge cases, and engineering guidance for each tool.
            If you need a custom tool, a tailored workflow, or product-level development support,
            contact TryAtLabs directly from the Contact page.
          </p>
        </header>

        {data.map((group) => (
          <section key={group.title} className="faqGroup">
            <div className="faqGroupHead">
              <h2 className="faqGroupTitle">{group.title}</h2>
              <div className="faqGroupHint mono">Common questions • Practical answers</div>
            </div>

            <div className="faqList">
              {group.items.map((it) => (
                <FaqItem key={it.q} q={it.q} a={it.a} />
              ))}
            </div>
          </section>
        ))}
      </section>

      {/* Required: ToolsHub at end */}
      <ToolsHub />

      <style>{`
        .faqPage{
          max-width: var(--max);
          margin: 0 auto;
          padding: 22px 16px 54px;
        }

        .faqWrap{ display:grid; gap: 14px; }

        .faqHeader{
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card2);
          box-shadow: var(--shadow2);
          padding: 18px;
        }

        .faqTitle{
          margin: 0 0 8px;
          font-size: clamp(24px, 3vw, 40px);
          letter-spacing: -0.5px;
        }

        .faqLead{
          margin: 0;
          color: var(--muted);
          font-weight: 700;
          line-height: 1.55;
          max-width: 95ch;
        }

        .faqGroup{
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card2);
          box-shadow: var(--shadow2);
          padding: 14px;
        }

        .faqGroupHead{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap: 12px;
          padding: 6px 4px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 12px;
        }

        .faqGroupTitle{
          margin: 0;
          font-size: 18px;
          letter-spacing: -0.2px;
        }

        .faqGroupHint{
          color: var(--faint);
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .faqList{ display:grid; gap: 10px; }

        .faqItem{
          border: 1px solid rgba(255,255,255,0.10);
          background: var(--card);
          border-radius: 18px;
          overflow:hidden;
        }

        .faqQ{
          width: 100%;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 12px;
          padding: 12px 12px;
          border: 0;
          background: transparent;
          color: var(--text);
          font-weight: 950;
          cursor: pointer;
          text-align:left;
        }

        .faqCaret{
          width: 34px;
          height: 34px;
          display:grid;
          place-items:center;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(121,78,230,0.12);
          font-weight: 950;
          flex: 0 0 auto;
        }

        .faqA{
          padding: 0 12px 12px;
          color: var(--muted);
          font-weight: 700;
          line-height: 1.55;
        }

        @media (max-width: 720px){
          .faqGroupHead{ align-items:flex-start; flex-direction:column; }
        }
      `}</style>
    </main>
  );
}