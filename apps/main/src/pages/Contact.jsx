import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Contact() {
  const canonical = `${BRAND.baseUrl}/contact`;
  return (
    <>
      <SeoHead
        title="Contact"
        description="Contact TryAtLabs for partnerships, feedback, or collaboration."
        canonical={canonical}
      />
      <section className="section">
        <div className="container">
          <h1>Contact</h1>
          <p className="muted">Email: {BRAND.supportEmail}</p>
        </div>
      </section>
    </>
  );
}
