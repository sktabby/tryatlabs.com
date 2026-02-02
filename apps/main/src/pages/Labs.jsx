import React from "react";
import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Labs() {
  const canonical = `${BRAND.baseUrl}/labs`;

  const highlights = [
    {
      icon: "🧪",
      title: "Experiments",
      text: "Small, focused utilities tested for usability, speed, and clarity.",
      chips: ["Prototype", "UI/UX", "Fast"],
    },
    {
      icon: "⚡",
      title: "Performance-first",
      text: "We prioritize client-side performance and snappy interactions.",
      chips: ["Vite", "Lazy load", "Core Web Vitals"],
    },
    {
      icon: "✅",
      title: "Graduate to Tools",
      text: "Stable experiments move into production subdomains and get polished.",
      chips: ["Quality", "SEO", "Ad-ready"],
    },
  ];

  return (
    <>
      <SeoHead
        title="Labs"
        description="Explore TryAtLabs experiments, prototypes, and validated tool ideas. A focused space for product iteration."
        canonical={canonical}
      />

      <main className="labsPage">
        {/* HERO */}
        <section className="labsHero">
          <div className="container labsHero__inner">
           
            <h1 className="labsTitle">Labs</h1>
            <p className="labsSubtitle">
              Labs is where new utilities are tested before they become stable tools across TryAtLabs
              subdomains. This space is intentionally lightweight, fast, and feedback-driven.
            </p>

            <div className="labsActions">
              <a className="labsBtn labsBtn--primary" href="/tools">
                Explore tools <span className="labsArrow">→</span>
              </a>
              <a className="labsBtn labsBtn--ghost" href="/contact">
                Suggest an idea
              </a>
            </div>

            {/* STATS / CARDS */}
            <div className="labsGrid" role="list">
              {highlights.map((h) => (
                <article className="labsCard" role="listitem" key={h.title}>
                  <div className="labsCard__icon" aria-hidden="true">
                    {h.icon}
                  </div>
                  <h2 className="labsCard__title">{h.title}</h2>
                  <p className="labsCard__text">{h.text}</p>

                  <div className="labsChips" aria-label={`${h.title} tags`}>
                    {h.chips.map((c) => (
                      <span className="labsChip" key={c}>
                        {c}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* CTA PANEL */}
            <div className="labsPanel" role="region" aria-label="Labs call to action">
              <div>
                <div className="labsPanel__title">Have a tool idea?</div>
                <div className="labsPanel__text">
                  If it saves time, improves clarity, and can run privately in-browser — it belongs
                  in Labs.
                </div>
              </div>
              <a className="labsBtn labsBtn--primary" href="/contact">
                Share your idea <span className="labsArrow">→</span>
              </a>
            </div>
          </div>

          {/* Background decoration */}
          <div className="labsBg" aria-hidden="true">
            <div className="labsBg__grid" />
          </div>
        </section>
      </main>

      {/* ✅ Page-scoped premium Labs Dark Glass styling (uses global Labs tokens) */}
      <style>{`
        /* ====== Page wrapper ====== */
        .labsPage{
          width: 100%;
          overflow-x: hidden; /* prevents bg layers causing layout shift */
        }

        /* ====== Hero section ====== */
        .labsHero{
          position: relative;
          padding: 56px 0 84px;
          overflow: hidden;
        }

        .labsHero__inner{
          position: relative;
          z-index: 2;
        }

        /* ====== Top row ====== */
        .labsHero__top{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .labsBadge{
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.05);
          box-shadow: var(--labs-soft);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: .02em;
          color: var(--labs-muted);
        }

        .labsBadge__dot{
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, #fff, var(--labs-accent) 45%, rgba(124,92,255,.2));
          box-shadow: 0 0 0 6px rgba(124,92,255,.12);
          flex: 0 0 auto;
        }

        .labsHint{
          font-size: 13px;
          font-weight: 850;
          color: var(--labs-muted-2);
          letter-spacing: .01em;
        }

        /* ====== Title + subtitle ====== */
        .labsTitle{
          margin: 6px 0 10px;
          font-size: clamp(34px, 4.4vw, 58px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-weight: 1000;
        }

        .labsSubtitle{
          margin: 0;
          max-width: 760px;
          color: var(--labs-muted);
          line-height: 1.65;
          font-size: 15px;
        }

        /* ====== Actions ====== */
        .labsActions{
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .labsBtn{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--btn-radius);
          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.04);
          color: var(--labs-text);
          text-decoration: none;
          font-weight: 950;
          transition: transform .15s ease, background .15s ease, border-color .15s ease, box-shadow .15s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .labsBtn:hover{
          transform: translateY(-1px);
          border-color: var(--labs-border-2);
          background: rgba(255,255,255,.065);
          box-shadow: var(--labs-soft);
        }

        .labsBtn:focus-visible{
          outline: none;
          box-shadow: 0 0 0 4px var(--labs-focus), var(--labs-soft);
        }

        .labsBtn--ghost{
          background: rgba(255,255,255,.03);
        }

        .labsBtn--primary{
          border-color: rgba(124,92,255,.35);
          background: linear-gradient(135deg, rgba(124,92,255,.95), rgba(46,233,166,.52));
          color: #0A0D16;
          box-shadow: 0 18px 40px rgba(124,92,255,.18);
        }

        .labsBtn--primary:hover{
          background: linear-gradient(135deg, rgba(124,92,255,1), rgba(46,233,166,.62));
          box-shadow: 0 18px 55px rgba(124,92,255,.22);
        }

        .labsArrow{
          display: inline-block;
          transform: translateY(0.5px);
          font-weight: 1000;
        }

        /* ====== Grid of cards ====== */
        .labsGrid{
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .labsCard{
          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.045);
          border-radius: var(--labs-radius);
          padding: 18px;
          box-shadow: var(--labs-soft);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease;
          position: relative;
          overflow: hidden;
          min-height: 196px;
        }

        .labsCard::before{
          content: "";
          position: absolute;
          inset: -1px;
          background:
            radial-gradient(520px 220px at 12% 0%, rgba(124,92,255,.14), transparent 60%),
            radial-gradient(520px 220px at 92% 25%, rgba(46,233,166,.09), transparent 60%);
          opacity: .85;
          pointer-events: none;
        }

        .labsCard > *{
          position: relative;
          z-index: 1;
        }

        .labsCard:hover{
          transform: translateY(-2px);
          border-color: var(--labs-border-2);
          background: rgba(255,255,255,.06);
          box-shadow: var(--labs-shadow);
        }

        .labsCard__icon{
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.05);
          box-shadow: var(--labs-soft);
          font-size: 20px;
          margin-bottom: 10px;
        }

        .labsCard__title{
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 950;
          letter-spacing: -0.01em;
        }

        .labsCard__text{
          margin: 0;
          color: var(--labs-muted);
          line-height: 1.6;
          font-size: 14px;
        }

        /* ====== Chips ====== */
        .labsChips{
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        .labsChip{
          font-size: 12px;
          padding: 9px 10px;
          border-radius: 999px;
          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.04);
          color: rgba(255,255,255,.78);
          font-weight: 900;
          letter-spacing: .04em;
        }

        /* ====== CTA Panel ====== */
        .labsPanel{
          margin-top: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px;
          border-radius: calc(var(--labs-radius) + 6px);
          border: 1px solid rgba(124,92,255,.22);
          background: linear-gradient(135deg, rgba(124,92,255,.12), rgba(46,233,166,.06));
          box-shadow: var(--labs-soft);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }

        .labsPanel::before{
          content:"";
          position:absolute;
          inset:-1px;
          pointer-events:none;
          background:
            radial-gradient(600px 260px at 10% 10%, rgba(124,92,255,.22), transparent 65%),
            radial-gradient(600px 260px at 90% 30%, rgba(46,233,166,.14), transparent 65%);
          opacity:.8;
        }

        .labsPanel > *{
          position: relative;
          z-index: 1;
        }

        .labsPanel__title{
          font-weight: 1000;
          letter-spacing: -0.01em;
          margin-bottom: 6px;
          font-size: 16px;
        }

        .labsPanel__text{
          color: var(--labs-muted);
          font-size: 14px;
          line-height: 1.6;
          max-width: 680px;
        }

        /* ====== Background decoration ====== */
        .labsBg{
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        /* glow orbs behind */
        .labsBg::before{
          content:"";
          position:absolute;
          inset: 0;
          background:
            radial-gradient(circle at 12% 10%, rgba(124,92,255,.28), transparent 55%),
            radial-gradient(circle at 88% 14%, rgba(46,233,166,.18), transparent 55%);
          filter: blur(22px);
          opacity: .55;
        }

        /* grid overlay */
        .labsBg__grid{
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size: 42px 42px;
          opacity: .14;
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,.85) 0%, rgba(0,0,0,0) 70%);
        }

        /* ====== Responsive ====== */
        @media (max-width: 980px){
          .labsGrid{
            grid-template-columns: 1fr;
          }
          .labsPanel{
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 520px){
          .labsHero{
            padding: 44px 0 64px;
          }
          .labsBtn{
            width: 100%;
          }
          .labsCard{
            padding: 16px;
            border-radius: 18px;
          }
        }
      `}</style>
    </>
  );
}
