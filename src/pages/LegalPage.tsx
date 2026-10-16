import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

type Kind = "privacy" | "terms" | "disclaimer";

const EMAIL = "sdmtechnologies.pvtltd@gmail.com";
const UPDATED = "16 October 2026";

interface Block { h: string; p: string[] }

const docs: Record<Kind, { title: string; desc: string; blocks: Block[] }> = {
  privacy: {
    title: "Privacy Policy",
    desc: "How SDM Technology collects, uses and protects your information, including cookies and Google AdSense advertising.",
    blocks: [
      { h: "Who we are", p: [
        "SDM Technology (\"we\", \"us\") is a software development and IT services company based in Gondia, Maharashtra, India. This website, https://www.sdmtechsolution.com, provides information about our services, internships and careers. You can contact us at " + EMAIL + " or +91 7038523408.",
      ]},
      { h: "Information we collect", p: [
        "Information you give us: when you create an account, contact us, apply for a job or internship, or use our chat, we collect details such as your name, email address, phone number, date of birth, resume and the content of your message.",
        "Information collected automatically: like most websites, we and our service providers may collect technical data such as your IP address, browser type, device information, pages visited and the time of your visit.",
      ]},
      { h: "How we use your information", p: [
        "We use your information to respond to enquiries, create and secure your account, process applications, issue internship letters, send service-related emails such as verification codes and confirmations, improve our website and protect it from misuse. We do not sell your personal information.",
      ]},
      { h: "Cookies and advertising", p: [
        "Our website uses cookies and similar technologies to keep you signed in and to understand how the site is used. Third-party vendors, including Google, use cookies to serve ads based on a user's previous visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and other sites on the internet.",
        "You may opt out of personalised advertising by visiting Google Ads Settings (https://adssettings.google.com). You can also control cookies through your browser settings. Blocking some cookies may affect how parts of the site work.",
      ]},
      { h: "Service providers", p: [
        "We use trusted providers to run the website, including hosting, database and authentication services and email delivery. These providers process data on our behalf and only as needed to provide their services.",
      ]},
      { h: "Data security and retention", p: [
        "We use reasonable technical and organisational measures, including encrypted connections (HTTPS) and access controls, to protect your information. We keep personal data only as long as needed for the purposes described above or as required by law. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
      ]},
      { h: "Your choices and rights", p: [
        "You may ask us to access, correct or delete the personal information we hold about you by emailing " + EMAIL + ". We will respond within a reasonable time. You can also unsubscribe from non-essential emails at any time.",
      ]},
      { h: "Children", p: [
        "Our services are not directed to children under 16, and we do not knowingly collect their personal information. If you believe a child has given us information, please contact us and we will delete it.",
      ]},
      { h: "Changes to this policy", p: [
        "We may update this policy from time to time. The latest version will always be published on this page with the date of the last update shown below.",
      ]},
    ],
  },
  terms: {
    title: "Terms of Use",
    desc: "The terms that apply when you use the SDM Technology website, accounts, internship and career services.",
    blocks: [
      { h: "Acceptance of terms", p: [
        "By using the SDM Technology website you agree to these terms. If you do not agree, please do not use the site.",
      ]},
      { h: "Using the website", p: [
        "You agree to use the website lawfully and not to attempt to gain unauthorised access to accounts or systems, interfere with its operation, upload harmful code or submit false information. We may suspend or remove accounts that break these rules.",
      ]},
      { h: "Accounts", p: [
        "You are responsible for keeping your login details confidential and for all activity under your account. Please give accurate information when registering and tell us promptly if you suspect unauthorised use.",
      ]},
      { h: "Internships, jobs and applications", p: [
        "Submitting an application does not guarantee an interview, offer or placement. Offers, fees (if any) and conditions are communicated in writing in the offer letter and its schedule. Please read them carefully before accepting. Any document processing or similar fee will be stated clearly in the offer documents.",
      ]},
      { h: "Intellectual property", p: [
        "The content of this website, including text, articles, graphics and logos, belongs to SDM Technology or its licensors and is protected by law. You may read and share links to our pages, but you may not copy or republish our content for commercial use without written permission.",
      ]},
      { h: "Third-party links and advertising", p: [
        "The website may contain links to other websites and advertisements served by third parties such as Google. We do not control those sites or ads and are not responsible for their content or practices.",
      ]},
      { h: "Limitation of liability", p: [
        "We try to keep the information on this website accurate and available, but we provide it \"as is\" without warranties of any kind. To the extent permitted by law, SDM Technology is not liable for any indirect or consequential loss arising from your use of the site.",
      ]},
      { h: "Governing law and contact", p: [
        "These terms are governed by the laws of India. Courts in Maharashtra will have jurisdiction over any dispute. For questions about these terms, email " + EMAIL + ".",
      ]},
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    desc: "General information disclaimer for the articles and content published by SDM Technology.",
    blocks: [
      { h: "General information only", p: [
        "The articles, guides and other content on this website are published for general information and education. They are not professional legal, financial or technical advice for your specific situation. Please consult a qualified professional before making important decisions.",
      ]},
      { h: "Accuracy", p: [
        "We make reasonable efforts to keep content accurate and up to date, but technology and regulations change quickly and we cannot guarantee that every page is complete or current. If you notice a mistake, please tell us at " + EMAIL + " and we will review it.",
      ]},
      { h: "External links", p: [
        "Links to other websites are provided for convenience. Their inclusion does not mean we endorse them, and we are not responsible for their content or privacy practices.",
      ]},
      { h: "Advertising", p: [
        "This website may display advertisements served by Google AdSense or other partners. Advertisements are clearly separate from our editorial content, and we are not responsible for the products or services advertised.",
      ]},
      { h: "Results", p: [
        "Any example of results, timelines or outcomes in our articles is illustrative. Results differ from one business or person to another, and we do not promise any particular outcome.",
      ]},
    ],
  },
};

const LegalPage = ({ kind }: { kind: Kind }) => {
  const d = docs[kind];
  usePageMeta(`${d.title} | SDM Technology`, d.desc);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-2">{d.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {UPDATED}</p>
          {d.blocks.map((b) => (
            <section key={b.h} className="mb-7">
              <h2 className="text-xl font-semibold text-foreground mb-2 font-display">{b.h}</h2>
              {b.p.map((t, i) => <p key={i} className="text-muted-foreground leading-relaxed mb-3">{t}</p>)}
            </section>
          ))}
          <p className="text-sm text-muted-foreground mt-10">
            Related: <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> ·{" "}
            <Link to="/terms" className="text-primary hover:underline">Terms of Use</Link> ·{" "}
            <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> ·{" "}
            <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
