import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, MapPin, Wallet, GraduationCap, FileText, UserCheck, Laptop, ClipboardCheck, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { openApply } from "@/lib/apply";
import { AppShell, Card, Chip, Heading, Hero, Spinner } from "@/components/app/AppShell";

interface Internship { id: string; title: string; department: string; location: string; type: string; description: string | null; duration: string | null; stipend: string | null; kind?: string | null; apply_url?: string | null }

const TABS = [{ key: "all", label: "All" }, { key: "short", label: "1 month" }, { key: "long", label: "2 – 3 months" }] as const;
const isShort = (d: string | null) => !!d && /(^|\D)1\s*-?\s*month/i.test(d);
const steps = [
  { icon: FileText, t: "Apply", d: "Pick an internship and apply." },
  { icon: UserCheck, t: "Get selected", d: "We contact selected candidates." },
  { icon: Laptop, t: "Use your portal", d: "See your projects in the Intern Portal." },
  { icon: ClipboardCheck, t: "Submit work", d: "Upload a zip or share links." },
  { icon: MessageSquare, t: "Get feedback", d: "Reviews and feedback online." },
];

const AppInternships = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");

  useEffect(() => {
    supabase.from("jobs").select("*").eq("is_active", true).eq("kind", "internship").order("created_at", { ascending: false })
      .then(({ data }) => { setItems((data as Internship[]) || []); setLoading(false); });
  }, []);

  const shown = items.filter((i) => (tab === "all" ? true : tab === "short" ? isShort(i.duration) : !isShort(i.duration)));
  const apply = async (i: Internship) => { if (!(await openApply(i))) navigate(`/careers/${i.id}`); };

  return (
    <AppShell>
      <Hero tag="Internships" title="Learn by working on real projects" text="Offer letter, mentor guidance, weekly tasks and a verified certificate." grad="from-[#1e3a5f] via-[#1d5a8a] to-[#2a8dc5]" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${tab === t.key ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white text-foreground border-black/10"}`}>{t.label}</button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {loading ? <Spinner /> : shown.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground"><GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">No internships are open in this category right now. Please check back soon.</p></Card>
        ) : shown.map((i) => (
          <Card key={i.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-foreground leading-snug">{i.title}</h3>
              <Chip>{i.department}</Chip>
            </div>
            {i.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{i.description}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mt-3">
              {i.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#0f766e]" />{i.duration}</span>}
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0f766e]" />{i.location}</span>
              {i.stipend && <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-[#0f766e]" />{i.stipend}</span>}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => apply(i)} className="flex-1 rounded-xl bg-[#0f766e] text-white py-2.5 text-sm font-semibold active:scale-[0.98] transition-transform">Apply now</button>
              <Link to={`/careers/${i.id}`} className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-foreground active:bg-black/[0.03]">Details</Link>
            </div>
          </Card>
        ))}
      </div>

      <Heading>How it works</Heading>
      <Card className="p-4 space-y-4">
        {steps.map((s, idx) => (
          <div key={s.t} className="flex items-center gap-3">
            <span className="relative h-10 w-10 rounded-xl bg-[#e6f4f1] flex items-center justify-center shrink-0"><s.icon className="w-5 h-5 text-[#0f766e]" /><span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#0f766e] text-white text-[10px] font-semibold flex items-center justify-center">{idx + 1}</span></span>
            <div><p className="text-sm font-semibold text-foreground">{s.t}</p><p className="text-xs text-muted-foreground">{s.d}</p></div>
          </div>
        ))}
      </Card>
      <Link to="/intern/login" className="mt-4 block text-center rounded-2xl border border-[#0f766e] text-[#0f766e] py-3 font-semibold active:bg-[#e6f4f1]">Intern login</Link>
    </AppShell>
  );
};

export default AppInternships;
