import { URLS } from "../../app/constants/urls";
import { ENV } from "../../app/constants/env";

const pick = (fallback, override) => (override && override.trim() ? override : fallback);

const BASE = {
  MAIN: pick(URLS.MAIN, ENV.MAIN_URL),
  TOOLS: pick(URLS.TOOLS, ENV.TOOLS_URL),
  PDF: pick(URLS.PDF, ENV.PDF_URL),
  IMAGE: pick(URLS.IMAGE, ENV.IMAGE_URL),
  TEXT: pick(URLS.TEXT, ENV.TEXT_URL),
  DEV: pick(URLS.DEV, ENV.DEV_URL),
};

export function goTo(target, path = "/", queryString = "") {
  const base = BASE[target];
  if (!base) throw new Error(`Unknown target: ${target}`);

  const p = path.startsWith("/") ? path : `/${path}`;
  const q = queryString ? (queryString.startsWith("?") ? queryString : `?${queryString}`) : "";
  window.location.assign(`${base}${p}${q}`);
}
