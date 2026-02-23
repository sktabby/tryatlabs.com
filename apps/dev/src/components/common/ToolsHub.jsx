import React from "react";

const HUB_LINKS = [
  { label: "Main Site", href: "https://tryatlabs.com", desc: "Home + ecosystem" },
  { label: "Text Tools", href: "https://text.tryatlabs.com", desc: "Writing + formatting tools" },
  { label: "PDF Tools", href: "https://pdf.tryatlabs.com", desc: "Compress, merge, split PDFs" },
  { label: "Image Tools", href: "https://image.tryatlabs.com", desc: "Resize, crop, convert images" },
  { label: "Dev Tools", href: "https://dev.tryatlabs.com", desc: "Developer utilities" },
];

export default function ToolsHub({ title = "Explore the TryAtLabs Ecosystem" }) {
  return (
    <section className="hubSection" aria-label="TryAtLabs tools hub">
      <div className="hubCard">
        <div className="hubTop">
          <h2 className="hubTitle">{title}</h2>
          <p className="hubDesc">
            Jump across our tool suites!
          </p>
        </div>

        <div className="hubGrid">
          {HUB_LINKS.map((x) => (
            <a
              key={x.href}
              className="hubItem"
              href={x.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="hubItemTitle">{x.label}</div>
              <div className="hubItemDesc">{x.desc}</div>
              <div className="hubItemGo">
                Open <span className="hubArrow">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .hubSection{ margin-top: 18px; }
        .hubCard{
          border:1px solid var(--border);
          border-radius: 20px;
          background: color-mix(in srgb, var(--card) 86%, transparent);
          box-shadow: var(--shadow2);
          padding: 14px;
          overflow:hidden;
          position:relative;
        }
        .hubCard:before{
          content:"";
          position:absolute; inset:-2px;
          background: radial-gradient(520px 200px at 15% 0%, rgba(121,78,230,0.18), transparent 60%),
                      radial-gradient(520px 200px at 90% 10%, rgba(99,64,188,0.16), transparent 62%);
          pointer-events:none;
        }
        .hubTop{ position:relative; margin-bottom: 12px; }
        .hubTitle{ margin: 0 0 6px; font-size: 18px; letter-spacing: -0.2px; }
        .hubDesc{ margin: 0; color: var(--muted); }

        .hubGrid{
          position:relative;
          display:grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        @media (max-width: 980px){ .hubGrid{ grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px){ .hubGrid{ grid-template-columns: 1fr; } }

        .hubItem{
          border:1px solid var(--border);
          border-radius: 18px;
          background: color-mix(in srgb, var(--card) 88%, transparent);
          padding: 12px;
          transition: transform .15s ease, border-color .15s ease;
        }
        .hubItem:hover{
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--p2) 45%, var(--border));
        }
        .hubItemTitle{ font-weight: 950; }
        .hubItemDesc{ margin-top: 6px; color: var(--muted); font-size: 12px; }
        .hubItemGo{ margin-top: 10px; font-weight: 950; color: rgba(255,255,255,0.85); }
        .hubArrow{ font-weight: 950; }
      `}</style>
    </section>
  );
}
