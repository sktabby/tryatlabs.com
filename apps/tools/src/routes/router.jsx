import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import ToolLayout from "../components/layout/ToolLayout";
import Home from "../pages/Home/Home";
import Category from "../pages/Category/Category";
import Tool from "../pages/Tool/Tool";
import About from "../pages/Static/About";
import Privacy from "../pages/Static/Privacy";
import Terms from "../pages/Static/Terms";
import Contact from "../pages/Static/Contact";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <ToolLayout />,
    children: [
      { path: "/", element: <Home /> },

      // legacy patterns (optional)
      { path: "/category/:category", element: <Navigate to="/:category" replace /> },
      { path: "/tool/:slug", element: <Navigate to="/general/:slug" replace /> },

      // real patterns
      { path: "/:category", element: <Category /> },
      { path: "/:category/:slug", element: <Tool /> },

      { path: "/about", element: <About /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
      { path: "/contact", element: <Contact /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
