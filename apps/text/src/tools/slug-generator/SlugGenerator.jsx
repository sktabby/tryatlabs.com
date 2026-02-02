import React, { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";

function slugify(str, { lower = true, separator = "-" }) {
  const s = lower ? str.toLowerCase() : str;
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, separator)
    .replace(new RegExp(`${separator}{2,}`, "g"), separator);
}

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [lower, setLower] = useState(true);
  const [separator, setSeparator] = useState("-");

  const out = useMemo(() => slugify(text, { lower, separator }), [text, lower, separator]);

  return (
    <ToolShell>
      {/* Input row */}
      <div className="sgRow">
        <div className="fieldLabel">Input</div>
        <input
          className="input sgInput"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Best Free Text Tools in 2026!"
        />
      </div>

      {/* Output row */}
      <div className="sgRow">
        <div className="fieldLabel">Output</div>
        <input className="input sgInput" value={out} readOnly />
      </div>

      <div className="toggleGrid">
        <label className="toggle">
          <div className="toggleLeft">
            <span className="toggleTitle">Lowercase</span>
          </div>
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
        </label>

        <label className="toggle">
          <div className="toggleLeft">
            <span className="toggleTitle">Separator</span>
          </div>

          <select className="select sgSelect" value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">- (dash)</option>
            <option value="_">_ (underscore)</option>
          </select>
        </label>
      </div>

      <div className="btnRow">
        <button
          className="btn btnPrimary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(out);
            } catch {}
          }}
          type="button"
        >
          Copy slug
        </button>

        <button className="btn btnGhost" onClick={() => setText("")} type="button">
          Clear
        </button>
      </div>

      {/* CSS in same file */}
      <style>{`
        /* =========================
           Slug Generator (scoped)
        ========================= */

        .sgRow{
          margin-bottom: 12px;
        }

        .fieldLabel{
          font-weight: 950;
          font-size: 12px;
          color: var(--muted);
          margin: 0 0 8px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        /* Input look */
        .sgInput{
          border-radius: 16px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          color: var(--text);
          padding: 12px 12px;
          font-weight: 750;
          font-size: 13.5px;
          outline: none;
          transition: border-color .14s ease, background .14s ease;
        }

        .sgInput:focus{
          border-color: color-mix(in srgb, var(--p1) 55%, var(--border));
          background: color-mix(in srgb, var(--card) 96%, transparent);
        }

        /* Toggles grid */
        .toggleGrid{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 10px 0 14px;
        }

        .toggle{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 16px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 90%, transparent);
          color: var(--text);
          font-weight: 850;
        }

        .toggleTitle{
          font-size: 13px;
          font-weight: 950;
          color: var(--text);
        }

        .toggle input[type="checkbox"]{
          width: 18px;
          height: 18px;
          accent-color: var(--p1);
        }

        /* Premium dropdown */
        .sgSelect{
          width: 165px;
          border-radius: 14px;
          border: 1px solid color-mix(in srgb, var(--p1) 28%, var(--border));
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card) 96%, transparent),
              color-mix(in srgb, var(--card) 88%, transparent)
            );
          color: var(--text);
          padding: 10px 40px 10px 12px;
          font-weight: 950;
          font-size: 13px;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color .14s ease, transform .14s ease, background .14s ease;
          box-shadow: 0 10px 28px rgba(80, 61, 92, 0.12);
          background-image:
            linear-gradient(45deg, transparent 50%, var(--p1) 50%),
            linear-gradient(135deg, var(--p1) 50%, transparent 50%),
            linear-gradient(to right, transparent, transparent);
          background-position:
            calc(100% - 18px) calc(50% - 2px),
            calc(100% - 12px) calc(50% - 2px),
            0 0;
          background-size: 6px 6px, 6px 6px, 100% 100%;
          background-repeat: no-repeat;
        }

        .sgSelect:hover{
          border-color: color-mix(in srgb, var(--p1) 55%, var(--border));
        }

        .sgSelect:focus{
          border-color: color-mix(in srgb, var(--p1) 70%, var(--border));
          transform: translateY(-1px);
        }

        .btnRow{
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
          margin-top: 6px;
        }

        @media (max-width: 760px){
          .toggleGrid{
            grid-template-columns: 1fr;
          }
          .sgSelect{
            width: 100%;
          }
        }
      `}</style>
    </ToolShell>
  );
}
