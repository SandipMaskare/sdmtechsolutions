// Each task is "Title :: what to do / deliverable". 8 weeks x 3 tasks per domain.
export type WeekPlan = [string, string, string];
export interface DomainPlan { key: string; label: string; match: string[]; weeks: WeekPlan[] }

export const planA: DomainPlan[] = [
  {
    key: "fullstack", label: "Full Stack Developer", match: ["full stack", "fullstack", "mern", "web developer"],
    weeks: [
      ["Setup & Git workflow :: Install Node, VS Code, Git. Create a GitHub repo and push a Hello World with 5 meaningful commits.", "HTML & CSS static page :: Build a responsive personal portfolio page (HTML + CSS only). Submit repo link and live URL.", "JavaScript basics :: Solve 10 JS exercises (arrays, objects, functions, DOM). Submit the code and a short note of what you learned."],
      ["Responsive layout project :: Clone a landing page using Flexbox and Grid, fully mobile friendly. Submit link and screenshots.", "DOM & events app :: Build a to-do app with add, delete, filter and localStorage. Submit link.", "Async JS & APIs :: Build a weather or news app using fetch() and a public API with loading and error states."],
      ["React fundamentals :: Create a React (Vite) app with components, props and state. Convert your to-do app to React.", "React hooks & routing :: Add react-router with 3 pages and use useEffect/useState properly. Submit link.", "Component library UI :: Build a reusable Button, Card and Modal component set and document usage in README."],
      ["Mini project: Blog UI :: Build a blog front-end (list + detail pages) with mock JSON data.", "Node & Express basics :: Create a REST API with 5 endpoints (CRUD) using Express. Test with Postman and attach the collection.", "Database basics :: Design a schema for a blog (users, posts, comments) and write SQL/Mongo queries. Submit schema diagram."],
      ["Connect DB to API :: Connect your Express API to PostgreSQL/MongoDB with proper models and validation.", "Authentication :: Implement signup/login with hashed passwords and JWT. Submit working endpoints and demo video.", "Connect frontend to backend :: Integrate the React blog with your API (list, create, edit, delete posts)."],
      ["Role based access :: Add admin vs user roles and protect routes on both client and server.", "File upload :: Add image upload for posts (Supabase storage or Cloudinary) with size/type validation.", "Search, pagination & filters :: Implement server-side pagination and search on the posts list."],
      ["Testing :: Write at least 8 unit/API tests (Jest/Vitest) and report coverage.", "Security & performance review :: Fix 5 issues: input validation, CORS, rate limit, env secrets, image optimisation. Document changes.", "Deployment :: Deploy frontend (Vercel) and backend (Render/Railway) with environment variables. Submit live links."],
      ["Capstone build :: Build the final full-stack app (your own idea, approved by mentor) with auth, CRUD and roles.", "Documentation :: Write a README with setup steps, API docs, screenshots and architecture diagram.", "Final demo :: Record a 5-minute walkthrough video and present the project to the mentor. Submit video link and feedback notes."],
    ],
  },
  {
    key: "frontend", label: "Front-End Developer", match: ["front-end", "frontend", "front end", "react developer"],
    weeks: [
      ["Dev setup & Git :: Set up Node, VS Code, Git and push a starter project to GitHub with clean commits.", "Semantic HTML page :: Build a semantic, accessible article page (headings, landmarks, alt text). Run Lighthouse and share score.", "CSS fundamentals :: Re-create a card layout from a design screenshot using only CSS. Submit link."],
      ["Flexbox & Grid :: Build 3 layout patterns (navbar, pricing grid, dashboard) with Flexbox/Grid.", "Responsive design :: Make a full landing page work on 360px, 768px and 1280px. Submit screenshots of each.", "CSS animations :: Add 5 tasteful micro-interactions (hover, loaders, transitions) without libraries."],
      ["JavaScript essentials :: Complete 12 JS exercises (ES6, array methods, closures). Submit solutions.", "DOM project :: Build an interactive quiz app with score and timer.", "Fetch API project :: Build a movie/recipe search using a public API with debounce and error handling."],
      ["React basics :: Build a multi-component React app (props, state, lists, forms).", "Hooks deep dive :: Use useReducer, useMemo and a custom hook in a small app. Explain each in README.", "Routing & layouts :: Create a 4-page app with nested routes, 404 page and protected route demo."],
      ["Tailwind CSS :: Rebuild your landing page with Tailwind and a consistent design token setup.", "Component library :: Build 6 reusable UI components (Button, Input, Modal, Tabs, Toast, Card) and document them.", "State management :: Add Context or Zustand to manage cart/theme state in a shop UI."],
      ["Forms & validation :: Build a multi-step form with React Hook Form + Zod and clear error messages.", "Data tables & charts :: Build a dashboard page with a sortable table and 2 charts using mock data.", "Dark mode & theming :: Add light/dark theme with persistence and no flash on load."],
      ["Accessibility audit :: Fix keyboard, contrast and ARIA issues in your project; share before/after Lighthouse.", "Performance :: Lazy-load routes/images, reduce bundle size and report before/after metrics.", "Testing :: Write 8 component tests with Vitest + Testing Library."],
      ["Capstone UI :: Build a complete front-end product (e-commerce, SaaS dashboard or portfolio) from a Figma design.", "Deploy & document :: Deploy on Vercel and write README with screenshots, features and tech stack.", "Final presentation :: Record a walkthrough and present design decisions to the mentor."],
    ],
  },
  {
    key: "python", label: "Python Developer", match: ["python"],
    weeks: [
      ["Environment setup :: Install Python, create a virtualenv, set up VS Code and Git. Push a Hello World repo.", "Python basics :: Solve 15 problems on variables, loops, conditions and functions. Submit the .py files.", "Data structures :: Practise lists, dicts, sets and tuples with 10 small programs and short notes."],
      ["File handling & modules :: Write a script that reads CSV/JSON, cleans data and writes a report.", "OOP :: Build a Library or Bank management system using classes, inheritance and exceptions.", "CLI tool :: Create a command-line to-do tool using argparse with file storage."],
      ["Working with APIs :: Use the requests library to build a weather/currency CLI with error handling.", "Web scraping :: Scrape a public site (respecting robots.txt) with BeautifulSoup and save to CSV.", "Regex & text processing :: Build a log analyzer or email extractor using regular expressions."],
      ["Flask/FastAPI basics :: Build a REST API with 5 endpoints and automatic docs.", "Database with SQL :: Design 3 tables, write joins and connect via SQLAlchemy.", "Mini project: Expense tracker API :: CRUD API with database and Postman collection."],
      ["Authentication :: Add JWT login/signup and protected endpoints to your API.", "Pandas basics :: Analyse a Kaggle dataset: clean, group, summarise. Submit notebook.", "Visualisation :: Create 5 charts with Matplotlib/Seaborn and write insights."],
      ["Testing :: Write 10 pytest tests including edge cases and mock an API call.", "Automation script :: Automate a real task (file organiser, bulk email, report generator).", "Docker basics :: Containerise your API with a Dockerfile and docker-compose."],
      ["Code quality :: Add type hints, linting (ruff/flake8) and formatting (black); fix all warnings.", "Deployment :: Deploy the API on Render/Railway and share the live URL.", "Performance & logging :: Add structured logging, caching and measure response times."],
      ["Capstone project :: Build a complete Python application (API + DB + simple UI) approved by mentor.", "Documentation :: README with architecture, setup, API docs and screenshots.", "Final demo :: Record a 5-minute demo and present to the mentor."],
    ],
  },
  {
    key: "uiux", label: "UI/UX Designer", match: ["ui/ux", "ui ux", "uiux", "ux designer", "ui designer", "product designer"],
    weeks: [
      ["Tools setup :: Set up Figma, create a practice file and learn frames, auto layout and components. Submit a 1-page practice design.", "Design teardown :: Analyse 3 popular apps: list 5 good and 5 poor UX decisions each, with screenshots.", "Design principles :: Create a one-page cheat sheet on hierarchy, contrast, spacing, alignment and typography."],
      ["User research plan :: Write research goals and 8 interview questions for a chosen app idea.", "Conduct interviews :: Interview 3 users and record findings in a notes document.", "Personas & journey map :: Create 2 personas and one user journey map from your research."],
      ["Problem & user flows :: Write a problem statement and draw user flows for the 3 key tasks.", "Wireframes :: Produce low-fidelity wireframes for 6 screens on paper or Figma.", "Information architecture :: Build a sitemap and navigation structure; do a card-sorting exercise."],
      ["Design system basics :: Define colours, type scale, spacing and 8 base components in Figma.", "High-fidelity screens :: Design 6 mobile screens using your design system.", "Iconography & imagery :: Create or curate a consistent icon set and image style for the project."],
      ["Prototype :: Build a clickable Figma prototype with realistic transitions for the main flow.", "Usability test :: Test the prototype with 5 users; record issues and severity.", "Iteration :: Fix the top 5 issues and document before/after screens."],
      ["Responsive/web design :: Design the same product's web version (desktop, tablet) with grid system.", "Accessibility :: Check contrast, tap target sizes, labels; fix and document WCAG issues.", "Micro-interactions :: Design 5 micro-interactions and animate them in Figma Smart Animate."],
      ["Developer handoff :: Prepare specs, assets and a component sheet; walk through with a developer.", "Case study draft :: Write the first draft of your case study (problem, process, outcome).", "Portfolio setup :: Publish your portfolio page on Behance/Notion/own site."],
      ["Capstone design :: Complete an end-to-end product design (research → prototype) for a client brief.", "Final case study :: Finalise a polished case study with visuals and learnings.", "Presentation :: Present your project to the mentor and collect feedback."],
    ],
  },
  {
    key: "graphic", label: "Graphic Designer", match: ["graphic", "creative design", "visual designer", "canva"],
    weeks: [
      ["Tools setup :: Set up Canva/Figma/Photoshop/Illustrator and create a practice canvas. Share screenshots.", "Design fundamentals :: Create a one-page guide on colour theory, typography, grid and balance with examples.", "Mood board :: Make a mood board for a fictional brand (colours, fonts, imagery)."],
      ["Typography practice :: Design 5 type-only posters using different font pairings.", "Colour palettes :: Create 4 palettes (and use each in a mini poster) with accessible contrast.", "Layout & grid :: Re-create 3 reference layouts (poster, flyer, brochure) from scratch."],
      ["Logo design :: Design 3 logo concepts for a brand with sketches and final vector files.", "Logo presentation :: Present the best logo on mockups (card, signboard, app icon) with usage rules.", "Brand identity sheet :: Create a one-page brand guideline: logo, colours, fonts, spacing."],
      ["Social media pack :: Design 10 Instagram posts and 3 stories in one consistent style.", "Carousel design :: Create a 7-slide educational LinkedIn carousel.", "YouTube thumbnails :: Design 5 high-CTR thumbnails and explain the choices."],
      ["Print design :: Design a trifold brochure with correct bleed, margins and CMYK export.", "Business stationery :: Design visiting card, letterhead and envelope set.", "Poster campaign :: Create a 3-poster series for an event with consistent theme."],
      ["Photo editing :: Retouch and colour grade 5 photos; share before/after.", "Illustration :: Create 5 flat vector illustrations or icons in a single style.", "Packaging mockup :: Design a product label/box and present on a mockup."],
      ["Motion basics :: Animate your logo and one social post (Canva/After Effects/CapCut, 5-10 sec).", "Client revision exercise :: Take mentor feedback on one design and deliver 2 revision rounds.", "File organisation & export :: Prepare final files in correct formats (PNG, PDF, SVG) with naming standards."],
      ["Capstone brand project :: Create a complete brand kit for a client brief: logo, palette, social, stationery.", "Portfolio :: Publish at least 8 pieces on Behance/Drive with short case descriptions.", "Final presentation :: Present the portfolio to the mentor and collect feedback."],
    ],
  },
  {
    key: "aiml", label: "AI/ML Engineer", match: ["ai/ml", "aiml", "machine learning", "ai engineer", "ml engineer", "artificial intelligence", "deep learning"],
    weeks: [
      ["Setup :: Install Python, Jupyter, Git; create a repo with a starter notebook.", "Python for data :: Complete NumPy and Pandas exercises (20 problems). Submit notebook.", "Maths refresher :: Write notes with examples on vectors, matrices, probability and gradient intuition."],
      ["Data cleaning :: Clean a messy Kaggle dataset (missing values, outliers, encoding). Document steps.", "EDA :: Do exploratory analysis with 6 visualisations and written insights.", "Feature engineering :: Create at least 5 new features and measure their impact."],
      ["Linear/Logistic regression :: Implement and evaluate on a dataset with train/test split.", "Tree models :: Train decision tree and random forest; compare metrics.", "Model evaluation :: Report precision, recall, F1, ROC-AUC and a confusion matrix with interpretation."],
      ["Mini project: Predictive model :: End-to-end model (e.g. house price or churn) in a clean notebook.", "Cross-validation & tuning :: Apply GridSearch/Optuna; show improvement.", "Pipeline :: Build a scikit-learn Pipeline and save the model with joblib."],
      ["Neural network basics :: Build a simple neural network (Keras/PyTorch) on MNIST.", "CNN :: Train an image classifier and show accuracy/loss curves.", "NLP basics :: Build a text classifier (TF-IDF + model) such as spam or sentiment."],
      ["LLM & prompts :: Use an LLM API to build a summariser or Q&A tool with prompt design notes.", "RAG demo :: Create a retrieval-augmented chatbot over a PDF/document set.", "Model serving :: Expose your best model through a FastAPI endpoint."],
      ["Experiment tracking :: Track 5 experiments (MLflow or sheet) and justify the final model.", "Responsible AI :: Check bias/fairness and write a model card.", "Deploy :: Deploy API or Streamlit/Gradio demo publicly."],
      ["Capstone :: Build an end-to-end AI solution for a real problem agreed with mentor.", "Report :: Write a technical report: data, method, results, limitations.", "Final demo :: Present and demo to the mentor."],
    ],
  },
];
