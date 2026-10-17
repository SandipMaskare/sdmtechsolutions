import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import CRMLayout from "@/components/crm/CRMLayout";
import PlanAssigner, { Assignee } from "@/components/crm/PlanAssigner";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

const TaskLibraryPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [people, setPeople] = useState<Assignee[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/auth");
    if (role !== "admin") return navigate("/crm/dashboard");
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("role", ["intern", "employee"]);
      const ids = (roles || []).map((r) => r.user_id);
      if (!ids.length) return;
      const { data: ps } = await supabase.from("profiles").select("user_id, full_name, email, internship_domain, internship_start, internship_end").in("user_id", ids);
      const rm: Record<string, string> = {};
      (roles || []).forEach((r) => (rm[r.user_id] = r.role));
      setPeople((ps || []).map((p: any) => ({ ...p, role: rm[p.user_id] })));
      const pre = sp.get("user");
      if (pre) setSel({ [pre]: true });
    })();
  }, [role, loading, user]);

  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  const chosen = people.filter((p) => sel[p.user_id]);

  return (
    <CRMLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display">Task Library</h1>
          <p className="text-muted-foreground mt-1">12 domains × 8 weeks × 3 tasks. Pick people, choose the domain and week, and assign in one click.</p>
        </div>
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Who gets the tasks?</CardTitle></CardHeader>
            <CardContent className="space-y-2 max-h-[560px] overflow-auto">
              {people.length === 0 && <p className="text-sm text-muted-foreground">No interns or employees yet.</p>}
              {people.map((p) => (
                <label key={p.user_id} className="flex items-start gap-3 text-sm cursor-pointer">
                  <Checkbox checked={!!sel[p.user_id]} onCheckedChange={(v) => setSel({ ...sel, [p.user_id]: !!v })} className="mt-1" />
                  <span>
                    <span className="font-medium">{p.full_name}</span> <Badge variant="outline" className="capitalize ml-1">{p.role}</Badge>
                    <br /><span className="text-xs text-muted-foreground">{p.internship_domain || "Domain not set"}</span>
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Plan</CardTitle></CardHeader>
            <CardContent><PlanAssigner people={chosen} /></CardContent>
          </Card>
        </div>
      </div>
    </CRMLayout>
  );
};
export default TaskLibraryPage;
