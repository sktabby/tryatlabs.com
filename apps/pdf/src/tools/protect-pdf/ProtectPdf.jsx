import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { Lock, ShieldCheck } from "lucide-react";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./protect-pdf.css";

export default function ProtectPdf() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");

  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(false);
  const [allowModifying, setAllowModifying] = useState(false);

  const canRun = !!file && userPassword.trim().length >= 4 && !busy;

  const onPick = (e) => {
    setError("");
    const picked = Array.from(e.target.files || []).find(
      (f) => f.type === "application/pdf"
    );
    e.target.value = "";
    if (!picked) return;
    setFile(picked);
  };

  const clear = () => {
    setFile(null);
    setError("");
    setUserPassword("");
    setOwnerPassword("");
    setAllowPrinting(true);
    setAllowCopying(false);
    setAllowModifying(false);
  };

  const hint = useMemo(() => {
    if (!file) return "Upload a PDF and set a password to protect it.";
    return "Your PDF will be encrypted locally in your browser.";
  }, [file]);

  const protect = async () => {
    setBusy(true);
    setError("");
    try {
      if (!file) throw new Error("Please upload a PDF.");
      if (userPassword.trim().length < 4)
        throw new Error("Password must be at least 4 characters.");

      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });

      const outBytes = await pdfDoc.save({
        encrypt: {
          userPassword: userPassword.trim(),
          ownerPassword: ownerPassword.trim() || userPassword.trim(),
          permissions: {
            printing: allowPrinting ? "lowResolution" : "none",
            copying: allowCopying,
            modifying: allowModifying,
            annotating: false,
            fillingForms: false,
            contentAccessibility: false,
            documentAssembly: false
          }
        }
      });

      goToResult(navigate, {
        slug: "protect-pdf",
        title: "PDF protected with password!",
        fileName: "tryatlabs-protected.pdf",
        bytes: outBytes
      });
    } catch (e) {
      setError(e?.message || "Failed to protect PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--protect card">
      <div className="toolHead">
        <div>
          <h2 className="toolTitle">Protect PDF</h2>
          <div className="muted">{hint}</div>
        </div>

        <div className="toolActions">
          <button className="btn btn--ghost" onClick={clear} disabled={busy}>
            Clear
          </button>
        </div>
      </div>

      <label className="drop">
        <input type="file" accept="application/pdf" onChange={onPick} />
        <div>
          <div className="drop__title">Drop a PDF here or click to upload</div>
          <div className="muted">Your file never leaves your device.</div>
        </div>
      </label>

      {file && (
        <div className="fileRow">
          <div>
            <div className="fileName">{file.name}</div>
            <div className="muted">{niceBytes(file.size)}</div>
          </div>
          <span className="miniPill">
            <ShieldCheck size={16} /> Private
          </span>
        </div>
      )}

      <div className="protectGrid">
        <div className="protectCard">
          <div className="protectCard__title">
            <Lock size={18} /> Password
          </div>

          <div className="field">
            <div className="field__label">Open password</div>
            <input
              className="input"
              type="password"
              placeholder="Minimum 4 characters"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>

          <div className="field">
            <div className="field__label">Owner password (optional)</div>
            <input
              className="input"
              type="password"
              placeholder="Defaults to open password"
              value={ownerPassword}
              onChange={(e) => setOwnerPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="protectCard">
          <div className="protectCard__title">Permissions</div>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={allowPrinting}
              onChange={(e) => setAllowPrinting(e.target.checked)}
            />
            <span>Allow printing</span>
          </label>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={allowCopying}
              onChange={(e) => setAllowCopying(e.target.checked)}
            />
            <span>Allow copy text</span>
          </label>

          <label className="checkRow">
            <input
              type="checkbox"
              checked={allowModifying}
              onChange={(e) => setAllowModifying(e.target.checked)}
            />
            <span>Allow editing</span>
          </label>
        </div>
      </div>

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button
          className="btn btn--primary"
          disabled={!canRun}
          onClick={protect}
        >
          {busy ? "Protecting..." : "Protect & Continue"}
        </button>
      </div>
    </div>
  );
}
