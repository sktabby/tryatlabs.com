import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ToolPage from "../pages/ToolPage";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/:slug", element: <ToolPage /> },
  { path: "*", element: <NotFound /> },
]);
