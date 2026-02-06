import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock, CheckCircle2, AlertCircle, Play, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  deadline: string | null;
  created_at: string;
}

const MyTasksPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [submitData, setSubmitData] = useState({
    external_link: "",
    comments: "",
  });

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
      fetchTasks();
    }
  }, [role, loading, user, navigate]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_to", user?.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return;
    }

    setTasks(data || []);
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Task status updated",
    });

    fetchTasks();
  };

  const handleSubmitWork = async () => {
    if (!selectedTask) return;

    // Create submission
    const { error: subError } = await supabase.from("task_submissions").insert({
      task_id: selectedTask.id,
      submitted_by: user?.id,
      external_link: submitData.external_link || null,
      comments: submitData.comments || null,
      review_status: "pending",
    });

    if (subError) {
      toast({
        title: "Error",
        description: "Failed to submit work",
        variant: "destructive",
      });
      return;
    }

    // Update task status to submitted
    await supabase
      .from("tasks")
      .update({ status: "submitted" })
      .eq("id", selectedTask.id);

    toast({
      title: "Success",
      description: "Work submitted successfully",
    });

    setIsSubmitDialogOpen(false);
    setSelectedTask(null);
    setSubmitData({ external_link: "", comments: "" });
    fetchTasks();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500"><Play className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "submitted":
        return <Badge className="bg-purple-500"><Send className="h-3 w-3 mr-1" />Submitted</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const submittedTasks = tasks.filter((t) => t.status === "submitted");
  const completedTasks = tasks.filter((t) => t.status === "approved" || t.status === "rejected");

  return (
    <CRMLayout userRole={role}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your assigned tasks
          </p>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{pendingTasks.length}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{submittedTasks.length}</div>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              All Tasks ({tasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks assigned to you yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-3 h-3 rounded-full mt-1.5 ${getPriorityColor(task.priority)}`}
                          title={task.priority}
                        />
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {getStatusBadge(task.status)}
                            {task.deadline && (
                              <span className="text-sm text-muted-foreground">
                                Due: {new Date(task.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6 md:ml-0">
                        {task.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(task.id, "in_progress")}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsSubmitDialogOpen(true);
                            }}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Submit
                          </Button>
                        )}
                        {task.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(task.id, "in_progress")}
                          >
                            Rework
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Work Dialog */}
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Work</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedTask && (
                <div>
                  <Label className="text-muted-foreground">Task</Label>
                  <p className="font-medium">{selectedTask.title}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label>External Link (Optional)</Label>
                <Input
                  value={submitData.external_link}
                  onChange={(e) =>
                    setSubmitData({ ...submitData, external_link: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea
                  value={submitData.comments}
                  onChange={(e) =>
                    setSubmitData({ ...submitData, comments: e.target.value })
                  }
                  placeholder="Add any notes about your work..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmitWork} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Work
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
};

export default MyTasksPage;
