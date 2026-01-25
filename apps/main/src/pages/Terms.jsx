import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Terms() {
  const canonical = `${BRAND.baseUrl}/terms`;
  return (
    <>
      <SeoHead title="Terms & Conditions" description="Read TryAtLabs terms and conditions." canonical={canonical} />
      <section className="section">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p className="muted">Use responsibly. No illegal usage. More terms can be added as the platform grows.</p>
        </div>
      </section>
    </>
  );
}
