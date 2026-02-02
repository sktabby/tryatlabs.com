import React, { useMemo, useRef, useState } from "react";
import { marked } from "marked";
import ToolShell from "../shared/ToolShell.jsx";

marked.setOptions({
  gfm: true,
  breaks: true
});

export default function MarkdownPreview() {
  const [md, setMd] = useState("");

  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isSyncing = useRef(false);

  const html = useMemo(() => marked.parse(md || ""), [md]);

  /* ---------- scroll sync (both ways) ---------- */
  const syncScroll = (from, to) => {
    if (!from || !to) return;
    if (isSyncing.current) return;

    isSyncing.current = true;
    const ratio =
      from.scrollTop / (from.scrollHeight - from.clientHeight || 1);
    to.scrollTop = ratio * (to.scrollHeight - to.clientHeight);
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  };

  return (
    <ToolShell>
      <div className="mdSplit">
        {/* PREVIEW */}
        <div className="mdCol">
          <div className="fieldLabel">Preview</div>
          <div
            ref={previewRef}
            className="mdPreview"
            onScroll={() => syncScroll(previewRef.current, editorRef.current)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* MARKDOWN */}
        <div className="mdCol">
          <div className="fieldLabel">Markdown</div>
          <textarea
            ref={editorRef}
            className="textarea mdArea"
            value={md}
            placeholder={`# Markdown Preview

Write **Markdown** here and see the preview instantly.`}
            onChange={(e) => setMd(e.target.value)}
            onScroll={() => syncScroll(editorRef.current, previewRef.current)}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="btnRow mdBtnRow">
        <button className="btn btnGhost" onClick={() => setMd("")} type="button">
          Clear
        </button>
        <button
          className="btn btnPrimary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(md);
            } catch {}
          }}
          type="button"
        >
          Copy Markdown
        </button>
      </div>

      <style>{`
        /* =========================
           Markdown Preview (scoped)
        ========================= */

        .mdSplit{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: stretch; /* equal height */
        }

        .mdCol{
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .mdArea,
        .mdPreview{
          flex: 1;              /* equal height */
          min-height: 360px;
          max-height: 520px;
          overflow: auto;
        }

        .mdArea{
          border-radius: 18px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 92%, transparent);
          color: var(--text);
          padding: 12px;
          font-size: 13.5px;
          font-weight: 700;
          line-height: 1.55;
          outline: none;
          resize: none;
          transition: border-color .14s ease, background .14s ease;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .mdArea:focus{
          border-color: color-mix(in srgb, var(--p1) 55%, var(--border));
          background: color-mix(in srgb, var(--card) 96%, transparent);
        }

        .mdPreview{
          border-radius: 18px;
          border: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 90%, transparent);
          padding: 14px;
          color: var(--text);
        }

        .mdBtnRow{
          margin-top: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (max-width: 860px){
          .mdSplit{
            grid-template-columns: 1fr;
          }

          .mdArea,
          .mdPreview{
            min-height: 260px;
            max-height: 420px;
          }
        }

        @media (max-width: 520px){
          .mdBtnRow .btn{
            width: 100%;
          }
        }
      `}</style>
    </ToolShell>
  );
}
