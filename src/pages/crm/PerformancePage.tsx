import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, CheckCircle2, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

const PerformancePage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    submittedTasks: 0,
    rejectedTasks: 0,
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
      fetchPerformance();
    }
  }, [role, loading, user, navigate]);

  const fetchPerformance = async () => {
    const { data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_to", user?.id);

    const taskList = tasks || [];
    setStats({
      totalTasks: taskList.length,
      completedTasks: taskList.filter((t) => t.status === "approved").length,
      pendingTasks: taskList.filter((t) => t.status === "pending").length,
      inProgressTasks: taskList.filter((t) => t.status === "in_progress").length,
      submittedTasks: taskList.filter((t) => t.status === "submitted").length,
      rejectedTasks: taskList.filter((t) => t.status === "rejected").length,
    });
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

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const approvalRate = (stats.completedTasks + stats.rejectedTasks) > 0
    ? Math.round((stats.completedTasks / (stats.completedTasks + stats.rejectedTasks)) * 100)
    : 0;

  return (
    <CRMLayout userRole={role}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">My Performance</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and achievements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.completedTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Clock className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.inProgressTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingTasks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Task Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {stats.completedTasks} of {stats.totalTasks} tasks completed
                </span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Approval Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {stats.completedTasks} approved out of {stats.completedTasks + stats.rejectedTasks} reviewed
                </span>
                <span className="font-medium">{approvalRate}%</span>
              </div>
              <Progress value={approvalRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.submittedTasks}</div>
                <p className="text-sm text-muted-foreground">Awaiting Review</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{stats.rejectedTasks}</div>
                <p className="text-sm text-muted-foreground">Need Rework</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{completionRate}%</div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  );
};

export default PerformancePage;
