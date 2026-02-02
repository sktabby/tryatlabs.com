import React, { useMemo, useState } from "react";
import ToolShell from "../shared/ToolShell.jsx";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  const output = useMemo(() => {
    let t = text;

    if (find) {
      const regex = new RegExp(find, "g");
      t = t.replace(regex, replace);
    }

    if (removeDuplicates) {
      const lines = t.split("\n");
      t = Array.from(new Set(lines)).join("\n");
    }

    return t;
  }, [text, find, replace, removeDuplicates]);

  return (
    <ToolShell
      
    >
      <textarea
        className="textarea"
        placeholder="Paste your text here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="row2">
        <input
          className="input"
          placeholder="Find"
          value={find}
          onChange={(e) => setFind(e.target.value)}
        />
        <input
          className="input"
          placeholder="Replace with"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
        />
      </div>

      <label className="toggle" style={{ marginTop: 10 }}>
        <input
          type="checkbox"
          checked={removeDuplicates}
          onChange={(e) => setRemoveDuplicates(e.target.checked)}
        />
        <span>Remove duplicate lines</span>
      </label>

      <div  style={{ marginTop: 12 }}>
        <textarea className="textarea" readOnly value={output} />
      </div>

      <div className="btnRow">
        <button
          className="btn btnPrimary"
          onClick={() => navigator.clipboard.writeText(output)}
        >
          Copy Result
        </button>
        <button className="btn btnGhost" onClick={() => setText("")}>
          Clear
        </button>
      </div>
    </ToolShell>
  );
}
