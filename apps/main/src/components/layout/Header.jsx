import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "../../app/constants/brand.js";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const mnavRef = useRef(null);
  const [mOpen, setMOpen] = useState(false);

  useEffect(() => {
    setMOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onDown = (e) => e.key === "Escape" && setMOpen(false);
    const onClick = (e) => {
      if (mnavRef.current && !mnavRef.current.contains(e.target)) setMOpen(false);
    };

    document.addEventListener("keydown", onDown);
    document.addEventListener("pointerdown", onClick, { capture: true });
    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("pointerdown", onClick, { capture: true });
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          {/* Brand */}
          <Link to="/" className="brand" aria-label="TryAtLabs Home">
            <span className="brand__logoWrap">
              <img src={BRAND.logo} alt="TryAtLabs" className="brand__logo" />
            </span>
            <span className="brand__name">{BRAND.name}.com</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav">
            <NavLink to="/" className="nav__link">Home</NavLink>
            <NavLink to="/labs" className="nav__link">Labs</NavLink>
            <NavLink to="/contact" className="nav__link">Contact</NavLink>
          </nav>

          {/* Desktop CTA */}
          <div className="header__cta">
            <Link to="/tools" className="btn btn--primary">
              Explore Tools
            </Link>
          </div>

          {/* Mobile Menu */}
          <details
            ref={mnavRef}
            className="mnav"
            open={mOpen}
            onToggle={(e) => setMOpen(e.currentTarget.open)}
          >
            <summary className="mnav__summary" onClick={(e) => e.preventDefault()}>
              <button
                type="button"
                className="mnav__summaryBtn"
                aria-expanded={mOpen}
                onClick={() => setMOpen((v) => !v)}
              >
                Menu <span className="mnav__chev">▾</span>
              </button>
            </summary>

            <div className="mnav__panel">
              <NavLink to="/" onClick={() => setMOpen(false)} className="mnav__link">Home</NavLink>
              <NavLink to="/labs" onClick={() => setMOpen(false)} className="mnav__link">Labs</NavLink>
              <NavLink to="/contact" onClick={() => setMOpen(false)} className="mnav__link">Contact</NavLink>

              <div className="mnav__divider" />

              <Link to="/tools" onClick={() => setMOpen(false)} className="btn btn--primary">
                Explore Tools
              </Link>
            </div>
          </details>
        </div>
      </header>

      {/* ===== Styles ===== */}
      <style>{`
        .header{
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(7,10,18,.72);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--labs-border);
        }

        .header__inner{
          display:flex;
          align-items:center;
          justify-content:space-around;

          /* ✅ LEFT–RIGHT MARGIN */
          padding: 12px clamp(16px, 4vw, 32px);
        }

        .brand{
          display:flex;
          align-items:center;
          gap: 10px;
          text-decoration:none;
          color: inherit;
        }

        /* White logo container */
        .brand__logoWrap{
          width: 42px;
          height: 42px;
          border-radius: 16px;
          background: #fff;
          border: 1px solid rgba(0,0,0,.06);
          display:grid;
          place-items:center;
          box-shadow:
            0 6px 20px rgba(0,0,0,.18),
            inset 0 1px 0 rgba(255,255,255,.9);
        }

        .brand__logo{
          width: 26px;
          height: 26px;
          object-fit: contain;
        }

        .brand__name{
          font-weight: 1000;
          color: var(--labs-text);
        }

        .nav{
          display:flex;
          gap: 12px;
        }

        .nav__link{
          padding: 9px 12px;
          border-radius: 12px;
          text-decoration:none;
          font-weight: 900;
          color: rgba(255,255,255,.72);
        }

        .nav__link:hover{
          background: rgba(255,255,255,.05);
          color: #fff;
        }

        /* CTA Button */
        .btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 10px 16px;
          border-radius: 14px;
          font-weight: 1000;
          text-decoration:none;
        }

        .btn--primary{
          background: linear-gradient(135deg, #7c5cff, #2ee9a6);
          color: #0A0D16;
          box-shadow: 0 14px 40px rgba(124,92,255,.25);
        }

        .btn--primary:hover{
          box-shadow: 0 18px 60px rgba(124,92,255,.35);
          transform: translateY(-1px);
        }

        .header__cta{ display:flex; }

        /* Mobile */
        .mnav{ display:none; }

        @media (max-width: 900px){
          .nav{ display:none; }
          .header__cta{ display:none; }
          .mnav{ display:block; }
        }

        .mnav__summaryBtn{
          height: 44px;
          padding: 0 14px;
          border-radius: 14px;
          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.06);
          color: #fff;
          font-weight: 900;
        }

        .mnav__panel{
          position:absolute;
          right: 0;
          margin-top: 10px;
          width: min(86vw, 320px);
          background: #0B0F1C;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px;
          padding: 12px;
          display:flex;
          flex-direction:column;
          gap: 10px;
        }

        .mnav__link{
          padding: 12px;
          border-radius: 14px;
          text-decoration:none;
          font-weight: 900;
          color: rgba(255,255,255,.9);
          background: rgba(255,255,255,.04);
        }

        .mnav__link:hover{
          background: rgba(255,255,255,.08);
        }

        .mnav__divider{
          height: 1px;
          background: rgba(255,255,255,.12);
          margin: 6px 0;
        }
          /* 🔥 Kill native summary marker everywhere */
.mnav summary{
  list-style: none;
}

.mnav summary::-webkit-details-marker{
  display: none;
}

.mnav summary::marker{
  content: "";
  display: none;
}

/* Extra safety for mobile Chrome */
.mnav summary{
  appearance: none;
  -webkit-appearance: none;
}

      `}</style>
    </>
  );
}
