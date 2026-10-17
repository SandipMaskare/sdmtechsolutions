// Reference material shared with interns for each domain (free, official or well-known sources).
export interface Ref { label: string; url: string }

export const RESOURCES: Record<string, Ref[]> = {
  fullstack: [
    { label: "MDN Web Docs: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn" },
    { label: "React: official tutorial", url: "https://react.dev/learn" },
    { label: "Node.js: learn", url: "https://nodejs.org/en/learn" },
    { label: "Full Stack roadmap", url: "https://roadmap.sh/full-stack" },
  ],
  frontend: [
    { label: "MDN Web Docs: Learn web development", url: "https://developer.mozilla.org/en-US/docs/Learn" },
    { label: "React: official tutorial", url: "https://react.dev/learn" },
    { label: "web.dev: Learn", url: "https://web.dev/learn" },
    { label: "Tailwind CSS docs", url: "https://tailwindcss.com/docs" },
  ],
  python: [
    { label: "Python official tutorial", url: "https://docs.python.org/3/tutorial/" },
    { label: "FastAPI tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
    { label: "Real Python tutorials", url: "https://realpython.com" },
    { label: "pytest documentation", url: "https://docs.pytest.org" },
  ],
  uiux: [
    { label: "Figma help centre", url: "https://help.figma.com" },
    { label: "Nielsen Norman Group articles", url: "https://www.nngroup.com/articles/" },
    { label: "Material Design 3", url: "https://m3.material.io" },
    { label: "Laws of UX", url: "https://lawsofux.com" },
  ],
  graphic: [
    { label: "Canva Design School", url: "https://www.canva.com/designschool/" },
    { label: "Adobe: learn tutorials", url: "https://www.adobe.com/learn" },
    { label: "Coolors: colour palettes", url: "https://coolors.co" },
    { label: "Google Fonts", url: "https://fonts.google.com" },
  ],
  aiml: [
    { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
    { label: "scikit-learn user guide", url: "https://scikit-learn.org/stable/user_guide.html" },
    { label: "fast.ai practical deep learning", url: "https://course.fast.ai" },
    { label: "Hugging Face courses", url: "https://huggingface.co/learn" },
  ],
  datascience: [
    { label: "Kaggle Learn", url: "https://www.kaggle.com/learn" },
    { label: "pandas user guide", url: "https://pandas.pydata.org/docs/user_guide/" },
    { label: "Mode SQL tutorial", url: "https://mode.com/sql-tutorial" },
    { label: "Microsoft Learn: Power BI", url: "https://learn.microsoft.com/power-bi/" },
  ],
  content: [
    { label: "Google developer documentation style guide", url: "https://developers.google.com/style" },
    { label: "Google SEO starter guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
    { label: "HubSpot Academy", url: "https://academy.hubspot.com" },
    { label: "Hemingway Editor", url: "https://hemingwayapp.com" },
  ],
  marketing: [
    { label: "Google Skillshop", url: "https://skillshop.withgoogle.com" },
    { label: "HubSpot Academy", url: "https://academy.hubspot.com" },
    { label: "Meta Blueprint", url: "https://www.facebook.com/business/learn" },
    { label: "Google SEO starter guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
  ],
  seo: [
    { label: "Google SEO starter guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
    { label: "Google Search Console help", url: "https://support.google.com/webmasters" },
    { label: "Moz: beginner's guide to SEO", url: "https://moz.com/beginners-guide-to-seo" },
    { label: "web.dev: Learn performance", url: "https://web.dev/learn/performance" },
  ],
  qa: [
    { label: "ISTQB", url: "https://www.istqb.org" },
    { label: "Playwright docs", url: "https://playwright.dev/docs/intro" },
    { label: "Postman learning centre", url: "https://learning.postman.com" },
    { label: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/" },
  ],
  itsupport: [
    { label: "Google IT Support certificate", url: "https://grow.google/certificates/it-support/" },
    { label: "Microsoft Learn", url: "https://learn.microsoft.com" },
    { label: "Linux Journey", url: "https://linuxjourney.com" },
    { label: "Cisco Networking Academy", url: "https://www.netacad.com" },
  ],
};

/** Stored on a task as one "Label | url" per line. */
export const refsToText = (refs: Ref[]) => refs.map((r) => `${r.label} | ${r.url}`).join("\n");
export const parseRefs = (text?: string | null): Ref[] =>
  (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [a, ...b] = l.split("|");
      const rest = b.join("|").trim();
      if (rest) return { label: a.trim(), url: rest };
      return /^https?:\/\//i.test(a.trim()) ? { label: a.trim(), url: a.trim() } : { label: a.trim(), url: "" };
    })
    .filter((r) => /^https?:\/\//i.test(r.url));
