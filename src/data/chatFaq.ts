// Instant auto-replies on behalf of SDM Technology. Works without any AI service.
export interface Faq { q: string; keys: RegExp; a: string }

export const FAQS: Faq[] = [
  { q: "What services do you offer?", keys: /service|offer|what do you do|website|web dev|app dev|software|seo|marketing|design|solution/i,
    a: "SDM Technology builds websites and web apps, mobile apps, custom software, UI/UX and graphic design, and digital marketing/SEO for businesses.\n\nSee all services: /services\nTell us your idea and we will reply with a plan." },
  { q: "How can I apply for a job?", keys: /\bjobs?\b|career|hiring|vacanc|opening|apply|position|recruit/i,
    a: "Open the Careers page, pick a job or internship and press Apply: /careers\nYou can also sign in first at /auth so we can reach you easily." },
  { q: "Do you offer internships?", keys: /intern|training|fresher|student|certificate|stipend/i,
    a: "Yes! We run internships in several domains with real projects, mentor review and a certificate. Details and the Apply button are on /careers\nOnce selected you get an Intern ID and a portal with tasks and learning material." },
  { q: "How do I contact you?", keys: /contact|call|phone|number|whatsapp|email|reach|talk|address|location/i,
    a: "Call or WhatsApp: +91 7038523408\nEmail: sdmtechnologies.pvtltd@gmail.com\nOr send a message from /contact and we will get back to you." },
  { q: "I forgot my password", keys: /forgot|password|reset|username|can'?t (log|sign)|login|log in|otp|code|verify|verification/i,
    a: "Go to /forgot, enter your email and we will send a reset link and a 6-digit code. Use the code box on that page if the link says it has expired.\nForgot your username? Use the same page with your email and we will send it." },
  { q: "What are your prices?", keys: /price|cost|charge|fee|quote|budget|how much|pricing|rate/i,
    a: "Price depends on what you need. Send us a short description at /contact or call +91 7038523408 and we will give a free quote." },
  { q: "How long does a project take?", keys: /how long|time|deadline|duration|delivery|when|days|weeks/i,
    a: "A simple website usually takes 1 to 3 weeks; apps and custom software take longer. We confirm the timeline after we understand your requirements." },
  { q: "Tell me about SDM Technology", keys: /about|who are you|company|sdm|team|founder/i,
    a: "SDM Technology is a technology and training company that builds digital products for businesses and trains students through real internships. Read more: /about" },
  { q: "Hello", keys: /^(hi|hello|hey|hii+|good (morning|afternoon|evening)|namaste)\b/i,
    a: "Hello! 👋 I am the SDM Technology assistant. Pick a question below or type your own and I will help." },
  { q: "Thanks", keys: /^(thanks|thank you|ok thanks|great|got it)\b/i,
    a: "You're welcome! If you need anything else, just ask." },
];

export const QUICK = ["What services do you offer?", "How can I apply for a job?", "Do you offer internships?", "How do I contact you?", "I forgot my password", "What are your prices?"];

export function faqAnswer(input: string): string | null {
  const t = input.trim();
  const exact = FAQS.find((f) => f.q.toLowerCase() === t.toLowerCase());
  if (exact) return exact.a;
  // longer, more specific questions first; greetings only match short messages
  for (const f of FAQS) {
    if (f.q === "Hello" || f.q === "Thanks") { if (t.length < 25 && f.keys.test(t)) return f.a; continue; }
    if (f.keys.test(t)) return f.a;
  }
  return null;
}
