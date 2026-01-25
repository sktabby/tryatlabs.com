import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Talent() {
  const canonical = `${BRAND.baseUrl}/talent`;
  return (
    <>
      <SeoHead
        title="Talent"
        description="Join TryAtLabs. We build fast, browser-first tools and ship SEO-driven products."
        canonical={canonical}
      />
      <section className="section">
        <div className="container">
          <h1>Talent</h1>
          <p className="muted">We’re building a tool ecosystem. If you love shipping clean products, connect with us.</p>
        </div>
      </section>
    </>
  );
}
