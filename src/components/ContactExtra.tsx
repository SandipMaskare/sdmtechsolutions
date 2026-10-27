import { Link } from "react-router-dom";
import { LINKEDIN_URL } from "@/lib/social";

const faqs: [string, string][] = [
  ["How do I ask for a quote?", "Use the form above and tell us what you want to build, who will use it, any deadline you have and a rough budget if you have one. The more detail you give, the more useful our first reply will be."],
  ["How do I apply for an internship?", "Open the internships page, choose a domain and submit the application form. If you are unsure which domain fits you, read our guide on choosing an internship domain on the blog."],
  ["How can an employer check a certificate we issued?", "Go to the verification page and enter the certificate or intern ID printed on the letter. The page shows whether the record is valid."],
  ["I am an intern or employee and cannot log in. What should I do?", "Use the Forgot password link on the login page to receive a code by email. If that does not work, write to us from your registered email address and include your name and intern or employee ID."],
  ["Where are you located?", "Our office is at Ward No. 3, Laxmi Chowk, Old Bus Stop, Murdada, Gondia, Maharashtra – 441911, India, and we are open Monday to Saturday, 9:00 AM to 6:00 PM. Most projects and internships run online, so you do not need to visit in person."],
];

const ContactExtra = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-3">Contact SDM Technology Pvt Ltd</h2>
      <p className="text-muted-foreground leading-relaxed mb-6">For business enquiries, project discussions and information about our technology services, please use the form above or the contact details below.</p>
      <ul className="space-y-2 text-muted-foreground mb-12">
        <li><strong className="text-foreground">Business name:</strong> SDM Technology Pvt Ltd (website and brand: SDM Tech Solution)</li>
        <li><strong className="text-foreground">Office address:</strong> Ward No. 3, Laxmi Chowk, Old Bus Stop, Murdada, Gondia, Maharashtra – 441911, India</li>
        <li><strong className="text-foreground">Business hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM</li>
        <li><strong className="text-foreground">Email:</strong> <a className="text-primary hover:underline" href="mailto:sdmtechnologies.pvtltd@gmail.com">sdmtechnologies.pvtltd@gmail.com</a></li>
        <li><strong className="text-foreground">Phone:</strong> <a className="text-primary hover:underline" href="tel:+917038523408">+91 7038523408</a></li>
        <li><strong className="text-foreground">LinkedIn:</strong> <a className="text-primary hover:underline" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">SDM Technology on LinkedIn</a></li>
      </ul>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display mb-6">Frequently asked questions</h2>
      <div className="space-y-6">
        {faqs.map(([q, a]) => (
          <div key={q}>
            <h3 className="font-semibold text-foreground mb-1">{q}</h3>
            <p className="text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-10">
        See also our <Link className="text-primary hover:underline" to="/privacy-policy">privacy policy</Link> and <Link className="text-primary hover:underline" to="/terms">terms of use</Link>.
      </p>
    </div>
  </section>
);

export default ContactExtra;
