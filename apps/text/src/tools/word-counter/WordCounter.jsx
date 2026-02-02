import React, { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";

export default function WordCounter() {
  const [text, setText] = useState("");

  const metrics = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (words ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    return { words, chars, charsNoSpaces, sentences, paragraphs };
  }, [text]);

  return (
    <ToolShell
     

    >
      <textarea
        className="textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text…"
      />

      <div className="metricsGrid">
        <div className="metricCard"><div className="metricNum">{metrics.words}</div><div className="metricLabel">Words</div></div>
        <div className="metricCard"><div className="metricNum">{metrics.chars}</div><div className="metricLabel">Characters</div></div>
        <div className="metricCard"><div className="metricNum">{metrics.charsNoSpaces}</div><div className="metricLabel">Chars (no spaces)</div></div>
        <div className="metricCard"><div className="metricNum">{metrics.sentences}</div><div className="metricLabel">Sentences</div></div>
        <div className="metricCard"><div className="metricNum">{metrics.paragraphs}</div><div className="metricLabel">Paragraphs</div></div>
      </div>

      <div className="btnRow">
        <button className="btn btnGhost" onClick={() => setText("")}>Clear</button>
        <button
          className="btn btnPrimary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
            } catch {}
          }}
        >
          Copy
        </button>
      </div>
    </ToolShell>
  );
}
