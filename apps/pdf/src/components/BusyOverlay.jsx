// src/components/BusyOverlay.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_TIPS = [
    "Working locally in your browser — your file never leaves your device.",
    "Bigger PDFs take longer. We’re optimizing pages one by one.",
    "Tip: If a PDF is scanned, it may take extra time to rebuild.",
    "Almost there — preparing the final output for download.",
];

function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

export default function BusyOverlay({
    open,
    title = "Processing your PDF",
    subtitle = "Please keep this tab open.",
    tips = DEFAULT_TIPS,
    stepLabel = "Working…",
}) {
    const [pct, setPct] = useState(0);
    const [tipIdx, setTipIdx] = useState(0);

    const wasOpenRef = useRef(false);
    const finishTimerRef = useRef(null);

    const safeTips = useMemo(
        () => (Array.isArray(tips) && tips.length ? tips : DEFAULT_TIPS),
        [tips]
    );

    useEffect(() => {
        if (open && !wasOpenRef.current) {
            wasOpenRef.current = true;
            setPct(0);
            setTipIdx(0);
        }

        if (open) {
            let raf = 0;
            let last = performance.now();

            const tick = (t) => {
                const dt = t - last;
                last = t;

                setPct((p) => {
                    const target = p < 75 ? 78 : 92;
                    const speed = p < 75 ? 0.08 : 0.02;
                    return clamp(p + dt * speed, 0, target);
                });

                raf = requestAnimationFrame(tick);
            };

            raf = requestAnimationFrame(tick);

            const tipTimer = setInterval(() => {
                setTipIdx((i) => (i + 1) % safeTips.length);
            }, 2400);

            return () => {
                cancelAnimationFrame(raf);
                clearInterval(tipTimer);
            };
        }
    }, [open, safeTips.length]);

    // finish to 100% before closing
    useEffect(() => {
        if (!open && wasOpenRef.current) {
            if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
            setPct(100);

            finishTimerRef.current = setTimeout(() => {
                wasOpenRef.current = false;
                setPct(0);
            }, 240);
        }

        return () => {
            if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
        };
    }, [open]);

    const visible = open || wasOpenRef.current;
    if (!visible) return null;

    const isFinishing = !open && wasOpenRef.current;

    return (
        <div className={`busyOverlay ${isFinishing ? "isFinishing" : ""}`}>
            <div className="busyOverlay__panel">
                <div className="busyOverlay__glow" />

                <div className="busyOverlay__top">
                    <div className="busyOverlay__kicker">
                        <span className="busyOverlay__dot" />
                        {stepLabel}
                    </div>

                    <h2 className="busyOverlay__title">{title}</h2>
                    <p className="busyOverlay__sub">{subtitle}</p>
                </div>

                <div className="busyOverlay__meter">
                    <div className="busyOverlay__bar">
                        <div className="busyOverlay__fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="busyOverlay__meta">
                        <span className="busyOverlay__pct">{Math.round(pct)}%</span>
                        <span className="busyOverlay__hint">{isFinishing ? "Done" : "Please wait"}</span>
                    </div>
                </div>

                <div className="busyOverlay__tip">
                    <div className="busyOverlay__tipText">{safeTips[tipIdx]}</div>
                </div>

                <div className="busyOverlay__dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
            </div>

            <style>{`
    .busyOverlay{
  position: fixed;
  inset: 10px;              /* ✅ makes space around edges */
  border-radius: 22px;      /* ✅ rounded overlay */
  overflow: hidden;         /* ✅ clip overlay edges */
  z-index: 2147483000;
  display: grid;
  place-items: center;
  padding: 18px;

  background: rgba(0,0,0,0.32); /* (or your rgba) */
}


/* also kill blur on every child */
.busyOverlay *,
.busyOverlay *::before,
.busyOverlay *::after{
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  filter: none !important;
}

.busyOverlay.isFinishing{
  animation: boFadeOut .22s ease-in both;
}

@keyframes boFadeIn{
  from{ opacity:0; }
  to{ opacity:1; }
}
@keyframes boFadeOut{
  from{ opacity:1; }
  to{ opacity:0; }
}

/* ================= PANEL ================= */

.busyOverlay__panel{
  width: min(520px, 100%);
  border-radius: 22px;
  border: 1px solid var(--border);

  /* solid glass look WITHOUT blur */
  background: color-mix(in srgb, var(--card) 94%, transparent);

  box-shadow: 0 28px 90px rgba(0,0,0,0.35);
  padding: 18px 16px 16px;
  position: relative;
  overflow: hidden;
}

/* glow is PURE gradient, no blur */
.busyOverlay__glow{
  position:absolute;
  inset:-2px;
  background:
    radial-gradient(
      700px 280px at 15% 10%,
      color-mix(in srgb, var(--p4) 28%, transparent),
      transparent 55%
    ),
    radial-gradient(
      600px 240px at 90% 0%,
      color-mix(in srgb, var(--p1) 22%, transparent),
      transparent 60%
    );
  pointer-events:none;
}

/* content layering */
.busyOverlay__top,
.busyOverlay__meter,
.busyOverlay__tip,
.busyOverlay__dots{
  position: relative;
  z-index: 1;
}

/* ================= HEADER ================= */

.busyOverlay__kicker{
  display:inline-flex;
  align-items:center;
  gap:10px;
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 900;
  padding: 7px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--card) 96%, transparent);
}

.busyOverlay__dot{
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--p1), var(--p5));
}

.busyOverlay__title{
  margin: 12px 0 6px;
  font-size: 20px;
  letter-spacing: -0.03em;
}

.busyOverlay__sub{
  margin: 0;
  color: var(--muted);
  font-weight: 750;
  font-size: 13px;
}

/* ================= PROGRESS ================= */

.busyOverlay__meter{
  margin-top: 14px;
}

.busyOverlay__bar{
  height: 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 30%, var(--card));
  overflow: hidden;
}

.busyOverlay__fill{
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--p1), var(--p5));
  transition: width .16s ease;
}

.busyOverlay__meta{
  margin-top: 10px;
  display:flex;
  justify-content: space-between;
  align-items:center;
}

.busyOverlay__pct{
  font-weight: 950;
}

.busyOverlay__hint{
  color: var(--muted);
  font-weight: 850;
  font-size: 12px;
}

/* ================= TIP ================= */

.busyOverlay__tip{
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 96%, transparent);
}

.busyOverlay__tipText{
  color: var(--muted);
  font-weight: 800;
  font-size: 13px;
  line-height: 1.45;
}

/* ================= DOTS ================= */

.busyOverlay__dots{
  margin-top: 12px;
  display:flex;
  gap: 8px;
  justify-content:center;
}

.busyOverlay__dots span{
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 92%, transparent);
  animation: dotPulse 1.05s infinite ease-in-out;
}

.busyOverlay__dots span:nth-child(2){ animation-delay:.15s; }
.busyOverlay__dots span:nth-child(3){ animation-delay:.3s; }

@keyframes dotPulse{
  0%,100%{ transform: translateY(0); opacity:.55; }
  50%{ transform: translateY(-4px); opacity:1; }
}

/* ================= MOBILE ================= */

@media (max-width: 520px){
  .busyOverlay{
    inset: 8px;
    border-radius: 18px;
    padding: 14px;
  }
}

/* ================= ACCESSIBILITY ================= */

@media (prefers-reduced-motion: reduce){
  .busyOverlay__dots span{ animation:none; }
  .busyOverlay__fill{ transition:none; }
}

      `}</style>
        </div>
    );
}
