import React from "react";
import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../components/layout/SiteLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import ToolPage from "../pages/Tool/ToolPage.jsx";
import NotFound from "../pages/NotFound.jsx";

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/tools/:slug", element: <ToolPage /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);
