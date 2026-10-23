import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, ExternalLink, Mail, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilePreviewButtons from "@/components/shared/FilePreviewButtons";
import EmailComposer from "./EmailComposer";

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

const isUrl = (v: string) => /^https?:\/\//i.test(v.trim());

const ApplicationsManager = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailId, setEmailId] = useState<string | null>(null);
  const { toast } = useToast();

  const [titles, setTitles] = useState<Record<string, { title: string; kind: string }>>({});
  const [mode, setMode] = useState<"form" | "site">("form");
  const [sheetUrl, setSheetUrl] = useState("");
  const [savingSet, setSavingSet] = useState(false);

  useEffect(() => {
    fetchApplications();
    supabase.from("jobs").select("id,title,kind").then(({ data }) => {
      const m: Record<string, { title: string; kind: string }> = {};
      (data || []).forEach((j: any) => (m[j.id] = { title: j.title, kind: j.kind }));
      setTitles(m);
    });
    supabase.from("website_content").select("section_key,content").in("section_key", ["apply_mode", "applications_sheet_url"]).then(({ data }) => {
      (data || []).forEach((r: any) => {
        if (r.section_key === "apply_mode") setMode((r.content || "").trim().toLowerCase() === "site" ? "site" : "form");
        if (r.section_key === "applications_sheet_url") setSheetUrl(r.content || "");
      });
    });
  }, []);

  const saveSetting = async (key: string, value: string) => {
    const { error } = await supabase.from("website_content").upsert({ section_key: key, title: key, content: value }, { onConflict: "section_key" });
    if (error) toast({ title: "Could not save", description: error.message, variant: "destructive" });
    return !error;
  };

  const changeMode = async (m: "form" | "site") => {
    setSavingSet(true);
    if (await saveSetting("apply_mode", m)) {
      setMode(m);
      toast({ title: m === "site" ? "Applicants now use the website form" : "Applicants now use the Google Form" });
    }
    setSavingSet(false);
  };

  const saveSheet = async () => {
    if (sheetUrl.trim() && !isUrl(sheetUrl)) return toast({ title: "Paste the full link, starting with https://", variant: "destructive" });
    setSavingSet(true);
    if (await saveSetting("applications_sheet_url", sheetUrl.trim())) toast({ title: "Saved" });
    setSavingSet(false);
  };

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
      <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-sm">
        <p className="font-semibold text-foreground">Where do applicants apply?</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={mode === "form" ? "default" : "outline"} disabled={savingSet} onClick={() => changeMode("form")}>Google Form (answers go to your Google Sheet)</Button>
          <Button size="sm" variant={mode === "site" ? "default" : "outline"} disabled={savingSet} onClick={() => changeMode("site")}>Website form (answers appear on this page)</Button>
        </div>
        <p className="text-muted-foreground">
          {mode === "form"
            ? "Right now the Apply buttons open your Google Form, so those applications are in the Google Sheet, not in the list below. Switch to the website form to see every application here, with the resume."
            : "Applicants fill the website form (they must be signed in). Their application and resume appear in the list below."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Input value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} placeholder="Paste the link of your Google Form responses sheet" className="max-w-md" />
          <Button size="sm" variant="outline" disabled={savingSet} onClick={saveSheet}>Save link</Button>
          {isUrl(sheetUrl) && (
            <Button size="sm" asChild><a href={sheetUrl.trim()} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Open Google Form responses</a></Button>
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground">Applications on this website ({applications.length})</h2>
      {applications.length === 0 ? (
        <p className="text-muted-foreground py-4">No applications saved on the website yet. Applications made through the Google Form are in your Google Sheet.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="p-4 bg-card border border-border rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground">{app.full_name}</h3>
                  {titles[app.job_id] && <p className="text-sm font-medium text-primary">{titles[app.job_id].kind === "internship" ? "Internship" : "Job"}: {titles[app.job_id].title}</p>}
                  <p className="text-sm text-muted-foreground">{app.email}{app.phone && ` • ${app.phone}`}</p>
                  <p className="text-xs text-muted-foreground mt-1">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                  {app.cover_letter && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.cover_letter}</p>}
                </div>
                <Badge variant={app.status === "reviewed" ? "default" : "secondary"}>
                  {app.status === "reviewed" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {app.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {app.status !== "reviewed" && (
                  <Button size="sm" onClick={() => updateStatus(app.id, "reviewed")}>
                    <CheckCircle className="w-4 h-4 mr-1" /> Mark Reviewed
                  </Button>
                )}
                {app.resume_url && (
                  <FilePreviewButtons bucket="resumes" path={app.resume_url} label="Resume" />
                )}
                <Button size="sm" variant="outline" onClick={() => setEmailId(emailId === app.id ? null : app.id)}>
                  <Mail className="w-4 h-4 mr-1" /> Email
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteApplication(app.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {emailId === app.id && (
                <div className="mt-4 rounded-lg border border-border p-4">
                  <EmailComposer
                    initialTo={app.email}
                    initialSubject="Your application at SDM Technology"
                    onSent={() => setEmailId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsManager;
