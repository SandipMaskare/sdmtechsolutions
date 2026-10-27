import { Link } from "react-router-dom";
import { LINKEDIN_URL } from "@/lib/social";

const steps = [
  ["Understand", "We start with a conversation about your business, your customers and what you want the software to achieve, and we write the goals down so everyone agrees on them."],
  ["Plan", "We break the work into small stages with clear deliverables, so you can see progress early and change direction before time is wasted."],
  ["Design", "We sketch screens and flows first, check them with you, and only then start building."],
  ["Build and test", "We build in short cycles and test each stage, including on phones, because most visitors in India use mobile devices."],
  ["Launch and support", "We help you publish the product, show your team how to use it and stay available for fixes and improvements."],
];

const AboutExtra = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-4xl space-y-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">What we do</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          SDM Technology designs and builds websites, web applications, mobile apps and business software for small and growing organisations. We also build the tools we use ourselves: our client portal, our internship platform and the online system that lets employers verify the certificates we issue.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our team works from Gondia, Maharashtra, and serves customers across India. You can read about each offering on our <Link className="text-primary hover:underline" to="/services">services page</Link>.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">How we work</h2>
        <ol className="space-y-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">{i + 1}</span>
              <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">{t}.</strong> {d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">Internships and training</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We run 8-week virtual internships in twelve domains: Full Stack, Frontend, Python, UI/UX, Graphic Design, AI and Machine Learning, Data Science, Content Writing, Digital Marketing, SEO, Quality Assurance and IT Support. Each intern receives a weekly task plan, submits work through our portal, gets reviewed by a mentor and, on completion, receives a certificate that anyone can check on our <Link className="text-primary hover:underline" to="/verify">verification page</Link>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Details and applications are on the <Link className="text-primary hover:underline" to="/internships">internships page</Link>, and our <Link className="text-primary hover:underline" to="/blog">blog</Link> has free guides for students.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">Technology we use</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our own platform is built with React, TypeScript, Tailwind CSS and Supabase, hosted on Vercel. For client projects we choose tools to fit the need, including Python, Node.js, SQL databases and cloud services, and we explain the reasons for each choice in plain language.
        </p>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">Our principles</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Clear scope and honest estimates before work begins.</li>
          <li>Regular updates, so you always know the state of your project.</li>
          <li>Secure handling of your data, as described in our <Link className="text-primary hover:underline" to="/privacy-policy">privacy policy</Link>.</li>
          <li>Practical learning for interns, with real tasks and fair, documented feedback.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">Our work and achievements</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">10 completed projects</strong> across our project-based work.</li>
          <li><strong className="text-foreground">50 interns trained</strong> through technical learning and development initiatives.</li>
          <li><strong className="text-foreground">Web development:</strong> experience in website development and modern web technologies.</li>
          <li><strong className="text-foreground">Artificial intelligence:</strong> an academic foundation in AI and technology.</li>
          <li><strong className="text-foreground">Modern web technologies:</strong> experience with Vite, React and TypeScript, with Supabase authentication and Vercel deployment in our website development work.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-4">Our approach</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          At SDM Technology we value practical problem-solving, continuous learning, technical development and responsible implementation. We aim to build solutions that address real needs while encouraging individuals to strengthen their technical skills through practical experience.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our goal is to continue developing our capabilities, delivering meaningful projects and contributing to technology education and skill development.
        </p>
        <p className="font-semibold text-foreground">SDM Technology Pvt Ltd: Technology with Purpose.</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Follow us on <a className="text-primary hover:underline" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a> or <Link className="text-primary hover:underline" to="/contact">contact us</Link>.
      </p>
    </div>
  </section>
);

export default AboutExtra;
