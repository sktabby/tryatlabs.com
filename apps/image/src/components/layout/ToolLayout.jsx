import { Outlet } from "react-router-dom";
import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

export default function ToolLayout() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
