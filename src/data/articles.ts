import { moreArticles } from "./moreArticles";
import { guidesA } from "./guidesA";
import { guidesB } from "./guidesB";
import { guidesC } from "./guidesC";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  intro: string;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: "choosing-software-for-small-business",
    title: "How to Choose the Right Software for Your Small Business",
    excerpt:
      "Off-the-shelf tools or custom software? A practical way to decide, based on your workflow, budget and plans for growth.",
    category: "Software Development",
    date: "2026-09-02",
    readMinutes: 6,
    intro:
      "Every growing business reaches a point where spreadsheets, chat groups and paper registers stop being enough. Orders get missed, customer details live in five places and nobody is sure which file is the latest. The question then becomes whether to buy ready-made software or build something of your own. This guide gives you a simple way to decide.",
    sections: [
      {
        heading: "Start with the workflow, not the tool",
        paragraphs: [
          "Before looking at any product, write down how work actually moves through your business today. Who receives an enquiry? Who prepares the quote? Where is the invoice created and who follows up on payment? Drawing this out on a single page usually shows where time is wasted: re-typing the same data, waiting for approvals or searching for information.",
          "Mark the three steps that cost the most time or cause the most mistakes. These are the problems your software must solve. Everything else is a bonus.",
        ],
      },
      {
        heading: "When ready-made software is enough",
        paragraphs: [
          "If your process is common, such as basic accounting, email marketing or appointment booking, a subscription product is usually the fastest and cheapest answer. You get a tested product, regular updates and support without any development cost.",
        ],
        bullets: [
          "Your process looks similar to most businesses in your industry.",
          "You can adapt your way of working to the tool without losing anything important.",
          "You need to be running within days, not months.",
          "The monthly fee stays small compared with the time it saves.",
        ],
      },
      {
        heading: "When custom software makes sense",
        paragraphs: [
          "Custom software becomes attractive when your way of working is your advantage. A logistics company with its own routing rules, a school with a special fee structure or a manufacturer with a unique approval chain will keep fighting a generic product. Paying for features you never use, or paying for ten different tools that do not talk to each other, can also cost more than one well-built system.",
          "Custom does not have to mean huge. Many successful projects start with one small module, for example an internal dashboard or an order tracker, and grow as the business learns what it really needs.",
        ],
      },
      {
        heading: "Questions to ask before you decide",
        paragraphs: [
          "Whichever route you take, ask these questions. Who owns the data, and can you export it at any time? What happens if the vendor or the developer disappears? How will the software connect with the tools you already use? How many people will use it today and in two years? And what will it cost to maintain, not just to launch?",
        ],
      },
      {
        heading: "Run a small pilot first",
        paragraphs: [
          "Whatever you choose, test it with a small team for two to four weeks before rolling it out. A pilot exposes missing features and confusing screens while they are still cheap to fix. Collect feedback from the people who will use the tool every day, not only from the owner.",
          "Choosing software is really choosing how your team will work for the next few years. Taking a little time to understand your own workflow first almost always saves money later.",
        ],
      },
    ],
  },
  {
    slug: "website-or-web-application",
    title: "Website or Web Application: Which One Does Your Business Need?",
    excerpt:
      "The two are often confused, but they solve different problems and cost different amounts. Here is how to tell which you need.",
    category: "Web Development",
    date: "2026-09-09",
    readMinutes: 5,
    intro:
      "Many business owners ask for a website when they actually need a web application, or the other way around. Understanding the difference helps you plan a realistic budget and avoid rebuilding everything a year later.",
    sections: [
      {
        heading: "What a website does",
        paragraphs: [
          "A website mainly presents information. Visitors read about your company, see your services, view your portfolio and contact you. The content is the same for most visitors and changes only when you update it. A company profile, a clinic page or a restaurant menu are typical examples.",
          "A good business website loads quickly, works well on mobile phones, explains clearly what you offer and makes it easy to get in touch. For most small businesses this is the right place to start.",
        ],
      },
      {
        heading: "What a web application does",
        paragraphs: [
          "A web application lets users do things: log in, submit data, track an order, manage a calendar or see a personal dashboard. What each person sees depends on who they are. Online booking systems, customer portals, learning platforms and internal management tools are web applications.",
          "Because a web application stores and processes data, it needs a database, user accounts, security and ongoing maintenance. That is why it takes longer and costs more than a brochure website.",
        ],
      },
      {
        heading: "A simple way to decide",
        paragraphs: ["Ask yourself these questions about your idea:"],
        bullets: [
          "Do visitors only need to read about us? A website is enough.",
          "Do users need to log in or keep personal records? You need a web application.",
          "Will staff use it daily to run the business? Think web application or internal tool.",
          "Do you only need leads and enquiries? A website with a contact form works.",
        ],
      },
      {
        heading: "Many businesses need both",
        paragraphs: [
          "It is common to have a public website to attract customers and a web application behind a login for existing customers or staff. Planning both together lets them share branding, accounts and data, and saves duplicated work.",
          "If you are unsure, start with the website and add application features one at a time. Each addition should solve a specific problem that your customers or team face today.",
        ],
      },
      {
        heading: "Things that matter for both",
        paragraphs: [
          "Whichever you build, make sure it is secure (HTTPS, strong passwords, regular updates), fast on slow mobile connections, easy to find on search engines and simple to update without a developer for every small change. These basics influence trust and results far more than fancy animations.",
        ],
      },
    ],
  },
  {
    slug: "first-software-internship-guide",
    title: "Preparing for Your First Software Internship: A Student's Guide",
    excerpt:
      "What to learn, how to behave in the team and how to turn a short internship into real experience and a strong reference.",
    category: "Internships",
    date: "2026-09-16",
    readMinutes: 6,
    intro:
      "An internship is often the first time a student works on real projects with deadlines and teammates. It is also one of the best ways to prove your skills to future employers. With a little preparation you can get far more from it than certificates alone.",
    sections: [
      {
        heading: "Learn the basics before day one",
        paragraphs: [
          "You do not need to know everything, but a solid base makes the first week much easier. Pick the area of your internship, such as web development, data analysis or app development, and spend a few days on fundamentals.",
        ],
        bullets: [
          "Web: HTML, CSS, JavaScript and one framework such as React.",
          "Data: Python, spreadsheets, basic statistics and one charting library.",
          "General: Git and GitHub, how to read documentation and how to search for error messages.",
        ],
      },
      {
        heading: "Treat tasks like real work",
        paragraphs: [
          "Interns are usually given small, well-defined tasks. Read the instructions twice, note the deadline and ask questions early if something is unclear. A short, specific question such as \"I tried A and B, and I am stuck on C. Which direction should I take?\" shows effort and saves everyone's time.",
          "Submit work on time, even if it is not perfect, and say clearly what is done and what is still missing. Reliability matters more than brilliance for a beginner.",
        ],
      },
      {
        heading: "Communicate clearly",
        paragraphs: [
          "Remote internships depend on written communication. Reply to messages promptly, give a short progress update at an agreed time and tell your mentor early if you are blocked or will miss a deadline. Nobody expects an intern to know everything, but everyone expects honesty.",
        ],
      },
      {
        heading: "Build a portfolio as you go",
        paragraphs: [
          "Keep a record of what you build. Put code on GitHub with a clear README, take screenshots and write two or three lines about the problem, your solution and what you learned. With permission from your company, these notes become the strongest part of your resume, because they show real output rather than a list of courses.",
        ],
      },
      {
        heading: "Finish well",
        paragraphs: [
          "In the last week, collect feedback from your mentor, ask what you could improve and request a recommendation or reference if your work has been good. Connect with your teammates on LinkedIn. A thoughtful ending leaves a lasting impression and often leads to the next opportunity.",
          "An internship is short, but the habits you build during it, such as learning independently, communicating clearly and delivering on time, stay with you throughout your career.",
        ],
      },
    ],
  },
  {
    slug: "mobile-app-mistakes-to-avoid",
    title: "Seven Mistakes to Avoid When Building Your First Mobile App",
    excerpt:
      "Most app projects fail for business reasons, not technical ones. Avoid these common mistakes and save time and money.",
    category: "Mobile App Development",
    date: "2026-09-23",
    readMinutes: 6,
    intro:
      "Building a mobile app is exciting, but a poor start can cost months and a large part of your budget. These are the mistakes we see most often, and how to avoid each of them.",
    sections: [
      {
        heading: "1. Building without validating the idea",
        paragraphs: [
          "Talk to at least ten potential users before writing any code. Ask how they solve the problem today and what annoys them about it. If nobody is willing to try or pay for a better solution, adjust the idea first.",
        ],
      },
      {
        heading: "2. Trying to build everything at once",
        paragraphs: [
          "A long feature list delays launch and hides what users actually value. Define one core action, for example booking a service or tracking an order, and release a first version that does only that well. You can add features once real users ask for them.",
        ],
      },
      {
        heading: "3. Ignoring design and ease of use",
        paragraphs: [
          "Users decide within seconds whether an app feels easy. Use clear navigation, readable text, large tap areas and as few steps as possible for the main task. Sketching screens on paper and testing them with a few people before development removes many costly changes later.",
        ],
      },
      {
        heading: "4. Choosing the wrong technology",
        paragraphs: [
          "Native apps for Android and iOS give the best performance, while cross-platform frameworks let one team build for both and reduce cost. For most business apps, a cross-platform approach is enough. Choose based on your budget, timeline and the device features you need, not on trends.",
        ],
      },
      {
        heading: "5. Forgetting about security and privacy",
        paragraphs: [
          "If your app stores personal data, protect it from the start: encrypt connections, store passwords safely, collect only what you need and publish a clear privacy policy. Fixing security after launch is far more expensive than planning it early.",
        ],
      },
      {
        heading: "6. Skipping testing on real devices",
        paragraphs: [
          "An app that works on a developer's new phone may crash on an older, slower one. Test on different screen sizes, Android versions and network speeds, including poor connections. Ask real users to try a beta version before the public launch.",
        ],
      },
      {
        heading: "7. Having no plan after launch",
        paragraphs: [
          "Launching is the beginning. Plan for bug fixes, operating system updates, user feedback and marketing. Track a few simple numbers, such as installs, daily users and how many people complete the main action, and improve the app step by step.",
        ],
      },
    ],
  },
  {
    slug: "cloud-for-small-business",
    title: "Cloud Computing for Small Businesses: Benefits and First Steps",
    excerpt:
      "How moving files, email and applications to the cloud can cut costs, improve security and make remote work easier.",
    category: "Cloud Solutions",
    date: "2026-09-30",
    readMinutes: 5,
    intro:
      "Cloud computing simply means using computing resources, such as storage, software and servers, over the internet instead of owning and maintaining them yourself. For small businesses it can reduce costs and remove a lot of technical worry.",
    sections: [
      {
        heading: "Why small businesses move to the cloud",
        paragraphs: ["Businesses of every size are shifting to the cloud for a few practical reasons:"],
        bullets: [
          "Lower upfront cost: you pay monthly for what you use instead of buying servers.",
          "Access from anywhere: staff can work from the office, home or while travelling.",
          "Automatic backups: files are copied to separate locations, so a broken laptop does not mean lost data.",
          "Easy scaling: add users or storage when you grow and reduce them when you do not need them.",
        ],
      },
      {
        heading: "What you can move first",
        paragraphs: [
          "You do not have to move everything at once. Most businesses start with the simplest and most valuable items: email and calendars, shared documents and file storage, accounting software and customer records. Later you can consider hosting your website or custom applications on a cloud platform.",
        ],
      },
      {
        heading: "Security basics",
        paragraphs: [
          "Reputable cloud providers invest heavily in security, but you are still responsible for how you use the service. Turn on two-step verification for every account, give each person their own login, remove access when someone leaves and review who can see sensitive files. Most data leaks come from weak or shared passwords, not from the provider.",
        ],
      },
      {
        heading: "Watch the costs",
        paragraphs: [
          "Cloud pricing is flexible, which also means bills can grow unnoticed. Set a monthly budget alert, switch off resources you are not using and review the invoice every month. Choosing the right plan at the start usually saves more than any discount later.",
        ],
      },
      {
        heading: "A simple migration plan",
        paragraphs: [
          "List your data and tools, choose what to move first, test with a small group, train the team and keep a backup of everything during the change. A gradual move with clear responsibilities is safer than a sudden switch over a weekend.",
          "If you are unsure where to begin, an IT consultant can review your current setup and suggest a plan that fits your size and budget.",
        ],
      },
    ],
  },
  {
    slug: "resume-tips-for-it-freshers",
    title: "Resume Tips for IT Freshers: How to Get Shortlisted",
    excerpt:
      "Recruiters scan a resume in under a minute. Learn what to include, what to remove and how to show skills without work experience.",
    category: "Careers",
    date: "2026-10-07",
    readMinutes: 5,
    intro:
      "If you are a fresher, you may feel you have nothing to put on a resume. In reality, projects, internships, certifications and clear writing can make a strong first impression. This guide shows how to present them.",
    sections: [
      {
        heading: "Keep it to one page",
        paragraphs: [
          "Recruiters read many resumes in a day, so clarity beats length. Use one page, a clean layout, a standard font and consistent spacing. Save the file as a PDF named with your name, for example Priya_Sharma_Resume.pdf.",
        ],
      },
      {
        heading: "The sections to include",
        paragraphs: ["A fresher resume works best in this order:"],
        bullets: [
          "Contact details: name, phone, professional email, LinkedIn and GitHub links.",
          "A two-line summary of your goal and strongest skills.",
          "Skills: group them, for example languages, frameworks, tools and databases.",
          "Projects: two to four, with what you built and the result.",
          "Education and any internships or certifications.",
        ],
      },
      {
        heading: "Describe projects with results",
        paragraphs: [
          "Instead of writing \"Made a website\", write what problem it solved, which technologies you used and what the outcome was, for example \"Built a student attendance app in React and Supabase used by 40 classmates, reducing manual roll calls\". Add a link to the live project or the code so the recruiter can check it quickly.",
        ],
      },
      {
        heading: "Be honest about your skills",
        paragraphs: [
          "Only list technologies you can talk about in an interview. Interviewers often start with the skills section, and being unable to explain something you listed hurts your credibility. It is better to show a smaller set of skills that you really know.",
        ],
      },
      {
        heading: "Proofread and tailor",
        paragraphs: [
          "Spelling mistakes suggest carelessness, so read your resume slowly and ask a friend to check it. Adjust the summary and the order of skills for each role you apply to, matching the words used in the job description. Finally, keep your LinkedIn profile consistent with your resume, because recruiters often check both.",
        ],
      },
    ],
  },
];

articles.push(...moreArticles, ...guidesA, ...guidesB, ...guidesC);
articles.sort((a, b) => (a.date < b.date ? 1 : -1));

export const getArticle = (slug?: string) => articles.find((a) => a.slug === slug);
