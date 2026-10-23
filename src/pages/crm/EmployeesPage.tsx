import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal, UserPlus, Mail, Phone, Building2, BellRing } from "lucide-react";
import { callFunction } from "@/lib/functions";
import { progressOf } from "@/components/portal/ProgressPanel";
import { Progress } from "@/components/ui/progress";
import { durationText, missingFields } from "@/lib/internProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  position: string | null;
  is_active: boolean;
  created_at: string;
  intern_id?: string | null;
  internship_domain?: string | null;
  internship_start?: string | null;
  internship_end?: string | null;
  college?: string | null;
  [k: string]: any;
}

const EmployeesPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});
  const [taskMap, setTaskMap] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    department: "",
    position: "",
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
      fetchEmployees();
    }
  }, [role, loading, user, navigate]);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
      return;
    }

    setEmployees(data || []);

    const { data: roleRows } = await supabase.from("user_roles").select("user_id, role");
    const map: Record<string, string> = {};
    (roleRows || []).forEach((r) => {
      const rank = (x: string) => (x === "admin" ? 3 : x === "employee" ? 2 : 1);
      if (!map[r.user_id] || rank(r.role) > rank(map[r.user_id])) map[r.user_id] = r.role;
    });
    setRoleMap(map);
    const { data: allTasks } = await supabase.from("tasks").select("assigned_to,status,week");
    const tm: Record<string, any[]> = {};
    (allTasks || []).forEach((t: any) => { if (t.assigned_to) (tm[t.assigned_to] ||= []).push(t); });
    setTaskMap(tm);
  };

  const handleToggleActive = async (employee: Employee) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !employee.is_active })
      .eq("id", employee.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Employee ${employee.is_active ? "deactivated" : "activated"} successfully`,
    });

    fetchEmployees();
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone || null,
        department: formData.department || null,
        position: formData.position || null,
      })
      .eq("id", editingEmployee.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Employee updated successfully",
    });

    setEditingEmployee(null);
    fetchEmployees();
  };

  const handleAssignRole = async (userId: string, role: "admin" | "employee" | "intern" | "none") => {
    // First remove existing roles
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // Add new role (normal users have no role row)
    const { error } = role === "none"
      ? { error: null }
      : await supabase.from("user_roles").insert({ user_id: userId, role });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `Role updated successfully`,
    });
    fetchEmployees();
  };

  const sendReminders = async () => {
    const targets = employees.filter((e) => ["intern", "employee"].includes(roleMap[e.user_id]) && e.is_active && missingFields(e, roleMap[e.user_id]).length > 0);
    if (targets.length === 0) { toast({ title: "All active interns have completed their profile" }); return; }
    if (!window.confirm(`Email ${targets.length} intern(s) asking them to complete their profile?`)) return;
    const body = `Hello,\n\nPlease log in to the SDM Technology portal and complete your profile. It is compulsory.\n\nInterns: add the details from your offer letter (Intern ID, internship domain, start and end dates, mode, college). Employees: add your Employee ID and position. Everyone: add your LinkedIn profile link and confirm that you follow the SDM Technology LinkedIn page.\n\nWe use your domain to assign your weekly tasks.\n\nLog in: https://www.sdmtechsolution.com/auth`;
    const { error } = await callFunction("send-email", {
      to: targets.map((t) => t.email),
      subject: "Action needed: complete your SDM Technology intern profile",
      text: body,
      template: "intern",
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">${body.replace(/\n/g, "<br>").replace("https://www.sdmtechsolution.com/auth", '<a href="https://www.sdmtechsolution.com/auth">https://www.sdmtechsolution.com/auth</a>')}</div>`,
    });
    toast(error ? { title: "Email not sent", description: error, variant: "destructive" } : { title: "Reminder sent", description: `${targets.length} intern(s) emailed.` });
  };

  type View = "intern_assigned" | "intern_waiting" | "employee" | "admin" | "user" | "all";
  const [view, setView] = useState<View>("intern_waiting");
  const inView = (emp: Employee) => {
    const r = roleMap[emp.user_id];
    const has = (taskMap[emp.user_id] || []).length > 0;
    switch (view) {
      case "intern_assigned": return r === "intern" && has;
      case "intern_waiting": return r === "intern" && !has;
      case "employee": return r === "employee";
      case "admin": return r === "admin";
      case "user": return !r;
      default: return true;
    }
  };
  const countOf = (v: View) => employees.filter((e) => {
    const r = roleMap[e.user_id]; const has = (taskMap[e.user_id] || []).length > 0;
    return v === "intern_assigned" ? r === "intern" && has : v === "intern_waiting" ? r === "intern" && !has : v === "employee" ? r === "employee" : v === "admin" ? r === "admin" : v === "user" ? !r : true;
  }).length;
  const VIEWS: [View, string][] = [["intern_waiting", "Interns: no task yet"], ["intern_assigned", "Interns: task assigned"], ["employee", "Employees"], ["admin", "Admins"], ["user", "Normal users"], ["all", "Everyone"]];

  const filteredEmployees = employees.filter(inView).filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (emp.intern_id?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (emp.internship_domain?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-display">Employees</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their roles. Click a name to see the full profile.
            </p>
          </div>
          <Button variant="outline" onClick={sendReminders}><BellRing className="h-4 w-4 mr-2" />Remind staff to complete profile</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {VIEWS.map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-full text-sm border transition ${view === v ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-muted"}`}>
              {label} ({countOf(v)})
            </button>
          ))}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>{VIEWS.find(([v]) => v === view)?.[1]} ({filteredEmployees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Intern ID</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Internship period</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Login type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <button className="text-left hover:text-primary hover:underline" onClick={() => navigate(`/crm/people/${employee.user_id}`)}>{employee.full_name}</button>
                      {["intern", "employee"].includes(roleMap[employee.user_id]) && missingFields(employee, roleMap[employee.user_id]).length > 0 && (
                        <Badge variant="outline" className="ml-2 text-orange-600 border-orange-400">Profile incomplete</Badge>
                      )}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.intern_id || "-"}</TableCell>
                    <TableCell>{employee.internship_domain || "-"}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{employee.internship_start ? durationText(employee) : "-"}</TableCell>
                    <TableCell className="min-w-[110px]">
                      {(() => { const o = progressOf(taskMap[employee.user_id] || []); return o.total ? (<div className="space-y-1"><Progress value={o.pct} className="h-2" /><span className="text-xs text-muted-foreground">{o.approved}/{o.total} done</span></div>) : "-"; })()}
                    </TableCell>
                    <TableCell>{employee.department || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={roleMap[employee.user_id] ? "default" : "outline"}>
                        {roleMap[employee.user_id] === "admin"
                          ? "Admin"
                          : roleMap[employee.user_id] === "employee"
                          ? "Employee"
                          : roleMap[employee.user_id] === "intern"
                          ? "Intern"
                          : "Normal user"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.is_active ? "default" : "secondary"}>
                        {employee.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/crm/people/${employee.user_id}`)}>
                            View full profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/crm/task-library?user=${employee.user_id}`)}>
                            Assign tasks
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingEmployee(employee);
                              setFormData({
                                email: employee.email,
                                full_name: employee.full_name,
                                phone: employee.phone || "",
                                department: employee.department || "",
                                position: employee.position || "",
                              });
                            }}
                          >
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAssignRole(employee.user_id, "employee")}
                          >
                            Assign as Employee
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAssignRole(employee.user_id, "intern")}
                          >
                            Assign as Intern
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAssignRole(employee.user_id, "admin")}
                          >
                            Assign as Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAssignRole(employee.user_id, "none")}
                          >
                            Make normal user (remove access)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(employee)}
                          >
                            {employee.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No one in this list</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Employee Dialog */}
        <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <Button onClick={handleUpdateEmployee} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
};

export default EmployeesPage;
