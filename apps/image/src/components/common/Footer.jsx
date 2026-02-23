import React from "react";
import { SITE } from "../../app/site.config.js";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const brandName = SITE.brand?.name || "TryAtLabs";
  const brandTagline = SITE.brand?.tagline || "Privacy-first tools that run in your browser.";
  const brandUrl = SITE.url || "https://tryatlabs.com";

  return (
    <footer className="ft">
      <style>{`
        .ft{
          padding: 46px 0 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          background:
            radial-gradient(900px 340px at 20% 0%, rgba(79,195,247,0.06), transparent 60%),
            rgba(255,255,255,0.02);
        }
        .ftGrid{
          display:grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 26px;
          align-items:start;
        }
        .ftBrand{
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.01em;
        }
        .ftDesc{
          margin-top: 10px;
          max-width: 560px;
          font-size: 13.5px;
          line-height: 1.7;
          color: var(--muted);
        }
        .ftSection{
          margin-top: 18px;
          display:grid;
          gap: 8px;
        }
        .ftLabel{
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .ftText{
          font-size: 13px;
          line-height: 1.6;
          color: var(--text);
          opacity: 0.92;
        }
        .ftContactRow{
          display:flex;
          gap: 10px;
          font-size: 13px;
          line-height: 1.5;
          word-break: break-word;
          align-items: center;
        }
        .ftLink{
          color: inherit;
          text-decoration: none;
          opacity: 0.92;
        }
        .ftLink:hover{
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .ftTopBtn{
          margin-top: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: inherit;
          cursor:pointer;
          transition: transform 120ms ease, background 120ms ease;
          width: fit-content;
        }
        .ftTopBtn:hover{
          background: rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }
        .ftRight{
          display:grid;
          gap: 14px;
          justify-items:end;
        }
        .ftCard{
          width: 100%;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.03);
          box-shadow: 0 16px 40px rgba(0,0,0,0.25);
        }
        .ftPills{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          margin-top: 10px;
        }
        .ftPill{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          font-size: 13px;
          font-weight: 800;
          color: inherit;
          text-decoration:none;
          transition: transform 120ms ease, background 120ms ease, border 120ms ease;
          flex: 0 0 auto;
        }
        .ftPill:hover{
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.20);
          transform: translateY(-1px);
        }
        .ftBottom{
          margin-top: 22px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display:flex;
          justify-content:space-between;
          gap: 12px;
          font-size: 12px;
          color: var(--muted);
          opacity: 0.85;
          flex-wrap: wrap;
        }
        @media (max-width: 900px){
          .ftGrid{ grid-template-columns: 1fr; }
          .ftRight{ justify-items:start; }
        }
        @media (max-width: 520px){
          .ftPill{ flex: 1 1 auto; justify-content:center; }
          .ftTopBtn{ width: 100%; }
        }
      `}</style>

      <div className="container">
        <div className="ftGrid">
          <div>
            <div className="ftBrand">{brandName}</div>

            <div className="ftDesc">
              {brandTagline}{" "}
              TryAtLabs is a fast, privacy-first platform built to handle everyday digital tasks directly
              in your browser. No sign-ups, no downloads — just clean tools that work instantly on desktop
              and mobile.
            </div>

            <div className="ftSection">
              <div className="ftLabel">Privacy</div>
              <div className="ftText">
                Most tools run locally in your browser. Your content is not stored or tracked unless explicitly stated.
              </div>
            </div>

            <div className="ftSection">
              <div className="ftLabel">Terms</div>
              <div className="ftText">
                Tools are provided as-is for general utility purposes. Users are responsible for how outputs are used.
              </div>
            </div>

            <div className="ftSection">
              <div className="ftLabel">Contact</div>

              <div className="ftContactRow">
                <span>📧</span>
                <a className="ftLink" href="mailto:contact@tryatlabs.com">
                  contact@tryatlabs.com
                </a>
              </div>

              <div className="ftContactRow">
                <span>🌐</span>
                <a className="ftLink" href={brandUrl} target="_blank" rel="noreferrer">
                  tryatlabs.com
                </a>
              </div>

              <button className="ftTopBtn" onClick={scrollTop}>
                ↑ Back to top
              </button>
            </div>
          </div>

          <div className="ftRight">
            <div className="ftCard">
              <div className="ftLabel">Social</div>
              <div className="ftPills">
                <a
                  className="ftPill"
                  href="https://www.instagram.com/ataminds?igsh=MWxzam90a2xoZTd5dg=="
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon /> Instagram
                </a>

                <a
                  className="ftPill"
                  href="https://youtube.com/@ataminds?si=5oP1fxznhvHj03FD"
                  target="_blank"
                  rel="noreferrer"
                >
                  <YouTubeIcon /> YouTube
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="ftBottom">
          <div>© {new Date().getFullYear()} tryatlabs.com. All rights reserved.</div>
          <div style={{ opacity: 0.9 }}>Built by ATA Minds</div>
        </div>
      </div>
    </footer>
  );
}

/* Icons */
function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M23.498 6.186a2.958 2.958 0 00-2.08-2.093C19.584 3.5 12 3.5 12 3.5s-7.584 0-9.418.593A2.958 2.958 0 00.502 6.186C0 8.028 0 12 0 12s0 3.972.502 5.814a2.958 2.958 0 002.08 2.093C4.416 20.5 12 20.5 12 20.5s7.584 0 9.418-.593a2.958 2.958 0 002.08-2.093C24 15.972 24 12 24 12s0-3.972-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.75 15.02L15.5 12 9.75 8.98v6.04z" fill="#fff" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 2.5h9A5 5 0 0 1 21.5 7.5v9a5 5 0 0 1-5 5h-9a5 5 0 0 1-5-5v-9a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M17.6 6.7h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
