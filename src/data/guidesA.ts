import type { Article } from "./articles";

export const guidesA: Article[] = [
  {
    slug: "full-stack-developer-roadmap-for-beginners",
    title: "Full Stack Developer Roadmap for Beginners: What to Learn and in What Order",
    excerpt:
      "A step-by-step learning path from HTML and CSS to databases and deployment, with realistic timelines and projects for each stage.",
    category: "Web Development",
    date: "2026-10-04",
    readMinutes: 8,
    intro:
      "Full stack development means you can build both the part of a website people see and the part that stores data and applies rules behind the scenes. The list of tools is long, and beginners often jump between tutorials without finishing anything. This roadmap puts the topics in a sensible order, so each stage prepares you for the next and ends with something you can show to others.",
    sections: [
      {
        heading: "Stage 1: The web basics (weeks 1 to 4)",
        paragraphs: [
          "Start with HTML for structure and CSS for appearance. Learn how headings, links, images, forms and tables work, then practise layout with flexbox and grid. Do not try to memorise every property. Instead, rebuild simple pages you like, such as a restaurant menu page or a personal profile, until the layout feels natural.",
          "Add responsive design early. Most visitors in India use a phone, so every page you build should look right at narrow widths. Test by resizing your browser window and by opening the page on a real phone.",
        ],
        bullets: [
          "Project: a one-page personal website with a contact form.",
          "Skills to check: semantic tags, forms, flexbox, grid, media queries.",
        ],
      },
      {
        heading: "Stage 2: JavaScript properly (weeks 5 to 10)",
        paragraphs: [
          "JavaScript is where most beginners struggle, so give it time. Learn variables, functions, arrays, objects, loops and conditions first. Then move on to working with the page: selecting elements, reacting to clicks and changing content. Finally learn asynchronous code, meaning how to fetch data from a server using promises and async functions.",
          "A useful rule is to write small programs by hand instead of only copying. A to-do list, a quiz, a tip calculator and a weather lookup using a public API will teach you more than watching many hours of video.",
        ],
        bullets: [
          "Project: a to-do app that saves tasks in the browser.",
          "Project: a small app that loads data from a public API and shows it as cards.",
        ],
      },
      {
        heading: "Stage 3: A front-end framework (weeks 11 to 16)",
        paragraphs: [
          "Once plain JavaScript feels comfortable, learn one framework. React is a common choice and has many learning resources. Focus on components, props, state and handling forms. Learn how to move between pages with a router and how to fetch and display data.",
          "Do not start with a framework before you understand JavaScript. People who do usually get stuck when something breaks, because they cannot tell whether the problem is in their code or in the framework.",
        ],
      },
      {
        heading: "Stage 4: Back end and databases (weeks 17 to 24)",
        paragraphs: [
          "Choose one server-side language, such as Node.js with JavaScript or Python, and learn how to build an API. An API is a set of addresses your front end calls to read or change data. Learn the basic operations of creating, reading, updating and deleting records, and learn how to validate the data that arrives.",
          "Next learn a database. Start with a relational database and plain SQL queries so you understand tables, keys and joins. Then learn authentication: how users sign up, log in and stay logged in, and why passwords must never be stored in plain text.",
        ],
        bullets: [
          "Project: a notes app where each user logs in and sees only their own notes.",
          "Skills to check: REST endpoints, SQL, password hashing, sessions or tokens.",
        ],
      },
      {
        heading: "Stage 5: Tools, deployment and teamwork",
        paragraphs: [
          "Learn Git and GitHub for tracking changes and collaborating. Learn how to deploy a project so that it has a real web address, and how to keep secrets such as database passwords out of your code. Practise reading error messages and logs, because debugging is a large part of daily work.",
          "At this stage, build one larger project from start to finish, for example a small booking system or a student attendance tracker. Write a short README that explains what it does, how to run it and which technologies it uses.",
        ],
      },
      {
        heading: "How to know you are ready to apply",
        paragraphs: [
          "You are ready for an internship or an entry-level role when you can build a small full stack application without following a tutorial, explain how data moves from the browser to the database and back, and describe one bug you found and how you fixed it. Perfection is not required. Employers look for people who can learn, finish work and communicate clearly.",
          "Keep your code public on GitHub, link your best two projects on your resume, and be ready to explain every decision you made in them.",
        ],
      },
    ],
  },
  {
    slug: "how-to-choose-an-internship-domain",
    title: "How to Choose the Right Internship Domain When You Are Not Sure",
    excerpt:
      "A simple way to compare development, design, data, marketing and testing internships using your interests, strengths and career plans.",
    category: "Internships",
    date: "2026-10-05",
    readMinutes: 7,
    intro:
      "Many students apply to an internship in whichever domain looks popular that year, then find out a month later that they do not enjoy the daily work. Choosing well takes a little thinking, not a perfect plan. This guide shows how to compare domains using what you already enjoy, what you are good at and where you want to be in a few years.",
    sections: [
      {
        heading: "Know what each domain actually involves day to day",
        paragraphs: [
          "Job titles can hide what people really do. A developer spends most of the day reading existing code, fixing errors and writing small pieces of new code. A designer researches users, sketches screens and revises them after feedback. A data analyst cleans messy tables and explains findings to people who are not technical. A marketing or SEO intern writes, measures results and keeps testing small changes. A tester tries to break software on purpose and records exactly how it failed.",
          "Imagine doing one of these for six hours. If the idea feels interesting rather than tiring, it is worth a closer look.",
        ],
      },
      {
        heading: "Look at your interests first",
        paragraphs: [
          "Think about the last time you lost track of time while working on something. Was it making a page look better, solving a puzzle, organising information or explaining something to a friend? These are clues. Puzzles and logic point towards programming and data. Visual details and empathy for users point towards design. Writing and curiosity about people point towards content and marketing.",
        ],
        bullets: [
          "Enjoy building things and fixing problems: Full Stack, Frontend, Python.",
          "Enjoy patterns, numbers and questions: Data Science, AI and Machine Learning.",
          "Enjoy visuals and user comfort: UI/UX, Graphic Design.",
          "Enjoy words, social media and growth: Content, Digital Marketing, SEO.",
          "Enjoy being careful and thorough: Quality Assurance, IT Support.",
        ],
      },
      {
        heading: "Check the foundations you already have",
        paragraphs: [
          "Your current skills decide how steep the first weeks will feel. Some domains need a base, for example programming logic for Python or Data Science, while others can be started with basic computer skills, such as content writing or IT support. This does not mean you should avoid a harder domain. It means you should plan extra learning time before the internship starts.",
          "If you have a free week, try a small experiment in two domains. Build a simple page, write a short article, and sketch a screen on paper. Notice which one you want to keep working on.",
        ],
      },
      {
        heading: "Think about the job you want after graduation",
        paragraphs: [
          "Look at five job listings for roles you might want in two or three years. Note the skills that appear in most of them. If most mention React, databases and Git, a development internship builds the right base. If they mention analytics tools and reporting, a data or marketing internship fits better. An internship is your first piece of evidence that you can do the work, so it should match the direction of your applications.",
        ],
      },
      {
        heading: "Check what the internship will give you",
        paragraphs: [
          "Compare programmes by what you will actually do, not by the length of the brochure. Ask whether you get real tasks with deadlines, whether someone reviews your work and tells you how to improve, and whether you finish with something to show, such as a project link or a certificate that an employer can verify. Practical work with feedback is worth much more than a list of lectures.",
        ],
      },
      {
        heading: "It is fine to change later",
        paragraphs: [
          "Your first internship does not lock you in. Many people move between related domains, for example from design to front-end development or from content writing to SEO, and the skills carry over. What matters is that you finish what you start, learn how professional work is organised and collect proof of your effort. Pick the domain that you can commit to for the full duration, and use the experience to decide your next step.",
        ],
      },
    ],
  },
  {
    slug: "beginners-path-into-ai-and-machine-learning",
    title: "A Beginner's Path into AI and Machine Learning Without a Maths Degree",
    excerpt:
      "What to learn first, which tools to use and how to build your first projects if you are new to artificial intelligence and machine learning.",
    category: "AI and Data",
    date: "2026-10-06",
    readMinutes: 8,
    intro:
      "Artificial intelligence sounds like a field only for experts with advanced degrees, but the entry point is more practical than most people expect. You need to be comfortable with basic programming, a little statistics and a habit of testing your ideas. This guide describes a path you can follow in a few months, and explains the common mistakes that slow beginners down.",
    sections: [
      {
        heading: "Understand the difference between the terms",
        paragraphs: [
          "Artificial intelligence is the broad idea of software that performs tasks that normally need human judgement. Machine learning is a way of building such software by letting it find patterns in examples rather than following rules you wrote by hand. Deep learning is a type of machine learning that uses large networks and is behind many modern tools for images and language.",
          "Knowing these terms helps you read articles and job descriptions without confusion, and it helps you decide where to start. For most beginners, ordinary machine learning on tables of data is the best first step.",
        ],
      },
      {
        heading: "Learn Python and data handling first",
        paragraphs: [
          "Python is the most common language for this field. Learn the basics of variables, functions, lists, dictionaries and loops, then move on to working with data using NumPy and pandas. You should be able to load a file, clean missing values, filter rows, group results and draw a simple chart before you try to train any model.",
          "Many people skip this stage and then spend weeks confused by errors that are really data problems. Real data is messy, and learning to clean it is a core skill, not a side task.",
        ],
        bullets: [
          "Practise: load a CSV file, find missing values, fix them and summarise the columns.",
          "Practise: draw three charts that answer three different questions about the data.",
        ],
      },
      {
        heading: "Learn just enough statistics",
        paragraphs: [
          "You do not need advanced mathematics to start, but you do need a few ideas. Learn mean, median, spread, correlation and what a probability is. Learn the difference between training data and test data and why a model must be checked on examples it has never seen. This last idea protects you from the most common mistake in the field, which is believing a model is good because it works on the data it was trained on.",
        ],
      },
      {
        heading: "Train your first models",
        paragraphs: [
          "Use the scikit-learn library to train simple models such as linear regression, decision trees and random forests. Choose a small, clear problem, for example predicting house prices from a table of features or classifying whether a message is spam. Split the data, train the model, check the results and write down what you learned.",
          "Pay attention to measuring performance with the right numbers. For a prediction of a value you might use the average error. For a yes or no problem, accuracy alone can mislead when one answer is much more common than the other, so look at precision and recall too.",
        ],
      },
      {
        heading: "Move on to deeper topics only when you are ready",
        paragraphs: [
          "After you are comfortable with the basics, explore neural networks with a library such as TensorFlow or PyTorch, and look at areas that interest you, such as text, images or recommendations. Learn how to use pre-trained models and public AI services, because in real projects they often save time compared with training everything from scratch.",
          "Learn also about responsible use. Models can reflect unfair patterns in their data, and they can be wrong with great confidence. A good practitioner checks results, explains limits and does not oversell.",
        ],
      },
      {
        heading: "Build projects that show your thinking",
        paragraphs: [
          "Employers want to see that you can take a question from start to finish. Pick a problem, collect or find data, clean it, build a model, evaluate it honestly and explain the result in plain language. Publish the notebook and a short write-up on GitHub. Two or three clear projects with honest conclusions are worth more than ten copied tutorials.",
          "Ideas to start with include predicting student performance from study habits, grouping customers by buying behaviour, or building a small tool that summarises or categorises text.",
        ],
      },
    ],
  },
  {
    slug: "python-for-beginners-first-30-days",
    title: "Python for Beginners: A Practical 30-Day Plan",
    excerpt:
      "A week-by-week plan to go from zero to writing useful Python programs, with exercises that teach the habits professionals rely on.",
    category: "Programming",
    date: "2026-10-07",
    readMinutes: 7,
    intro:
      "Python is popular with beginners because its code reads almost like plain English, and it is used in web development, automation, data analysis and artificial intelligence. Learning it in a month is realistic if you practise every day and build small programs. This plan breaks the month into four weeks, each with a clear goal.",
    sections: [
      {
        heading: "Week 1: The building blocks",
        paragraphs: [
          "Install Python and a code editor, then learn how to run a script. Cover variables, numbers, text, input and output, and conditions using if and else. Write tiny programs every day, such as a program that asks for a name and prints a greeting, a tip calculator, and a program that tells whether a number is even or odd.",
          "The goal of the first week is to become comfortable typing code, running it and reading the error message when it fails. Error messages are not a sign that you are bad at this. They are the main way Python tells you what to fix.",
        ],
        bullets: [
          "Daily habit: type every example yourself rather than pasting it.",
          "Exercise: build a simple unit converter for kilometres and miles.",
        ],
      },
      {
        heading: "Week 2: Repeating and organising",
        paragraphs: [
          "Learn loops with for and while, then lists, tuples, dictionaries and sets. These let you handle many values at once. Learn how to write functions so that you can reuse your code and give each piece of logic a clear name. Practise by writing a program that stores contacts in a dictionary, a program that counts how often each word appears in a sentence, and a number guessing game.",
        ],
      },
      {
        heading: "Week 3: Files, errors and modules",
        paragraphs: [
          "Real programs read and write files, so learn how to open a text file and a CSV file, process the lines and save results. Learn to handle errors with try and except so that your program does not crash when a file is missing or the user types something unexpected. Import modules from the standard library, such as random, datetime and json, and see how much work they save you.",
          "A good exercise is an expense tracker that reads a CSV file of spending, groups it by category and prints a short summary.",
        ],
      },
      {
        heading: "Week 4: Objects and a final project",
        paragraphs: [
          "Learn the basics of classes and objects, which help you model things such as a student, a product or a bank account. Then use everything you know to build a small project from start to finish. Good choices are a quiz game that stores scores, a command-line library manager, or a script that renames and sorts files in a folder.",
          "Write a short description of how to run it, and put the code on GitHub. Finishing and sharing a project teaches you far more than starting five and abandoning them.",
        ],
      },
      {
        heading: "Habits that make you improve faster",
        paragraphs: [
          "Practise a little every day instead of for many hours once a week, because memory builds with repetition. Read other people's code to see different ways of solving the same problem. When you are stuck, describe the problem in writing before searching for help. Often the act of explaining it shows you the answer, and if it does not, you can ask a clearer question.",
          "Use meaningful names for variables, keep functions short and add a comment when the reason for something is not obvious. These habits are what make code easy to maintain, and teams value them highly.",
        ],
      },
      {
        heading: "Where to go after 30 days",
        paragraphs: [
          "Choose a direction. For web development, learn a framework such as Flask or Django. For data work, learn pandas and charting. For automation, learn how to work with web pages and files. Keep building small projects in that direction, and consider joining an internship where you can work on tasks with a reviewer who points out how to improve.",
        ],
      },
    ],
  },
  {
    slug: "ui-ux-design-basics-for-developers-and-students",
    title: "UI/UX Design Basics Every Developer and Student Should Know",
    excerpt:
      "Core ideas about layout, colour, typography, accessibility and user research that make websites and apps easier to use.",
    category: "Design",
    date: "2026-10-08",
    readMinutes: 7,
    intro:
      "A product can work perfectly and still frustrate people if it is confusing to use. UI design is about how an interface looks, while UX design is about how it feels to use from the first tap to the final goal. You do not need to be an artist to apply the basics. This article covers the ideas that improve almost every screen you will build or design.",
    sections: [
      {
        heading: "Start with the user, not the screen",
        paragraphs: [
          "Before opening a design tool, write down who will use the product, what they want to achieve and what might stop them. A student checking exam results on a slow phone has different needs from an office worker managing invoices on a large monitor. Talking to even five real users shows problems you would never guess alone.",
          "Turn what you learn into a short list of tasks, such as find a course, apply, and track the application. Every screen should help with one of these tasks.",
        ],
      },
      {
        heading: "Create a clear visual hierarchy",
        paragraphs: [
          "Hierarchy tells the eye what to look at first. Make the most important thing the biggest or the strongest in colour, and make supporting information smaller and quieter. A page where everything is bold, large and coloured gives the user nothing to follow.",
          "Use consistent spacing. White space is not wasted space. It separates groups and gives the content room to breathe. Keep related items close together and add more space between unrelated groups.",
        ],
      },
      {
        heading: "Choose type and colour with restraint",
        paragraphs: [
          "Use no more than two typefaces. Choose a readable body size, usually at least 16 pixels on screens, and keep lines to about 60 to 80 characters. Pick one main colour for actions and a small set of neutral colours for everything else. Use colour to carry meaning consistently, for example red only for errors and green for success.",
        ],
        bullets: [
          "Check contrast between text and background so that it can be read in sunlight.",
          "Never use colour alone to show a state, add an icon or a label too.",
        ],
      },
      {
        heading: "Make navigation and actions obvious",
        paragraphs: [
          "People should always know where they are, where they can go and what will happen when they press a button. Use clear labels such as Apply now or Save changes instead of vague words. Keep the main action visible, and keep the number of choices small on each screen. Forms should ask only for what is needed, group related fields and show errors next to the field that needs fixing.",
          "Design for touch. Buttons should be large enough to tap comfortably and have space around them so that users do not press the wrong one.",
        ],
      },
      {
        heading: "Design for everyone",
        paragraphs: [
          "Accessibility improves the experience for all users. Provide text descriptions for images, make sure the page can be used with a keyboard, keep text large enough and avoid flashing content. These practices also help people who are using a phone in bright light or with a poor connection.",
        ],
      },
      {
        heading: "Test early and improve in small steps",
        paragraphs: [
          "Draw rough sketches first, then build a clickable prototype and ask someone to complete a task while you watch without helping. Note where they hesitate or tap the wrong thing. Fix the biggest problems and test again. Design is a cycle of making, observing and improving, not a single moment of inspiration.",
          "Keep a portfolio with before and after examples that explain the problem, your decision and the result. That story shows employers how you think, which matters more than polished visuals alone.",
        ],
      },
    ],
  },
];
