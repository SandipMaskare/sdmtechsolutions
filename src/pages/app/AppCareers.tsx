import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Clock, ChevronRight, Rocket, Heart, Users, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, Card, Chip, Heading, Hero, Spinner } from "@/components/app/AppShell";

interface Job { id: string; title: string; department: string; location: string; type: string }
const perks = [
  { icon: Rocket, t: "Career growth" }, { icon: Heart, t: "Health benefits" }, { icon: Users, t: "Team culture" }, { icon: GraduationCap, t: "Learning budget" },
];

const AppCareers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("jobs").select("*").eq("is_active", true).eq("kind", "job").order("created_at", { ascending: false })
      .then(({ data }) => { setJobs((data as Job[]) || []); setLoading(false); });
  }, []);
  return (
    <AppShell>
      <Hero tag="Careers" title="Build your career at SDM" text="Join a growing team in Gondia and work on real client projects." grad="from-[#3b1f5c] via-[#6d3fa0] to-[#9b5fd0]" />
      <h3 className="font-display text-[17px] font-semibold text-foreground mb-3">Open positions</h3>
      {loading ? <Spinner /> : jobs.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground"><Briefcase className="w-10 h-10 mx-auto mb-2 opacity-50" /><p className="text-sm">No openings right now. Check back soon, or look at our internships.</p><Link to="/internships" className="mt-3 inline-block text-[#0f766e] font-medium text-sm">See internships</Link></Card>
      ) : (
        <Card className="divide-y divide-black/5">
          {jobs.map((j) => (
            <Link key={j.id} to={`/careers/${j.id}`} className="flex items-center gap-3 p-4 active:bg-black/[0.03]">
              <span className="h-11 w-11 rounded-xl bg-[#eef3fb] flex items-center justify-center shrink-0"><Briefcase className="w-5 h-5 text-[#1d5a8a]" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{j.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{j.type}</span></p>
                <div className="mt-1.5"><Chip>{j.department}</Chip></div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
            </Link>
          ))}
        </Card>
      )}
      <Heading>Why join us</Heading>
      <div className="grid grid-cols-2 gap-3">
        {perks.map((p) => (
          <Card key={p.t} className="p-4 flex items-center gap-3"><span className="h-10 w-10 rounded-xl bg-[#e6f4f1] flex items-center justify-center"><p.icon className="w-5 h-5 text-[#0f766e]" /></span><span className="text-sm font-medium text-foreground">{p.t}</span></Card>
        ))}
      </div>
    </AppShell>
  );
};

export default AppCareers;
