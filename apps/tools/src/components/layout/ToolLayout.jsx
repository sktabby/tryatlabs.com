import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function ToolLayout() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/">Tools</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </header>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
