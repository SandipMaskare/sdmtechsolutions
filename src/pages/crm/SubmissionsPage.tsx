import FilePreviewButtons from "@/components/shared/FilePreviewButtons";
import SubmissionCode from "@/components/admin/SubmissionCode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ExternalLink, FileText, Check, X, Clock, Eye, Bot, Sparkles } from "lucide-react";
import { callFunction } from "@/lib/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  task_id: string;
  submitted_by: string;
  file_url: string | null;
  external_link: string | null;
  comments: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_status: string | null;
  review_comments: string | null;
  ai_verdict?: string | null;
  ai_score?: number | null;
  ai_feedback?: string | null;
  ai_details?: any;
  ai_checked_at?: string | null;
  ai_applied?: boolean;
  task_title?: string;
  submitter_name?: string;
}

const SubmissionsPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [aiBusy, setAiBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && role !== "admin") {
      navigate("/crm/dashboard");
      return;
    }

    if (role === "admin") {
      fetchSubmissions();
    }
  }, [role, loading, user, navigate]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("task_submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
      return;
    }

    // Fetch related data
    const submissionsWithDetails = await Promise.all(
      (data || []).map(async (submission) => {
        const [taskRes, profileRes] = await Promise.all([
          supabase.from("tasks").select("title").eq("id", submission.task_id).single(),
          supabase.from("profiles").select("full_name").eq("user_id", submission.submitted_by).single(),
        ]);

        return {
          ...submission,
          task_title: taskRes.data?.title,
          submitter_name: profileRes.data?.full_name,
        };
      })
    );

    setSubmissions(submissionsWithDetails);
  };

  const aiBadge = (x: Submission) => {
    if (!x.ai_checked_at) return <span className="text-xs text-muted-foreground">Not checked</span>;
    const v = x.ai_verdict;
    const cls = v === "approve" ? "bg-green-600" : v === "reject" ? "bg-red-600" : "bg-amber-500";
    const label = v === "approve" ? "Looks good" : v === "reject" ? "Not OK" : "Needs a look";
    return <span className="inline-flex items-center gap-1"><Badge className={cls}>{label}</Badge><span className="text-xs text-muted-foreground">{x.ai_score}/100{x.ai_applied ? " · auto" : ""}</span></span>;
  };

  const runAi = async (sub: Submission) => {
    setAiBusy(sub.id);
    const { data, error } = await callFunction("submission-review", { mode: "check", submission_id: sub.id, apply: false });
    setAiBusy(null);
    if (error) return toast({ title: "AI check failed", description: error, variant: "destructive" });
    toast({ title: `AI verdict: ${data?.verdict === "approve" ? "looks good" : data?.verdict === "reject" ? "not OK" : "needs your review"} (${data?.score}/100)` });
    const { data: fresh } = await supabase.from("task_submissions").select("*").eq("id", sub.id).maybeSingle();
    if (fresh) setSelectedSubmission({ ...sub, ...(fresh as any) });
    fetchSubmissions();
  };

  const runSweep = async () => {
    setAiBusy("all");
    const { data, error } = await callFunction("submission-review", { mode: "sweep_now" });
    setAiBusy(null);
    if (error) return toast({ title: "AI check failed", description: error, variant: "destructive" });
    toast({ title: `Checked ${data?.checked ?? 0} submission(s)`, description: data?.remaining ? `${data.remaining} more waiting; run it again.` : (data?.mode === "auto" ? "Clear verdicts were applied automatically." : "Verdicts are shown in the table; apply them from each review.") });
    fetchSubmissions();
  };

  const handleReview = async (status: "approved" | "rejected", commentOverride?: string) => {
    if (!selectedSubmission) return;

    // Update submission
    const { error: subError } = await supabase
      .from("task_submissions")
      .update({
        review_status: status,
        review_comments: commentOverride ?? reviewComments,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      })
      .eq("id", selectedSubmission.id);

    if (subError) {
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
      return;
    }

    // Update task status
    await supabase
      .from("tasks")
      .update({ status: status })
      .eq("id", selectedSubmission.task_id);

    toast({
      title: "Success",
      description: `Submission ${status} successfully`,
    });

    setSelectedSubmission(null);
    setReviewComments("");
    fetchSubmissions();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      (sub.task_title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (sub.submitter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (role !== "admin") {
    return null;
  }

  return (
    <CRMLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-display">Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Review and approve task submissions. The AI checker reads each submission and suggests (or, if you turn on auto mode, applies) approve or reject. You can always decide yourself.
            </p>
          </div>
          <Button variant="secondary" disabled={aiBusy === "all"} onClick={() => void runSweep()}><Bot className="w-4 h-4 mr-2" />{aiBusy === "all" ? "Checking…" : "Check pending with AI"}</Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by task or employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions ({filteredSubmissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI check</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.task_title || "Unknown Task"}
                    </TableCell>
                    <TableCell>{submission.submitter_name || "Unknown"}</TableCell>
                    <TableCell>
                      {new Date(submission.submitted_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(submission.review_status)}</TableCell>
                    <TableCell>{aiBadge(submission)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setReviewComments(submission.review_comments || "");
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No submissions found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Dialog */}
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[92vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Review Submission</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-muted-foreground">Task</Label>
                  <p className="font-medium">{selectedSubmission.task_title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted By</Label>
                  <p className="font-medium">{selectedSubmission.submitter_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted At</Label>
                  <p className="font-medium">
                    {new Date(selectedSubmission.submitted_at).toLocaleString()}
                  </p>
                </div>

                {selectedSubmission.external_link && (
                  <div>
                    <Label className="text-muted-foreground">External Link</Label>
                    <a
                      href={selectedSubmission.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {selectedSubmission.external_link}
                    </a>
                  </div>
                )}

                {selectedSubmission.file_url && (
                  <div>
                    <Label className="text-muted-foreground">File</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <FilePreviewButtons bucket="task-submissions" path={selectedSubmission.file_url!} label="Download file" />
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/5 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Label className="text-indigo-600 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> AI auto-check</Label>
                    <Button size="sm" variant="outline" disabled={aiBusy === selectedSubmission.id} onClick={() => void runAi(selectedSubmission)}>{aiBusy === selectedSubmission.id ? "Checking…" : selectedSubmission.ai_checked_at ? "Check again" : "Run AI check"}</Button>
                  </div>
                  {selectedSubmission.ai_checked_at ? (
                    <div className="space-y-2 text-sm">
                      <div>{aiBadge(selectedSubmission)}</div>
                      {selectedSubmission.ai_details?.summary && <p>{selectedSubmission.ai_details.summary}</p>}
                      {Array.isArray(selectedSubmission.ai_details?.requirements) && selectedSubmission.ai_details.requirements.length > 0 && (
                        <ul className="space-y-0.5">{selectedSubmission.ai_details.requirements.map((r: any, i: number) => <li key={i} className="flex gap-2"><span className={r.met ? "text-green-600" : "text-red-600"}>{r.met ? "✓" : "✗"}</span><span>{r.item}</span></li>)}</ul>
                      )}
                      {Array.isArray(selectedSubmission.ai_details?.issues) && selectedSubmission.ai_details.issues.length > 0 && (
                        <p className="text-xs text-muted-foreground">Issues: {selectedSubmission.ai_details.issues.join(" · ")}</p>
                      )}
                      {selectedSubmission.ai_feedback && <p className="text-xs rounded bg-muted p-2">{selectedSubmission.ai_feedback}</p>}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setReviewComments(`[AI check, ${selectedSubmission.ai_score}/100] ${selectedSubmission.ai_feedback || ""}`)}>Use AI feedback as my comment</Button>
                        {selectedSubmission.ai_verdict !== "needs_review" && selectedSubmission.review_status === "pending" && (
                          <Button size="sm" onClick={() => { setReviewComments(`[AI check, ${selectedSubmission.ai_score}/100] ${selectedSubmission.ai_feedback || ""}`); void handleReview(selectedSubmission.ai_verdict === "approve" ? "approved" : "rejected", `[AI check, ${selectedSubmission.ai_score}/100] ${selectedSubmission.ai_feedback || ""}`); }}>
                            Apply AI verdict ({selectedSubmission.ai_verdict === "approve" ? "approve" : "reject"})
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : <p className="text-xs text-muted-foreground">Not checked yet. The AI reads the zip/code/link and compares it with the task. It is a helper: you can approve or reject yourself below at any time.</p>}
                </div>

                {selectedSubmission.file_url && /\.(zip|py|js|mjs|html?|java|c|cpp|css|json|txt|ipynb)$/i.test(selectedSubmission.file_url) && (
                  <div className="rounded-xl border border-primary/30 p-3 space-y-2">
                    <Label className="text-primary">Check the code</Label>
                    <SubmissionCode path={selectedSubmission.file_url} task={selectedSubmission.task_title} onFeedback={(t) => setReviewComments(t)} />
                  </div>
                )}

                {selectedSubmission.comments && (
                  <div>
                    <Label className="text-muted-foreground">Comments</Label>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {selectedSubmission.comments}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Review Comments</Label>
                  <Textarea
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Add your review comments..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleReview("approved")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReview("rejected")}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
};

export default SubmissionsPage;
