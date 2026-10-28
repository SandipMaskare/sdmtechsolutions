import { useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const FAQS: { q: string; a: string }[] = [
  { q: "What does SDM Technology do?", a: "We build websites, web applications, mobile apps and cloud solutions for businesses, and we run a structured internship programme for students and fresh graduates from our office in Gondia, Maharashtra." },
  { q: "How do I apply for an internship?", a: "Open the Internships page, choose your domain and apply. Selected candidates receive an offer letter by email with login details for the intern portal." },
  { q: "Are the internships online or on-site?", a: "Both are possible. Virtual, on-site and hybrid modes are available depending on the domain and batch." },
  { q: "How long is an internship and what will I learn?", a: "Internships run in batches by domain, usually 4 to 8 weeks. Each batch follows a week-by-week task plan with reference material and mentor review." },
  { q: "Will I get a certificate?", a: "Yes. After you complete the tasks and your profile is complete, your completion letter and certificate are available in the portal with a verification link." },
  { q: "How can my business start a project with you?", a: "Send us a message from the Contact page or email us. We will understand your requirement, share a plan and an estimate, and start after you approve." },
  { q: "Where are you located?", a: "Our office is in Gondia, Maharashtra, India. Working hours are Monday to Saturday, 9:00 to 18:00." },
];

const HomeFAQ = () => {
  useEffect(() => {
    const s = document.createElement("script");
    s.type = "application/ld+json"; s.id = "faq-ld";
    s.text = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
    document.head.appendChild(s);
    return () => { s.remove(); };
  }, []);
  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider"><HelpCircle className="w-4 h-4" /> FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 font-display">Questions people ask us</h2>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="rounded-xl border border-border bg-card px-4 sdm-faq">
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
export default HomeFAQ;
