// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { PDFDocument } from "pdf-lib";
// import * as pdfjs from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
// import { niceBytes } from "../shared/fileUi.js";
// import { goToResult } from "../shared/goToResult.js";
// import "./merge-pdf.css";

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// async function renderThumb(file, scale = 0.35) {
//   // returns dataURL of page 1 preview (best-effort)
//   try {
//     const buf = await file.arrayBuffer();
//     const pdf = await pdfjs.getDocument({ data: buf }).promise;
//     const page = await pdf.getPage(1);

//     const viewport = page.getViewport({ scale });
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     canvas.width = Math.floor(viewport.width);
//     canvas.height = Math.floor(viewport.height);

//     await page.render({ canvasContext: ctx, viewport }).promise;
//     return canvas.toDataURL("image/png");
//   } catch {
//     return "";
//   }
// }

// export default function MergePdf() {
//   const navigate = useNavigate();

//   const [items, setItems] = useState([]); // { file, thumb, id }
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");
//   const [dragging, setDragging] = useState(false);

//   const files = useMemo(() => items.map((x) => x.file), [items]);

//   const addPickedFiles = async (fileList) => {
//     setError("");

//     const picked = Array.from(fileList || []).filter((f) => f.type === "application/pdf");
//     if (picked.length === 0) {
//       setError("Please upload PDF files only.");
//       return;
//     }

//     // create items first (so list updates instantly), then hydrate thumbs async
//     const newItems = picked.map((f) => ({
//       id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(16).slice(2)}`,
//       file: f,
//       thumb: ""
//     }));

//     setItems((prev) => [...prev, ...newItems]);

//     // generate thumbs (best-effort) without blocking UI too much
//     for (const it of newItems) {
//       const thumb = await renderThumb(it.file, 0.32);
//       setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, thumb } : p)));
//     }
//   };

//   const onPick = (e) => {
//     addPickedFiles(e.target.files);
//     e.target.value = "";
//   };

//   const onDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(false);
//     addPickedFiles(e.dataTransfer.files);
//   };

//   const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

//   const clear = () => {
//     setItems([]);
//     setError("");
//   };

//   const move = (from, to) => {
//     setItems((prev) => {
//       if (from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
//       const next = [...prev];
//       const [it] = next.splice(from, 1);
//       next.splice(to, 0, it);
//       return next;
//     });
//   };

//   const merge = async () => {
//     setBusy(true);
//     setError("");
//     try {
//       if (files.length < 2) throw new Error("Please add at least 2 PDF files.");

//       const merged = await PDFDocument.create();

//       for (const f of files) {
//         const bytes = await f.arrayBuffer();
//         const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
//         const pages = await merged.copyPages(doc, doc.getPageIndices());
//         pages.forEach((p) => merged.addPage(p));
//       }

//       const outBytes = await merged.save();

//       goToResult(navigate, {
//         slug: "merge-pdf",
//         title: "PDFs have been merged!",
//         fileName: "tryatlabs-merged.pdf",
//         bytes: outBytes
//       });
//     } catch (e) {
//       setError(e?.message || "Failed to merge PDFs.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="tool tool--merge card">
//       <div className="row">
//         <div
//           className={`drop ${dragging ? "isDragging" : ""}`}
//           onDragEnter={() => setDragging(true)}
//           onDragOver={(e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             setDragging(true);
//           }}
//           onDragLeave={() => setDragging(false)}
//           onDrop={onDrop}
//           role="button"
//           tabIndex={0}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" || e.key === " ") {
//               e.currentTarget.querySelector('input[type="file"]')?.click();
//             }
//           }}
//         >
//           <input type="file" accept="application/pdf" multiple onChange={onPick} />
//           <div className="drop__inner">
//             <div className="drop__title">Drop PDFs here or click to upload</div>
//             <div className="muted">Add multiple PDFs. Use ↑ ↓ to set the final order.</div>
//           </div>
//         </div>
//       </div>

//       {items.length > 0 && (
//         <div className="list">
//           {items.map((it, idx) => (
//             <div key={it.id} className="listItem">
//               <div className="fileMain">
//                 <div className="thumb">
//                   {it.thumb ? <img src={it.thumb} alt="PDF preview page 1" /> : <div className="thumb__ph">PDF</div>}
//                 </div>

//                 <div className="fileInfo">
//                   <div className="listItem__title" title={it.file.name}>
//                     {it.file.name}
//                   </div>
//                   <div className="muted">{niceBytes(it.file.size)}</div>
//                 </div>
//               </div>

//               <div className="fileActions">
//                 <button
//                   className="btn btn--ghost"
//                   type="button"
//                   onClick={() => move(idx, idx - 1)}
//                   disabled={busy || idx === 0}
//                   aria-label="Move up"
//                   title="Move up"
//                 >
//                   ↑
//                 </button>
//                 <button
//                   className="btn btn--ghost"
//                   type="button"
//                   onClick={() => move(idx, idx + 1)}
//                   disabled={busy || idx === items.length - 1}
//                   aria-label="Move down"
//                   title="Move down"
//                 >
//                   ↓
//                 </button>
//                 <button className="btn btn--ghost" type="button" onClick={() => remove(it.id)} disabled={busy}>
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {error && <div className="alert alert--danger">{error}</div>}

//       <div className="actions">
//         <button className="btn btn--primary" disabled={busy || items.length < 2} onClick={merge}>
//           {busy ? "Merging..." : "Merge & Continue"}
//         </button>
//         <button className="btn btn--ghost" disabled={busy || items.length === 0} onClick={clear}>
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { niceBytes } from "../shared/fileUi.js";
import { goToResult } from "../shared/goToResult.js";
import "./merge-pdf.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function renderThumb(file, scale = 0.35) {
  try {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL("image/png");
  } catch {
    return "";
  }
}

export default function MergePdf() {
  const navigate = useNavigate();
  const inputRef = useRef(null); // ✅ added

  const [items, setItems] = useState([]); // { file, thumb, id }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const files = useMemo(() => items.map((x) => x.file), [items]);

  const addPickedFiles = async (fileList) => {
    setError("");

    const picked = Array.from(fileList || []).filter((f) => f.type === "application/pdf");
    if (picked.length === 0) {
      setError("Please upload PDF files only.");
      return;
    }

    const newItems = picked.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(16).slice(2)}`,
      file: f,
      thumb: "",
    }));

    setItems((prev) => [...prev, ...newItems]);

    for (const it of newItems) {
      const thumb = await renderThumb(it.file, 0.32);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, thumb } : p)));
    }
  };

  const onPick = (e) => {
    addPickedFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    addPickedFiles(e.dataTransfer.files);
  };

  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const clear = () => {
    setItems([]);
    setError("");
  };

  const move = (from, to) => {
    setItems((prev) => {
      if (from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const merge = async () => {
    setBusy(true);
    setError("");
    try {
      if (files.length < 2) throw new Error("Please add at least 2 PDF files.");

      const merged = await PDFDocument.create();

      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }

      const outBytes = await merged.save();

      goToResult(navigate, {
        slug: "merge-pdf",
        title: "PDFs have been merged!",
        fileName: "tryatlabs-merged.pdf",
        bytes: outBytes,
      });
    } catch (e) {
      setError(e?.message || "Failed to merge PDFs.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool tool--merge card">
      <div className="row">
        <div
          className={`drop ${dragging ? "isDragging" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Upload PDFs"
          onClick={() => inputRef.current?.click()} // ✅ click opens picker always
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click(); // ✅ keyboard opens picker always
            }
          }}
          onDragEnter={() => setDragging(true)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            // ✅ prevents flicker when moving over children
            if (e.currentTarget.contains(e.relatedTarget)) return;
            setDragging(false);
          }}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={onPick}
            style={{ display: "none" }} // ✅ hidden input, we trigger via ref
          />

          <div className="drop__inner">
            <div className="drop__title">Drop PDFs here or click to upload</div>
            <div className="muted">Add multiple PDFs. Use ↑ ↓ to set the final order.</div>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="list">
          {items.map((it, idx) => (
            <div key={it.id} className="listItem">
              <div className="fileMain">
                <div className="thumb">
                  {it.thumb ? <img src={it.thumb} alt="PDF preview page 1" /> : <div className="thumb__ph">PDF</div>}
                </div>

                <div className="fileInfo">
                  <div className="listItem__title" title={it.file.name}>
                    {it.file.name}
                  </div>
                  <div className="muted">{niceBytes(it.file.size)}</div>
                </div>
              </div>

              <div className="fileActions">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => move(idx, idx - 1)}
                  disabled={busy || idx === 0}
                  aria-label="Move up"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => move(idx, idx + 1)}
                  disabled={busy || idx === items.length - 1}
                  aria-label="Move down"
                  title="Move down"
                >
                  ↓
                </button>
                <button className="btn btn--ghost" type="button" onClick={() => remove(it.id)} disabled={busy}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="alert alert--danger">{error}</div>}

      <div className="actions">
        <button className="btn btn--primary" disabled={busy || items.length < 2} onClick={merge}>
          {busy ? "Merging..." : "Merge & Continue"}
        </button>
        <button className="btn btn--ghost" disabled={busy || items.length === 0} onClick={clear}>
          Clear
        </button>
      </div>
    </div>
  );
}
