// src/pages/About.jsx
import { SeoHead } from "../seo/SeoHead.jsx";
import { SITE } from "../app/site.config.js";

export default function About() {
  return (
    <>
      <SeoHead
        title={`About — ${SITE.name}`}
        description="Learn more about TryAtLabs PDF, our privacy-first approach, and why our tools run fully in your browser."
        canonical={`${SITE.url}/about`}
      />

      <section className="section">
        <div className="section__head">
          <h1>About TryAtLabs PDF</h1>
          <p className="muted">
            Simple, fast, and privacy-first PDF tools — built for everyone.
          </p>
        </div>

        <div className="card">
          <p>
            <b>TryAtLabs PDF</b> is a collection of modern PDF tools that run
            completely in your browser. Your files never leave your device.
          </p>

          <p>
            We focus on <b>speed</b>, <b>clean UI</b>, and <b>privacy</b>.
            No uploads. No tracking. No clutter.
          </p>

          <p>
            Whether you want to merge, split, compress, rotate, or watermark
            PDFs — our tools are designed to be simple and reliable on both
            desktop and mobile.
          </p>

          <p className="muted" style={{ marginTop: 16 }}>
            Built by TryAtLabs · Crafted for performance · Designed for trust
          </p>
        </div>
      </section>
    </>
  );
}
