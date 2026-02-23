import React from "react";
import { Routes, Route } from "react-router-dom";
import ToolLayout from "../components/layout/ToolLayout.jsx";
import Home from "../pages/Home.jsx";
import ToolPage from "../pages/ToolPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import About from "../pages/About.jsx"
import Contact from "../pages/Contact.jsx"
import Faqs from "../pages/Faqs.jsx"

export default function App() {
  return (
    <ToolLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<Faqs />} />
      </Routes>
    </ToolLayout>
  );
}
