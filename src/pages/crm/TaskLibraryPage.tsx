import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarDays, ChevronDown, ChevronRight, Pencil, Plus, Search, Trash2, UserMinus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CRMLayout from "@/components/crm/CRMLayout";
import PlanAssigner, { Assignee } from "@/components/crm/PlanAssigner";
import AutoTasksPanel from "@/components/crm/AutoTasksPanel";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { supabase as typed } from "@/integrations/supabase/client";
import { DOMAINS, findDomain, planWeeks } from "@/data/internshipPlan";

const supabase: any = typed;

interface Batch { id: string; name: string; domain: string; start_date: string | null; end_date: string | null; mentor?: string | null }
interface Task { id: string; assigned_to: string; title: string; status: string; deadline: string | null; week: number | null }
type Person = Assignee & { role: string };

const NONE = "__none";
const fd = (d?: string | null, y = false) => (d ? new Date(d + (d.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-IN", { day: "numeric", month: "short", ...(y ? { year: "numeric" } : {}) }) : "?");
const monthYear = (d?: string | null) => (d ? new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "");
const weekOf = (t: Task) => t.week ?? (/^Week (\d+):/.exec(t.title)?.[1] ? Number(/^Week (\d+):/.exec(t.title)![1]) : null);
const statusTone: Record<string, string> = {
  approved: "bg-green-500/15 text-green-700 border-green-500/40",
  submitted: "bg-blue-500/15 text-blue-700 border-blue-500/40",
  rejected: "bg-red-500/15 text-red-700 border-red-500/40",
  in_progress: "bg-amber-500/15 text-amber-700 border-amber-500/40",
  pending: "bg-amber-500/15 text-amber-700 border-amber-500/40",
};

const weekTone = (list: Task[]) => {
  if (!list.length) return "border-dashed text-muted-foreground";
  if (list.every((t) => t.status === "approved")) return statusTone.approved;
  if (list.every((t) => t.status === "approved" || t.status === "submitted")) return statusTone.submitted;
  if (list.some((t) => t.status === "rejected")) return statusTone.rejected;
  if (list.some((t) => !["approved", "submitted"].includes(t.status) && t.deadline && new Date(t.deadline) < new Date())) return statusTone.rejected;
  return statusTone.pending;
};

const TaskLibraryPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sp] = useSearchParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [bm, setBm] = useState<Record<string, string>>({}); // user_id -> batch_id
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");
  const [needF, setNeedF] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [exp, setExp] = useState<Record<string, boolean>>({});
  const [plan, setPlan] = useState<{ domainKey: string; week: string }>({ domainKey: DOMAINS[0].key, week: "1" });
  const [forceDomain, setForceDomain] = useState<string | undefined>();
  const [edit, setEdit] = useState<Partial<Batch> | null>(null);
  const [moveTo, setMoveTo] = useState<string>(NONE);
  const [delWeek, setDelWeek] = useState<string>(NONE);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("role", ["intern", "employee"]);
    const ids = (roles || []).map((r: any) => r.user_id);
    const [{ data: bs }, { data: ms }] = await Promise.all([
      supabase.from("batches").select("id,name,domain,start_date,end_date,mentor"),
      supabase.from("batch_members").select("batch_id,user_id"),
    ]);
    const bList: Batch[] = ((bs as Batch[]) || []).slice().sort((a, b) => String(a.start_date || "9999").localeCompare(String(b.start_date || "9999")) || a.domain.localeCompare(b.domain));
    const memb: Record<string, string> = {};
    ((ms as any[]) || []).forEach((x) => (memb[x.user_id] = x.batch_id));
    setBatches(bList); setBm(memb);
    if (!ids.length) { setPeople([]); setTasks([]); return; }
    const [{ data: ps }, { data: ts }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, email, internship_domain, internship_start, internship_end").in("user_id", ids),
      supabase.from("tasks").select("id,assigned_to,title,status,deadline,week").in("assigned_to", ids),
    ]);
    const rm: Record<string, string> = {};
    (roles || []).forEach((r: any) => (rm[r.user_id] = r.role));
    setPeople(((ps as any[]) || []).map((p) => {
      const b = bList.find((x) => x.id === memb[p.user_id]);
      // a batch supplies the dates and domain when the profile has none, so deadlines and week limits still work
      return { ...p, role: rm[p.user_id], internship_start: p.internship_start || b?.start_date || null, internship_end: p.internship_end || b?.end_date || null, internship_domain: p.internship_domain || b?.domain || null };
    }).sort((a, b) => String(a.full_name).localeCompare(String(b.full_name))));
    setTasks((ts as Task[]) || []);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/auth");
    if (role !== "admin") return navigate("/crm/dashboard");
    void load();
  }, [role, loading, user, load, navigate]);

  // ?batch=<id> (from the Batches page): open that batch and pick everyone in it
  const pb = sp.get("batch");
  const [applied, setApplied] = useState(false);
  useEffect(() => {
    if (applied || !pb || !batches.length || !people.length) return;
    const b = batches.find((x) => x.id === pb);
    if (!b) return;
    setApplied(true);
    setOpen((o) => ({ ...o, [`c:${b.start_date || NONE}`]: true, [`b:${b.id}`]: true }));
    setSel(Object.fromEntries(people.filter((p) => bm[p.user_id] === pb).map((p) => [p.user_id, true])));
    const dk = findDomain(b.domain)?.key; if (dk) setForceDomain(dk);
  }, [pb, batches, people, bm, applied]);

  const byUser = useMemo(() => {
    const m: Record<string, Task[]> = {};
    tasks.forEach((t) => (m[t.assigned_to] ||= []).push(t));
    return m;
  }, [tasks]);
  const weekTasks = (uid: string, w: number) => (byUser[uid] || []).filter((t) => weekOf(t) === w);
  const needsWeek = (p: Person) => plan.week === "all" ? true : Number(plan.week) <= planWeeks(p.internship_start, p.internship_end) && weekTasks(p.user_id, Number(plan.week)).length === 0;

  const match = (p: Person) => {
    const s = q.trim().toLowerCase();
    if (s && !`${p.full_name} ${p.email} ${p.internship_domain}`.toLowerCase().includes(s)) return false;
    if (needF && !needsWeek(p)) return false;
    return true;
  };

  // cohort (start date) -> batch (domain) -> interns
  const cohorts = useMemo(() => {
    const map = new Map<string, Batch[]>();
    batches.forEach((b) => { const k = b.start_date || NONE; map.set(k, [...(map.get(k) || []), b]); });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([start, list]) => ({
      start, batches: list.map((b) => ({ b, members: people.filter((p) => bm[p.user_id] === b.id && p.role === "intern" && match(p)), all: people.filter((p) => bm[p.user_id] === b.id) })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batches, people, bm, q, needF, plan, tasks]);
  const unbatched = useMemo(() => people.filter((p) => !bm[p.user_id] && match(p)), [people, bm, q, needF, plan, tasks]); // eslint-disable-line react-hooks/exhaustive-deps
  const unbatchedGroups = useMemo(() => {
    const g = new Map<string, Person[]>();
    unbatched.filter((p) => p.role === "intern").forEach((p) => { const k = findDomain(p.internship_domain)?.label || "Domain not set"; g.set(k, [...(g.get(k) || []), p]); });
    return [...g.entries()];
  }, [unbatched]);
  const employees = unbatched.filter((p) => p.role === "employee");

  const chosen = people.filter((p) => sel[p.user_id]);
  const setMany = (list: Person[], v: boolean) => setSel((s) => { const n = { ...s }; list.forEach((p) => (n[p.user_id] = v)); return n; });
  const toggle = (setter: typeof setOpen, k: string) => setter((o) => ({ ...o, [k]: !o[k] }));

  const run = async (fn: () => Promise<unknown>) => { setBusy(true); try { await fn(); } finally { setBusy(false); } };
  const err = (e: any) => e && toast({ title: "Something went wrong", description: e.message, variant: "destructive" });

  const setBatchFor = (ids: string[], batchId: string | null) => run(async () => {
    const del = await supabase.from("batch_members").delete().in("user_id", ids);
    if (del.error) return err(del.error);
    if (batchId) { const ins = await supabase.from("batch_members").insert(ids.map((u) => ({ batch_id: batchId, user_id: u }))); if (ins.error) return err(ins.error); }
    toast({ title: batchId ? `Moved ${ids.length} intern(s)` : `Removed ${ids.length} intern(s) from their batch` });
    await load();
  });

  const deleteTasks = (ids: string[], label: string) => run(async () => {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} task(s)${label ? ` (${label})` : ""}? Submissions on them are removed too. This cannot be undone.`)) return;
    const { error } = await supabase.from("tasks").delete().in("id", ids);
    if (error) return err(error);
    toast({ title: `Deleted ${ids.length} task(s)` });
    await load();
  });

  const saveBatch = (b: Partial<Batch>) => run(async () => {
    if (!b.domain || !b.start_date || !b.end_date) return toast({ title: "Domain, start and end date are required", variant: "destructive" });
    const row = { name: b.name?.trim() || `${b.domain} · ${monthYear(b.start_date)}`, domain: b.domain, start_date: b.start_date, end_date: b.end_date, mentor: b.mentor || null };
    const { error } = b.id ? await supabase.from("batches").update(row).eq("id", b.id) : await supabase.from("batches").insert(row);
    if (error) return err(error);
    setEdit(null); toast({ title: "Batch saved" }); await load();
  });
  const deleteBatch = (b: Batch) => run(async () => {
    if (!window.confirm(`Delete the batch "${b.name}"? Interns stay, they just leave the batch. Their tasks are not deleted.`)) return;
    await supabase.from("batch_members").delete().eq("batch_id", b.id);
    const { error } = await supabase.from("batches").delete().eq("id", b.id);
    if (error) return err(error);
    await load();
  });
  const shiftCohort = (start: string, list: Batch[]) => {
    const ns = window.prompt(`New start date for all ${list.length} batch(es) starting ${fd(start, true)} (YYYY-MM-DD):`, start);
    if (!ns || !/^\d{4}-\d{2}-\d{2}$/.test(ns)) return;
    const diff = Math.round((new Date(ns).getTime() - new Date(start).getTime()) / 86400000);
    void run(async () => {
      for (const b of list) {
        const e = b.end_date ? new Date(new Date(b.end_date).getTime() + diff * 86400000).toISOString().slice(0, 10) : null;
        const { error } = await supabase.from("batches").update({ start_date: ns, end_date: e }).eq("id", b.id);
        if (error) return err(error);
      }
      toast({ title: "Cohort dates updated" }); await load();
    });
  };

  const InternRow = ({ p }: { p: Person }) => {
    const total = planWeeks(p.internship_start, p.internship_end);
    const mine = (byUser[p.user_id] || []).slice().sort((a, b) => (weekOf(a) || 0) - (weekOf(b) || 0));
    const isOpen = !!exp[p.user_id];
    const bId = bm[p.user_id];
    return (
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Checkbox checked={!!sel[p.user_id]} onCheckedChange={(v) => setSel({ ...sel, [p.user_id]: !!v })} />
          <button className="font-medium text-sm text-left min-w-[130px]" onClick={() => toggle(setExp, p.user_id)}>{p.full_name}</button>
          <div className="flex flex-wrap gap-1 flex-1">
            {Array.from({ length: total }, (_, i) => i + 1).map((w) => {
              const l = weekTasks(p.user_id, w);
              return <button key={w} onClick={() => toggle(setExp, p.user_id)} title={l.length ? `${l.length} task(s)` : "Not assigned"} className={`px-1.5 py-0.5 rounded border text-[11px] ${weekTone(l)}`}>W{w}{l.length ? `·${l.length}` : ""}</button>;
            })}
          </div>
          <span className="text-[11px] text-muted-foreground">{mine.length} task(s)</span>
          <button onClick={() => toggle(setExp, p.user_id)} className="text-muted-foreground">{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
        </div>
        {isOpen && (
          <div className="mt-2 ml-6 space-y-1">
            {mine.length === 0 && <p className="text-xs text-muted-foreground">No tasks yet.</p>}
            {mine.map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-xs rounded border border-border px-2 py-1">
                <Badge variant="outline" className={`capitalize ${statusTone[t.status] || ""}`}>{t.status.replace("_", " ")}</Badge>
                <span className="flex-1 min-w-0 truncate" title={t.title}>{t.title}</span>
                <span className="text-muted-foreground whitespace-nowrap">due {fd(t.deadline)}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" disabled={busy} title="Delete this task" onClick={() => void deleteTasks([t.id], t.title)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Select value={bId || NONE} onValueChange={(v) => void setBatchFor([p.user_id], v === NONE ? null : v)}>
                <SelectTrigger className="h-7 w-56 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={NONE}>No batch</SelectItem>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.domain} · {fd(b.start_date)}</SelectItem>)}</SelectContent>
              </Select>
              {mine.length > 0 && <Button size="sm" variant="outline" className="h-7 text-xs" disabled={busy} onClick={() => void deleteTasks(mine.map((t) => t.id), `all of ${p.full_name}'s tasks`)}><Trash2 className="w-3 h-3 mr-1 text-destructive" /> Delete all tasks</Button>}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const wkNum = delWeek === NONE ? null : Number(delWeek);
  const weekDeleteIds = wkNum ? chosen.flatMap((p) => weekTasks(p.user_id, wkNum).map((t) => t.id)) : [];

  return (
    <CRMLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold font-display">Task Library</h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">Open a start-date section, then a domain, to see its interns and every week of their work (green = approved, blue = submitted, amber = pending, red = rejected or overdue). Tick people, then assign a plan week on the right.</p>
          </div>
          <Button onClick={() => setEdit({ start_date: "", end_date: "" })}><Plus className="w-4 h-4 mr-1" /> New batch</Button>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]"><Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" /><Input className="pl-8" placeholder="Search name, email or domain" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <label className="flex items-center gap-2 text-xs"><Checkbox checked={needF} onCheckedChange={(v) => setNeedF(!!v)} /> Only people who still need the selected week</label>
              <Button size="sm" variant="outline" onClick={() => setOpen(Object.fromEntries([...cohorts.flatMap((c) => [[`c:${c.start}`, true], ...c.batches.map(({ b }) => [`b:${b.id}`, true])])]))}>Expand all</Button>
              <Button size="sm" variant="ghost" onClick={() => setOpen({})}>Collapse all</Button>
            </div>

            {chosen.length > 0 && (
              <div className="sticky top-2 z-10 rounded-lg border border-primary/40 bg-card shadow p-2 flex flex-wrap items-center gap-2 text-xs">
                <b>{chosen.length} selected</b>
                <Button size="sm" variant="ghost" className="h-7" onClick={() => setSel({})}>Clear</Button>
                <Select value={moveTo} onValueChange={setMoveTo}>
                  <SelectTrigger className="h-7 w-52 text-xs"><SelectValue placeholder="Move to batch…" /></SelectTrigger>
                  <SelectContent><SelectItem value={NONE}>Move to batch…</SelectItem>{batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.domain} · {fd(b.start_date)}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-7" disabled={busy || moveTo === NONE} onClick={() => void setBatchFor(chosen.map((p) => p.user_id), moveTo).then(() => setMoveTo(NONE))}>Move</Button>
                <Button size="sm" variant="outline" className="h-7" disabled={busy} onClick={() => void setBatchFor(chosen.map((p) => p.user_id), null)}><UserMinus className="w-3 h-3 mr-1" /> Remove from batch</Button>
                <Select value={delWeek} onValueChange={setDelWeek}>
                  <SelectTrigger className="h-7 w-40 text-xs"><SelectValue placeholder="Delete a week…" /></SelectTrigger>
                  <SelectContent><SelectItem value={NONE}>Delete a week…</SelectItem>{Array.from({ length: 8 }, (_, i) => i + 1).map((w) => <SelectItem key={w} value={String(w)}>Week {w}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-7" disabled={busy || !weekDeleteIds.length} onClick={() => void deleteTasks(weekDeleteIds, `Week ${wkNum}`).then(() => setDelWeek(NONE))}><Trash2 className="w-3 h-3 mr-1 text-destructive" /> Delete{weekDeleteIds.length ? ` (${weekDeleteIds.length})` : ""}</Button>
              </div>
            )}

            {people.length === 0 && <p className="text-sm text-muted-foreground">No interns or employees yet.</p>}
            {cohorts.map((c) => {
              const ck = `c:${c.start}`;
              const members = c.batches.flatMap((x) => x.members);
              const total = c.batches.reduce((n, x) => n + x.all.filter((p) => p.role === "intern").length, 0);
              if ((q || needF) && members.length === 0) return null;
              return (
                <Card key={ck}>
                  <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
                    <button className="flex items-center gap-2 flex-1 text-left" onClick={() => toggle(setOpen, ck)}>
                      {open[ck] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{c.start === NONE ? "No start date" : `Starting ${fd(c.start, true)}`}</span>
                      <span className="text-xs text-muted-foreground">{total} interns · {c.batches.length} domain{c.batches.length > 1 ? "s" : ""}</span>
                    </button>
                    <Checkbox checked={members.length > 0 && members.every((p) => sel[p.user_id])} onCheckedChange={(v) => setMany(members, !!v)} title="Select everyone in this section" />
                    {c.start !== NONE && <Button size="sm" variant="outline" className="h-7" disabled={busy} onClick={() => shiftCohort(c.start, c.batches.map((x) => x.b))}><Pencil className="w-3 h-3 mr-1" /> Edit dates</Button>}
                  </div>
                  {open[ck] && (
                    <CardContent className="space-y-2 pt-0">
                      {c.batches.map(({ b, members: ms, all }) => {
                        const bk = `b:${b.id}`;
                        const withTasks = all.filter((p) => (byUser[p.user_id] || []).length).length;
                        return (
                          <div key={b.id} className="rounded-lg border border-border">
                            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-t-lg flex-wrap">
                              <Checkbox checked={ms.length > 0 && ms.every((p) => sel[p.user_id])} onCheckedChange={(v) => { setMany(ms, !!v); const dk = findDomain(b.domain)?.key; if (dk && v) setForceDomain(dk); }} />
                              <button className="flex items-center gap-1.5 flex-1 text-left text-sm font-semibold" onClick={() => toggle(setOpen, bk)}>
                                {open[bk] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}{b.domain}
                                <span className="text-xs font-normal text-muted-foreground">ends {fd(b.end_date, true)} · {all.length} interns · {withTasks} with tasks · {all.length - withTasks} without</span>
                              </button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" title="Edit batch" onClick={() => setEdit(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" title="Delete batch" disabled={busy} onClick={() => void deleteBatch(b)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                            </div>
                            {open[bk] && (
                              <div className="divide-y divide-border">
                                {ms.length === 0 && <p className="px-3 py-2 text-xs text-muted-foreground">{all.length ? "Nobody matches the filters." : "No interns in this batch yet. Select interns below and use “Move to batch”."}</p>}
                                {ms.map((p) => <InternRow key={p.user_id} p={p} />)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {unbatchedGroups.length > 0 && (
              <Card>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-left" onClick={() => toggle(setOpen, "c:nobatch")}>
                  {open["c:nobatch"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className="font-semibold">Interns not in a batch</span>
                  <span className="text-xs text-muted-foreground">{unbatched.filter((p) => p.role === "intern").length}</span>
                </button>
                {open["c:nobatch"] && (
                  <CardContent className="space-y-2 pt-0">
                    {unbatchedGroups.map(([label, list]) => (
                      <div key={label} className="rounded-lg border border-border">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-t-lg text-sm font-semibold">
                          <Checkbox checked={list.every((p) => sel[p.user_id])} onCheckedChange={(v) => setMany(list, !!v)} />{label}<span className="text-xs font-normal text-muted-foreground">{list.length}</span>
                        </div>
                        <div className="divide-y divide-border">{list.map((p) => <InternRow key={p.user_id} p={p} />)}</div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            )}
            {employees.length > 0 && (
              <Card>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-left" onClick={() => toggle(setOpen, "c:emp")}>
                  {open["c:emp"] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span className="font-semibold">Employees</span><span className="text-xs text-muted-foreground">{employees.length}</span>
                </button>
                {open["c:emp"] && <CardContent className="pt-0 divide-y divide-border">{employees.map((p) => <InternRow key={p.user_id} p={p} />)}</CardContent>}
              </Card>
            )}
          </div>

          <div className="space-y-4 xl:sticky xl:top-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Assign tasks ({chosen.length} picked)</CardTitle></CardHeader>
              <CardContent>
                <PlanAssigner people={chosen} forceDomain={forceDomain} onChange={setPlan} onDone={() => void load()} />
              </CardContent>
            </Card>
            <AutoTasksPanel />
          </div>
        </div>
      </div>
      <BatchDialog value={edit} onClose={() => setEdit(null)} onSave={saveBatch} busy={busy} />
    </CRMLayout>
  );
};

const BatchDialog = ({ value, onClose, onSave, busy }: { value: Partial<Batch> | null; onClose: () => void; onSave: (b: Partial<Batch>) => void; busy: boolean }) => {
  const [b, setB] = useState<Partial<Batch>>({});
  useEffect(() => setB(value || {}), [value]);
  if (!value) return null;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{value.id ? "Edit batch" : "New batch"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Domain</Label>
            <Select value={b.domain || ""} onValueChange={(v) => setB({ ...b, domain: v })}>
              <SelectTrigger><SelectValue placeholder="Choose a domain" /></SelectTrigger>
              <SelectContent>{DOMAINS.map((d) => <SelectItem key={d.key} value={d.label}>{d.label}</SelectItem>)}{b.domain && !DOMAINS.some((d) => d.label === b.domain) && <SelectItem value={b.domain}>{b.domain}</SelectItem>}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Start date</Label><Input type="date" value={b.start_date || ""} onChange={(e) => setB({ ...b, start_date: e.target.value })} /></div>
            <div><Label>End date</Label><Input type="date" value={b.end_date || ""} onChange={(e) => setB({ ...b, end_date: e.target.value })} /></div>
          </div>
          <div><Label>Batch name (optional)</Label><Input value={b.name || ""} placeholder="Auto: domain · month year" onChange={(e) => setB({ ...b, name: e.target.value })} /></div>
          <div><Label>Mentor (optional)</Label><Input value={b.mentor || ""} onChange={(e) => setB({ ...b, mentor: e.target.value })} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={busy} onClick={() => onSave(b)}>{value.id ? "Save" : "Create batch"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskLibraryPage;
