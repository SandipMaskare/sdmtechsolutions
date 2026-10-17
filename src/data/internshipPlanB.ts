import type { DomainPlan } from "./internshipPlanA";

export const planB: DomainPlan[] = [
  {
    key: "datascience", label: "Data Scientist", match: ["data scien", "data analyst", "data analytics"],
    weeks: [
      ["Setup & SQL basics :: Set up Python/Jupyter and a free SQL database; write 15 SELECT/JOIN/GROUP BY queries.", "Python & Pandas :: Complete 20 Pandas exercises on filtering, grouping and merging.", "Statistics refresher :: Notes with worked examples on mean/median, variance, distributions and hypothesis tests."],
      ["Data cleaning :: Clean a real dataset and write a data-quality report.", "EDA project :: Explore a dataset with 8 charts and written business insights.", "Dashboard v1 :: Build a simple dashboard in Power BI/Tableau/Looker Studio from the cleaned data."],
      ["A/B testing :: Analyse a sample A/B test and state the conclusion with confidence intervals.", "Regression :: Build and interpret a regression model; explain coefficients in plain language.", "Classification :: Train 2 classifiers and compare using proper metrics."],
      ["Mini project :: End-to-end analysis (question → data → insight → recommendation).", "Feature engineering :: Create and justify 6 features; show impact on model.", "Storytelling :: Make a 6-slide deck presenting your findings to a non-technical audience."],
      ["Time series :: Forecast a time series (moving average + ARIMA/Prophet) and evaluate.", "Clustering :: Segment customers with K-Means and describe each segment.", "Advanced SQL :: Window functions, CTEs and a 5-query analytics pack."],
      ["Automation :: Build a script/notebook that refreshes a report from a data source.", "Dashboard v2 :: Build a full interactive dashboard with filters and KPIs.", "Data ethics :: Write a note on privacy, bias and consent for your dataset."],
      ["Model deployment :: Wrap a model in a Streamlit app or API.", "Documentation :: Document data dictionary, assumptions and reproduction steps.", "Peer review :: Review a fellow intern's analysis and submit written feedback."],
      ["Capstone :: Solve a business problem end to end using real data (mentor approved).", "Executive summary :: One-page summary with recommendations and impact.", "Final presentation :: Present results and demo to the mentor."],
    ],
  },
  {
    key: "content", label: "Content Writer", match: ["content writer", "content", "copywriter", "writer"],
    weeks: [
      ["Writing basics :: Write a 400-word piece on any topic; focus on clear structure (intro, body, conclusion).", "Style guide study :: Read SDM's blog and make a list of tone and style rules (10 points).", "Grammar & editing :: Edit a messy 500-word sample; submit tracked changes."],
      ["Research skills :: Research one topic with 5 reliable sources and create a citation sheet.", "Blog post #1 :: Write a 800-word original article on a tech topic with headings.", "Headlines & hooks :: Write 20 headline options for 3 topics and pick the best with reasons."],
      ["SEO basics :: Learn keyword research; choose a keyword for an article and plan on-page SEO.", "SEO article :: Write a 1,000-word SEO article with meta title, description and internal links.", "Plagiarism & originality :: Run your article through a checker and fix any overlaps."],
      ["Website copy :: Rewrite a service page (about 300 words) focused on benefits and a clear CTA.", "Social captions :: Write 15 captions for LinkedIn/Instagram with hashtags.", "Email copy :: Write a 3-email welcome sequence."],
      ["Case study :: Write a 600-word case study using the problem → solution → result format.", "Long-form guide :: Write a 1,500-word how-to guide with examples.", "Infographic text :: Write concise copy for a 7-point infographic."],
      ["Script writing :: Write a 90-second explainer video script.", "Product descriptions :: Write 10 product/service descriptions in a consistent voice.", "Content calendar :: Plan one month of content across blog and social."],
      ["Editing a peer :: Edit another intern's article and give feedback.", "Analytics review :: Review one article's performance (views, time on page) and suggest improvements.", "Repurposing :: Turn one article into 5 social posts, one email and a short video script."],
      ["Capstone :: Produce a 4-piece content pack (blog, social, email, landing copy) for a brief.", "Portfolio :: Compile your best 5 pieces on a public page.", "Final review :: Present to mentor and apply feedback."],
    ],
  },
  {
    key: "marketing", label: "Digital Marketing Executive", match: ["digital marketing", "marketing", "social media"],
    weeks: [
      ["Marketing basics :: Write a 1-page summary on the marketing funnel, audience and channels with examples.", "Competitor research :: Analyse 3 competitors' website and social presence in a comparison table.", "Audience personas :: Create 2 buyer personas for an SDM service."],
      ["Social media audit :: Audit SDM's LinkedIn/Instagram and list 10 improvements.", "Content plan :: Prepare a 4-week social content calendar.", "Create content :: Design and schedule 10 posts (Canva) following the plan."],
      ["SEO fundamentals :: Complete a keyword research sheet for one service (20 keywords with intent).", "On-page SEO :: Optimise 3 pages (titles, meta, headings, alt text) and document changes.", "Google Analytics & Search Console :: Set up and explain 5 key reports with screenshots."],
      ["Email marketing :: Build a 4-email nurture sequence in Mailchimp/Brevo.", "Landing page review :: Review the website's landing page and propose conversion improvements.", "Mini campaign :: Run a small organic campaign for a week and report reach and engagement."],
      ["Google Ads basics :: Plan a search campaign: keywords, ad copy, budget (no spend needed) and present.", "Meta Ads basics :: Plan a social ad set with audience targeting and creatives.", "Analytics report :: Create a weekly performance report for social channels."],
      ["LinkedIn outreach :: Write connection and follow-up templates; test with 20 contacts.", "Influencer/partnership list :: Build a list of 15 potential collaborators with contact info.", "Content repurposing :: Turn one blog into 6 pieces across channels."],
      ["A/B testing :: Design and run an A/B test on a post, subject line or CTA; report results.", "Reporting dashboard :: Build a Looker Studio dashboard of key metrics.", "Reputation :: Collect 5 testimonials/reviews and plan how to publish them."],
      ["Capstone campaign :: Plan and run a complete 2-week marketing campaign with goals and KPIs.", "Final report :: Report results, learnings and next steps with data.", "Presentation :: Present results to the mentor."],
    ],
  },
  {
    key: "seo", label: "SEO Specialist", match: ["seo", "search engine"],
    weeks: [
      ["SEO fundamentals :: Write a 1-page explainer on how search works, crawling, indexing and ranking.", "Tools setup :: Set up Google Search Console, Analytics and a free keyword tool for the website.", "Site crawl :: Crawl the site with Screaming Frog (free) and list the top 15 issues."],
      ["Keyword research :: Build a sheet of 40 keywords with volume, difficulty and intent.", "Keyword mapping :: Map keywords to existing pages and propose 5 new pages.", "Competitor analysis :: Analyse 3 competitors: top pages, backlinks and content gaps."],
      ["On-page optimisation :: Optimise titles, meta descriptions and H1s of 5 pages.", "Content optimisation :: Improve one blog post with better structure, FAQs and internal links.", "Schema markup :: Add FAQ/Organization/Article JSON-LD and validate."],
      ["Technical SEO :: Fix sitemap, robots.txt, canonicals and 404s; document before/after.", "Page speed :: Run PageSpeed Insights; apply 5 fixes (image, caching, JS) and report scores.", "Mobile & Core Web Vitals :: Audit and list fixes for LCP, CLS and INP."],
      ["Link building plan :: List 30 relevant backlink opportunities (directories, guest posts, partners).", "Outreach :: Send 15 outreach emails with templates; track replies.", "Local SEO :: Set up/optimise Google Business Profile and citations."],
      ["Content strategy :: Plan 12 SEO articles with topics, keywords and briefs.", "Write SEO article :: Write and publish one 1,200-word article optimised for a target keyword.", "Internal linking :: Build an internal link map and implement 20 links."],
      ["Rank tracking :: Set up tracking for 20 keywords and record weekly positions.", "Monthly SEO report :: Create a report with traffic, impressions, clicks and wins.", "Penalty/risk review :: Check for thin, duplicate or spammy content and propose fixes."],
      ["Capstone audit :: Do a complete SEO audit of a client site with prioritised action plan.", "Implementation :: Implement the top 10 quick wins and document results.", "Final presentation :: Present the audit and results to the mentor."],
    ],
  },
  {
    key: "qa", label: "Software QA Tester", match: ["qa", "quality assurance", "tester", "testing"],
    weeks: [
      ["QA fundamentals :: Write notes on SDLC, STLC, test levels and types with examples.", "Test environment :: Set up Jira (free) or a Sheet tracker, Postman and browser dev tools.", "Explore an app :: Do exploratory testing of a website and log 10 observations."],
      ["Test case design :: Write 30 test cases (positive/negative/boundary) for a login and signup flow.", "Bug reporting :: Log 8 well-written bug reports with steps, expected/actual and screenshots.", "Test plan :: Write a test plan with scope, risks, schedule and entry/exit criteria."],
      ["Functional testing :: Execute your test cases on a live website and report pass/fail.", "Cross-browser/device testing :: Test on 3 browsers and 2 screen sizes; record issues.", "Usability & accessibility checks :: Check contrast, keyboard navigation and labels; list findings."],
      ["API testing basics :: Test 10 endpoints in Postman with assertions; share the collection.", "SQL for testers :: Write 15 queries to validate data in a database.", "Regression suite :: Prepare a 25-case regression checklist for a web app."],
      ["Automation basics :: Learn Selenium/Playwright and automate the login flow.", "Page object model :: Refactor your scripts using POM.", "Data-driven tests :: Run the same test with 5 data sets."],
      ["Automate 10 scenarios :: Add 10 stable end-to-end tests with reports.", "CI basics :: Run your tests in GitHub Actions on every push.", "Performance basics :: Run a simple load test (k6/JMeter) on a demo API and summarise."],
      ["Security basics :: Test for XSS, SQL injection and auth issues on a demo app (OWASP Juice Shop); document.", "Mobile testing :: Test a mobile web app on real devices/emulators and log issues.", "Test metrics :: Create a report: defects by severity, pass rate, coverage."],
      ["Capstone :: Test a real project end to end: plan, cases, execution, automation and report.", "Final defect report :: Prepare a summary with severity ranking and recommendations.", "Presentation :: Present your QA work to the mentor."],
    ],
  },
  {
    key: "itsupport", label: "IT Support Engineer", match: ["it support", "information technology", "system admin", "helpdesk", "network"],
    weeks: [
      ["IT basics :: Write notes on hardware, OS, networking and common support terms.", "Windows & Linux :: Install a Linux VM; practise 25 core commands and submit a cheat sheet.", "Ticketing :: Set up a free ticket system (or Sheet) and log 10 practice tickets."],
      ["Networking basics :: Explain IP, DNS, DHCP, subnets and routers with a diagram.", "Network troubleshooting :: Use ping, tracert, nslookup, ipconfig and document 5 scenarios.", "Wi-Fi & router setup :: Configure a router/virtual lab and note secure settings."],
      ["User accounts & permissions :: Create users, groups and permissions on Windows/Linux; document steps.", "Remote support :: Practise remote tools (AnyDesk/RDP) and write a support guide.", "Software installs :: Create a checklist for installing and updating common office software safely."],
      ["Troubleshooting 1 :: Document fixes for 10 common issues (slow PC, no internet, printer, login lock-out).", "Backup & recovery :: Set up an automated backup and test a restore.", "Email & cloud tools :: Configure Google Workspace/M365 accounts, groups and sharing."],
      ["Security basics :: Create a security checklist: passwords, MFA, updates, antivirus, phishing.", "Phishing awareness :: Prepare a short training deck for staff.", "Patch & update plan :: Draft a monthly patching schedule."],
      ["Scripting :: Write 5 PowerShell/Bash scripts to automate routine tasks.", "Monitoring :: Set up a basic monitoring tool and alert on disk/CPU.", "Documentation :: Write 5 SOPs (onboarding, offboarding, password reset, etc.)."],
      ["Cloud basics :: Create a small VM/server on a free tier and secure it.", "Asset management :: Build an inventory sheet of devices, licences and warranties.", "SLA & incident handling :: Write an incident-response workflow and priority matrix."],
      ["Capstone :: Design the IT setup for a 10-person office: network, accounts, backup, security.", "Implementation plan :: Prepare a cost, timeline and checklist for it.", "Final presentation :: Present to the mentor."],
    ],
  },
];
