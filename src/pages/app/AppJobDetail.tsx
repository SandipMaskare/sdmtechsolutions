import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JobApplicationForm from "@/components/JobApplicationForm";
import { AppShell, Card, Chip, Heading, Spinner } from "@/components/app/AppShell";
import NotFound from "@/pages/NotFound";

interface Job { id: string; title: string; department: string; location: string; type: string; description: string | null; requirements: string[] | null; duration?: string | null; stipend?: string | null }

const AppJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");
  useEffect(() => {
    if (!id) return setState("missing");
    supabase.from("jobs").select("*").eq("id", id).eq("is_active", true).maybeSingle()
      .then(({ data }) => { setJob(data as Job | null); setState(data ? "found" : "missing"); });
  }, [id]);
  if (state === "missing") return <NotFound />;
  return (
    <AppShell>
      {state === "loading" || !job ? <Spinner /> : (
        <>
          <Card className="p-5">
            <Chip>{job.department}</Chip>
            <h2 className="font-display text-[22px] font-bold text-foreground leading-tight mt-3">{job.title}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground mt-3">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#0f766e]" />{job.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#0f766e]" />{job.duration || job.type}</span>
              {job.stipend && <span>{job.stipend}</span>}
            </div>
          </Card>
          {job.description && (<><Heading>About the role</Heading><Card className="p-4"><p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{job.description}</p></Card></>)}
          {job.requirements && job.requirements.length > 0 && (
            <><Heading>Requirements</Heading><Card className="p-4 space-y-3">{job.requirements.map((r) => (<div key={r} className="flex gap-3 text-sm text-foreground/90"><CheckCircle2 className="w-5 h-5 text-[#0f766e] shrink-0 mt-0.5" />{r}</div>))}</Card></>
          )}
          <Heading>Apply now</Heading>
          <JobApplicationForm jobId={job.id} onDone={() => navigate("/careers")} />
        </>
      )}
    </AppShell>
  );
};

export default AppJobDetail;
