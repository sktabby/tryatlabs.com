// src/pages/Contact.jsx
import { SeoHead } from "../seo/SeoHead.jsx";
import { SITE } from "../app/site.config.js";

export default function Contact() {
  return (
    <>
      <SeoHead
        title={`Contact — ${SITE.name}`}
        description="Contact TryAtLabs PDF for feedback, support, or partnerships."
        canonical={`${SITE.url}/contact`}
      />

      <section className="section contactPage">
        <div className="section__head">
          <h1>Contact</h1>
        
        </div>

        <div className="card contactCard">
          <p className="contactIntro">
            The easiest way to reach us is email. We personally read every message.
          </p>

          <div className="contactGrid">
            <div className="contactBlock">
              <div className="contactLabel">Email</div>
              <a
                className="contactValue"
                href="mailto:tryatlabs@gmail.com"
              >
                tryatlabs@gmail.com
              </a>
            </div>

            <div className="contactBlock">
              <div className="contactLabel">Main Website</div>
              <a
                className="contactValue"
                href="https://tryatlabs.com"
                target="_blank"
                rel="noreferrer"
              >
                tryatlabs.com
              </a>
            </div>
          </div>

          <div className="contactUse">
            <div className="contactLabel">Best for</div>
            <ul>
              <li>Feature requests & feedback</li>
              <li>Bug reports (mention tool name)</li>
              <li>Partnerships & collaborations</li>
            </ul>
          </div>

          <div className="contactNote">
            <strong>Privacy-first note</strong>
            <p>
              Our PDF tools run fully in your browser. Please avoid emailing
              sensitive documents unless requested.
            </p>
          </div>

          <div className="actions contactActions">
            <a className="btn btn--primary" href="mailto:tryatlabs@gmail.com">
              Email us
            </a>
            <a
              className="btn btn--ghost"
              href="https://tryatlabs.com"
              target="_blank"
              rel="noreferrer"
            >
              Visit main site
            </a>
          </div>

          <p className="contactFooter muted">
            Typical response time: 24–48 hours.
          </p>
        </div>
      </section>

      {/* ✅ Page-scoped CSS */}
      <style>{`
        .contactPage {
          max-width: 780px;
        }

        .contactCard {
          padding: 22px;
        }

        .contactIntro {
          font-size: 15px;
          line-height: 1.6;
          margin-top: 0;
        }

        .contactGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-top: 18px;
        }

        .contactBlock {
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px;
          background: color-mix(in srgb, var(--card) 95%, transparent);
        }

        .contactLabel {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .contactValue {
          display: inline-block;
          margin-top: 6px;
          font-weight: 950;
          font-size: 16px;
          color: var(--text);
        }

        .contactUse {
          margin-top: 18px;
        }

        .contactUse ul {
          margin: 10px 0 0;
          padding-left: 18px;
          line-height: 1.6;
        }

        .contactNote {
          margin-top: 18px;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px;
          background: color-mix(in srgb, var(--p4) 22%, transparent);
        }

        .contactNote strong {
          display: block;
          font-weight: 950;
          margin-bottom: 6px;
        }

        .contactNote p {
          margin: 0;
          font-size: 14px;
          color: var(--muted);
        }

        .contactActions {
          margin-top: 18px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .contactFooter {
          margin-top: 14px;
          margin-bottom: 0;
          font-size: 13px;
        }

        @media (max-width: 640px) {
          .contactGrid {
            grid-template-columns: 1fr;
          }

          .contactActions .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
