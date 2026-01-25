import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { HelmetProvider } from "./providers/HelmetProvider.jsx";
import { AnalyticsProvider } from "./providers/AnalyticsProvider.jsx";
import { AdsProvider } from "./providers/AdsProvider.jsx";

import "../styles/globals.css";
import "../styles/main-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AnalyticsProvider>
        <AdsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AdsProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  </React.StrictMode>
);
