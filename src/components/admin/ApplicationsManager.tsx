import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ExternalLink, Trash2 } from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: string;
  applied_at: string;
  job_id: string;
}

const ApplicationsManager = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("applied_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading applications", variant: "destructive" });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("job_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Application marked as ${status}` });
      fetchApplications();
    }
  };

  const deleteApplication = async (id: string) => {
    const { error } = await supabase.from("job_applications").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", variant: "destructive" });
    } else {
      toast({ title: "Application deleted" });
      fetchApplications();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Job Applications ({applications.length})</h2>
      {applications.length === 0 ? (
        <p className="text-muted-foreground py-4">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="p-4 bg-card border border-border rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">{app.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{app.email}{app.phone && ` • ${app.phone}`}</p>
                  <p className="text-xs text-muted-foreground mt-1">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                  {app.cover_letter && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.cover_letter}</p>}
                </div>
                <Badge variant={app.status === "reviewed" ? "default" : "secondary"}>
                  {app.status === "reviewed" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {app.status}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                {app.status !== "reviewed" && (
                  <Button size="sm" onClick={() => updateStatus(app.id, "reviewed")}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Reviewed
                  </Button>
                )}
                {app.resume_url && (
                  <Button size="sm" variant="outline" onClick={async () => {
                    const { data } = await supabase.storage.from("resumes").createSignedUrl(app.resume_url!, 3600);
                    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                  }}>
                    <ExternalLink className="w-4 h-4 mr-1" /> Resume
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => deleteApplication(app.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsManager;
