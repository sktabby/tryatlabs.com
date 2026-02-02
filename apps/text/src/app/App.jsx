import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../routes/router.jsx";
import AdsProvider from "../components/ads/AdsProvider.jsx";

export default function App() {
  return (
    <AdsProvider>
      <RouterProvider router={router} />
    </AdsProvider>
  );
}
