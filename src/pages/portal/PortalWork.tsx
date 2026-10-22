import { useState } from "react";
import { Calendar, Play, Send, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PortalLayout, { PortalKind, portalCopy } from "@/components/portal/PortalLayout";
import { usePortalTasks, statusMeta, priorityMeta, PortalTask } from "@/hooks/usePortalTasks";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TaskGuide from "@/components/portal/TaskGuide";

const MAX_MB = 10;
const FILTERS = [
  { key: "all", label: "All" },
  { key: "todo", label: "To do" },
  { key: "submitted", label: "Submitted" },
  { key: "done", label: "Approved" },
] as const;

const PortalWork = ({ kind }: { kind: PortalKind }) => {
  const c = portalCopy[kind];
  const { user } = useAuth();
  const { toast } = useToast();
  const { tasks, submissions, loading, error, refresh } = usePortalTasks();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [active, setActive] = useState<PortalTask | null>(null);
  const [link, setLink] = useState("");
  const [comments, setComments] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const shown = tasks.filter((t) =>
    filter === "all"
      ? true
      : filter === "todo"
      ? ["pending", "in_progress", "rejected"].includes(t.status)
      : filter === "submitted"
      ? t.status === "submitted"
      : t.status === "approved"
  );

  const latestFor = (taskId: string) => submissions.find((s) => s.task_id === taskId);

  const start = async (t: PortalTask) => {
    const { error } = await supabase.from("tasks").update({ status: "in_progress" }).eq("id", t.id);
    if (error) return toast({ title: "Could not update", description: error.message, variant: "destructive" });
    refresh();
  };

  const openSubmit = (t: PortalTask) => {
    setActive(t);
    setLink("");
    setComments("");
    setFile(null);
  };

  const pickFile = (f: File | null) => {
    if (f && !/\.zip$/i.test(f.name)) {
      toast({ title: "Please upload a .zip file", description: "Put all your work in one zip file, or use the link field instead.", variant: "destructive" });
      return;
    }
    if (f && f.size > MAX_MB * 1024 * 1024) {
      toast({ title: "File too large", description: `Maximum ${MAX_MB} MB.`, variant: "destructive" });
      return;
    }
    setFile(f);
  };

  const submit = async () => {
    if (!active || !user) return;
    if (!file && !link.trim()) {
      return toast({ title: `Attach a file or paste a link to your ${c.workOne}`, variant: "destructive" });
    }
    if (link.trim() && !/^https?:\/\//i.test(link.trim())) {
      return toast({ title: "Link must start with http:// or https://", variant: "destructive" });
    }
    setBusy(true);
    try {
      let path: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        path = `${user.id}/${active.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("task-submissions").upload(path, file, { upsert: false });
        if (upErr) throw new Error("Upload failed: " + upErr.message);
      }
      const { error: subErr } = await supabase.from("task_submissions").insert({
        task_id: active.id,
        submitted_by: user.id,
        file_url: path,
        external_link: link.trim() || null,
        comments: comments.trim() || null,
        review_status: "pending",
      });
      if (subErr) throw new Error(subErr.message);
      const { error: stErr } = await supabase.from("tasks").update({ status: "submitted" }).eq("id", active.id);
      if (stErr) throw new Error(stErr.message);
      toast({ title: "Submitted!", description: "The admin will review your work." });
      setActive(null);
      refresh();
    } catch (e: any) {
      toast({ title: "Could not submit", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <PortalLayout kind={kind}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">{c.workLabel}</h1>
          <p className="text-muted-foreground mt-1">Open a {c.workOne}, do the work, then submit a file or link here.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button key={f.key} size="sm" variant={filter === f.key ? "default" : "outline"} onClick={() => setFilter(f.key)}>
              {f.label}
            </Button>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">Could not load: {error}</p>}

        {loading ? (
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        ) : shown.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {tasks.length === 0
                ? `No ${c.work.toLowerCase()} assigned yet. Ask the admin to assign you one.`
                : "Nothing in this view."}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {shown.map((t) => {
              const sub = latestFor(t.id);
              const canSubmit = ["pending", "in_progress", "rejected"].includes(t.status);
              const late = t.deadline && new Date(t.deadline) < new Date() && canSubmit;
              return (
                <Card key={t.id}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${priorityMeta[t.priority] || "bg-slate-400"}`} title={`${t.priority} priority`} />
                        <h3 className="font-semibold text-lg text-foreground">{t.title}</h3>
                      </div>
                      <Badge className={statusMeta[t.status]?.className}>{statusMeta[t.status]?.label || t.status}</Badge>
                    </div>
                    {t.description && <p className="text-muted-foreground whitespace-pre-line">{t.description}</p>}
                    <TaskGuide title={t.title} description={t.description} referenceLinks={(t as any).reference_links} />
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className={`flex items-center gap-1.5 ${late ? "text-red-600 font-medium" : ""}`}>
                        <Calendar className="w-4 h-4" />
                        {t.deadline ? `Due ${new Date(t.deadline).toLocaleDateString()}${late ? " (overdue)" : ""}` : "No deadline"}
                      </span>
                      <span className="capitalize">{t.priority} priority</span>
                    </div>

                    {sub?.review_comments && (
                      <div className="rounded-lg bg-muted p-3 text-sm">
                        <p className="flex items-center gap-2 font-medium text-foreground mb-1"><MessageSquare className="w-4 h-4" /> Feedback from admin</p>
                        <p className="text-muted-foreground whitespace-pre-line">{sub.review_comments}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {t.status === "pending" && (
                        <Button variant="outline" size="sm" onClick={() => start(t)}>
                          <Play className="w-4 h-4 mr-1" /> Start
                        </Button>
                      )}
                      {canSubmit && (
                        <Button size="sm" onClick={() => openSubmit(t)}>
                          <Send className="w-4 h-4 mr-1" /> {t.status === "rejected" ? "Submit again" : "Submit work"}
                        </Button>
                      )}
                      {sub?.external_link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={sub.external_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Your link</a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && !busy && setActive(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit: {active?.title}</DialogTitle>
            <DialogDescription>Attach your file, paste a link (GitHub, Drive, etc.), or both.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload your work as one .zip file (max {MAX_MB} MB)</Label>
              <Input type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={(e) => pickFile(e.target.files?.[0] || null)} />
              {file && <p className="text-xs text-muted-foreground">Selected: {file.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Link</Label>
              <Input type="url" placeholder="https://github.com/you/project" value={link} onChange={(e) => setLink(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Notes for the admin</Label>
              <Textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="What did you do? Anything to know?" />
            </div>
            <Button className="w-full" onClick={submit} disabled={busy}>
              {busy ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
};

export default PortalWork;
