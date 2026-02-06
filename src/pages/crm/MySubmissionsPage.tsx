import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ExternalLink, Clock, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface Submission {
  id: string;
  task_id: string;
  file_url: string | null;
  external_link: string | null;
  comments: string | null;
  submitted_at: string;
  review_status: string | null;
  review_comments: string | null;
  task_title?: string;
}

const MySubmissionsPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (!loading && !role) {
      navigate("/");
      return;
    }

    if (role) {
      fetchSubmissions();
    }
  }, [role, loading, user, navigate]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("task_submissions")
      .select("*")
      .eq("submitted_by", user?.id)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
      return;
    }

    // Fetch task titles
    const submissionsWithTasks = await Promise.all(
      (data || []).map(async (sub) => {
        const { data: task } = await supabase
          .from("tasks")
          .select("title")
          .eq("id", sub.task_id)
          .single();
        return { ...sub, task_title: task?.title };
      })
    );

    setSubmissions(submissionsWithTasks);
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
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!role) {
    return null;
  }

  return (
    <CRMLayout userRole={role}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">My Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your submitted work
          </p>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              All Submissions ({submissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No submissions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium">{submission.task_title || "Unknown Task"}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Submitted: {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                        {submission.external_link && (
                          <a
                            href={submission.external_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Link
                          </a>
                        )}
                        {submission.comments && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted p-2 rounded">
                            {submission.comments}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(submission.review_status)}
                        {submission.review_comments && (
                          <p className="text-sm text-muted-foreground max-w-xs text-right">
                            Feedback: {submission.review_comments}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  );
};

export default MySubmissionsPage;
