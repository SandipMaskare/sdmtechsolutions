import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Clock, MapPin, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobApplicationForm from "@/components/JobApplicationForm";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string | null;
  requirements: string[] | null;
}

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [state, setState] = useState<"loading" | "found" | "missing">("loading");

  useEffect(() => {
    if (!id) return setState("missing");
    supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        setJob(data as Job | null);
        setState(data ? "found" : "missing");
      });
  }, [id]);

  if (state === "missing") return <NotFound />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/careers" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> All openings
            </Link>
            {state === "loading" || !job ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-primary" /> {job.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" />{job.location}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />{job.type}</span>
                  <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium">{job.department}</span>
                </div>
              </>
            )}
          </div>
        </section>

        {job && (
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-5 gap-10">
              <div className="md:col-span-3 space-y-8">
                {job.description && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3 font-display">About the role</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
                  </div>
                )}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3 font-display">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((r) => (
                        <li key={r} className="flex gap-3 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold text-foreground mb-3 font-display">Apply now</h2>
                <JobApplicationForm jobId={job.id} onDone={() => navigate("/careers")} />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPage;
