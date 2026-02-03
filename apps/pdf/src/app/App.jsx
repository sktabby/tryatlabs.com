import { Routes, Route } from "react-router-dom";
import ToolLayout from "../components/layout/ToolLayout.jsx";
import Home from "../pages/Home.jsx";
import ToolPage from "../pages/ToolPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import Result from "../pages/Result.jsx";

export default function App() {
  return (
    <ToolLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:toolSlug" element={<ToolPage />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToolLayout>
  );
}
