import React from "react";
import ToolsHub from "../components/common/ToolsHub.jsx";

export default function Contact() {
  return (
    <main className="contactPage">
      <section className="contactWrap">

        <header className="contactHeader">
          <h1 className="contactTitle">Contact TryAtLabs</h1>
          <p className="contactLead">
            If you're planning a custom development project, performance upgrade,
            or internal tool build, feel free to reach out. Share your requirements,
            your current setup, and what you're trying to achieve — we’ll guide you
            through the next steps clearly and practically.
          </p>
        </header>

        <section className="contactGrid">

          <article className="panel">
            <h2 className="panelTitle">Direct Contact</h2>
            <p className="panelText">
              The easiest way to connect with us is via email. Send a short overview
              of your project, expected outcomes, and any technical constraints.
              If you're unsure about scope, simply describe the problem — we’ll help
              you structure it.
            </p>

            <div className="infoList">
              <div className="infoRow">
                <div className="infoK mono">Email</div>
                <div className="infoV">
                  <a className="link" href="mailto:tryatlabs@gmail.com">
                    tryatlabs@gmail.com
                  </a>
                  <div className="hint">
                    Best for technical discussions, requirements, and collaboration.
                  </div>
                </div>
              </div>

              <div className="infoRow">
                <div className="infoK mono">Focus</div>
                <div className="infoV">
                  <span>Web Development & Engineering</span>
                  <div className="hint">
                    UI systems, internal tools, optimization, and structured builds.
                  </div>
                </div>
              </div>

              <div className="infoRow">
                <div className="infoK mono">Website</div>
                <div className="infoV">
                  <a
                    className="link"
                    href="https://tryatlabs.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    tryatlabs.com
                  </a>
                  <div className="hint">
                    Portfolio and project references.
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="panel">
            <h2 className="panelTitle">What to Include</h2>
            <p className="panelText">
              A clear technical brief helps us respond accurately. Consider including:
            </p>

            <div className="check">
              <div className="checkItem">
                <div className="dot" />
                <div className="checkText">
                  <strong>Objective:</strong> What outcome are you targeting?
                </div>
              </div>

              <div className="checkItem">
                <div className="dot" />
                <div className="checkText">
                  <strong>Users:</strong> Who will interact with the system?
                </div>
              </div>

              <div className="checkItem">
                <div className="dot" />
                <div className="checkText">
                  <strong>Inputs & Outputs:</strong> Sample data and expected format.
                </div>
              </div>

              <div className="checkItem">
                <div className="dot" />
                <div className="checkText">
                  <strong>Constraints:</strong> Device targets, performance needs, or deadlines.
                </div>
              </div>
            </div>
          </article>

          <article className="panel wide">
            <h2 className="panelTitle">Services We Deliver</h2>
            <p className="panelText">
              We build structured, maintainable web systems with attention to performance
              and long-term clarity. Engagements typically include:
            </p>

            <div className="serviceGrid">

              <div className="svc">
                <div className="svcT">Frontend Engineering</div>
                <div className="svcD">
                  Clean component architecture, responsive layouts,
                  and consistent interaction systems.
                </div>
              </div>

              <div className="svc">
                <div className="svcT">Custom Tool Development</div>
                <div className="svcD">
                  Purpose-built utilities aligned with your workflow.
                </div>
              </div>

              <div className="svc">
                <div className="svcT">Performance Refinement</div>
                <div className="svcD">
                  Load optimization, runtime improvements, and system cleanup.
                </div>
              </div>

              <div className="svc">
                <div className="svcT">Technical Guidance</div>
                <div className="svcD">
                  Architecture advice and structured growth planning.
                </div>
              </div>

            </div>
          </article>

        </section>
      </section>

      <ToolsHub />

      <style>{`
        .contactPage{
          max-width: var(--max);
          margin: 0 auto;
          padding: 22px 16px 54px;
        }

        .contactWrap{ display:grid; gap: 18px; }

        .contactHeader{
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card2);
          padding: 18px;
        }

        .contactTitle{
          margin: 0 0 6px;
          font-size: clamp(22px, 3vw, 34px);
          font-weight: 600;
          letter-spacing: -0.3px;
        }

        .contactLead{
          margin: 0;
          color: var(--muted);
          font-weight: 500;
          line-height: 1.6;
          max-width: 85ch;
        }

        .contactGrid{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items:start;
        }

        .panel{
          border: 1px solid var(--border);
          border-radius: 22px;
          background: var(--card2);
          padding: 16px;
        }

        .wide{ grid-column: 1 / -1; }

        .panelTitle{
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .panelText{
          margin: 0 0 12px;
          color: var(--muted);
          font-weight: 500;
          line-height: 1.6;
        }

        .infoList{ display:grid; gap: 10px; }

        .infoRow{
          display:grid;
          grid-template-columns: 100px 1fr;
          gap: 12px;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: var(--card);
        }

        .infoK{
          font-weight: 500;
          font-size: 12px;
          letter-spacing: .06em;
          color: rgba(255,255,255,0.75);
        }

        .infoV{ display:grid; gap: 4px; }

        .hint{
          color: var(--faint);
          font-weight: 500;
          font-size: 12px;
        }

        .link{
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }

        .link:hover{
          border-bottom-color: var(--p2);
        }

        .check{ display:grid; gap: 10px; }

        .checkItem{
          display:flex;
          gap: 10px;
          align-items:flex-start;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: var(--card);
        }

        .dot{
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--p2);
          margin-top: 6px;
          flex: 0 0 auto;
        }

        .checkText{
          color: var(--muted);
          font-weight: 500;
          line-height: 1.5;
        }

        .serviceGrid{
          display:grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 6px;
        }

        .svc{
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.08);
          background: var(--card);
          padding: 12px;
        }

        .svcT{ font-weight: 600; }
        .svcD{
          margin-top: 6px;
          color: var(--muted);
          font-weight: 500;
          line-height: 1.5;
        }

        @media (max-width: 980px){
          .contactGrid{ grid-template-columns: 1fr; }
          .serviceGrid{ grid-template-columns: 1fr; }
          .infoRow{ grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}