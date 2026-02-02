import React, { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";
import { diffWords } from "diff";

/* ---------------------------
   Diff rendering logic
---------------------------- */
function renderDiff(a, b) {
  const parts = diffWords(a, b);

  return parts.map((p, idx) => {
    const cls = p.added
      ? "diffAdd"
      : p.removed
      ? "diffRemove"
      : "diffSame";

    return (
      <span key={idx} className={cls}>
        {p.value}
      </span>
    );
  });
}

export default function DiffChecker() {
 const [left, setLeft] = useState("");
const [right, setRight] = useState("");


  const diffView = useMemo(() => renderDiff(left, right), [left, right]);

  return (
    <ToolShell>
      {/* =========================
          Scoped styles (ONLY here)
         ========================= */}
      <style>{`
        .split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .splitCol {
          min-width: 0;
        }

        .fieldLabel {
          font-size: 12px;
          font-weight: 950;
          color: var(--muted);
          margin-bottom: 8px;
        }

        /* textarea polish without changing global behavior */
        .textarea.tall {
          border-radius: 18px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          box-shadow: 0 14px 40px rgba(80, 61, 92, 0.1);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .textarea.tall:focus {
          border-color: color-mix(in srgb, var(--p1) 45%, var(--border));
          box-shadow: 0 18px 55px rgba(80, 61, 92, 0.18);
        }

     .diffBox {
  margin-top: 8px;
  padding: 14px;

  height: 220px;              /* FIXED HEIGHT */
  overflow-y: auto;           /* ENABLE SCROLL */
  overflow-x: hidden;

  border-radius: 22px;
  border: 1px solid var(--border);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--card) 86%, transparent),
    color-mix(in srgb, var(--card) 94%, transparent)
  );

  box-shadow: 0 18px 60px rgba(80, 61, 92, 0.12);

  white-space: pre-wrap;
  word-break: break-word;

  font-size: 13.5px;
  font-weight: 650;
  line-height: 1.6;
  color: var(--text);
}


        .diffSame {
          color: color-mix(in srgb, var(--text) 84%, var(--muted));
        }

        .diffAdd {
          background: color-mix(in srgb, #22c55e 18%, transparent);
          color: color-mix(in srgb, #22c55e 88%, var(--text));
          border: 1px solid color-mix(in srgb, #22c55e 35%, transparent);
          border-radius: 8px;
          padding: 1px 3px;
        }

        .diffRemove {
          background: color-mix(in srgb, #ef4444 16%, transparent);
          color: color-mix(in srgb, #ef4444 88%, var(--text));
          border: 1px solid color-mix(in srgb, #ef4444 35%, transparent);
          border-radius: 8px;
          padding: 1px 3px;
          text-decoration: line-through;
          text-decoration-thickness: 2px;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .split {
            grid-template-columns: 1fr;
          }

          .diffBox {
            border-radius: 18px;
            padding: 12px;
          }
        }
          /* =========================
   Diff hint (mini guide)
========================= */
.diffHint {
  margin-top: 6px;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 750;
  color: var(--muted);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.diffHintAdd,
.diffHintRemove {
  padding: 2px 6px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 11px;
  line-height: 1;
}

.diffHintAdd {
  background: color-mix(in srgb, #22c55e 18%, transparent);
  color: color-mix(in srgb, #22c55e 90%, var(--text));
  border: 1px solid color-mix(in srgb, #22c55e 35%, transparent);
}

.diffHintRemove {
  background: color-mix(in srgb, #ef4444 16%, transparent);
  color: color-mix(in srgb, #ef4444 90%, var(--text));
  border: 1px solid color-mix(in srgb, #ef4444 35%, transparent);
}

      `}</style>

      {/* =========================
          Inputs
         ========================= */}
     <div className="split">
  <div className="splitCol">
    <div className="fieldLabel">Original</div>
    <textarea
      className="textarea tall"
      value={left}
      placeholder="Paste original text here…"
      onChange={(e) => setLeft(e.target.value)}
    />
  </div>

  <div className="splitCol">
    <div className="fieldLabel">Updated</div>
    <textarea
      className="textarea tall"
      value={right}
      placeholder="Paste updated text here…"
      onChange={(e) => setRight(e.target.value)}
    />
  </div>
</div>


      {/* =========================
          Result
         ========================= */}
         <div className="diffHint">
  <span className="diffHintAdd">Green</span> = added text,
  <span className="diffHintRemove">Red</span> = removed text,
  normal text is unchanged.
</div>

      <div className="fieldLabel" style={{ marginTop: 12 }}>
        Result
      </div>
      <div className="diffBox">{diffView}</div>
    </ToolShell>
  );
}
