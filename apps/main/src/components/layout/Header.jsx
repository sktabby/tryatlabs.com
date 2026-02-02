import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BRAND } from "../../app/constants/brand.js";
import { URLS } from "../../app/constants/urls.js";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ mobile menu controlled
  const mnavRef = useRef(null);
  const [mOpen, setMOpen] = useState(false);

  // If URL contains #services, auto scroll after route renders
  useEffect(() => {
    if (location.hash === "#services") {
      requestAnimationFrame(() => {
        const el = document.getElementById("services");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.pathname, location.hash]);

  // ✅ Close dropdown on any navigation (route/hash)
  useEffect(() => {
    setMOpen(false);
  }, [location.pathname, location.hash]);

  // ✅ Close dropdown on click outside or Escape
  useEffect(() => {
    const onDown = (e) => {
      if (e.key === "Escape") setMOpen(false);
    };

    const onClick = (e) => {
      const node = mnavRef.current;
      if (!node) return;
      if (!node.contains(e.target)) setMOpen(false);
    };

    document.addEventListener("keydown", onDown);
    document.addEventListener("pointerdown", onClick, { capture: true });

    return () => {
      document.removeEventListener("keydown", onDown);
      document.removeEventListener("pointerdown", onClick, { capture: true });
    };
  }, []);

  const goServices = (e) => {
    e.preventDefault();
    setMOpen(false);

    // If already on home, just scroll
    if (location.pathname === "/") {
      const el = document.getElementById("services");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Else navigate to home with hash; effect above will scroll
    navigate("/#services");
  };

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand" aria-label="TryAtLabs Home">
            <span className="brand__logoWrap" aria-hidden="true">
              <img src={BRAND.logo} alt="TryAtLabs" className="brand__logo" />
            </span>
            <span className="brand__name">{BRAND.name}.com</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
              Home
            </NavLink>
            <NavLink to="/labs" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
              Labs
            </NavLink>
          
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop CTA */}
      

          {/* ✅ Mobile Dropdown (controlled) */}
          <details
            ref={mnavRef}
            className="mnav"
            aria-label="Mobile menu"
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

            <div className="mnav__panel" role="menu">
              <NavLink
                to="/"
                onClick={() => setMOpen(false)}
                className={({ isActive }) => (isActive ? "mnav__link active" : "mnav__link")}
              >
                Home
              </NavLink>
              <NavLink
                to="/labs"
                onClick={() => setMOpen(false)}
                className={({ isActive }) => (isActive ? "mnav__link active" : "mnav__link")}
              >
                Labs
              </NavLink>
              <NavLink
                to="/studio"
                onClick={() => setMOpen(false)}
                className={({ isActive }) => (isActive ? "mnav__link active" : "mnav__link")}
              >
                Studio
              </NavLink>
              <NavLink
                to="/partnerships"
                onClick={() => setMOpen(false)}
                className={({ isActive }) => (isActive ? "mnav__link active" : "mnav__link")}
              >
                Partnerships
              </NavLink>
              <NavLink
                to="/talent"
                onClick={() => setMOpen(false)}
                className={({ isActive }) => (isActive ? "mnav__link active" : "mnav__link")}
              >
               
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMOpen(false)}
                className={({ isActive }) => (isActive ? "mnav__link active" : "mnav__link")}
              >
                Contact
              </NavLink>

              <div className="mnav__divider" />

              <button className="mnav__toolsBtn" onClick={goServices} type="button">
                Explore Tools
              </button>
            </div>
          </details>
        </div>
      </header>

      {/* ✅ Dark Labs theme CSS (uses global vars: --labs-*) */}
      <style>{`
        .header{
          position: sticky;
          top: 0;
          z-index: 50;

          background: rgba(7,10,18,.62);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--labs-border);
        }

        .header::before{
          content:"";
          position:absolute;
          inset: 0;
          pointer-events:none;
          background:
            radial-gradient(800px 200px at 20% 0%, rgba(124,92,255,.14), transparent 60%),
            radial-gradient(800px 200px at 80% 0%, rgba(46,233,166,.08), transparent 60%);
          opacity: .75;
        }

        .header__inner{
          position: relative;
          display:flex;
          align-items:center;
          justify-content:space-around;
          gap: 14px;
          padding: 12px 0;
        }

        .brand{
          display:flex;
          align-items:center;
          gap: 10px;
          min-width: 0;
          text-decoration: none;
          color: inherit;
        }

        .brand__logoWrap{
          width: 42px;
          height: 42px;
          border-radius: 16px;

          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.05);
          display:grid;
          place-items:center;
          box-shadow: var(--labs-soft);
          overflow:hidden;

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .brand__logo{
          width: 26px;
          height: 26px;
          object-fit: contain;
          display:block;
        }

        .brand__name{
          font-weight: 1000;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--labs-text);
        }

        .nav{
          display:flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .nav__link{
          text-decoration: none;
          padding: 9px 12px;
          border-radius: 12px;

          color: rgba(255,255,255,.72);
          border: 1px solid transparent;

          transition: transform 140ms ease, background 140ms ease, color 140ms ease, border-color 140ms ease;
        }

        .nav__link:hover{
          background: rgba(255,255,255,.04);
          border-color: rgba(255,255,255,.08);
          color: rgba(255,255,255,.92);
          transform: translateY(-1px);
        }

        .nav__link.active{
          background: rgba(124,92,255,.12);
          color: rgba(255,255,255,.94);
          border: 1px solid rgba(124,92,255,.25);
        }

        .header__cta{ display:flex; }

        .btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap: 10px;

          padding: 10px 14px;
          border-radius: 14px;

          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.04);
          color: var(--labs-text);

          font-weight: 900;
          text-decoration:none;

          transition: transform 140ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .btn:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,.06);
          border-color: var(--labs-border-2);
          box-shadow: var(--labs-soft);
        }

        .btn--primary{
          border-color: rgba(124,92,255,.35);
          background: linear-gradient(135deg, rgba(124,92,255,.95), rgba(46,233,166,.52));
          color: #0A0D16;
          box-shadow: 0 18px 40px rgba(124,92,255,.18);
        }

        .btn--primary:hover{
          background: linear-gradient(135deg, rgba(124,92,255,1), rgba(46,233,166,.62));
          box-shadow: 0 18px 55px rgba(124,92,255,.22);
        }

        .mnav{ display:none; }
        @media (max-width: 880px){
          .nav{ display:none; }
          .header__cta{ display:none; }
          .mnav{ display:block; position: relative; }
        }

        .mnav summary{ list-style:none; }
        .mnav summary::-webkit-details-marker{ display:none; }

        .mnav__summaryBtn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap: 8px;

          height: 44px;
          padding: 0 14px;
          border-radius: 14px;

          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.05);
          box-shadow: var(--labs-soft);
          cursor:pointer;

          font-weight: 950;
          color: rgba(255,255,255,.90);

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .mnav[open] .mnav__chev{ transform: rotate(180deg); }
        .mnav__chev{ transition: transform 160ms ease; opacity: .85; }

       .mnav__panel{
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: min(86vw, 320px);
  border-radius: 18px;

  /* ✅ solid premium gradient (NO transparency) */
  background: linear-gradient(
    180deg,
    #0B0F1C 0%,
    #070A12 100%
  );

  border: 1px solid rgba(255,255,255,.12);

  box-shadow:
    0 30px 80px rgba(0,0,0,.55),
    inset 0 1px 0 rgba(255,255,255,.06);

  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  transform-origin: top right;
  animation: dropIn 180ms ease;
  z-index: 100;
}

        .mnav__panel > *{
          position: relative;
          z-index: 1;
        }

        @keyframes dropIn{
          from{ opacity: 0; transform: translateY(-6px) scale(0.98); }
          to{ opacity: 1; transform: translateY(0) scale(1); }
        }

        .mnav__link{
          text-decoration:none;
          padding: 12px 12px;
          border-radius: 14px;
          font-weight: 850;

          color: rgba(255,255,255,.90);
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);

          transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
        }

        .mnav__link:hover{
          transform: translateX(2px);
          background: rgba(255,255,255,.06);
          border-color: rgba(255,255,255,.12);
        }

        .mnav__link.active{
          background: rgba(124,92,255,.12);
          border-color: rgba(124,92,255,.25);
        }

        .mnav__divider{
          height: 1px;
          background: rgba(255,255,255,.10);
          margin: 6px 6px 2px;
        }

        .mnav__toolsBtn{
          width: 100%;
          border-radius: 14px;
          padding: 12px 12px;
          font-weight: 950;
          cursor: pointer;

          border: 1px solid rgba(124,92,255,.35);
          background: linear-gradient(135deg, rgba(124,92,255,.95), rgba(46,233,166,.52));
          color: #0A0D16;

          transition: transform 140ms ease, box-shadow 180ms ease;
        }

        .mnav__toolsBtn:hover{
          transform: translateY(-1px);
          box-shadow: 0 18px 55px rgba(124,92,255,.22);
        }

        .mnav__toolsHub{
          width: 100%;
          text-align:center;
          padding: 11px 12px;
          border-radius: 14px;
          font-weight: 900;
          text-decoration:none;

          border: 1px solid var(--labs-border);
          background: rgba(255,255,255,.04);
          color: rgba(255,255,255,.88);
        }



      `}</style>
    </>
  );
}
