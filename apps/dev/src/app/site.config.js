export const SITE = {
  name: "TryAtLabs",
  product: "Dev Tools",
  domain: "dev.tryatlabs.com",
  baseUrl: "https://dev.tryatlabs.com",
  ogImage: "/assets/og-default.png",
  brandLogo: "/assets/logo.png",
  twitter: "@tryatlabs",
};

export const DEV_TOOLS = [
  {
    slug: "base64-tool",
    title: "Base64 Encoder / Decoder",
    description: "Encode or decode Base64 instantly — runs fully in your browser.",
    keywords: ["base64", "encode", "decode", "developer tools", "tryatlabs"],
   
    faqs: [
      {
        q: "Is this Base64 tool safe to use?",
        a: "Yes. Everything runs locally in your browser. No uploads are sent to any server.",
      },
      {
        q: "Does it support Unicode text?",
        a: "Yes. It uses TextEncoder/TextDecoder to handle Unicode safely.",
      },
      {
        q: "Why does decoding sometimes fail?",
        a: "Decoding fails if the Base64 string is malformed or has invalid padding. Make sure the input is valid Base64.",
      },
    ],
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description: "Generate SHA-256 / SHA-1 / SHA-384 / SHA-512 hashes using Web Crypto.",
    keywords: ["hash", "sha256", "sha512", "checksum", "web crypto"],
    faqs: [
      {
        q: "Which algorithms are supported?",
        a: "SHA-256, SHA-1, SHA-384, and SHA-512 using the browser Web Crypto API.",
      },
      {
        q: "Is hashing the same as encryption?",
        a: "No. Hashing is one-way and cannot be reversed. Encryption is reversible with a key.",
      },
      {
        q: "Are files or text uploaded to a server?",
        a: "No. All hashing runs locally in your browser.",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode JWT header & payload safely (no verification) — browser-side.",
    keywords: ["jwt", "decoder", "json web token", "auth"],
 
    faqs: [
      {
        q: "Does this tool verify JWT signatures?",
        a: "No. It only decodes the header and payload. Signature verification requires the signing key/public key.",
      },
      {
        q: "Is it safe to paste tokens here?",
        a: "Yes. Decoding happens locally in your browser with no server requests.",
      },
      {
        q: "Why does my token fail to decode?",
        a: "Tokens must be in header.payload.signature format. Invalid Base64URL or malformed JSON can cause failures.",
      },
    ],
  },
  {
    slug: "timestamp-generator",
    title: "Timestamp Generator",
    description: "Convert dates to UNIX timestamps and timestamps to human time.",
    keywords: ["timestamp", "unix", "epoch", "converter"],
    faqs: [
      {
        q: "Does it support seconds and milliseconds?",
        a: "Yes. It detects common UNIX seconds vs milliseconds and converts accordingly.",
      },
      {
        q: "What timezone does it use?",
        a: "ISO output is UTC. Human-readable output uses your local browser timezone.",
      },
      {
        q: "Does this work offline?",
        a: "Yes. It runs entirely in your browser.",
      },
    ],
  },
  {
    slug: "url-encode-decode",
    title: "URL Encode / Decode",
    description: "Encode or decode URL components quickly — safe for querystrings.",
    keywords: ["url encode", "url decode", "querystring", "percent encoding"],
    faqs: [
      {
        q: "What does URL encoding do?",
        a: "It converts special characters into percent-encoded values so they can safely appear in URLs.",
      },
      {
        q: "Should I encode the full URL?",
        a: "Usually you encode components (like query values). Encoding an entire URL may also encode ':' and '/', which you may not want.",
      },
      {
        q: "Is my input sent to a server?",
        a: "No. Everything is processed locally in your browser.",
      },
    ],
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4 with one click — copy in a second.",
    keywords: ["uuid", "guid", "uuid v4", "generator"],
  
    faqs: [
      {
        q: "Which UUID version is generated?",
        a: "UUID v4 (random). It uses crypto.randomUUID when available.",
      },
      {
        q: "Is UUID guaranteed unique?",
        a: "UUID v4 has an extremely low collision probability, so it’s safe for most identifiers.",
      },
      {
        q: "Can I generate multiple UUIDs at once?",
        a: "Yes. Use the generator and copy the list output (one per line).",
      },
    ],
  },

    {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    description: "Prettify, minify, and validate JSON instantly — runs in your browser.",
    keywords: ["json formatter", "json validator", "prettify json", "minify json"],
   
    faqs: [
      { q: "Is my JSON uploaded?", a: "No. JSON formatting and validation happen locally in your browser." },
      { q: "Can it detect JSON errors?", a: "Yes. It highlights invalid JSON and shows a readable error." },
      { q: "Does it support minify?", a: "Yes. You can minify JSON for smaller payloads." },
    ],
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions with matches, groups, and flags — browser-side.",
    keywords: ["regex tester", "regular expression tester", "regex online", "regex match"],
   
    faqs: [
      { q: "Does it support flags like i/g/m?", a: "Yes. You can toggle common flags (i, g, m) easily." },
      { q: "Is it safe to paste sensitive text?", a: "Yes. Everything runs locally with no server requests." },
      { q: "Why is my regex slow?", a: "Some patterns can cause catastrophic backtracking. Try simplifying the pattern." },
    ],
  },
  {
    slug: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate clean placeholder text for UI mockups and layouts.",
    keywords: ["lorem ipsum generator", "placeholder text", "dummy text"],
    faqs: [
      { q: "Can I generate paragraphs or words?", a: "Yes. Choose words, sentences, or paragraphs." },
      { q: "Is the output copy-friendly?", a: "Yes. One-click copy is supported." },
      { q: "Does it work offline?", a: "Yes. Fully browser-side." },
    ],
  },
  {
    slug: "random-string-generator",
    title: "Random String Generator",
    description: "Generate secure random strings for tokens, salts, and test data.",
    keywords: ["random string generator", "secure token generator", "salt generator"],
 
    faqs: [
      { q: "Is it cryptographically secure?", a: "Yes. It uses the browser crypto API for randomness." },
      { q: "Can I choose length and charset?", a: "Yes. You can choose length and allowed characters." },
      { q: "Are generated strings stored anywhere?", a: "No. Everything is generated locally and not stored." },
    ],
  },
  {
    slug: "url-parser",
    title: "URL Parser",
    description: "Split a URL into protocol, host, path, and query params instantly.",
    keywords: ["url parser", "parse url", "query params", "url components"],
    faqs: [
      { q: "Does it parse query parameters?", a: "Yes. It lists params and decoded values." },
      { q: "Should I paste full URLs?", a: "Yes. Full URLs work best (including https://)." },
      { q: "Is my URL sent to a server?", a: "No. Parsing runs locally in the browser." },
    ],
  },
  {
    slug: "nanoid-generator",
    title: "NanoID Generator",
    description: "Generate compact, URL-safe IDs — great alternative to UUID for apps.",
    keywords: ["nanoid generator", "id generator", "url safe id", "unique id"],
    faqs: [
      { q: "How is NanoID different from UUID?", a: "NanoID is shorter and URL-safe, while UUID is longer but standardized." },
      { q: "Is it secure?", a: "Yes. It can be generated using crypto-grade randomness in the browser." },
      { q: "Can I customize the length?", a: "Yes. Set the desired length and generate multiple IDs." },
    ],
  },

];
