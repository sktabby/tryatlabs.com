export const ENV = {
  MAIN_URL: import.meta.env.VITE_MAIN_URL,
  TOOLS_URL: import.meta.env.VITE_TOOLS_URL,
  PDF_URL: import.meta.env.VITE_PDF_URL,
  IMAGE_URL: import.meta.env.VITE_IMAGE_URL,
  TEXT_URL: import.meta.env.VITE_TEXT_URL,
  DEV_URL: import.meta.env.VITE_DEV_URL,
   MODE: import.meta.env.MODE,
  IS_PROD: import.meta.env.PROD,

  // Analytics (optional)
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || "",

  // AdSense (optional for later)
  ADSENSE_CLIENT: import.meta.env.VITE_ADSENSE_CLIENT || ""
};
