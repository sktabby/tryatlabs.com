export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footerStatic" aria-label="PDF tools footer">
      <div className="container footerStatic__inner">
        {/* Left content */}
        <div className="footerStatic__content">
          <div className="footerStatic__title">TryAtLabs PDF Tools</div>

          <p className="footerStatic__desc">
            This section provides fast, privacy-first PDF utilities that run completely
            in your browser. Files are processed locally on your device and are never
            uploaded to any server.
          </p>

          <p className="footerStatic__desc">
            Use these tools to merge, split, compress, convert, and organize PDFs
            securely with a clean, distraction-free interface.
          </p>

          <p className="footerStatic__copy muted">
            © {year} TryAtLabs. All rights reserved. ·{" "}
            <a
              href="https://tryatlabs.com"
              target="_blank"
              rel="noreferrer"
              className="footerStatic__link"
            >
              Visit TryAtLabs
            </a>
          </p>
        </div>

        {/* Right actions */}
        <div className="footerStatic__actions">
          <button
            className="footerStatic__topBtn"
            onClick={backToTop}
            aria-label="Back to top"
            type="button"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      {/* Scoped styles only for footer */}
      <style>{`
        .footerStatic {
          border-top: 1px solid var(--border);
          background: color-mix(in srgb, var(--card) 94%, transparent);
          padding: 32px 0 36px;
        }

        .footerStatic__inner {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          flex-wrap: wrap;
        }

        .footerStatic__content {
          max-width: 62ch;
        }

        .footerStatic__title {
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .footerStatic__desc {
          margin-top: 8px;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 700;
          color: var(--muted);
        }

        .footerStatic__copy {
          margin-top: 14px;
          font-size: 13px;
          font-weight: 700;
        }

        .footerStatic__link {
          font-weight: 900;
          color: var(--text);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .footerStatic__actions {
          display: flex;
          align-items: flex-start;
        }

        .footerStatic__topBtn {
          border: 1px solid var(--border);
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--p4) 55%, var(--card)),
            color-mix(in srgb, var(--p5) 55%, var(--card))
          );
          color: #0c1222;
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 16px 40px rgba(17, 24, 39, 0.12);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
          white-space: nowrap;
        }

        .footerStatic__topBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 48px rgba(17, 24, 39, 0.18);
        }

        @media (max-width: 720px) {
          .footerStatic__actions {
            width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}
