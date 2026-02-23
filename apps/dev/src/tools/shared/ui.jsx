import React from "react";
import "./ui.css"
export function FieldLabel({ children, hint }) {
  return (
    <div className="fieldLabel">
      <div className="fieldLabelTop">
        <span>{children}</span>
        {hint ? <span className="fieldHint">{hint}</span> : null}
      </div>
    </div>
  );
}

export function TextArea({ value, onChange, placeholder, rows = 8 }) {
  return (
    <textarea
      className="ta"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      spellCheck={false}
    />
  );
}

export function Input({ value, onChange, placeholder }) {
  return (
    <input
      className="in"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
    />
  );
}

export function Row({ children }) {
  return <div className="row">{children}</div>;
}

export function Button({ children, onClick, variant = "primary", disabled = false }) {
  const cls = variant === "ghost" ? "btnGhost" : variant === "soft" ? "btnSoft" : "btnPrimary";
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function CopyButton({ text }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // ignore
    }
  };

  return (
    <button className="btnSoft" onClick={copy} disabled={!text}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function Card({ title, desc, children, right }) {
  return (
    <div className="glassCard">
      <div className="glassCardHead">
        <div>
          <div className="glassTitle">{title}</div>
          {desc ? <div className="glassDesc">{desc}</div> : null}
        </div>
        {right ? <div className="glassRight">{right}</div> : null}
      </div>
      <div className="glassBody">{children}</div>
    </div>
  );
}
