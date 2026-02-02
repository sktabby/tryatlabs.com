import { createBrowserRouter } from "react-router-dom";
import ToolLayout from "../components/layout/ToolLayout.jsx";
import Home from "../pages/Home.jsx";
import ToolPage from "../pages/ToolPage.jsx";
import NotFound from "../pages/NotFound.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ToolLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: ":toolSlug", element: <ToolPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
