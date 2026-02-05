import { Link } from "react-router-dom";
import { BRAND } from "../../app/constants/brand.js";
import { SUBDOMAINS, URLS } from "../../app/constants/urls.js";
import "../../styles/footer.css";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="container siteFooter__inner">
        
        {/* Brand */}
        <div className="siteFooter__brand">
          <div className="siteFooter__name">{BRAND.name}</div>
          <p className="siteFooter__tagline">{BRAND.tagline}</p>
        </div>

        {/* Tools */}
        <div className="siteFooter__col">
          <div className="siteFooter__title">Tools</div>
          <a href={SUBDOMAINS.pdf}>PDF Tools</a>
          <a href={SUBDOMAINS.image}>Image Tools</a>
          <a href={SUBDOMAINS.text}>Text Tools</a>
          <a href={SUBDOMAINS.dev}>Developer Tools</a>
        </div>

        {/* Company */}
        <div className="siteFooter__col">
          <div className="siteFooter__title">Company</div>
          <Link to={URLS.tools}>All Tools</Link>
          <Link to={URLS.privacy}>Privacy Policy</Link>
          <Link to={URLS.terms}>Terms of Service</Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="siteFooter__bottom">
        <div className="container siteFooter__bottomInner">
          <span>© {year} {BRAND.name}. All rights reserved.</span>
          <span className="siteFooter__note">
           Built by Aqsa Shah & Tabish Shaikh
          </span>
        </div>
      </div>
    </footer>
  );
}
