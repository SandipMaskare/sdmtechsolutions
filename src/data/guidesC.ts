import type { Article } from "./articles";

export const guidesC: Article[] = [
  {
    slug: "react-or-plain-javascript-which-to-learn-first",
    title: "React or Plain JavaScript: Which Should You Learn First?",
    excerpt:
      "Why the order of learning matters, what React adds, and a simple rule for knowing when you are ready to move from JavaScript to a framework.",
    category: "Web Development",
    date: "2026-10-14",
    readMinutes: 6,
    intro:
      "Many beginners ask whether they should go straight to React because job listings mention it. The short answer is that you should learn the core of JavaScript first, then React. React is written in JavaScript, so everything you learn about the language will appear in every React project you build. This article explains why, and how to tell when you are ready.",
    sections: [
      {
        heading: "What React is, and what it is not",
        paragraphs: [
          "React is a library for building user interfaces from small reusable pieces called components. It does not replace JavaScript. It gives you a structured way to describe what the screen should look like for a given set of data, and it updates the screen efficiently when the data changes. Everything inside a component is ordinary JavaScript: functions, arrays, objects, conditions and loops.",
        ],
      },
      {
        heading: "Why starting with React alone causes trouble",
        paragraphs: [
          "Beginners who start with React often copy patterns without understanding them. When an error appears, they cannot tell whether the problem is a misunderstanding of the language or of the library. They struggle with ideas such as array methods like map and filter, destructuring, arrow functions and promises, all of which React code uses constantly.",
          "Time spent learning these first feels slower, but it makes React much easier, so you finish the whole journey sooner.",
        ],
      },
      {
        heading: "What to know before touching React",
        paragraphs: [
          "You should be comfortable with the following topics. If you can build a small to-do app or quiz with only HTML, CSS and JavaScript, you are ready.",
        ],
        bullets: [
          "Variables, functions, arrow functions and scope.",
          "Arrays and objects, with methods such as map, filter and reduce.",
          "Working with the page: selecting elements, handling clicks and form input.",
          "Fetching data from an API using async and await.",
          "Modules: importing and exporting code between files.",
        ],
      },
      {
        heading: "What React makes easier",
        paragraphs: [
          "Once you have built a few plain JavaScript pages, you will notice how much manual work goes into updating the page whenever data changes. React handles this for you: you describe the interface as a function of state, and React updates the right parts. Components also make it simple to reuse a button, a card or a form across many pages, and a large ecosystem provides routing, forms and data fetching tools.",
        ],
      },
      {
        heading: "A sensible learning order",
        paragraphs: [
          "Spend four to six weeks on JavaScript and small projects. Then learn React in this order: components and props, state with hooks, handling forms, lists and keys, fetching data, routing between pages and finally sharing state across components. Build the same to-do app in React that you built in plain JavaScript, so you can see exactly what the library changes.",
          "After that, build a larger project such as a notes app with login, or a small dashboard that shows data from an API.",
        ],
      },
      {
        heading: "Do not stop learning the basics",
        paragraphs: [
          "Frameworks change every few years, but the fundamentals stay the same. Strong knowledge of JavaScript, HTML, CSS, HTTP and debugging will help you pick up any new tool quickly. Employers value this adaptability more than knowledge of one library's features.",
        ],
      },
    ],
  },
  {
    slug: "data-science-vs-data-analytics-career-guide",
    title: "Data Science vs Data Analytics: Which Career Path Fits You?",
    excerpt:
      "The real differences between data analysts and data scientists in skills, daily work and learning path, with advice on choosing a starting point.",
    category: "AI and Data",
    date: "2026-10-15",
    readMinutes: 7,
    intro:
      "The terms data analytics and data science are often used as if they mean the same thing, and job titles do not help. In practice the two paths overlap but have different emphasis. Understanding the difference saves you from studying the wrong things and helps you apply for roles that fit your strengths.",
    sections: [
      {
        heading: "What a data analyst does",
        paragraphs: [
          "A data analyst answers questions about what has happened and why. They collect data from databases and spreadsheets, clean it, summarise it and present findings in charts and dashboards. A typical question might be why sales dropped in one region last quarter or which marketing channel brought the most customers. The main skills are SQL, spreadsheets, a visualisation tool and clear communication.",
        ],
      },
      {
        heading: "What a data scientist does",
        paragraphs: [
          "A data scientist often goes a step further and builds models that predict what may happen or automate decisions, for example estimating which customers are likely to leave or recommending products. The work needs stronger programming, usually in Python, a good understanding of statistics and experience with machine learning libraries. Data scientists also spend a lot of time preparing data and checking whether a model really works.",
        ],
      },
      {
        heading: "Where they overlap",
        paragraphs: [
          "Both roles start with understanding the business question, getting reliable data and cleaning it. Both need to explain results in plain language, because findings are useless if decision makers cannot understand them. Many people begin as analysts and move towards data science as they add programming and statistics.",
        ],
      },
      {
        heading: "Skills to learn for each path",
        paragraphs: [
          "The lists below show a realistic starting point.",
        ],
        bullets: [
          "Analytics: spreadsheet formulas and pivot tables, SQL queries and joins, a dashboard tool, basic statistics and storytelling with data.",
          "Data science: Python, pandas and NumPy, statistics and probability, scikit-learn, model evaluation and basic software practices such as Git.",
        ],
      },
      {
        heading: "How to choose",
        paragraphs: [
          "If you enjoy exploring information and explaining what it means to others, start with analytics. If you enjoy programming and mathematics and like the idea of building systems that learn from data, aim for data science. You do not have to decide forever. Starting with analytics gives you a solid foundation and can lead you towards science later.",
          "Look at five job descriptions in each area and notice which tasks sound appealing. That is often the clearest signal.",
        ],
      },
      {
        heading: "Build projects that match the role",
        paragraphs: [
          "For analytics, take a public dataset, ask three clear questions, answer them with charts and write a short report with recommendations. For data science, pick a prediction problem, build and compare two models, explain how you measured performance and describe the limits. In both cases, publish your work and keep the explanations simple. A clear story about what you found and why it matters will stand out from a pile of code.",
        ],
      },
    ],
  },
  {
    slug: "software-testing-and-qa-career-for-freshers",
    title: "Software Testing and QA as a Career: A Guide for Freshers",
    excerpt:
      "What quality assurance engineers do, the skills that matter, manual versus automation testing and how to get your first role.",
    category: "Careers",
    date: "2026-10-16",
    readMinutes: 7,
    intro:
      "Every app you use has been tested by someone before it reached you, and the quality of that testing decides whether you love or abandon the product. Quality assurance, usually shortened to QA, is a steady and growing career with a lower barrier to entry than many development roles. It rewards patience, curiosity and attention to detail.",
    sections: [
      {
        heading: "What QA engineers actually do",
        paragraphs: [
          "A tester examines software to find problems before users do. This includes checking that features work as described, trying unusual inputs, testing on different devices and browsers, and writing clear reports that help developers reproduce and fix each issue. Good QA is not about blame. It is about making the product better and reducing risk for the team.",
        ],
      },
      {
        heading: "Manual and automation testing",
        paragraphs: [
          "In manual testing, a person follows test cases or explores the product by hand. It is essential for judging usability and for finding surprises that scripts would miss. In automation testing, you write code that runs checks automatically, which is useful for repeating the same tests after every change. Most teams use both, and beginners usually start with manual testing, then learn automation.",
        ],
      },
      {
        heading: "Core skills to develop",
        paragraphs: [
          "Begin with the basics of the software development process and how teams work in short cycles. Learn how to write test cases with clear steps and expected results, and how to write bug reports that include the environment, steps, actual result and expected result, with a screenshot or recording.",
        ],
        bullets: [
          "Test design ideas: boundary values, equivalence classes and negative testing.",
          "Basic SQL, to check that data was stored correctly.",
          "Browser developer tools, to inspect network calls and errors.",
          "A bug tracking tool and a test management tool.",
          "Later: an automation tool such as Selenium, Playwright or Cypress, and a programming language such as JavaScript or Python.",
        ],
      },
      {
        heading: "Think like a tester",
        paragraphs: [
          "A tester asks what happens if. What if the user enters a very long name, leaves a field blank, loses connection halfway or presses the back button after paying? Practise by testing everyday apps and websites and writing down the problems you find. This habit of questioning is the most valuable skill in QA, and you can start building it today.",
        ],
      },
      {
        heading: "Build a portfolio",
        paragraphs: [
          "Choose a small web application or a public demo site, write a test plan, create 20 to 30 test cases, record the bugs you find in a clear report and publish the results. If you learn automation, write a few automated tests and put them on GitHub with instructions. Clear written work shows employers that you can communicate, which is half of the job.",
        ],
      },
      {
        heading: "Getting your first role",
        paragraphs: [
          "Apply for QA intern and junior tester roles, and highlight your test cases, bug reports and projects. Prepare for questions on testing basics, the bug life cycle, the difference between severity and priority, and examples of how you would test a login page. A good internship gives you real products to test and mentors to review your reports, which accelerates your growth. From there, you can grow into automation, performance testing, security testing or team leadership.",
        ],
      },
    ],
  },
  {
    slug: "linkedin-profile-tips-for-students-and-freshers",
    title: "LinkedIn Profile Tips for Students and Freshers",
    excerpt:
      "How to write a headline, summary and experience section that recruiters find and trust, even when you have no work history yet.",
    category: "Careers",
    date: "2026-10-17",
    readMinutes: 7,
    intro:
      "LinkedIn is where recruiters and founders look for candidates, and also where many people check you out before replying to a message. A complete, clear profile works for you around the clock. You do not need years of experience to look professional. You need accuracy, clarity and proof of what you can do.",
    sections: [
      {
        heading: "Start with a clear photo and banner",
        paragraphs: [
          "Use a recent photo where your face is clearly visible, with good light and a plain background. Dress as you would for an interview. Add a simple banner that says what you do or are learning, such as Web Developer | React | Python. These small details show effort and make your profile look finished.",
        ],
      },
      {
        heading: "Write a headline that says more than Student",
        paragraphs: [
          "The headline appears beside your name in search results and messages, so it carries a lot of weight. Instead of only Student at XYZ College, describe your direction and skills, for example Computer Science student | Learning full stack development | React, Node.js, SQL. Use the words a recruiter would search for, and keep it truthful.",
        ],
      },
      {
        heading: "Use the About section to tell your story",
        paragraphs: [
          "Write three short paragraphs. First, who you are and what you are studying or building. Second, the skills and projects you are proud of, with one or two concrete examples. Third, what you are looking for and how people can reach you. Write in the first person and in plain, confident language. Avoid empty phrases such as hardworking team player, and show it through examples instead.",
        ],
      },
      {
        heading: "Turn projects and internships into experience",
        paragraphs: [
          "If you have no jobs yet, list internships, freelance work, volunteering and significant projects. For each one, write what the goal was, what you did and what the result was. Use numbers where honest, such as built a booking form used by 30 classmates. Add links to live demos or code. Attach certificates and projects in the Featured section, so visitors see your best work at once.",
        ],
        bullets: [
          "Add skills that you can honestly discuss, and pin the three most important.",
          "Ask mentors and teammates for short recommendations after you finish a project.",
          "Complete the education section and add relevant courses.",
        ],
      },
      {
        heading: "Grow your network with intent",
        paragraphs: [
          "Connect with classmates, teachers, mentors, alumni and people in the roles you want. Add a short note when you send a request, saying why you want to connect. Follow companies you admire and read what they share. A polite message that asks a specific question, such as how someone prepared for their first role, gets a better response than a request for a job.",
        ],
      },
      {
        heading: "Post and comment regularly",
        paragraphs: [
          "You do not have to write long essays. Share what you learned this week, a project you finished, a problem you solved or a short summary of a course. Add a screenshot or a link. Comment thoughtfully on other people's posts, because comments make you visible to their networks. Posting once or twice a week for a few months builds a reputation that no resume can match.",
        ],
      },
      {
        heading: "Keep it accurate and up to date",
        paragraphs: [
          "Never exaggerate dates, titles or skills, because employers verify claims, and a single false statement can damage trust. Update your profile after each project or certificate, keep your resume consistent with it and set your profile to public so recruiters can find you. A profile that is honest, active and easy to understand will serve you throughout your career.",
        ],
      },
    ],
  },
  {
    slug: "website-speed-optimisation-basics",
    title: "Website Speed Optimisation Basics for Small Business Sites",
    excerpt:
      "Why speed affects visitors and search rankings, how to measure it and the practical fixes that make the biggest difference.",
    category: "Web Development",
    date: "2026-10-18",
    readMinutes: 7,
    intro:
      "Visitors leave slow websites, and search engines notice. A page that loads quickly on a mid-range phone and a slow mobile connection feels trustworthy, while a heavy page feels broken. The good news is that a few well-chosen fixes usually produce most of the improvement, and you do not have to rebuild the whole site.",
    sections: [
      {
        heading: "Why speed matters",
        paragraphs: [
          "People decide within seconds whether to stay. If your page is slow, they are less likely to read, call or buy. Speed is also part of the page experience signals that search engines consider, and a faster site tends to be easier to crawl. For businesses in towns where mobile data is slow or expensive, a light website is a real advantage.",
        ],
      },
      {
        heading: "Measure before you change anything",
        paragraphs: [
          "Use free tools such as PageSpeed Insights, Lighthouse in Chrome developer tools and WebPageTest. They report how long it takes for the main content to appear, how stable the layout is while loading and how quickly the page responds to a tap. They also list specific problems. Test the pages that matter most, such as the home page and your main service page, on mobile settings, and write down the starting numbers.",
        ],
      },
      {
        heading: "Optimise images first",
        paragraphs: [
          "Images are usually the heaviest part of a page. Resize them to the size actually displayed, because a photo taken at 4000 pixels wide does not need to be sent to a phone screen that is 400 pixels wide. Use modern formats such as WebP or AVIF, compress them and load images below the first screen lazily, so they download only when the visitor scrolls near them. Always set width and height so the layout does not jump.",
        ],
      },
      {
        heading: "Reduce and defer code",
        paragraphs: [
          "Remove scripts and plug-ins you no longer use. Every chat widget, tracker and font adds weight. Load non-essential scripts after the main content, and split large JavaScript bundles so that each page loads only what it needs. Minify and compress files, and enable gzip or Brotli compression on the server.",
        ],
        bullets: [
          "Limit the number of font files and weights.",
          "Avoid autoplaying videos on the first screen.",
          "Check third-party widgets, since they are often the slowest items.",
        ],
      },
      {
        heading: "Use caching and a good host",
        paragraphs: [
          "Caching lets browsers keep files they have already downloaded, so repeat visits are faster. Set long cache times for files that rarely change, such as images and bundled code, and use a content delivery network to serve files from a location near the visitor. Choose hosting that responds quickly, because a slow server delays everything else, no matter how much you optimise the page.",
        ],
      },
      {
        heading: "Keep checking",
        paragraphs: [
          "Speed slowly gets worse as new images, scripts and features are added. Repeat your tests every month and after major changes, compare with your starting numbers and fix new problems early. Set a simple budget, for example a home page under one megabyte, and treat it as a rule for everyone who edits the site. Small habits protect the speed you worked for.",
        ],
      },
    ],
  },
];
