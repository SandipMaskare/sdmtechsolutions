import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ADMIN_TOOLS } from "@/components/crm/adminTools";
import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalEmployees: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  submittedTasks: number;
}

const CRMDashboard = () => {
  const { role, loading, profile, user } = useUserRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    submittedTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

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
      fetchDashboardData();
    }
  }, [role, loading, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      if (role === "admin") {
        // Fetch all stats for admin
        const [employeesRes, tasksRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("tasks").select("*"),
        ]);

        const tasks = tasksRes.data || [];
        setStats({
          totalEmployees: employeesRes.count || 0,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.status === "approved").length,
          pendingTasks: tasks.filter((t) => t.status === "pending").length,
          inProgressTasks: tasks.filter((t) => t.status === "in_progress").length,
          submittedTasks: tasks.filter((t) => t.status === "submitted").length,
        });

        setRecentTasks(tasks.slice(0, 5));
      } else {
        // Fetch employee's own tasks
        const { data: tasks } = await supabase
          .from("tasks")
          .select("*")
          .eq("assigned_to", user?.id);

        const taskList = tasks || [];
        setStats({
          totalEmployees: 0,
          totalTasks: taskList.length,
          completedTasks: taskList.filter((t) => t.status === "approved").length,
          pendingTasks: taskList.filter((t) => t.status === "pending").length,
          inProgressTasks: taskList.filter((t) => t.status === "in_progress").length,
          submittedTasks: taskList.filter((t) => t.status === "submitted").length,
        });

        setRecentTasks(taskList.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <CRMLayout userRole={role}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">
            Welcome back, {profile?.full_name || "User"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {role === "admin" ? "Admin Dashboard" : "Employee Dashboard"} • {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>


        {role === "admin" && (
          <div className="space-y-4">
            <Link to="/crm/batches" className="block rounded-2xl p-4 text-white bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Batches &amp; interns</p>
                  <p className="text-sm opacity-90">Group interns by domain and dates, manage every profile in one place and send profile reminders.</p>
                </div>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </div>
            </Link>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Everything in one place</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {ADMIN_TOOLS.map((t, i) => (
                  <Link key={t.key} to={t.to} style={{ animationDelay: `${i * 35}ms` }}
                    className="sdm-stat group flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/50">
                    <span className="h-9 w-9 rounded-lg flex items-center justify-center text-white shrink-0 bg-gradient-to-br from-teal-500 to-indigo-500 group-hover:from-indigo-500 group-hover:to-fuchsia-500 transition-all"><t.icon className="w-4 h-4" /></span>
                    <span className="text-sm font-medium text-foreground leading-tight">{t.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Employees
                  </CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalEmployees}</div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </CardTitle>
                <ClipboardList className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalTasks}</div>
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
                  Pending
                </CardTitle>
                <Clock className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pendingTasks}</div>
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
                  Completed
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.completedTasks}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Completion Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {role === "admin" ? "Overall Completion Rate" : "Your Completion Rate"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No tasks yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.priority === "urgent"
                              ? "bg-red-500"
                              : task.priority === "high"
                              ? "bg-orange-500"
                              : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {task.status.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      {task.deadline && (
                        <span className="text-sm text-muted-foreground">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
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

export default CRMDashboard;
