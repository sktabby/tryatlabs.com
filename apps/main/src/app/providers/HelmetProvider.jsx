import { HelmetProvider as Provider } from "react-helmet-async";

export function HelmetProvider({ children }) {
  return <Provider>{children}</Provider>;
}
