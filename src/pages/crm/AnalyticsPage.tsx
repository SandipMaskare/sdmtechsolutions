import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface EmployeePerformance {
  user_id: string;
  full_name: string;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
  completion_rate: number;
}

const AnalyticsPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const [employeeStats, setEmployeeStats] = useState<EmployeePerformance[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });

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
      fetchAnalytics();
    }
  }, [role, loading, user, navigate]);

  const fetchAnalytics = async () => {
    try {
      // Fetch all tasks
      const { data: tasks } = await supabase.from("tasks").select("*");
      const taskList = tasks || [];

      setOverallStats({
        totalTasks: taskList.length,
        completedTasks: taskList.filter((t) => t.status === "approved").length,
        pendingTasks: taskList.filter((t) => t.status === "pending").length,
        inProgressTasks: taskList.filter((t) => t.status === "in_progress").length,
      });

      // Fetch all profiles
      const { data: profiles } = await supabase.from("profiles").select("*");
      
      // Calculate per-employee stats
      const performanceStats: EmployeePerformance[] = (profiles || []).map((profile) => {
        const employeeTasks = taskList.filter((t) => t.assigned_to === profile.user_id);
        const completedTasks = employeeTasks.filter((t) => t.status === "approved").length;
        const pendingTasks = employeeTasks.filter((t) => 
          t.status === "pending" || t.status === "in_progress"
        ).length;

        return {
          user_id: profile.user_id,
          full_name: profile.full_name,
          total_tasks: employeeTasks.length,
          completed_tasks: completedTasks,
          pending_tasks: pendingTasks,
          completion_rate: employeeTasks.length > 0 
            ? Math.round((completedTasks / employeeTasks.length) * 100) 
            : 0,
        };
      });

      // Sort by completion rate
      performanceStats.sort((a, b) => b.completion_rate - a.completion_rate);
      setEmployeeStats(performanceStats.filter((e) => e.total_tasks > 0));
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

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

  const overallCompletionRate = overallStats.totalTasks > 0
    ? Math.round((overallStats.completedTasks / overallStats.totalTasks) * 100)
    : 0;

  return (
    <CRMLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track team performance and task completion rates
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overallStats.totalTasks}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overallStats.completedTasks}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
                <Clock className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overallStats.inProgressTasks}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{overallStats.pendingTasks}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Overall Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Overall Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {overallStats.completedTasks} of {overallStats.totalTasks} tasks completed
                  </span>
                  <span className="font-medium">{overallCompletionRate}%</span>
                </div>
                <Progress value={overallCompletionRate} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employee Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Employee Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {employeeStats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No employee data available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {employeeStats.map((employee, index) => (
                    <div key={employee.user_id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{employee.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.completed_tasks} completed • {employee.pending_tasks} pending
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-lg">{employee.completion_rate}%</span>
                      </div>
                      <Progress value={employee.completion_rate} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CRMLayout>
  );
};

export default AnalyticsPage;
