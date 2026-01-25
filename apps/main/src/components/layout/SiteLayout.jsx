import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export function SiteLayout({ children }) {
  return (
    <div className="site">
      <Header />
      <main className="main">{children}</main>
      <Footer />
    </div>
  );
}
