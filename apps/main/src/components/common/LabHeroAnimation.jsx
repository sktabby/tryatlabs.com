export default function LabHeroAnimation() {
  return (
    <div
      className="labCleanMount"
      aria-hidden="true"
      style={{
        width: "100%",
        maxWidth: 560,
        height: 360,
        position: "relative",
        display: "block",
        isolation: "isolate"
      }}
    >
      <style>{`
        .labClean {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(2, 24, 44, 0.10);
          background:
            radial-gradient(820px 420px at 20% 10%, rgba(79,195,247,0.10), transparent 55%),
            radial-gradient(760px 420px at 85% 10%, rgba(167,139,250,0.08), transparent 55%),
            radial-gradient(680px 420px at 55% 95%, rgba(255,99,97,0.05), transparent 55%),
            #ffffff;
          box-shadow: 0 18px 40px rgba(0,0,0,0.08);
        }

        /* soft grid (lab table blueprint vibe) */
        .labClean::before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(rgba(2,24,44,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(2,24,44,0.03) 1px, transparent 1px);
          background-size: 34px 34px;
          opacity: 0.55;
          pointer-events:none;
        }

        /* subtle top vignette */
        .labClean::after{
          content:"";
          position:absolute;
          inset:0;
          background:
            radial-gradient(900px 460px at 50% 0%, rgba(2,24,44,0.06), transparent 55%);
          pointer-events:none;
        }

        .labSVG{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
        }

        /* --- floating flasks --- */
        .flask{
          filter: drop-shadow(0 10px 18px rgba(0,0,0,0.08));
        }

        .floatA{ animation: floatA 7.2s ease-in-out infinite; }
        .floatB{ animation: floatB 8.0s ease-in-out infinite; }
        .floatC{ animation: floatC 7.6s ease-in-out infinite; }
        .floatD{ animation: floatD 8.4s ease-in-out infinite; }

        @keyframes floatA{
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(0,-10px); }
        }
        @keyframes floatB{
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(-8px,-12px); }
        }
        @keyframes floatC{
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(10px,-10px); }
        }
        @keyframes floatD{
          0%,100%{ transform: translate(0,0); }
          50%{ transform: translate(-6px,-8px); }
        }

        /* --- liquid gentle movement --- */
        .liqPulse{ animation: liqPulse 3.6s ease-in-out infinite; transform-origin:center; }
        @keyframes liqPulse{
          0%,100%{ transform: translateY(0) scaleY(1); opacity: 0.92; }
          50%{ transform: translateY(-2px) scaleY(1.03); opacity: 1; }
        }

        /* --- conversion beam --- */
        .beam{
          stroke-dasharray: 10 14;
          animation: beamFlow 1.4s linear infinite;
          opacity: 0.9;
        }
        @keyframes beamFlow{
          to{ stroke-dashoffset: -24; }
        }

        /* --- particles moving along beam --- */
        .spark{
          animation: sparkMove 1.8s linear infinite;
          opacity: 0.8;
        }
        .spark.s2{ animation-delay: 0.55s; opacity: 0.65; }
        .spark.s3{ animation-delay: 1.05s; opacity: 0.55; }

        @keyframes sparkMove{
          0%{ transform: translate(0,0); opacity: 0; }
          20%{ opacity: 0.9; }
          100%{ transform: translate(240px, -40px); opacity: 0; }
        }

        /* --- PDF badge --- */
        .badge{
          font: 800 12px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
          letter-spacing: 0.4px;
        }

        .badgeWrap{
          filter: drop-shadow(0 10px 16px rgba(0,0,0,0.10));
          animation: badgeFloat 6.8s ease-in-out infinite;
          transform-origin:center;
        }
        @keyframes badgeFloat{
          0%,100%{ transform: translateY(0); }
          50%{ transform: translateY(-8px); }
        }

        /* accessibility */
        @media (prefers-reduced-motion: reduce){
          .floatA,.floatB,.floatC,.floatD,
          .liqPulse,.beam,.spark,.badgeWrap{
            animation: none !important;
          }
        }
      `}</style>

      <div className="labClean">
        <svg className="labSVG" viewBox="0 0 900 560" role="img" aria-label="Clean lab animation converting PDF">
          <defs>
            {/* glass gradient */}
            <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.90)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.30)" />
            </linearGradient>

            {/* outlines */}
            <linearGradient id="outlineG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(2,24,44,0.18)" />
              <stop offset="100%" stopColor="rgba(2,24,44,0.10)" />
            </linearGradient>

            {/* liquids */}
            <linearGradient id="liqCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(79,195,247,0.48)" />
              <stop offset="100%" stopColor="rgba(79,195,247,0.22)" />
            </linearGradient>

            <linearGradient id="liqViolet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(167,139,250,0.42)" />
              <stop offset="100%" stopColor="rgba(167,139,250,0.20)" />
            </linearGradient>

            <linearGradient id="liqWarm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,99,97,0.28)" />
              <stop offset="100%" stopColor="rgba(255,99,97,0.14)" />
            </linearGradient>

            {/* beam gradient */}
            <linearGradient id="beamG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(79,195,247,0.00)" />
              <stop offset="25%" stopColor="rgba(79,195,247,0.55)" />
              <stop offset="55%" stopColor="rgba(167,139,250,0.50)" />
              <stop offset="100%" stopColor="rgba(255,99,97,0.00)" />
            </linearGradient>

            {/* soft glow */}
            <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* "desk" baseline */}
          <path d="M0 455 C220 430, 680 430, 900 455" fill="rgba(2,24,44,0.05)" />

          {/* PDF badge */}
          <g className="badgeWrap" transform="translate(95 120)">
            <rect x="0" y="0" width="92" height="34" rx="10" fill="rgba(2,24,44,0.06)" stroke="rgba(2,24,44,0.10)"/>
            <circle cx="18" cy="17" r="7" fill="rgba(255,99,97,0.22)" />
            <text x="34" y="22" className="badge" fill="rgba(2,24,44,0.80)">PDF</text>
          </g>

          {/* Conversion beam (from PDF badge towards right flask) */}
          <path
            className="beam"
            d="M185 137 C270 118, 360 118, 430 145"
            stroke="url(#beamG)"
            strokeWidth="4"
            fill="none"
            filter="url(#soft)"
          />

          {/* Sparks moving along beam (fake motion by translate) */}
          <g className="spark" transform="translate(185 137)">
            <circle cx="0" cy="0" r="4" fill="rgba(79,195,247,0.55)" filter="url(#soft)"/>
            <circle cx="-10" cy="6" r="2.5" fill="rgba(167,139,250,0.35)" />
          </g>
          <g className="spark s2" transform="translate(185 137)">
            <circle cx="0" cy="0" r="3.2" fill="rgba(167,139,250,0.45)" filter="url(#soft)"/>
            <circle cx="-8" cy="5" r="2.2" fill="rgba(255,99,97,0.25)" />
          </g>
          <g className="spark s3" transform="translate(185 137)">
            <circle cx="0" cy="0" r="3.6" fill="rgba(255,99,97,0.30)" filter="url(#soft)"/>
            <circle cx="-9" cy="5" r="2.4" fill="rgba(79,195,247,0.25)" />
          </g>

          {/* Flask 1 (left) */}
          <g className="flask floatA" transform="translate(120 230)">
            <path d="M70 0 h40 v90 c0 14 48 38 62 88 c12 44-18 80-82 80 s-94-36-82-80 c14-50 62-74 62-88z"
              fill="url(#glassG)" stroke="url(#outlineG)" strokeWidth="2"/>
            <path className="liqPulse" d="M38 166 c26 24 118 24 144 0 c2 44-22 70-72 70 s-74-26-72-70z"
              fill="url(#liqCyan)" />
            <path d="M86 12 h10 v74 c0 16 40 36 52 74" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* Flask 2 (center small beaker) */}
          <g className="flask floatD" transform="translate(380 280)">
            <path d="M55 10 h70 v170 c0 38-26 64-70 64s-70-26-70-64V10z"
              fill="url(#glassG)" stroke="url(#outlineG)" strokeWidth="2"/>
            <path className="liqPulse" d="M18 170 c18 16 74 16 92 0 c2 34-16 54-46 54s-48-20-46-54z"
              fill="url(#liqWarm)" />
            <path d="M70 26 v128" stroke="rgba(255,255,255,0.50)" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* Flask 3 (right - "output") */}
          <g className="flask floatB" transform="translate(520 200)">
            <path d="M68 0 h44 v98 c0 16 56 42 72 98 c14 48-20 88-94 88s-108-40-94-88 c16-56 72-82 72-98z"
              fill="url(#glassG)" stroke="url(#outlineG)" strokeWidth="2"/>
            <path className="liqPulse" d="M40 182 c28 26 130 26 158 0 c2 48-26 78-79 78s-81-30-79-78z"
              fill="url(#liqViolet)" />
            <path d="M92 12 h12 v80 c0 16 46 40 60 82" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* Small floating flask 4 (top-right) */}
          <g className="flask floatC" transform="translate(690 110) scale(0.82)">
            <path d="M70 0 h40 v90 c0 14 48 38 62 88 c12 44-18 80-82 80 s-94-36-82-80 c14-50 62-74 62-88z"
              fill="url(#glassG)" stroke="url(#outlineG)" strokeWidth="2"/>
            <path className="liqPulse" d="M38 166 c26 24 118 24 144 0 c2 44-22 70-72 70s-74-26-72-70z"
              fill="url(#liqCyan)" />
          </g>

          {/* Output badge (clean, not noisy) */}
          <g transform="translate(700 420)">
            <rect x="0" y="0" width="140" height="36" rx="12" fill="rgba(2,24,44,0.05)" stroke="rgba(2,24,44,0.10)"/>
            <circle cx="18" cy="18" r="7" fill="rgba(79,195,247,0.22)" />
            <text x="34" y="23" className="badge" fill="rgba(2,24,44,0.78)">Converted Output</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
