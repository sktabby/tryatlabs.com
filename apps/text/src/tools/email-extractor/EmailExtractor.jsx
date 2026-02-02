import React, { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;




export default function EmailExtractor() {
  const [text, setText] = useState("");

  const emails = useMemo(() => {
    const found = text.match(EMAIL_REGEX) || [];
    return Array.from(new Set(found)); // remove duplicates
  }, [text]);

  const copy = async () => {
    await navigator.clipboard.writeText(emails.join("\n"));
  };

  return (
    <ToolShell>
      <style>{`
        /* =========================
           EmailExtractor (scoped)
        ========================= */
        .eeWrap {
          display: grid;
          gap: 12px;
        }

        .eeInput {
          border-radius: 18px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          box-shadow: 0 14px 40px rgba(80, 61, 92, 0.10);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          min-height: 220px;
          line-height: 1.55;
        }

        .eeInput:focus {
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
          box-shadow: 0 18px 55px rgba(80, 61, 92, 0.18);
        }

        .eeCard {
          margin-top: 0;
          padding: 12px;
          border-radius: 22px;
        }

        .eeHead {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .eeTitle {
          margin: 0;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: -0.01em;
          color: var(--muted);
        }

        .eeCount {
          font-size: 12px;
          font-weight: 900;
          color: var(--muted);
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 88%, transparent);
        }

        .eeEmpty {
          margin: 4px 0 0;
          color: var(--muted);
          font-weight: 750;
          line-height: 1.6;
          font-size: 13px;
        }

      .eeOut {
  border-radius: 18px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 92%, transparent);
  height: 220px;              /* FIXED HEIGHT */
  line-height: 1.55;
  box-shadow: 0 14px 40px rgba(80, 61, 92, 0.08);
  overflow: auto;             /* SCROLL INSIDE */
  resize: none;               /* PREVENT MANUAL RESIZE */
}

        .eeActions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          margin-top: 2px;
        }

        .eeBtn {
          min-width: 140px;
        }

        @media (max-width: 760px) {
          .eeActions {
            justify-content: stretch;
          }
          .eeBtn {
            flex: 1;
            min-width: 0;
          }
          .eeInput {
            min-height: 200px;
          }
        .eeOut {
  height: 180px;
}

        }
      `}</style>

      <div className="eeWrap">
        <textarea
          className="textarea eeInput"
          placeholder="Paste text, resumes, logs, or documents here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="contentCard eeCard">
          <div className="eeHead">
            <p className="eeTitle">Detected Emails</p>
            <span className="eeCount">{emails.length} found</span>
          </div>

          {emails.length === 0 ? (
            <p className="eeEmpty">No emails detected yet.</p>
          ) : (
            <textarea className="textarea eeOut" readOnly value={emails.join("\n")} />
          )}
        </div>

        <div className="eeActions">
          <button className="btn btnPrimary eeBtn" onClick={copy} disabled={emails.length === 0}>
            Copy Emails
          </button>
          <button className="btn btnGhost eeBtn" onClick={() => setText("")} disabled={text.length === 0}>
            Clear
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
