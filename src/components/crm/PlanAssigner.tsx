import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { notifyUser, PORTAL_URL } from "@/lib/notify";
import { DOMAINS, WEEKS, findDomain, splitTask, planWeeks } from "@/data/internshipPlan";
import { RESOURCES, refsToText } from "@/data/internshipResources";

export interface Assignee { email?: string | null; user_id: string; full_name: string; role?: string; internship_domain?: string | null; internship_start?: string | null; internship_end?: string | null }

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
  const [email, setEmail] = useState(true);

  useEffect(() => { if (guess) setDomainKey(guess); }, [guess]);
  useEffect(() => setPicked([true, true, true]), [week, domainKey]);

  const domain = useMemo(() => DOMAINS.find((d) => d.key === domainKey)!, [domainKey]);
  const weeks = week === "all" ? Array.from({ length: WEEKS }, (_, i) => i + 1) : [Number(week)];
  const refs = RESOURCES[domainKey] || [];
  const maxCap = Math.max(...people.map((p) => planWeeks(p.internship_start, p.internship_end)));
  useEffect(() => { if (week !== "all" && Number(week) > maxCap) setWeek("1"); }, [maxCap, week]);

  const assign = async () => {
    if (!user || people.length === 0) return toast({ title: "Select at least one person", variant: "destructive" });
    setBusy(true);
    const ids = people.map((p) => p.user_id);
    const { data: existing } = await supabase.from("tasks").select("assigned_to,title").in("assigned_to", ids);
    const have = new Set((existing || []).map((t: any) => `${t.assigned_to}|${t.title}`));
    const rows: any[] = [];
    let skipped = 0;
    for (const p of people) {
      const cap = planWeeks(p.internship_start, p.internship_end);
      for (const w of weeks) {
        if (w > cap) { skipped++; continue; } // a 1-month internship does not get 8 weeks of work
        domain.weeks[w - 1].forEach((raw, i) => {
          if (week !== "all" && !picked[i]) return;
          const { title, description } = splitTask(raw);
          const full = `Week ${w}: ${title}`;
          if (have.has(`${p.user_id}|${full}`)) return;
          rows.push({
            title: full, description, assigned_to: p.user_id, assigned_by: user.id, priority: "medium", status: "pending",
            deadline: dueFor(w, p.internship_start).toISOString(), task_type: p.role === "employee" ? "task" : "project", week: w, domain: domain.label, reference_links: refsToText(refs),
          });
        });
      }
    }
    if (rows.length === 0) { setBusy(false); return toast({ title: "Nothing new to assign", description: skipped ? "That week is beyond this internship's length, so nothing was assigned." : "These tasks were already assigned." }); }
    const { error } = await supabase.from("tasks").insert(rows);
    setBusy(false);
    if (error) return toast({ title: "Could not assign", description: error.message, variant: "destructive" });
    let mailed = 0;
    if (email) {
      for (const p of people) {
        const mine = rows.filter((r) => r.assigned_to === p.user_id);
        if (!p.email || mine.length === 0) continue;
        const wk = [...new Set(mine.map((r) => r.week))].join(", ");
        const { error: mErr } = await notifyUser({
          email: p.email, name: p.full_name,
          template: "tasks" as const, refs,
          subject: `New ${p.role === "employee" ? "tasks" : "projects"} assigned: Week ${wk}`,
          lines: [`${mine.length} new ${p.role === "employee" ? "task(s)" : "project(s)"} have been assigned to you:`, ...mine.map((r) => `• ${r.title} (due ${new Date(r.deadline).toLocaleDateString("en-IN")})`), "Please log in, complete the work and upload it as a single .zip file on the portal."],
          link: { label: "Open my portal", url: p.role === "employee" ? PORTAL_URL.replace("/intern", "/employee") : PORTAL_URL },
        });
        if (!mErr) mailed++;
      }
    }
    toast({ title: `${rows.length} task${rows.length > 1 ? "s" : ""} assigned`, description: `to ${people.length} ${people.length > 1 ? "people" : "person"}${email ? ` · ${mailed} email(s) sent` : ""}` });
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
              {Array.from({ length: maxCap }, (_, i) => <SelectItem key={i} value={String(i + 1)}>Week {i + 1}</SelectItem>)}
              <SelectItem value="all">All weeks of the internship ({maxCap})</SelectItem>
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

      <label className="flex items-center gap-2 text-sm cursor-pointer"><Checkbox checked={email} onCheckedChange={(v) => setEmail(!!v)} />Email them about these tasks</label>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Deadline = end of that week from the internship start date. Already-assigned tasks are skipped.</p>
        <Button onClick={assign} disabled={busy || people.length === 0}>{busy ? "Assigning..." : `Assign to ${people.length || "…"} ${people.length === 1 ? "person" : "people"}`}</Button>
      </div>
    </div>
  );
};

export default PlanAssigner;
