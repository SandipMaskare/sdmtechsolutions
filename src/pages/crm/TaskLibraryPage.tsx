import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CRMLayout from "@/components/crm/CRMLayout";
import PlanAssigner, { Assignee } from "@/components/crm/PlanAssigner";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { DOMAINS, WEEKS, findDomain, planWeeks } from "@/data/internshipPlan";

type StatusF = "all" | "none" | "has" | "needs" | "done";
type RoleF = "all" | "intern" | "employee";
const NO_DOMAIN = "__none";

const TaskLibraryPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [people, setPeople] = useState<Assignee[]>([]);
  const [tasks, setTasks] = useState<{ assigned_to: string; title: string }[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState<StatusF>("all");
  const [roleF, setRoleF] = useState<RoleF>("all");
  const [domainF, setDomainF] = useState<string>("all");
  const [plan, setPlan] = useState<{ domainKey: string; week: string }>({ domainKey: DOMAINS[0].key, week: "1" });
  const [forceDomain, setForceDomain] = useState<string | undefined>();

  const loadTasks = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    const { data } = await supabase.from("tasks").select("assigned_to, title").in("assigned_to", ids);
    setTasks((data as any[]) || []);
  }, []);

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
      setPeople((ps || []).map((p: any) => ({ ...p, role: rm[p.user_id] })).sort((a: any, b: any) => String(a.full_name).localeCompare(String(b.full_name))));
      await loadTasks(ids);
      const pre = sp.get("user");
      if (pre) setSel({ [pre]: true });
    })();
  }, [role, loading, user]);

  // Weeks each person already has (per task title "Week N: ...") and how many tasks in total.
  const info = useMemo(() => {
    const m: Record<string, { total: number; weeks: Set<number> }> = {};
    tasks.forEach((t) => {
      const e = (m[t.assigned_to] ||= { total: 0, weeks: new Set() });
      e.total++;
      const w = /^Week (\d+):/.exec(t.title);
      if (w) e.weeks.add(Number(w[1]));
    });
    return m;
  }, [tasks]);

  const domKey = (p: Assignee) => findDomain(p.internship_domain)?.key || NO_DOMAIN;
  const hasWeek = (p: Assignee) => {
    const e = info[p.user_id];
    if (!e) return false;
    if (plan.week === "all") return Array.from({ length: planWeeks(p.internship_start, p.internship_end) }, (_, i) => i + 1).every((w) => e.weeks.has(w));
    return e.weeks.has(Number(plan.week));
  };
  const withinLength = (p: Assignee) => plan.week === "all" || Number(plan.week) <= planWeeks(p.internship_start, p.internship_end);
  const weekLabel = plan.week === "all" ? "all weeks" : `Week ${plan.week}`;

  const shown = useMemo(() => people.filter((p) => {
    if (roleF !== "all" && p.role !== roleF) return false;
    if (domainF !== "all" && domKey(p) !== domainF) return false;
    if (q && !`${p.full_name} ${p.email} ${p.internship_domain}`.toLowerCase().includes(q.toLowerCase())) return false;
    const e = info[p.user_id];
    if (statusF === "none") return !e;
    if (statusF === "has") return !!e;
    if (statusF === "needs") return !hasWeek(p) && withinLength(p);
    if (statusF === "done") return hasWeek(p);
    return true;
  }), [people, roleF, domainF, q, statusF, info, plan]);

  const groups = useMemo(() => {
    const order = [...DOMAINS.map((d) => ({ key: d.key, label: d.label })), { key: NO_DOMAIN, label: "Domain not set" }];
    return order.map((g) => ({ ...g, list: shown.filter((p) => domKey(p) === g.key) })).filter((g) => g.list.length);
  }, [shown]);

  const counts = (key: string) => {
    const all = people.filter((p) => (roleF === "all" || p.role === roleF) && domKey(p) === key);
    return { n: all.length, with: all.filter((p) => info[p.user_id]).length };
  };

  const chosen = people.filter((p) => sel[p.user_id]);
  const setMany = (list: Assignee[], v: boolean) => setSel((s) => { const n = { ...s }; list.forEach((p) => (n[p.user_id] = v)); return n; });

  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} className={`px-2.5 py-1 rounded-full text-xs border ${on ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{children}</button>
  );

  return (
    <CRMLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display">Task Library</h1>
          <p className="text-muted-foreground mt-1">People are grouped by domain. Use the filters to see who still has no task, or who still needs the week you are assigning, then pick them and assign in one click.</p>
        </div>
        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Who gets the tasks? ({chosen.length} picked)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="relative"><Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" /><Input className="pl-8" placeholder="Search name, email or domain" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <div className="flex flex-wrap gap-1.5">
                <Chip on={statusF === "all"} onClick={() => setStatusF("all")}>Everyone</Chip>
                <Chip on={statusF === "none"} onClick={() => setStatusF("none")}>No task yet</Chip>
                <Chip on={statusF === "has"} onClick={() => setStatusF("has")}>Has tasks</Chip>
                <Chip on={statusF === "needs"} onClick={() => setStatusF("needs")}>Needs {weekLabel}</Chip>
                <Chip on={statusF === "done"} onClick={() => setStatusF("done")}>Already has {weekLabel}</Chip>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["all", "intern", "employee"] as RoleF[]).map((r) => <Chip key={r} on={roleF === r} onClick={() => setRoleF(r)}>{r === "all" ? "Interns + employees" : r === "intern" ? "Interns" : "Employees"}</Chip>)}
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Chip on={domainF === "all"} onClick={() => setDomainF("all")}>All domains</Chip>
                {DOMAINS.map((d) => <Chip key={d.key} on={domainF === d.key} onClick={() => { setDomainF(d.key); setForceDomain(d.key); }}>{d.label}</Chip>)}
                <Chip on={domainF === NO_DOMAIN} onClick={() => setDomainF(NO_DOMAIN)}>Domain not set</Chip>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{shown.length} shown</span>
                <span className="flex gap-2"><Button size="sm" variant="outline" className="h-7" onClick={() => setMany(shown, true)}>Select all shown</Button><Button size="sm" variant="ghost" className="h-7" onClick={() => setSel({})}>Clear</Button></span>
              </div>
              <div className="max-h-[520px] overflow-auto space-y-3">
                {people.length === 0 && <p className="text-sm text-muted-foreground">No interns or employees yet.</p>}
                {people.length > 0 && groups.length === 0 && <p className="text-sm text-muted-foreground">Nobody matches these filters.</p>}
                {groups.map((g) => {
                  const c = counts(g.key);
                  const allOn = g.list.every((p) => sel[p.user_id]);
                  return (
                    <div key={g.key} className="rounded-lg border border-border">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-t-lg">
                        <Checkbox checked={allOn} onCheckedChange={(v) => setMany(g.list, !!v)} />
                        <button className="flex-1 text-left text-sm font-semibold" onClick={() => g.key !== NO_DOMAIN && setForceDomain(g.key)}>{g.label}</button>
                        <span className="text-xs text-muted-foreground">{c.n} people · {c.with} with tasks · {c.n - c.with} without</span>
                      </div>
                      <div className="divide-y divide-border">
                        {g.list.map((p) => {
                          const e = info[p.user_id];
                          const done = hasWeek(p), fits = withinLength(p);
                          return (
                            <label key={p.user_id} className="flex items-start gap-3 text-sm cursor-pointer px-3 py-2">
                              <Checkbox checked={!!sel[p.user_id]} onCheckedChange={(v) => setSel({ ...sel, [p.user_id]: !!v })} className="mt-1" />
                              <span className="flex-1 min-w-0">
                                <span className="font-medium">{p.full_name}</span> <Badge variant="outline" className="capitalize ml-1">{p.role}</Badge>
                                <br />
                                <span className="text-xs text-muted-foreground">{e ? `${e.total} task(s) · weeks ${[...e.weeks].sort((a, b) => a - b).join(", ") || "none"}` : "No task yet"} · {planWeeks(p.internship_start, p.internship_end)} wk internship</span>
                              </span>
                              {!fits ? <span className="text-xs text-muted-foreground">too short</span> : done ? <span className="text-xs text-green-600">has {weekLabel}</span> : <span className="text-xs text-amber-600">needs {weekLabel}</span>}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Plan</CardTitle></CardHeader>
            <CardContent>
              <PlanAssigner people={chosen} forceDomain={forceDomain} onChange={setPlan} onDone={() => void loadTasks(people.map((p) => p.user_id))} />
            </CardContent>
          </Card>
        </div>
      </div>
    </CRMLayout>
  );
};
export default TaskLibraryPage;
