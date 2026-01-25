import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Labs() {
  const canonical = `${BRAND.baseUrl}/labs`;
  return (
    <>
      <SeoHead
        title="Labs"
        description="Explore TryAtLabs experiments, prototypes, and validated tool ideas. A focused space for product iteration."
        canonical={canonical}
      />
      <section className="section">
        <div className="container">
          <h1>Labs</h1>
          <p className="muted">
            Labs is where new utilities are tested before they become stable tools across our subdomains.
          </p>
        </div>
      </section>
    </>
  );
}
