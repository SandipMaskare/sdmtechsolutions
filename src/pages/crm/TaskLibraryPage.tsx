import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layers, Search } from "lucide-react";
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
  const [batches, setBatches] = useState<{ id: string; name: string; domain: string; start_date: string | null; end_date: string | null }[]>([]);
  const [bm, setBm] = useState<Record<string, string>>({}); // user_id -> batch_id
  const [batchF, setBatchF] = useState<string>("all"); // all | none | batch id
  const [groupBy, setGroupBy] = useState<"domain" | "batch">("batch");

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
      const [{ data: bs }, { data: ms }] = await Promise.all([
        (supabase as any).from("batches").select("id,name,domain,start_date,end_date").order("start_date", { ascending: true }),
        (supabase as any).from("batch_members").select("batch_id,user_id"),
      ]);
      const bList = ((bs as any[]) || []).slice().sort((a, b) => String(a.start_date || "9999").localeCompare(String(b.start_date || "9999")) || String(a.end_date || "").localeCompare(String(b.end_date || "")));
      const memb: Record<string, string> = {};
      ((ms as any[]) || []).forEach((x) => (memb[x.user_id] = x.batch_id));
      setBatches(bList); setBm(memb);
      const { data: ps } = await supabase.from("profiles").select("user_id, full_name, email, internship_domain, internship_start, internship_end").in("user_id", ids);
      const rm: Record<string, string> = {};
      (roles || []).forEach((r) => (rm[r.user_id] = r.role));
      setPeople((ps || []).map((p: any) => {
        const b = bList.find((x) => x.id === memb[p.user_id]);
        // a batch supplies the dates and domain when the profile has none, so deadlines and week limits still work
        return { ...p, role: rm[p.user_id], internship_start: p.internship_start || b?.start_date || null, internship_end: p.internship_end || b?.end_date || null, internship_domain: p.internship_domain || b?.domain || null };
      }).sort((a: any, b: any) => String(a.full_name).localeCompare(String(b.full_name))));
      await loadTasks(ids);
      const pre = sp.get("user");
      if (pre) setSel({ [pre]: true });
      const pb = sp.get("batch");
      if (pb && bList.some((x) => x.id === pb)) {
        const b = bList.find((x) => x.id === pb)!;
        setSel(Object.fromEntries(Object.entries(memb).filter(([, v]) => v === pb).map(([k]) => [k, true])));
        setBatchF(pb);
        if (findDomain(b.domain)) setForceDomain(findDomain(b.domain)!.key);
      }
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
    if (batchF === "none" && bm[p.user_id]) return false;
    if (batchF !== "all" && batchF !== "none" && bm[p.user_id] !== batchF) return false;
    if (q && !`${p.full_name} ${p.email} ${p.internship_domain}`.toLowerCase().includes(q.toLowerCase())) return false;
    const e = info[p.user_id];
    if (statusF === "none") return !e;
    if (statusF === "has") return !!e;
    if (statusF === "needs") return !hasWeek(p) && withinLength(p);
    if (statusF === "done") return hasWeek(p);
    return true;
  }), [people, roleF, domainF, batchF, bm, q, statusF, info, plan]);

  const NO_BATCH = "__nobatch";
  const fd = (d: string | null) => (d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "?");
  const bLabel = (b: { name: string; start_date: string | null; end_date: string | null }) => `${b.name} · ${fd(b.start_date)} – ${fd(b.end_date)}`;
  const groups = useMemo(() => {
    if (groupBy === "batch") {
      const order = [...batches.map((b) => ({ key: b.id, label: bLabel(b), domain: b.domain })), { key: NO_BATCH, label: "Not in a batch", domain: "" }];
      return order.map((g) => ({ ...g, list: shown.filter((p) => (bm[p.user_id] || NO_BATCH) === g.key) })).filter((g) => g.list.length);
    }
    const order = [...DOMAINS.map((d) => ({ key: d.key, label: d.label, domain: d.key })), { key: NO_DOMAIN, label: "Domain not set", domain: "" }];
    return order.map((g) => ({ ...g, list: shown.filter((p) => domKey(p) === g.key) })).filter((g) => g.list.length);
  }, [shown, groupBy, batches, bm]);

  const counts = (g: { list: Assignee[] }) => {
    const all = people.filter((p) => g.list.some((x) => x.user_id === p.user_id));
    return { n: all.length, with: all.filter((p) => info[p.user_id]).length };
  };
  const pickBatch = (id: string) => {
    const b = batches.find((x) => x.id === id);
    const members = people.filter((p) => bm[p.user_id] === id);
    setSel(Object.fromEntries(members.map((p) => [p.user_id, true])));
    setBatchF(id);
    if (b && DOMAINS.some((d) => d.key === findDomain(b.domain)?.key)) setForceDomain(findDomain(b.domain)!.key);
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
              <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 p-3 space-y-2">
                <p className="text-sm font-semibold flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary" /> Assign to a whole batch</p>
                {batches.length === 0 ? <p className="text-xs text-muted-foreground">No batches yet. Create one in Batches &amp; Interns, then come back.</p> : (
                  <div className="flex flex-wrap gap-1.5">
                    {batches.map((b) => {
                      const n = people.filter((p) => bm[p.user_id] === b.id).length;
                      return <button key={b.id} onClick={() => pickBatch(b.id)} className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${batchF === b.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted"}`}>{bLabel(b)} · {n}</button>;
                    })}
                  </div>
                )}
                <p className="text-[11px] text-muted-foreground">Tap a batch to pick every intern in it and set the domain, then press Assign on the right.</p>
              </div>
              <div className="relative"><Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" /><Input className="pl-8" placeholder="Search name, email or domain" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <div className="flex flex-wrap gap-1.5">
                <Chip on={statusF === "all"} onClick={() => setStatusF("all")}>Everyone</Chip>
                <Chip on={statusF === "none"} onClick={() => setStatusF("none")}>No task yet</Chip>
                <Chip on={statusF === "has"} onClick={() => setStatusF("has")}>Has tasks</Chip>
                <Chip on={statusF === "needs"} onClick={() => setStatusF("needs")}>Needs {weekLabel}</Chip>
                <Chip on={statusF === "done"} onClick={() => setStatusF("done")}>Already has {weekLabel}</Chip>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Chip on={batchF === "all"} onClick={() => setBatchF("all")}>Any batch</Chip>
                <Chip on={batchF === "none"} onClick={() => setBatchF("none")}>Not in a batch</Chip>
                <span className="mx-1 text-muted-foreground">|</span>
                <Chip on={groupBy === "batch"} onClick={() => setGroupBy("batch")}>Group by batch</Chip>
                <Chip on={groupBy === "domain"} onClick={() => setGroupBy("domain")}>Group by domain</Chip>
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
                  const c = counts(g);
                  const allOn = g.list.every((p) => sel[p.user_id]);
                  return (
                    <div key={g.key} className="rounded-lg border border-border">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-t-lg">
                        <Checkbox checked={allOn} onCheckedChange={(v) => setMany(g.list, !!v)} />
                        <button className="flex-1 text-left text-sm font-semibold" onClick={() => { const dk = findDomain(g.domain)?.key; if (dk) setForceDomain(dk); }}>{g.label}</button>
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
