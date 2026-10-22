// Learning help shown with every task: topic-specific references, practical tips and a step-by-step way to finish.
// It is matched from the task title + description, so it also works for tasks assigned before this existed.
import type { Ref } from "./internshipResources";

export interface Topic { key: string; name: string; match: RegExp; refs: Ref[]; tips: string[] }

export const TOPICS: Topic[] = [
  { key: "git", name: "Git & GitHub", match: /\b(git|github|commit|repo|repository|version control)\b/i,
    refs: [
      { label: "Pro Git book (free)", url: "https://git-scm.com/book/en/v2" },
      { label: "GitHub Skills: hands-on courses", url: "https://skills.github.com" },
    ],
    tips: ["Commit small and often with clear messages such as \"Add login form\".", "Push to GitHub at the end of every work session so nothing is lost."] },
  { key: "html", name: "HTML", match: /\b(html|semantic|landing page|portfolio page|static page)\b/i,
    refs: [
      { label: "MDN: Learn HTML", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
      { label: "web.dev: Learn HTML", url: "https://web.dev/learn/html" },
    ],
    tips: ["Use real elements (header, nav, main, footer, button) instead of only div.", "Give every image an alt text."] },
  { key: "css", name: "CSS & layout", match: /\b(css|flexbox|grid|responsive|layout|animation|mobile friendly|media quer)/i,
    refs: [
      { label: "MDN: Learn CSS", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS" },
      { label: "Flexbox Froggy (game)", url: "https://flexboxfroggy.com" },
      { label: "CSS Grid Garden (game)", url: "https://cssgridgarden.com" },
      { label: "CSS-Tricks: Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
    ],
    tips: ["Design for the smallest screen first, then add breakpoints.", "Test at 360px, 768px and 1280px wide using browser dev tools."] },
  { key: "javascript", name: "JavaScript", match: /\b(javascript|js|es6|dom|closure|array method|events?|local ?storage|async|promise)\b/i,
    refs: [
      { label: "javascript.info: the modern tutorial", url: "https://javascript.info" },
      { label: "MDN: JavaScript guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    ],
    tips: ["Use console.log to check values at each step.", "Break the problem into small functions and test each one."] },
  { key: "api", name: "APIs & fetch", match: /\b(fetch|api|rest|endpoint|postman|json|crud|http)\b/i,
    refs: [
      { label: "MDN: Using the Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" },
      { label: "Postman learning centre", url: "https://learning.postman.com" },
      { label: "REST API tutorial", url: "https://restfulapi.net" },
    ],
    tips: ["Handle three states in the UI: loading, error and success.", "Try every endpoint in Postman before connecting the front end."] },
  { key: "react", name: "React", match: /\b(react|hooks?|usestate|useeffect|component|props|jsx|vite)\b/i,
    refs: [
      { label: "React: official tutorial", url: "https://react.dev/learn" },
      { label: "React Router docs", url: "https://reactrouter.com/home" },
    ],
    tips: ["Keep components small and give each one a single job.", "State changes cause re-renders: keep state as close to where it is used as you can."] },
  { key: "tailwind", name: "Tailwind CSS", match: /\btailwind/i,
    refs: [{ label: "Tailwind CSS docs", url: "https://tailwindcss.com/docs" }],
    tips: ["Search the docs for the style you want, then copy the class name."] },
  { key: "node", name: "Node.js & Express", match: /\b(node|express|backend|server)\b/i,
    refs: [
      { label: "Node.js: learn", url: "https://nodejs.org/en/learn" },
      { label: "Express: getting started", url: "https://expressjs.com/en/starter/installing.html" },
    ],
    tips: ["Keep routes, controllers and database code in separate files.", "Never put passwords or keys in your code: use environment variables."] },
  { key: "database", name: "Databases & SQL", match: /\b(database|sql|postgres|postgresql|mongodb|mongo|schema|table|query|queries|supabase)\b/i,
    refs: [
      { label: "SQL tutorial (W3Schools)", url: "https://www.w3schools.com/sql/" },
      { label: "PostgreSQL tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
      { label: "Supabase docs", url: "https://supabase.com/docs" },
    ],
    tips: ["Draw your tables and how they connect on paper before you write any code.", "Add an id to every table and use foreign keys for relations."] },
  { key: "auth", name: "Authentication & security", match: /\b(auth|authentication|login|signup|sign up|jwt|password|role|security|cors|owasp|validation)\b/i,
    refs: [
      { label: "jwt.io: introduction to JWT", url: "https://jwt.io/introduction" },
      { label: "OWASP Authentication cheat sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
      { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
    ],
    tips: ["Always hash passwords, never store them as plain text.", "Check permissions on the server too, not only in the UI."] },
  { key: "testing", name: "Testing", match: /\b(test|tests|testing|jest|vitest|coverage|unit|pytest|playwright|qa)\b/i,
    refs: [
      { label: "Vitest guide", url: "https://vitest.dev/guide/" },
      { label: "Jest: getting started", url: "https://jestjs.io/docs/getting-started" },
      { label: "pytest documentation", url: "https://docs.pytest.org" },
    ],
    tips: ["Write one test for the normal case and one for a failure case.", "A test should check one thing and have a clear name."] },
  { key: "deploy", name: "Deployment", match: /\b(deploy|deployment|hosting|vercel|netlify|live url|ci\/cd|docker)\b/i,
    refs: [
      { label: "Vercel docs", url: "https://vercel.com/docs" },
      { label: "Docker: get started", url: "https://docs.docker.com/get-started/" },
    ],
    tips: ["Add environment variables in the host's settings, not in GitHub.", "After deploying, open the live link yourself and test the main flow."] },
  { key: "python", name: "Python", match: /\b(python|fastapi|flask|django|script|pip)\b/i,
    refs: [
      { label: "Python official tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Real Python tutorials", url: "https://realpython.com" },
    ],
    tips: ["Use a virtual environment (python -m venv) for every project.", "Read error messages from the bottom up: the last line says what went wrong."] },
  { key: "data", name: "Data analysis", match: /\b(pandas|dataset|data analysis|eda|clean(ing)? data|dashboard|power bi|visuali[sz]ation|chart|excel)\b/i,
    refs: [
      { label: "Kaggle Learn: free micro-courses", url: "https://www.kaggle.com/learn" },
      { label: "pandas user guide", url: "https://pandas.pydata.org/docs/user_guide/" },
    ],
    tips: ["Look at the data first: shape, missing values, and a few rows.", "Write down what question each chart answers."] },
  { key: "ml", name: "Machine learning", match: /\b(machine learning|ml|model|classification|regression|scikit|neural|deep learning|nlp|prediction|training)\b/i,
    refs: [
      { label: "scikit-learn: getting started", url: "https://scikit-learn.org/stable/getting_started.html" },
      { label: "Kaggle Learn: intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
    ],
    tips: ["Always split data into train and test before judging a model.", "Start with a simple baseline model, then improve it."] },
  { key: "design", name: "UI/UX design", match: /\b(figma|wireframe|prototype|ui|ux|user research|persona|design system|mockup)\b/i,
    refs: [
      { label: "Figma help centre", url: "https://help.figma.com" },
      { label: "Laws of UX", url: "https://lawsofux.com" },
      { label: "Material Design 3", url: "https://m3.material.io" },
    ],
    tips: ["Start with rough wireframes, then add colour and detail.", "Use one font pair and a small, consistent colour palette."] },
  { key: "a11y", name: "Accessibility & performance", match: /\b(accessibility|lighthouse|aria|contrast|performance|lazy|bundle)\b/i,
    refs: [
      { label: "Chrome Lighthouse overview", url: "https://developer.chrome.com/docs/lighthouse/overview" },
      { label: "W3C: intro to accessibility", url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
      { label: "web.dev: Learn performance", url: "https://web.dev/learn/performance" },
    ],
    tips: ["Run Lighthouse before and after your changes and note both scores."] },
  { key: "seo", name: "SEO & marketing", match: /\b(seo|keyword|backlink|marketing|campaign|social media|content calendar|analytics|ads?)\b/i,
    refs: [
      { label: "Google SEO starter guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
      { label: "Google Skillshop", url: "https://skillshop.withgoogle.com" },
      { label: "HubSpot Academy", url: "https://academy.hubspot.com" },
    ],
    tips: ["Pick one clear goal for the work (traffic, leads, followers) and measure it."] },
  { key: "writing", name: "Writing & documentation", match: /\b(readme|documentation|document|write|blog|article|report|presentation|case study|walkthrough|demo video|video)\b/i,
    refs: [
      { label: "Make a README", url: "https://www.makeareadme.com" },
      { label: "Google developer documentation style guide", url: "https://developers.google.com/style" },
    ],
    tips: ["A good README says what it is, how to run it, and shows a screenshot.", "For a demo video, practise once, keep it under 5 minutes and show the main flow only."] },
  { key: "pythonskills", name: "Python skills", match: /\b(data structures?|oop|object[- ]oriented|cli|command[- ]line|scraping|beautifulsoup|regex|regular expression|code quality|lint|pep ?8|refactor)/i,
    refs: [
      { label: "Real Python tutorials", url: "https://realpython.com" },
      { label: "PEP 8: Python style guide", url: "https://peps.python.org/pep-0008/" },
      { label: "Beautiful Soup documentation", url: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/" },
      { label: "Python regex HOWTO", url: "https://docs.python.org/3/howto/regex.html" },
    ],
    tips: ["Write small functions with clear names and test them with a few sample inputs.", "When scraping, check the site's rules (robots.txt) and do not send requests too fast."] },
  { key: "uxresearch", name: "UX research & structure", match: /\b(persona|journey map|information architecture|iconography|imagery|sitemap|user flow|usability|dark mode|theming|theme)\b/i,
    refs: [
      { label: "NN/g: personas", url: "https://www.nngroup.com/articles/persona/" },
      { label: "NN/g: journey mapping 101", url: "https://www.nngroup.com/articles/journey-mapping-101/" },
      { label: "Google Material Symbols (icons)", url: "https://fonts.google.com/icons" },
    ],
    tips: ["Base personas and journeys on real users you talked to, not guesses.", "Keep icons from one family so they look consistent."] },
  { key: "graphicwork", name: "Design projects", match: /\b(carousel|thumbnail|print|stationery|photo editing|illustration|revision|export|portfolio|business card|letterhead)\b/i,
    refs: [
      { label: "Canva Design School", url: "https://www.canva.com/designschool/" },
      { label: "Photopea: free online editor", url: "https://www.photopea.com" },
      { label: "Behance: design portfolios for inspiration", url: "https://www.behance.net" },
    ],
    tips: ["Look at 5 good examples first and note what they have in common.", "Export at the right size and format: PNG for web graphics, PDF for print."] },
  { key: "mladvanced", name: "Advanced ML & data science", match: /\b(feature engineering|tree models?|decision tree|random forest|cnn|convolution|time series|clustering|k-?means|capstone|storytelling|executive summary|peer review)\b/i,
    refs: [
      { label: "Kaggle: feature engineering", url: "https://www.kaggle.com/learn/feature-engineering" },
      { label: "scikit-learn: decision trees", url: "https://scikit-learn.org/stable/modules/tree.html" },
      { label: "scikit-learn: clustering", url: "https://scikit-learn.org/stable/modules/clustering.html" },
      { label: "Kaggle: time series", url: "https://www.kaggle.com/learn/time-series" },
      { label: "TensorFlow: CNN tutorial", url: "https://www.tensorflow.org/tutorials/images/cnn" },
    ],
    tips: ["Explain your result in plain words: what did you find and why does it matter?", "Keep your notebook tidy: headings, short explanations and clean charts."] },
  { key: "contentwork", name: "Content writing", match: /\b(grammar|editing|research skills?|website copy|copywriting|headline|proofread|tone of voice)\b/i,
    refs: [
      { label: "Purdue OWL: writing lab", url: "https://owl.purdue.edu/owl/" },
      { label: "Hemingway Editor", url: "https://hemingwayapp.com" },
      { label: "Google developer documentation style guide", url: "https://developers.google.com/style" },
    ],
    tips: ["Write a rough draft first, then edit: shorter sentences, active voice.", "Read your work aloud to catch awkward lines."] },
  { key: "seowork", name: "SEO tasks", match: /\b(site crawl|competitor|on-page|core web vitals|outreach|internal link|rank tracking|penalty|backlink audit|search console)/i,
    refs: [
      { label: "Google Search Central docs", url: "https://developers.google.com/search/docs" },
      { label: "web.dev: Core Web Vitals", url: "https://web.dev/articles/vitals" },
      { label: "Moz: beginner's guide to SEO", url: "https://moz.com/beginners-guide-to-seo" },
    ],
    tips: ["Record before and after numbers so you can prove the change worked."] },
  { key: "marketingwork", name: "Marketing research", match: /\b(audience|influencer|partnership|reputation|brand voice|competitor analysis)\b/i,
    refs: [
      { label: "HubSpot Academy", url: "https://academy.hubspot.com" },
      { label: "Google Skillshop", url: "https://skillshop.withgoogle.com" },
    ],
    tips: ["Back every claim with a source or a number."] },
  { key: "qabugs", name: "QA & bug reports", match: /\b(bug report|bug reporting|test case|test plan|regression|reproduce)\b/i,
    refs: [
      { label: "ISTQB", url: "https://www.istqb.org" },
      { label: "Playwright docs", url: "https://playwright.dev/docs/intro" },
    ],
    tips: ["A good bug report has steps to reproduce, expected result, actual result and a screenshot."] },
  { key: "itwork", name: "IT support", match: /\b(windows|linux|ticketing|helpdesk|help desk|networking|network|wi-?fi|router|software install|patch|monitoring|asset management|implementation plan|cloud tools|email setup)\b/i,
    refs: [
      { label: "Linux Journey", url: "https://linuxjourney.com" },
      { label: "Microsoft Learn", url: "https://learn.microsoft.com" },
      { label: "Professor Messer: free IT courses", url: "https://www.professormesser.com" },
      { label: "Cisco Networking Academy", url: "https://www.netacad.com" },
    ],
    tips: ["Document every change you make with the date and the reason.", "Try the steps on a test machine before using them on a real one."] },
  { key: "graphic", name: "Graphic design", match: /\b(logo|poster|banner|canva|photoshop|illustrator|brand|infographic|typography)\b/i,
    refs: [
      { label: "Canva Design School", url: "https://www.canva.com/designschool/" },
      { label: "Coolors: colour palettes", url: "https://coolors.co" },
      { label: "Google Fonts", url: "https://fonts.google.com" },
    ],
    tips: ["Limit yourself to two fonts and three colours.", "Leave white space: crowded designs look unprofessional."] },
];

export interface TaskGuide {
  steps: string[];
  topics: { name: string; tips: string[] }[];
  refs: Ref[];
}

/** What to hand in, taken from the task text ("Submit link and screenshots." etc.). */
const deliverableOf = (text: string) => {
  const m = text.match(/\b(submit|share|attach|record|deploy|upload|send)\b[^.]*\./i);
  return m ? m[0].trim() : "";
};

export function guideFor(title: string, description?: string | null, max = 3): TaskGuide {
  const text = `${title} ${description || ""}`;
  const hits = TOPICS.filter((t) => t.match.test(text)).slice(0, max);
  const seen = new Set<string>();
  const refs: Ref[] = [];
  hits.forEach((t) => t.refs.forEach((r) => { if (!seen.has(r.url)) { seen.add(r.url); refs.push(r); } }));
  const deliver = deliverableOf(text);
  const steps = [
    "Read the task twice. Write down in one sentence what you must hand in.",
    "Spend 30 to 60 minutes on the learning links below before you start building.",
    "Break the work into 3 or 4 small parts and finish them one by one. Get the simplest version working first.",
    "When you get stuck: read the error message, search it online, then check the documentation. Still stuck after 30 minutes? Ask your mentor and explain what you tried.",
    "Test everything yourself as a user would, and fix what looks wrong.",
    deliver ? `Hand in: ${deliver.charAt(0).toUpperCase()}${deliver.slice(1)}` : "Submit your work with a short note on what you built and what you learned.",
  ];
  return { steps, topics: hits.map((t) => ({ name: t.name, tips: t.tips })), refs };
}
