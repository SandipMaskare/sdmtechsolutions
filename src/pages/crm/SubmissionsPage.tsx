import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ExternalLink, FileText, Check, X, Clock, Eye } from "lucide-react";
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

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selectedSubmission) return;

    // Update submission
    const { error: subError } = await supabase
      .from("task_submissions")
      .update({
        review_status: status,
        review_comments: reviewComments,
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
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve task submissions from employees
          </p>
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
          <DialogContent className="max-w-lg">
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
                    <a
                      href={selectedSubmission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View File
                    </a>
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
