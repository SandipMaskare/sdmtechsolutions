// After `vite build`: writes a real HTML file for the blog and every article, so the full text is in the
// page source (search engines and AdSense reviewers see it without running JavaScript). Also rebuilds sitemap.xml.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
const SITE = "https://www.sdmtechsolution.com";
if (!existsSync(path.join(dist, "index.html"))) throw new Error("dist/index.html missing; run vite build first");

// Bundle the article data (TypeScript) into a temporary module and load it.
const tmp = path.join(root, "node_modules", ".prerender-articles.mjs");
await build({ entryPoints: [path.join(root, "src/data/articles.ts")], bundle: true, format: "esm", platform: "node", outfile: tmp, logLevel: "silent" });
const { articles } = await import(pathToFileURL(tmp).href + "?t=" + Date.now());
rmSync(tmp, { force: true });

const template = readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function page({ title, description, url, body, ld, type = "website" }) {
  let h = template;
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  h = h.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`);
  h = h.replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
  h = h.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`);
  h = h.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`);
  h = h.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  h = h.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  h = h.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />`);
  if (ld) h = h.replace("</head>", `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`);
  h = h.replace(/<div id="root">[\s\S]*?<\/main><\/div>/, `<div id="root">${body}</div>`);
  return h;
}

const wrap = (inner) => `<main style="max-width:820px;margin:0 auto;padding:24px 20px;font-family:system-ui,sans-serif;line-height:1.7;color:#1f2937">
<nav style="margin-bottom:20px;font-size:14px"><a href="/">SDM Technology</a> · <a href="/about">About</a> · <a href="/services">Services</a> · <a href="/internships">Internships</a> · <a href="/blog">Blog</a> · <a href="/contact">Contact</a></nav>
${inner}
<footer style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:14px"><p>SDM Technology, Gondia, Maharashtra, India · sdmtechnologies.pvtltd@gmail.com · +91 7038523408</p><p><a href="/privacy-policy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/disclaimer">Disclaimer</a></p></footer></main>`;

const out = (urlPath, html) => {
  const dir = path.join(dist, urlPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
};

// Blog index
const list = articles.map((a) => `<li style="margin-bottom:14px"><a href="/blog/${a.slug}"><strong>${esc(a.title)}</strong></a><br><span style="font-size:14px;color:#4b5563">${esc(a.excerpt)}</span></li>`).join("\n");
out("blog", page({
  title: "Guides on Web Development, AI, Internships and Careers | SDM Technology Blog",
  description: "Practical, original guides on software development, web design, AI and data, SEO, internships and careers from the SDM Technology team in Gondia, Maharashtra.",
  url: `${SITE}/blog`,
  body: wrap(`<h1>SDM Technology Blog: Guides for Businesses, Students and Developers</h1><p>Practical, plain-language articles on software development, web and mobile apps, AI and data, SEO, internships and careers.</p><ul style="list-style:none;padding:0">${list}</ul>`),
}));

// Articles
for (const a of articles) {
  const sections = a.sections.map((s) => `<section><h2>${esc(s.heading)}</h2>${s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</section>`).join("\n");
  const more = articles.filter((x) => x.slug !== a.slug && x.category === a.category).concat(articles.filter((x) => x.slug !== a.slug && x.category !== a.category)).slice(0, 4)
    .map((m) => `<li><a href="/blog/${m.slug}">${esc(m.title)}</a></li>`).join("");
  const url = `${SITE}/blog/${a.slug}`;
  out(`blog/${a.slug}`, page({
    title: `${a.title} | SDM Technology`,
    description: a.excerpt,
    url,
    type: "article",
    ld: {
      "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.excerpt,
      datePublished: a.date, dateModified: a.date, mainEntityOfPage: url, articleSection: a.category,
      author: { "@type": "Organization", name: "SDM Technology" },
      publisher: { "@type": "Organization", name: "SDM Technology", logo: { "@type": "ImageObject", url: `${SITE}/sdm-logo.jpg` } },
    },
    body: wrap(`<article><p style="font-size:13px;color:#0f766e;text-transform:uppercase;letter-spacing:.06em">${esc(a.category)}</p><h1>${esc(a.title)}</h1><p style="font-size:14px;color:#6b7280">By SDM Technology Team · ${fmt(a.date)} · ${a.readMinutes} min read</p><p><strong>${esc(a.intro)}</strong></p>${sections}</article><h2>More articles</h2><ul>${more}</ul><p><a href="/blog">All articles</a> · <a href="/contact">Contact SDM Technology</a></p>`),
  }));
}

// Per-page titles for the other public pages (content is rendered by the app)
const statics = {
  about: ["About SDM Technology | Software Company in Gondia, Maharashtra", "Learn about SDM Technology, a Gondia-based company building websites, apps and AI solutions and running project-based internships."],
  services: ["Software, Web and App Development Services | SDM Technology", "Web development, mobile apps, cloud, data analytics and IT consulting for small and growing businesses, from SDM Technology in Gondia."],
  internships: ["Virtual Internships in 12 Domains with Verified Certificates | SDM Technology", "8-week project-based internships in Full Stack, Python, UI/UX, AI/ML, Data Science, Marketing, SEO, QA and more, with mentor review and certificates you can verify online."],
  careers: ["Careers at SDM Technology | Jobs and Openings in Gondia", "See current job openings and career opportunities at SDM Technology."],
  contact: ["Contact SDM Technology | Gondia, Maharashtra", "Contact SDM Technology for websites, apps, software and internships. Email sdmtechnologies.pvtltd@gmail.com or call +91 7038523408."],
  "privacy-policy": ["Privacy Policy | SDM Technology", "How SDM Technology collects, uses and protects personal information, including cookies and advertising."],
  terms: ["Terms of Use | SDM Technology", "The terms for using the SDM Technology website, portals and services."],
  disclaimer: ["Disclaimer | SDM Technology", "Important information about the content and services provided by SDM Technology."],
};
const fallbackBody = (template.match(/<div id="root">([\s\S]*?<\/main>)<\/div>/) || [])[1] || "";
for (const [p, [title, description]] of Object.entries(statics)) {
  out(p, page({ title, description, url: `${SITE}/${p}`, body: fallbackBody }));
}

// Sitemap
const staticUrls = ["", "about", "services", "internships", "careers", "contact", "blog", "privacy-policy", "terms", "disclaimer",
  "services/software-development", "services/web-development", "services/mobile-app-development", "services/data-analytics", "services/cloud-solutions", "services/it-consulting"];
const today = new Date().toISOString().slice(0, 10);
const urls = [...staticUrls.map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod></url>`),
  ...articles.map((a) => `  <url><loc>${SITE}/blog/${a.slug}</loc><lastmod>${a.date}</lastmod></url>`)];
writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
console.log(`prerender: ${articles.length} articles, ${Object.keys(statics).length} pages, sitemap with ${urls.length} URLs`);
