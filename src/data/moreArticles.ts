import type { Article } from "./articles";

export const moreArticles: Article[] = [
  {
    slug: "software-project-from-idea-to-launch",
    title: "From Idea to Launch: How a Software Project Is Planned and Built",
    excerpt: "A plain-language walk through the stages of a software project, so you know what to expect and what to prepare before you hire a developer.",
    category: "Software Development",
    date: "2026-09-09",
    readMinutes: 6,
    intro:
      "Many business owners hire a developer with only a rough idea in mind and are surprised when the developer asks dozens of questions. Those questions are not delays. They are the first stage of a process that protects your budget and your time. Knowing the stages in advance helps you give better answers and judge whether a project is on track.",
    sections: [
      {
        heading: "1. Discovery and requirements",
        paragraphs: [
          "Every project starts by understanding the problem. A good team will ask who will use the software, what tasks it must support and what success looks like. The output is a short requirements document listing the features you need now and the ones that can wait. Separating must-have features from nice-to-have features is the single most effective way to keep a first release affordable.",
        ],
      },
      {
        heading: "2. Design and planning",
        paragraphs: [
          "Next, the team sketches the screens and the flow between them. For small projects this can be simple wireframes; for larger ones it includes a clickable prototype. Reviewing a prototype is much cheaper than changing finished code, so this is the best moment to ask for changes.",
          "In parallel, the developers choose the technology, plan the database and break the work into small tasks with estimates. A realistic plan lists milestones, so you can see progress every week or two instead of waiting for one big delivery.",
        ],
      },
      {
        heading: "3. Development in small steps",
        paragraphs: [
          "Modern teams build software in short cycles, often one or two weeks long. At the end of each cycle you receive something that works and can be tested. This approach exposes misunderstandings early. If a feature is not what you imagined, you find out in week two, not month four.",
        ],
        bullets: [
          "Ask for a demo at the end of every cycle.",
          "Keep one person on your side who can answer questions quickly.",
          "Write down every change request so its cost and time are visible.",
        ],
      },
      {
        heading: "4. Testing and fixing",
        paragraphs: [
          "Testing runs throughout development, but a dedicated testing period before launch checks that everything works together on real phones, browsers and screen sizes. It also checks the unhappy paths: what happens when someone enters a wrong value, loses internet connection or clicks twice. Bugs found here are normal; the important thing is that they are tracked and fixed before real customers see them.",
        ],
      },
      {
        heading: "5. Launch and after-launch support",
        paragraphs: [
          "Launching means moving the software to a live server, connecting the domain name, configuring email and backups, and checking that everything is secure. After launch, plan for support. Real users always find small issues and ask for improvements. Many teams offer a monthly support arrangement covering bug fixes, security updates and small enhancements.",
          "Software is never really finished. The best results come from launching a focused first version, learning from real users and improving steadily. If you prepare your requirements, nominate a decision maker and give timely feedback, you will already be ahead of most clients.",
        ],
      },
    ],
  },
  {
    slug: "website-security-basics-for-small-business",
    title: "Website Security Basics Every Small Business Should Know",
    excerpt: "You do not need to be a big company to be a target. These practical steps protect your website, your customers and your reputation.",
    category: "Security",
    date: "2026-09-16",
    readMinutes: 6,
    intro:
      "Small businesses often assume that attackers only go after large companies. In reality, automated tools scan millions of websites every day looking for easy targets such as weak passwords or outdated software. The good news is that a handful of simple habits blocks most of these attacks.",
    sections: [
      {
        heading: "Use HTTPS everywhere",
        paragraphs: [
          "HTTPS encrypts the data travelling between your visitor and your website, so passwords and form entries cannot be read on the way. Browsers mark sites without HTTPS as \"Not secure\", which also reduces trust. Most modern hosting platforms provide free certificates that renew automatically, so there is no reason to run a business website without it.",
        ],
      },
      {
        heading: "Strong passwords and two-step verification",
        paragraphs: [
          "Weak and reused passwords are the most common way accounts are taken over. Use a different, long password for your hosting, domain, email and admin accounts, and store them in a password manager. Turn on two-step verification wherever it is offered. Even if a password leaks, the attacker still cannot log in without the second step.",
        ],
        bullets: [
          "Use at least 12 characters and avoid names or birth dates.",
          "Never share one admin login between several staff members.",
          "Remove access immediately when someone leaves the team.",
        ],
      },
      {
        heading: "Keep software updated",
        paragraphs: [
          "Outdated plugins, libraries and frameworks contain known weaknesses that attackers actively exploit. Update your website platform, plugins and dependencies regularly and remove the ones you no longer use. If you work with a developer, agree on who is responsible for updates so that it does not fall between the cracks.",
        ],
      },
      {
        heading: "Protect forms and user data",
        paragraphs: [
          "Every form on your website is a door. Validate input on the server and not only in the browser, limit how often a form can be submitted, and collect only the data you really need. Data you never collect cannot be stolen. If you store personal information, restrict access so that each staff member sees only what their job requires.",
        ],
      },
      {
        heading: "Back up and prepare",
        paragraphs: [
          "Backups are your safety net against attacks, mistakes and hardware failure. Keep automatic backups of your database and files, store at least one copy away from your main server, and test restoring a backup once in a while. A backup you have never tested is only a hope.",
          "Finally, write down what you would do if your website were hacked: who to call, how to take the site offline and how to inform customers. Having a plan turns a crisis into a manageable task.",
        ],
      },
    ],
  },
  {
    slug: "local-seo-basics-for-small-business-websites",
    title: "Local SEO Basics: Helping Customers in Your City Find Your Website",
    excerpt: "Simple, honest steps to appear when people nearby search for what you offer, without tricks or paid shortcuts.",
    category: "Digital Marketing",
    date: "2026-09-23",
    readMinutes: 6,
    intro:
      "When someone searches for a service \"near me\" or adds a city name to their search, search engines try to show nearby, trustworthy businesses. If you serve customers in a particular town, local search optimisation is one of the most cost-effective ways to be found. It rewards clear information and real activity rather than tricks.",
    sections: [
      {
        heading: "Claim and complete your Google Business Profile",
        paragraphs: [
          "A free Google Business Profile is what appears on the map and in the side panel of search results. Fill in every field: business name, address, phone number, opening hours, services and photos. Keep the name, address and phone number identical everywhere online, because consistent details help search engines trust that your business is real. Reply politely to every review, positive or negative.",
        ],
      },
      {
        heading: "Write clear pages for each service",
        paragraphs: [
          "Search engines match pages to questions. A separate page for each main service, written in simple language, answers specific searches far better than one general page. Explain what the service is, who it is for, how it works and what customers can expect. Mention the places you serve naturally, without repeating the city name in every sentence.",
        ],
        bullets: [
          "Use one clear heading that describes the page.",
          "Write short paragraphs that answer real customer questions.",
          "Add a visible phone number and contact button on every page.",
        ],
      },
      {
        heading: "Make the site fast and mobile friendly",
        paragraphs: [
          "Most local searches happen on phones. If your pages load slowly or the text is too small to read, visitors leave and search engines notice. Compress images, avoid heavy animations on the first screen and test your pages on a real phone over a normal mobile connection.",
        ],
      },
      {
        heading: "Earn trust with reviews and useful content",
        paragraphs: [
          "Ask satisfied customers to leave an honest review and make it easy by sending them the direct link. Never buy fake reviews, as search engines and customers can usually tell, and it can get your profile penalised. Publishing helpful articles that answer common questions also shows expertise and brings in visitors who are not yet ready to buy but will remember you later.",
        ],
      },
      {
        heading: "Be patient and measure",
        paragraphs: [
          "Search results take weeks or months to improve. Use free tools such as Google Search Console to see which searches bring visitors and which pages need work. Improve one thing at a time, keep what works and be wary of anyone who promises first-page results overnight.",
        ],
      },
    ],
  },
  {
    slug: "choosing-a-technology-stack",
    title: "How to Choose a Technology Stack Without Getting Lost in Buzzwords",
    excerpt: "React, Node, Python, Supabase, Firebase: what these names mean and a simple way to pick tools that suit your project.",
    category: "Software Development",
    date: "2026-09-30",
    readMinutes: 6,
    intro:
      "A technology stack is simply the set of tools used to build a product: the language for the screens, the language for the server, the database and the hosting. The choices can feel overwhelming, and developers sometimes pick tools because they are fashionable. A better approach is to choose based on your project's needs.",
    sections: [
      {
        heading: "The main layers",
        paragraphs: [
          "Most web products have three layers. The front end is what the user sees and clicks, usually built with HTML, CSS and a library such as React. The back end handles rules, accounts and data processing, using languages such as JavaScript with Node, Python or Java. The database stores information permanently, for example PostgreSQL or MySQL. Understanding these layers makes conversations with developers much easier.",
        ],
      },
      {
        heading: "Popular, well-supported tools are safer",
        paragraphs: [
          "Tools with large communities have more documentation, more ready-made components and many more developers who can maintain the project later. A niche technology may be elegant, but if its only expert leaves your team, you will struggle. For a business application, the safe choice is almost always a widely used technology.",
        ],
      },
      {
        heading: "Managed services save time",
        paragraphs: [
          "Services such as managed databases, authentication providers and hosting platforms handle security updates, scaling and backups for you. For a small team this means launching faster and spending less on maintenance. The trade-off is some dependence on the provider, so check pricing and make sure you can export your data at any time.",
        ],
        bullets: [
          "Ask how much the service costs when your usage grows.",
          "Confirm you can export all your data in a standard format.",
          "Check where the data is stored if you handle sensitive information.",
        ],
      },
      {
        heading: "Match the tool to the project",
        paragraphs: [
          "A simple company website needs very little: static pages or a light framework. A booking or ordering system needs accounts, a database and payment integration. A data-heavy product that analyses large datasets may need Python and specialised libraries. Starting with the simplest stack that meets your needs keeps costs low, and you can always add pieces later.",
        ],
      },
      {
        heading: "Think about the team",
        paragraphs: [
          "The best stack is one that your developers know well. A team that is confident in its tools builds faster, makes fewer mistakes and writes cleaner code. Ask your developer to explain why they recommend a particular stack in plain words. A good explanation mentions your goals, budget and future plans, not just the technology's popularity.",
        ],
      },
    ],
  },
  {
    slug: "build-a-student-portfolio",
    title: "How Students Can Build a Portfolio That Impresses Recruiters",
    excerpt: "Three to five well-explained projects beat a long list of tutorials. Here is how to choose, build and present them.",
    category: "Careers",
    date: "2026-10-05",
    readMinutes: 6,
    intro:
      "Freshers often worry that they have no experience. A portfolio solves this by showing what you can actually build. Recruiters reviewing hundreds of applications spend only a minute on each, so your portfolio needs to be focused, easy to open and honest about what you did.",
    sections: [
      {
        heading: "Choose projects that solve real problems",
        paragraphs: [
          "Tutorial clones such as a weather app or a to-do list are fine for learning, but they look the same in every portfolio. Pick a problem you actually know: a timetable app for your department, a simple inventory sheet for a local shop or a tool that tracks club attendance. A project with a real user, even a small one, gives you a story to tell in interviews.",
        ],
      },
      {
        heading: "Show the whole process",
        paragraphs: [
          "For every project write a short description that covers the problem, your solution, the technologies you used and what you learned. If you worked in a team, state clearly which part you built. Screenshots and a short screen recording help recruiters understand your work without installing anything.",
        ],
        bullets: [
          "Add a live link wherever possible.",
          "Link the source code on GitHub with a clear README.",
          "Mention any numbers, such as the number of users or pages handled.",
        ],
      },
      {
        heading: "Keep your GitHub tidy",
        paragraphs: [
          "Recruiters often look at your GitHub profile. Pin your best three to six repositories, give each one a readable name and write a README that explains how to run it. Commit regularly with meaningful messages. A profile with steady activity shows discipline more than one big upload before an interview.",
        ],
      },
      {
        heading: "Host a simple personal website",
        paragraphs: [
          "A one-page website with your name, a short introduction, your projects and contact links gives recruiters a single place to see everything. Free hosting platforms make it easy to publish. Keep the design clean and make sure it works well on a phone, because many recruiters will open the link from a message.",
        ],
      },
      {
        heading: "Keep learning in public",
        paragraphs: [
          "Writing short posts about what you learned, or contributing to small open-source projects, shows curiosity and communication skills. You do not need to be an expert; explaining a problem you solved is valuable to other learners and to employers. Internships and project-based programmes are also a great way to add real, team-based work to your portfolio.",
        ],
      },
    ],
  },
  {
    slug: "digital-tools-for-local-shops-and-service-businesses",
    title: "Going Digital: Practical Tools for Local Shops and Service Businesses",
    excerpt: "Billing, stock, customer records and online presence: where to start when your business still runs on paper and memory.",
    category: "Business Technology",
    date: "2026-10-12",
    readMinutes: 6,
    intro:
      "Going digital does not mean replacing everything at once. For a local shop, clinic, coaching class or workshop, the best approach is to pick the one task that costs you the most time or causes the most mistakes and fix that first. Small, steady steps are easier on staff and on the budget.",
    sections: [
      {
        heading: "Start with billing and records",
        paragraphs: [
          "Paper bills are easy to lose and hard to total at the end of the month. A simple billing tool produces clean invoices, tracks who has paid and shows what is outstanding. Customer details stored in one searchable place let you follow up, remember preferences and send reminders without searching through notebooks.",
        ],
      },
      {
        heading: "Keep track of stock and orders",
        paragraphs: [
          "Running out of a popular item or over-buying a slow one both cost money. Even a well-organised shared spreadsheet tracking items, quantities and reorder levels is a big improvement over memory. When the business grows, a small inventory application can alert you when stock is low and show which products sell best.",
        ],
        bullets: [
          "Record every purchase and sale on the same day.",
          "Set a minimum quantity for your fastest-selling items.",
          "Review slow-moving stock monthly.",
        ],
      },
      {
        heading: "Make it easy to be found and contacted",
        paragraphs: [
          "Many customers now look for a business online before visiting. A simple website with your services, address, opening hours and a click-to-call button builds trust. Combine it with a complete Google Business Profile and a WhatsApp number for enquiries, and you cover the way most local customers prefer to reach out.",
        ],
      },
      {
        heading: "Protect your data",
        paragraphs: [
          "Once information moves from paper to screens, back it up. Use cloud storage or automatic backups so that a lost phone or broken computer does not erase your records. Use separate logins for staff and keep passwords private, so you always know who changed what.",
        ],
      },
      {
        heading: "Train your team and grow gradually",
        paragraphs: [
          "The best tool is the one your staff will actually use. Choose software with simple screens, spend an hour showing each person their part and ask for feedback after a few weeks. When the basics are working smoothly, you can add online bookings, payment links or a custom application designed around the way your business works.",
        ],
      },
    ],
  },
];
