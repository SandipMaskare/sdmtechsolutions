import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info, Layers, GraduationCap, Briefcase, Newspaper, Mail, Phone, ChevronRight, LayoutDashboard, MapPin, Clock, Linkedin, Globe, LogIn } from "lucide-react";
import { services } from "@/data/services";
import { articles } from "@/data/articles";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AppTopBar from "@/components/app/AppTopBar";

const slides = [
  { to: "/services", tag: "What we do", title: "Software built around your business", text: "Web, mobile, cloud and data solutions from a team that ships.", grad: "from-[#0b3b4a] via-[#0f766e] to-[#14b8a6]" },
  { to: "/internships", tag: "Learn with us", title: "Internships with real projects", text: "Offer letter, mentor guidance, weekly tasks and a verified certificate.", grad: "from-[#1e3a5f] via-[#1d5a8a] to-[#2a8dc5]" },
  { to: "/careers", tag: "Join SDM", title: "Build your career in Gondia", text: "Open roles in software development, design and delivery.", grad: "from-[#3b1f5c] via-[#6d3fa0] to-[#9b5fd0]" },
];

const stats = [
  { v: "100+", l: "Projects" },
  { v: "50+", l: "Clients" },
  { v: "5+", l: "Years" },
  { v: "15+", l: "Experts" },
];

const explore = [
  { to: "/about", icon: Info, label: "About SDM Technology" },
  { to: "/blog", icon: Newspaper, label: "Insights & guides" },
  { to: "/contact", icon: Mail, label: "Contact & enquiries" },
  { to: "/privacy-policy", icon: Globe, label: "Privacy policy" },
];

interface JobRow { id: string; title: string; location?: string | null; type?: string | null }

const SectionHead = ({ title, to }: { title: string; to?: string }) => (
  <div className="flex items-center justify-between mb-3 mt-7">
    <h3 className="font-display text-[17px] font-semibold text-foreground">{title}</h3>
    {to && <Link to={to} className="text-sm font-medium text-primary flex items-center">View all <ChevronRight className="w-4 h-4" /></Link>}
  </div>
);

/** Home screen of the installed app. Corporate style: hero banners, stats, services, openings, insights. */
const AppHome = () => {
  const { user } = useAuth();
  const [slide, setSlide] = useState(0);
  const [jobs, setJobs] = useState<JobRow[]>([]);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (supabase as any)
      .from("jobs").select("id,title,location,type").eq("is_active", true).eq("kind", "job")
      .order("created_at", { ascending: false }).limit(3)
      .then(({ data }: any) => setJobs(data ?? []));
  }, []);

  const s = slides[slide];

  return (
    <div className="min-h-screen bg-[#f4f7f8]">
      <AppTopBar />
      <main className="px-4" style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top))", paddingBottom: "calc(6rem + var(--sdm-ad-h, 0px))" }}>
        {/* Hero banner */}
        <Link to={s.to} className={`mt-0 -mx-4 block bg-gradient-to-br ${s.grad} text-white px-6 pt-7 pb-9 transition-colors duration-500`}>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">{s.tag}</span>
          <h2 className="font-display text-[26px] leading-[1.15] font-bold mt-2 max-w-[18rem]">{s.title}</h2>
          <p className="text-sm text-white/85 mt-2 max-w-[19rem]">{s.text}</p>
          <span className="inline-flex items-center gap-1 mt-5 rounded-full bg-white text-[#0f4c5c] text-sm font-semibold px-4 py-2">Explore <ChevronRight className="w-4 h-4" /></span>
          <div className="flex gap-1.5 mt-6">
            {slides.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />)}
          </div>
        </Link>

        {/* Stats strip */}
        <div className="-mt-6 relative grid grid-cols-4 rounded-2xl bg-white shadow-md border border-black/5 py-3.5">
          {stats.map((x, i) => (
            <div key={x.l} className={`text-center ${i > 0 ? "border-l border-black/5" : ""}`}>
              <p className="font-display text-lg font-bold text-[#0f766e]">{x.v}</p>
              <p className="text-[11px] text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </div>

        {/* Account card */}
        {user ? (
          <Link to="/enter" className="mt-5 flex items-center gap-3 rounded-2xl bg-white border border-black/5 p-4 shadow-sm active:scale-[0.99] transition-transform">
            <span className="h-11 w-11 rounded-xl bg-[#e6f4f1] flex items-center justify-center"><LayoutDashboard className="w-5 h-5 text-[#0f766e]" /></span>
            <div className="min-w-0"><p className="font-semibold text-foreground">My portal</p><p className="text-xs text-muted-foreground truncate">Tasks, submissions, payments and profile</p></div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </Link>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link to="/intern/login" className="rounded-2xl bg-[#0f766e] text-white p-4 flex items-center gap-3 active:scale-[0.98] transition-transform shadow-sm">
              <GraduationCap className="w-6 h-6" /><div><p className="font-semibold text-sm leading-tight">Intern</p><p className="text-[11px] text-white/80">Sign in</p></div>
            </Link>
            <Link to="/employee/login" className="rounded-2xl bg-white border border-black/5 p-4 flex items-center gap-3 active:scale-[0.98] transition-transform shadow-sm">
              <LogIn className="w-6 h-6 text-[#0f766e]" /><div><p className="font-semibold text-sm leading-tight text-foreground">Employee</p><p className="text-[11px] text-muted-foreground">Sign in</p></div>
            </Link>
          </div>
        )}

        {/* Services grid */}
        <SectionHead title="Our services" to="/services" />
        <div className="grid grid-cols-2 gap-3">
          {services.map((sv) => (
            <Link key={sv.slug} to={`/services/${sv.slug}`} className="rounded-2xl bg-white border border-black/5 p-4 shadow-sm active:scale-[0.98] transition-transform">
              <span className="h-10 w-10 rounded-xl bg-[#e6f4f1] flex items-center justify-center mb-3"><sv.icon className="w-5 h-5 text-[#0f766e]" /></span>
              <p className="text-[13px] font-semibold text-foreground leading-snug">{sv.title}</p>
            </Link>
          ))}
        </div>

        {/* Openings */}
        {jobs.length > 0 && (
          <>
            <SectionHead title="Latest openings" to="/careers" />
            <div className="rounded-2xl bg-white border border-black/5 shadow-sm divide-y divide-black/5">
              {jobs.map((j) => (
                <Link key={j.id} to={`/careers/${j.id}`} className="flex items-center gap-3 p-4 active:bg-black/[0.03]">
                  <span className="h-10 w-10 rounded-xl bg-[#eef3fb] flex items-center justify-center shrink-0"><Briefcase className="w-5 h-5 text-[#1d5a8a]" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{j.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                      {j.location && <><MapPin className="w-3 h-3" />{j.location}</>}
                      {j.type && <span className="ml-1">· {j.type}</span>}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Insights */}
        <SectionHead title="Insights" to="/blog" />
        <div className="rounded-2xl bg-white border border-black/5 shadow-sm divide-y divide-black/5">
          {articles.slice(0, 3).map((a) => (
            <Link key={a.slug} to={`/blog/${a.slug}`} className="block p-4 active:bg-black/[0.03]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0f766e]">{a.category}</span>
              <p className="text-sm font-semibold text-foreground mt-1 leading-snug">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" />{a.readMinutes} min read</p>
            </Link>
          ))}
        </div>

        {/* Explore list */}
        <SectionHead title="Explore" />
        <div className="rounded-2xl bg-white border border-black/5 shadow-sm divide-y divide-black/5">
          {explore.map((e) => (
            <Link key={e.to} to={e.to} className="flex items-center gap-3 p-4 active:bg-black/[0.03]">
              <e.icon className="w-5 h-5 text-[#0f766e]" />
              <span className="text-sm font-medium text-foreground">{e.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </Link>
          ))}
        </div>

        {/* Connect */}
        <SectionHead title="Connect with us" />
        <div className="grid grid-cols-3 gap-3">
          <a href="tel:+917038523408" className="rounded-2xl bg-white border border-black/5 shadow-sm py-4 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Phone className="w-5 h-5 text-[#0f766e]" /><span className="text-xs font-medium">Call</span></a>
          <a href="mailto:sdmtechnologies.pvtltd@gmail.com" className="rounded-2xl bg-white border border-black/5 shadow-sm py-4 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Mail className="w-5 h-5 text-[#0f766e]" /><span className="text-xs font-medium">Email</span></a>
          <a href="https://www.linkedin.com/company/sdm-technology-1/" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-white border border-black/5 shadow-sm py-4 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"><Linkedin className="w-5 h-5 text-[#0a66c2]" /><span className="text-xs font-medium">LinkedIn</span></a>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">© SDM Technology · Gondia, Maharashtra</p>
        <p className="mt-1 text-center text-xs text-muted-foreground"><Link to="/privacy-policy" className="underline">Privacy</Link> · <Link to="/terms" className="underline">Terms</Link></p>
      </main>
    </div>
  );
};

export default AppHome;
