import { Routes, Route } from "react-router-dom";
import ToolLayout from "../components/layout/ToolLayout.jsx";
import Home from "../pages/Home.jsx";
import ToolPage from "../pages/ToolPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import Result from "../pages/Result.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";

export default function App() {
  return (
    <ToolLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:toolSlug" element={<ToolPage />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
        
      </Routes>
    </ToolLayout>
  );
}
