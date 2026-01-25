import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Partnerships() {
  const canonical = `${BRAND.baseUrl}/partnerships`;
  return (
    <>
      <SeoHead
        title="Partnerships"
        description="Partner with TryAtLabs for tool integrations, SEO distribution, and long-term ecosystem growth."
        canonical={canonical}
      />
      <section className="section">
        <div className="container">
          <h1>Partnerships</h1>
          <p className="muted">
            We collaborate with creators, communities, and products that align with productivity and privacy-first tools.
          </p>
        </div>
      </section>
    </>
  );
}
