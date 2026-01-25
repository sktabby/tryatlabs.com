import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home.jsx";
import Labs from "../pages/Labs.jsx";
import Studio from "../pages/Studio.jsx";
import Partnerships from "../pages/Partnerships.jsx";
import Talent from "../pages/Talent.jsx";
import Contact from "../pages/Contact.jsx";
import Privacy from "../pages/Privacy.jsx";
import Terms from "../pages/Terms.jsx";
import NotFound from "../pages/NotFound.jsx";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/labs" element={<Labs />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/partnerships" element={<Partnerships />} />
      <Route path="/talent" element={<Talent />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
