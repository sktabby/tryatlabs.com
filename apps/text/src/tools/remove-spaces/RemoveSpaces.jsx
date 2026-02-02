import React, { useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";

function cleanText(input, { collapseSpaces, trimLines, removeEmptyLines }) {
  let t = input;

  if (trimLines) {
    t = t
      .split("\n")
      .map((l) => l.trim())
      .join("\n");
  }

  if (collapseSpaces) {
    t = t.replace(/[ \t]+/g, " ");
  }

  if (removeEmptyLines) {
    t = t.replace(/\n\s*\n+/g, "\n\n");
  }

  return t.trim();
}

export default function RemoveSpaces() {
  const [text, setText] = useState("");
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);

  return (
    <ToolShell>
      <textarea
        className="textarea rsTextarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste messy text here…"
        spellCheck={false}
      />

      <div className="toggleGrid rsToggleGrid">
        <label className="toggle rsToggle">
          <span className="rsToggleLeft">
            <span className="rsToggleTitle">Collapse multiple spaces</span>
            <span className="rsToggleSub">Turns repeated spaces into a single space.</span>
          </span>
          <input
            type="checkbox"
            checked={collapseSpaces}
            onChange={(e) => setCollapseSpaces(e.target.checked)}
          />
        </label>

        <label className="toggle rsToggle">
          <span className="rsToggleLeft">
            <span className="rsToggleTitle">Trim each line</span>
            <span className="rsToggleSub">Removes leading/trailing spaces per line.</span>
          </span>
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
          />
        </label>

        <label className="toggle rsToggle">
          <span className="rsToggleLeft">
            <span className="rsToggleTitle">Remove extra empty lines</span>
            <span className="rsToggleSub">Collapses multiple blank lines.</span>
          </span>
          <input
            type="checkbox"
            checked={removeEmptyLines}
            onChange={(e) => setRemoveEmptyLines(e.target.checked)}
          />
        </label>
      </div>

      <div className="btnRow rsBtnRow">
        <button
          className="btn btnPrimary"
          onClick={() => setText(cleanText(text, { collapseSpaces, trimLines, removeEmptyLines }))}
          type="button"
        >
          Clean text
        </button>
        <button className="btn btnGhost" onClick={() => setText("")} type="button">
          Clear
        </button>
        <button
          className="btn btnGhost"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
            } catch {}
          }}
          type="button"
        >
          Copy
        </button>
      </div>

      <style>{`
        /* =========================
           Remove Spaces (scoped)
        ========================= */

        .rsTextarea{
          border-radius: 18px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          color: var(--text);
          padding: 12px;
          font-size: 13.5px;
          font-weight: 700;
          line-height: 1.55;
          outline: none;
          max-height: 420px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          transition: border-color .14s ease, background .14s ease;
        }

        .rsTextarea:focus{
          border-color: color-mix(in srgb, var(--p1) 55%, var(--border));
          background: color-mix(in srgb, var(--card) 96%, transparent);
        }

        .rsToggleGrid{
          margin-top: 12px;
          gap: 10px;
        }

        .rsToggle{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 12px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 90%, transparent);
          transition: border-color .14s ease, background .14s ease, transform .14s ease;
        }

        .rsToggle:hover{
          background: color-mix(in srgb, var(--p1) 12%, transparent);
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
          transform: translateY(-1px);
        }

        .rsToggleLeft{
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .rsToggleTitle{
          font-weight: 950;
          font-size: 13px;
          color: var(--text);
        }

        .rsToggleSub{
          font-weight: 750;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.35;
        }

        .rsToggle input[type="checkbox"]{
          width: 18px;
          height: 18px;
          accent-color: var(--p1);
          flex: 0 0 auto;
        }

        .rsBtnRow{
          margin-top: 14px;
          gap: 10px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        /* Mobile tidy */
        @media (max-width: 520px){
          .rsBtnRow .btn{
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </ToolShell>
  );
}
