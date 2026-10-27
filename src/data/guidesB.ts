import type { Article } from "./articles";

export const guidesB: Article[] = [
  {
    slug: "git-and-github-for-students",
    title: "Git and GitHub for Students: A Plain-Language Guide",
    excerpt:
      "What version control is, the handful of commands you really need, and how to use GitHub to show your work to employers.",
    category: "Developer Tools",
    date: "2026-10-09",
    readMinutes: 7,
    intro:
      "Almost every software team uses Git to keep track of changes to code, and GitHub is the most common place to store and share it. Students who learn these early work more comfortably in internships and make a good impression, because their projects are organised and visible. This guide explains the ideas without jargon and gives you a routine you can start today.",
    sections: [
      {
        heading: "What problem does Git solve?",
        paragraphs: [
          "Imagine saving files named final, final2 and really_final. You soon lose track of which one is correct, and if two people edit at once, someone's work is overwritten. Git solves this by recording a history of your project. Every saved step, called a commit, stores what changed, when and with what message. You can go back to any earlier step, compare versions and work on new ideas without breaking the working version.",
        ],
      },
      {
        heading: "Key words you will see",
        paragraphs: [
          "A repository is the folder that Git tracks, together with its history. A commit is a saved snapshot of your changes. A branch is a separate line of work, so you can try something new without affecting the main version. A remote is a copy of the repository stored online, for example on GitHub. Pushing sends your commits to the remote, and pulling brings other people's commits to your computer.",
        ],
      },
      {
        heading: "The daily routine in five commands",
        paragraphs: [
          "Most of the time you need only a few commands. Check what changed, choose what to save, save it with a message, and send it online.",
        ],
        bullets: [
          "git status shows which files have changed.",
          "git add followed by a file name selects the changes to save.",
          "git commit with a message stores the snapshot in the history.",
          "git push sends your commits to GitHub.",
          "git pull downloads new commits from GitHub.",
        ],
      },
      {
        heading: "Write commit messages that help",
        paragraphs: [
          "A message such as fix stuff tells nobody anything. Write a short sentence that says what changed and why, for example Add validation to the signup form. Small, focused commits are easier to understand and to undo than one giant commit at the end of the week. Reviewers and teammates will thank you.",
        ],
      },
      {
        heading: "Use branches and pull requests",
        paragraphs: [
          "When you want to add a feature, create a new branch, do the work there and open a pull request on GitHub. A pull request shows exactly what changed and lets others comment before the change is merged into the main branch. This is how professional teams review each other's work, so practising it in your own projects prepares you for a real job.",
          "If two people change the same lines, Git asks you to resolve a conflict. Do not panic. Open the file, decide which version to keep or combine both, save and commit. Conflicts become easy after you have solved two or three.",
        ],
      },
      {
        heading: "Make your GitHub profile work for you",
        paragraphs: [
          "Recruiters often look at a candidate's GitHub page. Pin your best three projects, give each a clear README that explains what it does, how to run it and what you learned, and add screenshots. Commit regularly rather than uploading everything at once, because a steady history shows consistent effort.",
          "Never upload passwords, API keys or private data. Use a file named .gitignore to keep secret files out of the repository, and if you ever commit a secret by mistake, change it immediately because it may already be visible.",
        ],
      },
    ],
  },
  {
    slug: "technical-interview-preparation-for-freshers",
    title: "How to Prepare for a Technical Interview as a Fresher",
    excerpt:
      "A practical preparation plan covering fundamentals, projects, problem solving and communication, with common questions to practise.",
    category: "Careers",
    date: "2026-10-10",
    readMinutes: 8,
    intro:
      "A technical interview can feel intimidating when you have little work experience, but interviewers know that and adjust their expectations. They want to see that you understand the basics, can reason through a problem and can talk about your own projects honestly. With two or three weeks of organised preparation, most freshers can improve their performance noticeably.",
    sections: [
      {
        heading: "Know what the interviewer is looking for",
        paragraphs: [
          "For entry-level roles, interviewers usually assess four things: how well you know the fundamentals of your field, how you break down a problem, how well you can explain your projects and how you behave as a future teammate. Nobody expects you to know everything. A candidate who says I am not sure, but here is how I would find out, often does better than one who guesses confidently and is wrong.",
        ],
      },
      {
        heading: "Revise the fundamentals",
        paragraphs: [
          "Go back to the basics of the role you are applying for. For a developer this means the main concepts of your language, data structures such as arrays, lists, stacks, queues and hash maps, basic database ideas, how the web works and what happens when you type an address into a browser. Write short answers in your own words, because being able to explain a concept simply is proof that you understand it.",
        ],
        bullets: [
          "Object-oriented ideas: classes, inheritance, encapsulation, polymorphism.",
          "Databases: primary keys, joins, normalisation and simple SQL queries.",
          "Web basics: HTTP methods, status codes, cookies and sessions.",
          "Version control: commit, branch, merge and pull request.",
        ],
      },
      {
        heading: "Practise problem solving out loud",
        paragraphs: [
          "Solve a few coding problems each day, starting with easy ones, and always explain your thinking aloud. A good routine is to restate the problem, ask about edge cases, describe a simple approach, write the code and then test it with an example. Interviewers care about how you think as much as about the final answer. If you get stuck, say what you have tried and what you plan next instead of going silent.",
          "Do not memorise solutions. Learn the patterns, such as using two pointers, counting with a hash map or breaking a problem into smaller steps, so you can apply them to new questions.",
        ],
      },
      {
        heading: "Prepare to talk about your projects in depth",
        paragraphs: [
          "Expect questions such as why you chose a particular technology, what the hardest bug was and what you would improve. Prepare a two-minute summary of each project covering the problem, your role, the tools you used and the result. If you worked in a team, be clear about what you personally did. Anything on your resume can be asked about, so remove skills you cannot discuss.",
        ],
      },
      {
        heading: "Handle the common non-technical questions",
        paragraphs: [
          "You will almost certainly be asked to introduce yourself, explain why you want the role and describe a challenge you overcame. Prepare short, honest answers with specific examples. Research the company so that you can say something real about why you want to work there. Prepare two or three questions of your own, such as how new team members are mentored or what a typical first project looks like.",
        ],
      },
      {
        heading: "On the day",
        paragraphs: [
          "Test your internet connection and tools for an online interview, keep a notebook and water nearby, and join a few minutes early. Listen to the whole question before answering, and ask for clarification when needed. If you make a mistake, correct it calmly and move on. After the interview, send a short thank-you message. Whatever the result, write down the questions you found difficult and study them, because every interview is practice for the next one.",
        ],
      },
    ],
  },
  {
    slug: "seo-basics-for-new-websites",
    title: "SEO Basics for a New Website: What Actually Matters",
    excerpt:
      "How search engines find and rank pages, and the practical steps new site owners should take on content, structure, speed and links.",
    category: "Digital Marketing",
    date: "2026-10-11",
    readMinutes: 8,
    intro:
      "Search engine optimisation, or SEO, is the practice of helping people find your website when they search. A new site starts with no reputation, so patience and good habits matter more than tricks. The steps below apply to business sites, blogs and portfolios, and none of them requires paid tools to begin.",
    sections: [
      {
        heading: "How search engines work in simple terms",
        paragraphs: [
          "Search engines send programs called crawlers to visit pages and follow links. They store what they find in a huge index. When someone searches, the engine picks pages from the index that best match the question and ranks them using many signals, including how useful the content is, how well the page works on a phone and whether other trusted sites link to it.",
          "This means your first job is to make sure your pages can be found and understood, and your second is to make them genuinely useful.",
        ],
      },
      {
        heading: "Start with the people who search",
        paragraphs: [
          "Write down the questions your customers or readers actually ask. A local web design company might hear how much a business website costs, how long it takes to build and whether a shop needs an online store. Each question can become a page or a section. Use the same words people use, not only technical terms.",
          "Check what already appears for a search by typing the question into a search engine and reading the top results. Notice what they cover, and aim to be clearer, more complete or more local.",
        ],
      },
      {
        heading: "Page titles, descriptions and headings",
        paragraphs: [
          "Each page needs its own title that says what the page is about, ideally in under 60 characters, with the main phrase near the beginning. The meta description is the short text that may appear under the title in results, so write it as a helpful summary of about 150 characters. Use one main heading and break the content with clear sub-headings, because they help both readers and search engines.",
        ],
        bullets: [
          "Do not repeat the same title on different pages.",
          "Describe images with short alt text, which also helps accessibility.",
          "Use readable addresses such as /blog/seo-basics-for-new-websites.",
        ],
      },
      {
        heading: "Write content worth reading",
        paragraphs: [
          "Thin or copied pages rarely rank, and they may be ignored completely. Write original, detailed pages that answer the question properly, include examples and are updated when things change. Show who is behind the site with an About page and real contact details, because trust matters. Avoid stuffing the same phrase repeatedly. Write naturally, and the related words will appear on their own.",
        ],
      },
      {
        heading: "Technical basics that help",
        paragraphs: [
          "Make sure the site works well on mobile, loads quickly and uses HTTPS. Submit a sitemap, which is a list of your pages, through Google Search Console, and use the same tool to see which searches show your site and whether any pages have problems. Fix broken links, and make sure important content is available in the page itself rather than hidden behind a login or loaded only after many scripts run.",
        ],
      },
      {
        heading: "Local presence and links",
        paragraphs: [
          "If you serve a particular town or region, create and complete a Google Business Profile with accurate name, address, phone number and hours, and ask satisfied customers for honest reviews. Other websites linking to you is a strong signal, but it should come from real relationships, such as local directories, partners, college websites and articles other people find worth sharing. Buying bulk links can harm your site.",
        ],
      },
      {
        heading: "Be patient and measure",
        paragraphs: [
          "SEO results usually take weeks or months to show. Track which pages get visits and which searches bring them, improve the pages that are close to the first page, and keep publishing useful content on a regular schedule. Steady work beats a one-time burst of effort.",
        ],
      },
    ],
  },
  {
    slug: "how-to-write-a-technical-blog-post",
    title: "How to Write a Technical Blog Post That People Actually Read",
    excerpt:
      "A repeatable method for planning, drafting and polishing technical articles, useful for students building a portfolio and companies sharing expertise.",
    category: "Content Writing",
    date: "2026-10-12",
    readMinutes: 7,
    intro:
      "Writing about what you learn is one of the best ways to understand it, and a good article can bring visitors, build trust and open doors to jobs. Technical writing is not about long words. It is about making a hard idea clear to a particular reader. This guide gives you a method you can repeat for every post.",
    sections: [
      {
        heading: "Choose a reader and a single question",
        paragraphs: [
          "Decide exactly who the post is for, such as a first-year student, a small shop owner or a developer new to React. Then pick one question it answers, for example How do I connect a form to a database? Posts that try to cover everything end up helping nobody. If your outline has more than one big question, split it into two posts.",
        ],
      },
      {
        heading: "Make an outline before you write",
        paragraphs: [
          "List the steps a reader must go through to reach the answer. Start with the problem, explain the key idea, show the solution and finish with what to do next. Putting the outline in order saves time, and it shows gaps in your own understanding before you start writing paragraphs.",
        ],
        bullets: [
          "Opening: the problem, and who is affected by it.",
          "Body: two to five sections, each with a clear heading.",
          "Closing: a short summary and a suggested next step.",
        ],
      },
      {
        heading: "Write a strong opening",
        paragraphs: [
          "The first lines decide whether people continue. State the problem in terms the reader recognises, say what they will be able to do after reading, and move straight into the content. Avoid long introductions about the history of the internet.",
        ],
      },
      {
        heading: "Explain with examples",
        paragraphs: [
          "Abstract descriptions are forgotten, but a concrete example sticks. After introducing an idea, show a small piece of code, a diagram or a real situation. Keep code short, test it before publishing and explain what each important line does. Use plain words, short sentences and the same term for the same thing throughout, because switching names confuses readers.",
          "If you use a tool or a number, say where it came from. If you are not sure about something, say so or check it. Accuracy is the foundation of trust.",
        ],
      },
      {
        heading: "Structure for scanning",
        paragraphs: [
          "Many readers skim first. Use descriptive headings, short paragraphs and occasional lists so that someone can see the shape of the article in a few seconds. Bold only the few phrases that really matter. Add an image or diagram where it explains something faster than words can.",
        ],
      },
      {
        heading: "Edit like a stranger",
        paragraphs: [
          "Leave the draft for a day, then read it aloud. Cut sentences that repeat earlier ones, replace vague words with exact ones and check that every promise in the opening is fulfilled. Ask a friend from your target audience to read it and tell you where they got lost. Fix spelling and links, then give the post a clear title that includes the main topic.",
        ],
      },
      {
        heading: "Publish, share and keep improving",
        paragraphs: [
          "Publish on your own website or a platform where your audience reads, add a short summary for social media and answer comments politely. Come back every few months to update examples and fix anything outdated. A small library of accurate, useful articles becomes more valuable over time, and it demonstrates your knowledge better than any list of skills.",
        ],
      },
    ],
  },
  {
    slug: "get-the-most-from-a-virtual-internship",
    title: "How to Get the Most Out of a Virtual Internship",
    excerpt:
      "Practical habits for managing time, communicating with mentors, delivering tasks and turning an online internship into real career value.",
    category: "Internships",
    date: "2026-10-13",
    readMinutes: 7,
    intro:
      "A virtual internship gives you flexibility, but it also asks for self-discipline. Nobody sits next to you reminding you of deadlines, so success depends on your habits. Interns who treat an online programme with the same seriousness as an office job usually finish with better skills, better references and stronger projects to show.",
    sections: [
      {
        heading: "Set up before day one",
        paragraphs: [
          "Prepare a quiet place to work, a reliable internet connection and a backup option such as mobile data. Install the tools you will need and test them. Read all the instructions you receive, note the schedule and add deadlines to a calendar with reminders. Starting prepared sets the tone for the whole programme.",
        ],
      },
      {
        heading: "Plan your week",
        paragraphs: [
          "At the beginning of each week, list the tasks, estimate how long each will take and block time for them. Do the hardest task when you are most alert. Break large tasks into small steps with their own mini-deadlines, so that you are never facing a single huge job the night before submission.",
          "If you realise a deadline is at risk, tell your mentor early and explain what you have done and what you need. Early warning is a sign of responsibility. Silence is what causes problems.",
        ],
      },
      {
        heading: "Communicate clearly and professionally",
        paragraphs: [
          "In remote work, writing replaces body language, so write clear messages. Say what you are asking, what you have already tried and by when you need an answer. Keep a polite, respectful tone, respond within a reasonable time and confirm important points in writing. When you ask for help, include screenshots, error messages or links so that the person can help without extra questions.",
        ],
        bullets: [
          "Ask questions after you have spent a reasonable time trying to solve the problem.",
          "Summarise decisions in a short message so that everyone shares the same understanding.",
          "Say thank you when someone gives feedback or help.",
        ],
      },
      {
        heading: "Treat feedback as the main prize",
        paragraphs: [
          "Reviews of your work are the most valuable part of an internship, because they show you what to improve. When a task comes back with comments, read them carefully, thank the reviewer, fix the issues and note the lesson for next time. Do not take comments personally. Every professional receives them throughout their career, and people who handle them well grow quickly.",
        ],
      },
      {
        heading: "Build proof as you go",
        paragraphs: [
          "Keep a record of what you complete. Save links, screenshots, short descriptions and the result of each task. Write down which skills you used. At the end you will have material for your resume, your portfolio and your LinkedIn profile. A certificate that employers can verify online, combined with real work samples, makes your claim more believable.",
        ],
      },
      {
        heading: "Make the connections count",
        paragraphs: [
          "Be active in the team channels, help other interns when you can and thank mentors publicly. At the end of the programme, ask for feedback and, if appropriate, a recommendation on LinkedIn. Stay in touch by sharing your progress after a few months. Relationships formed in an internship often lead to referrals and opportunities that you would not find in a job listing.",
        ],
      },
      {
        heading: "Finish strong",
        paragraphs: [
          "Submit your final work on time, make sure it is organised and documented, and write a short reflection on what you learned and what you want to learn next. Completing every task, even when motivation drops in the middle, is what separates people who benefit from internships from those who simply attend them.",
        ],
      },
    ],
  },
];
