import React, { useState } from "react";

function toTitleCase(t) {
  return t
    .toLowerCase()
    .split(/(\s+)/)
    .map((w) => (w.trim() ? w[0].toUpperCase() + w.slice(1) : w))
    .join("");
}

function toSentenceCase(t) {
  return t
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (c) => c.toUpperCase());
}

export default function CaseConverter() {
  const [text, setText] = useState("");

  const actions = [
    { label: "UPPERCASE", fn: (t) => t.toUpperCase() },
    { label: "lowercase", fn: (t) => t.toLowerCase() },
    { label: "Title Case", fn: toTitleCase },
    { label: "Sentence case", fn: toSentenceCase },
    {
      label: "cApItAlIzE eAcH",
      fn: (t) =>
        t.replace(/[a-z]/gi, (c, i) =>
          i % 2 ? c.toLowerCase() : c.toUpperCase()
        )
    }
  ];

  const onClear = () => setText("");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback (rare)
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  return (
    <>
      {/* Top actions (Clear / Copy) */}
      <div className="caseTopBar">
        <button className="caseMiniBtn" onClick={onClear} type="button">
          Clear
        </button>
        <button className="caseMiniBtn caseMiniBtnPrimary" onClick={onCopy} type="button">
          Copy
        </button>
      </div>

      <textarea
        className="caseTextarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        spellCheck={false}
      />

      <div className="caseActions">
        {actions.map((a) => (
          <button
            key={a.label}
            className="caseBtn"
            onClick={() => setText(a.fn(text))}
            type="button"
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* CSS in same file */}
      <style>{`
        .caseTool {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 14px;
        }

        /* Distinct top toolbar look (different from other cards) */
        .caseTopBar{
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 10px;
          padding: 4px;
          border-radius: 16px;
          
        }

        .caseMiniBtn{
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text);
          padding: 8px 12px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          transition: transform .14s ease, background .14s ease, border-color .14s ease, opacity .14s ease;
          white-space: nowrap;
        }

        .caseMiniBtn:hover{
          background: color-mix(in srgb, var(--p1) 12%, transparent);
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
        }

        .caseMiniBtn:active{
          transform: scale(0.97);
        }

        .caseMiniBtnPrimary{
          background: linear-gradient(135deg, var(--p2), var(--p4));
          border-color: transparent;
          color: white;
          box-shadow: 0 10px 24px rgba(80, 61, 92, 0.18);
        }

        .caseMiniBtnPrimary:hover{
          opacity: 0.95;
        }

        .caseTextarea {
          width: 100%;
          min-height: 260px;
          max-height: 420px;
          resize: vertical;
          overflow: auto;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          color: var(--text);
          padding: 12px;
          font-size: 13.5px;
          font-weight: 700;
          line-height: 1.55;
          outline: none;
        }

        .caseActions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .caseBtn {
          border-radius: 16px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 90%, transparent);
          color: var(--text);
          padding: 12px 10px;
          font-size: 12.5px;
          font-weight: 900;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.14s ease, transform 0.14s ease, border-color 0.14s ease;
          text-align: center;
          min-height: 44px; /* equal height on mobile */
        }

        .caseBtn:hover {
          background: color-mix(in srgb, var(--p1) 14%, transparent);
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
        }

        .caseBtn:active {
          transform: scale(0.97);
        }

        /* Mobile: force clean equal grid */
        @media (max-width: 520px) {
          .caseActions {
            grid-template-columns: repeat(2, 1fr);
          }
          .caseTopBar{
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
}
