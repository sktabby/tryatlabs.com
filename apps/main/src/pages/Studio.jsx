import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Studio() {
  const canonical = `${BRAND.baseUrl}/studio`;
  return (
    <>
      <SeoHead
        title="Studio"
        description="The TryAtLabs Studio builds clean, fast web experiences and tool ecosystems optimized for SEO and usability."
        canonical={canonical}
      />
      <section className="section">
        <div className="container">
          <h1>Studio</h1>
          <p className="muted">We design and ship practical web utilities — clean UI, fast performance, and SEO-first.</p>
        </div>
      </section>
    </>
  );
}
