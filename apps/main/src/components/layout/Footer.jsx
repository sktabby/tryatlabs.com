import { Link } from "react-router-dom";
import { BRAND } from "../../app/constants/brand.js";
import { URLS } from "../../app/constants/urls.js";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__left">
          <div className="footer__brand">{BRAND.name}</div>
          <div className="muted">{BRAND.tagline}</div>
          <div className="muted">© {year} {BRAND.name}. All rights reserved.</div>
        </div>

        <div className="footer__links">
          <a href={URLS.tools}>Tools</a>
          <a href={URLS.pdf}>PDF</a>
          <a href={URLS.image}>Image</a>
          <a href={URLS.text}>Text</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
