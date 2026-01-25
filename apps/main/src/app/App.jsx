import { SiteLayout } from "../components/layout/SiteLayout.jsx";
import { AppRouter } from "../routes/router.jsx";

export default function App() {
  return (
    <SiteLayout>
      <AppRouter />
    </SiteLayout>
  );
}
