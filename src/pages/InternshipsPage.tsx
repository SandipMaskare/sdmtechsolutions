import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Clock, ArrowRight, FileText, UserCheck, ClipboardCheck, MessageSquare, Laptop, ChevronDown, Award, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { openApply } from "@/lib/apply";
import { Input } from "@/components/ui/input";
import VideoBackdrop from "@/components/VideoBackdrop";

interface Internship {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  duration: string | null;
  stipend: string | null;
  kind?: string | null;
  apply_url?: string | null;
}

const TABS = [
  { key: "all", label: "All internships" },
  { key: "short", label: "1 Month" },
  { key: "long", label: "2 Months" },
] as const;

const isShort = (d: string | null) => !!d && /(^|\D)1\s*-?\s*month/i.test(d);
const domainOf = (i: { title: string }) => i.title.replace(/\s*Intern\s*\(.*\)\s*$/i, "").trim();

const steps = [
  { icon: FileText, title: "Apply", text: "Pick an internship and fill in the application form." },
  { icon: UserCheck, title: "Get selected", text: "Our team reviews applications and contacts the selected candidates." },
  { icon: Laptop, title: "Use your Intern Portal", text: "Log in to your own portal to see the projects assigned to you." },
  { icon: ClipboardCheck, title: "Submit your work", text: "Upload files or share links straight from the portal." },
  { icon: MessageSquare, title: "Get feedback", text: "Every submission is reviewed and you see the feedback online." },
];

const InternshipsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [sp] = useSearchParams();
  const [q, setQ] = useState(sp.get("q") || "");
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .eq("kind", "internship")
      .order("title", { ascending: true })
      .then(({ data }) => {
        setItems((data as Internship[]) || []);
        setLoading(false);
      });
  }, []);

  const depts = ["All", ...Array.from(new Set(items.map((i) => i.department)))];
  const shown = items.filter((i) => (tab === "all" ? true : tab === "short" ? isShort(i.duration) : !isShort(i.duration)))
    .filter((i) => dept === "All" || i.department === dept)
    .filter((i) => !q || `${i.title} ${i.department} ${i.description || ""}`.toLowerCase().includes(q.toLowerCase()));

  const apply = async (i: Internship) => {
    if (!(await openApply(i))) navigate(`/careers/${i.id}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="relative overflow-hidden py-20 bg-[hsl(210_60%_12%)]">
          <VideoBackdrop name="learn" />
          <div className="relative container mx-auto px-4 text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-teal-300 font-semibold text-sm uppercase tracking-wider">Internships</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5 font-display">
                Learn by working on <span className="text-teal-300">real projects</span>
              </h1>
              <p className="text-white/85 text-lg mb-8">
                Join an SDM Technology internship, get projects in your own intern portal, submit your work online and receive feedback from the team.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button size="lg" onClick={() => document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })}>
                  See open internships <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/60 hover:bg-white/10 hover:text-white" asChild>
                  <Link to="/intern/login">Intern login</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="openings" className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {TABS.map((t) => (
                <Button key={t.key} variant={tab === t.key ? "default" : "outline"} onClick={() => setTab(t.key)}>
                  {t.label}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-center mb-8">
              <div className="relative w-full sm:w-64"><Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" placeholder="Search a domain, e.g. Python" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search internships" /></div>
              {depts.map((d) => <button key={d} onClick={() => setDept(d)} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${dept === d ? "sdm-chip-active text-white border-transparent" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}>{d}</button>)}
            </div>
            <p className="text-center text-sm text-muted-foreground mb-6">{shown.length} open internship{shown.length === 1 ? "" : "s"}. Each domain is offered for 1 month and for 2 months.</p>

            {loading ? (
              <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : shown.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No internships are open in this category right now. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {shown.map((i) => (
                  <motion.div
                    key={i.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-xl font-semibold text-foreground font-display">{domainOf(i)} <span className="text-primary">· {i.duration}</span></h2>
                      <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium shrink-0">{i.department}</span>
                    </div>
                    {i.description && (
                      <div className="mb-4">
                        <p className={`text-muted-foreground whitespace-pre-line text-sm ${open === i.id ? "" : "line-clamp-3"}`}>{open === i.id ? i.description : i.description.split("\n\n")[1] || i.description}</p>
                        <button onClick={() => setOpen(open === i.id ? null : i.id)} className="mt-2 text-primary text-sm font-medium inline-flex items-center gap-1">
                          {open === i.id ? "Hide details" : "Week-by-week outline"} <ChevronDown className={`w-4 h-4 transition-transform ${open === i.id ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
                      {i.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{i.duration}</span>}
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" />{i.location}</span>
                      <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-primary" />Certificate</span>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <Button onClick={() => apply(i)} className="flex-1">
                        Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/careers/${i.id}`)}>Details</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-10 font-display">How it works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((s, idx) => (
                <div key={s.title} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-3 relative">
                    <s.icon className="w-7 h-7 text-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">{idx + 1}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InternshipsPage;
