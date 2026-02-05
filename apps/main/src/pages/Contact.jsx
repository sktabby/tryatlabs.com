import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Contact() {
  const canonical = `${BRAND.baseUrl}/contact`;

  return (
    <>
      <SeoHead
        title="Contact"
        description="Contact TryAtLabs for partnerships, feedback, or collaboration."
        canonical={canonical}
      />

      <section className="section">
        <style>{`
          .contactWrap{
            max-width: 720px;
            margin: 0 auto;
            padding: 56px 0;
            text-align: center;
          }

          .contactTitle{
            margin: 0 0 12px;
            font-size: clamp(28px, 4vw, 44px);
            line-height: 1.05;
            letter-spacing: -0.03em;
            font-weight: 1000;
          }

          .contactDesc{
            margin: 0 auto 22px;
            max-width: 60ch;
            line-height: 1.6;
          }

          .emailCard{
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 18px;
            border: 1px solid var(--labs-border);
            background: rgba(255,255,255,.045);
            box-shadow: var(--labs-soft);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            font-weight: 900;
            letter-spacing: -0.01em;
          }

          .emailCard svg{
            width: 18px;
            height: 18px;
            stroke: rgba(255,255,255,.86);
            stroke-width: 1.8;
            fill: none;
          }

          .hint{
            margin-top: 14px;
            font-size: 13px;
            color: var(--labs-muted);
          }
        `}</style>

        <div className="container contactWrap">
          <div className="pill" style={{ margin: "0 auto 14px", width: "fit-content" }}>
            Get in touch
          </div>

          <h1 className="contactTitle">
            Contact <span style={{ color: "var(--brand)" }}>TryAtLabs</span>
          </h1>

          <p className="muted contactDesc">
            For partnerships, feedback, or collaboration — just drop us an email.
          </p>

          <a
            href="mailto:tryatlabs@gmail.com"
            className="emailCard"
            aria-label="Email TryAtLabs"
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 6h16v12H4z" />
              <path d="M4 7l8 6 8-6" />
            </svg>
            tryatlabs@gmail.com
          </a>

          <div className="hint">
            We usually reply within 24–48 hours.
          </div>
        </div>
      </section>
    </>
  );
}
