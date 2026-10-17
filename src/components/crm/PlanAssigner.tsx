import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { DOMAINS, WEEKS, findDomain, splitTask } from "@/data/internshipPlan";

export interface Assignee { user_id: string; full_name: string; role?: string; internship_domain?: string | null; internship_start?: string | null }

const dueFor = (week: number, start?: string | null) => {
  const today = new Date();
  const base = start ? new Date(start) : today;
  const due = new Date(base.getTime() + (week * 7 - 1) * 86400000);
  due.setHours(18, 0, 0, 0);
  return due < today ? new Date(today.getTime() + 7 * 86400000) : due;
};

/** Pick a domain + week from the 8-week plan and assign its 3 tasks to the chosen people. */
const PlanAssigner = ({ people, onDone }: { people: Assignee[]; onDone?: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const guess = findDomain(people.find((p) => p.internship_domain)?.internship_domain)?.key;
  const [domainKey, setDomainKey] = useState(guess || DOMAINS[0].key);
  const [week, setWeek] = useState("1"); // "1".."8" or "all"
  const [picked, setPicked] = useState<boolean[]>([true, true, true]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (guess) setDomainKey(guess); }, [guess]);
  useEffect(() => setPicked([true, true, true]), [week, domainKey]);

  const domain = useMemo(() => DOMAINS.find((d) => d.key === domainKey)!, [domainKey]);
  const weeks = week === "all" ? Array.from({ length: WEEKS }, (_, i) => i + 1) : [Number(week)];

  const assign = async () => {
    if (!user || people.length === 0) return toast({ title: "Select at least one person", variant: "destructive" });
    setBusy(true);
    const ids = people.map((p) => p.user_id);
    const { data: existing } = await supabase.from("tasks").select("assigned_to,title").in("assigned_to", ids);
    const have = new Set((existing || []).map((t: any) => `${t.assigned_to}|${t.title}`));
    const rows: any[] = [];
    for (const p of people) {
      for (const w of weeks) {
        domain.weeks[w - 1].forEach((raw, i) => {
          if (week !== "all" && !picked[i]) return;
          const { title, description } = splitTask(raw);
          const full = `Week ${w}: ${title}`;
          if (have.has(`${p.user_id}|${full}`)) return;
          rows.push({
            title: full, description, assigned_to: p.user_id, assigned_by: user.id, priority: "medium", status: "pending",
            deadline: dueFor(w, p.internship_start).toISOString(), task_type: p.role === "employee" ? "task" : "project", week: w, domain: domain.label,
          });
        });
      }
    }
    if (rows.length === 0) { setBusy(false); return toast({ title: "Nothing new to assign", description: "These tasks were already assigned." }); }
    const { error } = await supabase.from("tasks").insert(rows);
    setBusy(false);
    if (error) return toast({ title: "Could not assign", description: error.message, variant: "destructive" });
    toast({ title: `${rows.length} task${rows.length > 1 ? "s" : ""} assigned`, description: `to ${people.length} ${people.length > 1 ? "people" : "person"}` });
    onDone?.();
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5"><Label>Domain</Label>
          <Select value={domainKey} onValueChange={setDomainKey}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{DOMAINS.map((d) => <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Week</Label>
          <Select value={week} onValueChange={setWeek}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: WEEKS }, (_, i) => <SelectItem key={i} value={String(i + 1)}>Week {i + 1}</SelectItem>)}
              <SelectItem value="all">All {WEEKS} weeks (24 tasks)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border divide-y max-h-[420px] overflow-auto">
        {weeks.map((w) => (
          <div key={w} className="p-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Week {w}</p>
            {domain.weeks[w - 1].map((raw, i) => {
              const t = splitTask(raw);
              return (
                <label key={i} className="flex gap-3 items-start text-sm cursor-pointer">
                  {week !== "all" && <Checkbox checked={picked[i]} onCheckedChange={(v) => setPicked(picked.map((x, j) => (j === i ? !!v : x)))} className="mt-1" />}
                  <span><span className="font-medium">{t.title}</span><br /><span className="text-muted-foreground">{t.description}</span></span>
                </label>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Deadline = end of that week from the internship start date. Already-assigned tasks are skipped.</p>
        <Button onClick={assign} disabled={busy || people.length === 0}>{busy ? "Assigning..." : `Assign to ${people.length || "…"} ${people.length === 1 ? "person" : "people"}`}</Button>
      </div>
    </div>
  );
};

export default PlanAssigner;
