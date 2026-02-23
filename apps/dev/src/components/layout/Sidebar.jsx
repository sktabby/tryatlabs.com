import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen, items }) {
  return (
    <>
      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="sidebarTop">
          <div className="sidebarTitle">Tools</div>
          <button className="sidebarClose" onClick={() => setOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="sidebarNav">
          <NavLink to="/" className={({ isActive }) => `sideLink ${isActive ? "active" : ""}`}>
            Home
          </NavLink>

          <div className="sideDivider" />

          {items.map((t) => (
            <NavLink
              key={t.slug}
              to={`/tools/${t.slug}`}
              className={({ isActive }) => `sideLink ${isActive ? "active" : ""}`}
            >
              <span className="sideLinkText">{t.title}</span>
              {t.badge ? <span className="pill">{t.badge}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="sidebarBottom">
          <div className="miniNote">
            <b>Privacy-first:</b> everything runs in your browser. No file uploads.
          </div>
        </div>
      </aside>
    </>
  );
}
