import { ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PortalLayout, { PortalKind, portalCopy } from "@/components/portal/PortalLayout";
import { usePortalTasks } from "@/hooks/usePortalTasks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const reviewBadge = (s: string | null) =>
  s === "approved" ? <Badge className="bg-green-600">Approved</Badge>
  : s === "rejected" ? <Badge className="bg-red-500">Needs changes</Badge>
  : <Badge variant="secondary">Waiting for review</Badge>;

const PortalSubmissions = ({ kind }: { kind: PortalKind }) => {
  const c = portalCopy[kind];
  const { tasks, submissions, loading } = usePortalTasks();
  const { toast } = useToast();
  const titleOf = (id: string) => tasks.find((t) => t.id === id)?.title || "Removed " + c.workOne;

  const openFile = async (path: string) => {
    const { data, error } = await supabase.storage.from("task-submissions").createSignedUrl(path, 300);
    if (error || !data) return toast({ title: "Could not open file", description: error?.message, variant: "destructive" });
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <PortalLayout kind={kind}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">My Submissions</h1>
          <p className="text-muted-foreground mt-1">Everything you have submitted and what the admin said about it.</p>
        </div>

        {loading ? (
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        ) : submissions.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">You have not submitted anything yet.</CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((s) => (
              <Card key={s.id}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">{titleOf(s.task_id)}</h3>
                    {reviewBadge(s.review_status)}
                  </div>
                  <p className="text-xs text-muted-foreground">Submitted {new Date(s.submitted_at).toLocaleString()}</p>
                  {s.comments && <p className="text-sm text-muted-foreground whitespace-pre-line">{s.comments}</p>}
                  {s.review_comments && (
                    <p className="text-sm rounded-lg bg-muted p-3"><span className="font-medium">Admin: </span>{s.review_comments}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {s.file_url && (
                      <Button variant="outline" size="sm" onClick={() => openFile(s.file_url!)}>
                        <FileText className="w-4 h-4 mr-1" /> Open file
                      </Button>
                    )}
                    {s.external_link && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={s.external_link} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-1" /> Open link</a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default PortalSubmissions;
