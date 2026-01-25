import { SeoHead } from "../seo/SeoHead.jsx";
import { BRAND } from "../app/constants/brand.js";

export default function Privacy() {
  const canonical = `${BRAND.baseUrl}/privacy`;
  return (
    <>
      <SeoHead title="Privacy Policy" description="Read TryAtLabs privacy policy." canonical={canonical} />
      <section className="section">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p className="muted">
            We aim to keep tools privacy-first. Where tools run in your browser, files are processed locally.
          </p>
        </div>
      </section>
    </>
  );
}
