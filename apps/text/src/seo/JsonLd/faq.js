export const faqJsonLd = (pairs = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pairs.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a }
  }))
});
