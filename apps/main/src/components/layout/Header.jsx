import { Link, NavLink } from "react-router-dom";
import { BRAND } from "../../app/constants/brand.js";
import { URLS } from "../../app/constants/urls.js";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand" aria-label="TryAtLabs Home">
          <img src={BRAND.logo} alt="TryAtLabs" className="brand__logo" />
          <span className="brand__name">{BRAND.name}</span>
        </Link>

        <nav className="nav">
          <NavLink to="/labs" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
            Labs
          </NavLink>
          <NavLink to="/studio" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
            Studio
          </NavLink>
          <NavLink to="/partnerships" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
            Partnerships
          </NavLink>
          <NavLink to="/talent" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
            Talent
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav__link active" : "nav__link")}>
            Contact
          </NavLink>
        </nav>

        <div className="header__cta">
          <a className="btn btn--primary" href={URLS.tools}>
            Open Tools
          </a>
        </div>
      </div>
    </header>
  );
}
