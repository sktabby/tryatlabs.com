import React from "react";
import { NavLink } from "react-router-dom";

export default function DesktopSidebar({ items }) {
  return (
    <aside className="sidebarDesktop" aria-label="Dev tools sidebar">
      <div className="sidebarDesktopTop">
        <div className="sidebarDesktopTitle">Tools</div>
        <div className="sidebarDesktopHint">Browser-first</div>
      </div>

      <nav className="sidebarDesktopNav">
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

      <div className="sidebarDesktopBottom">
        <div className="miniNote">
          <b>Privacy-first:</b> runs locally in your browser. No uploads.
        </div>
      </div>
    </aside>
  );
}
