import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Fixed categorical order (blue, aqua, orange) so a colour always means the same thing.
export const C = { approved: "#2a78d6", submitted: "#1baf7a", open: "#eb6834", grid: "hsl(var(--border))", text: "hsl(var(--muted-foreground))" };

export const tooltipStyle = {
  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12,
};
const axis = { stroke: C.text, fontSize: 12, tickLine: false, axisLine: false } as const;

export interface TaskRow { id: string; status: string; week?: number | null; deadline?: string | null; created_at?: string }
export interface SubRow { task_id: string; submitted_at: string; reviewed_at?: string | null; review_status?: string | null }

export const computeStats = (tasks: TaskRow[], subs: SubRow[]) => {
  const total = tasks.length;
  const approved = tasks.filter((t) => t.status === "approved").length;
  const submittedOrDone = tasks.filter((t) => ["submitted", "approved"].includes(t.status));
  const firstSub = (id: string) => subs.filter((s) => s.task_id === id).sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))[0];
  let onTime = 0, late = 0;
  submittedOrDone.forEach((t) => {
    const s = firstSub(t.id);
    if (!s || !t.deadline) return;
    new Date(s.submitted_at) <= new Date(t.deadline) ? onTime++ : late++;
  });
  const reviewed = subs.filter((s) => s.reviewed_at);
  const avgReviewDays = reviewed.length ? reviewed.reduce((a, s) => a + (new Date(s.reviewed_at!).getTime() - new Date(s.submitted_at).getTime()) / 86400000, 0) / reviewed.length : null;
  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && !["submitted", "approved"].includes(t.status)).length;
  const rejected = subs.filter((s) => s.review_status === "rejected").length;
  return { total, approved, rate: total ? Math.round((approved / total) * 100) : 0, onTime, late, onTimeRate: onTime + late ? Math.round((onTime / (onTime + late)) * 100) : null, avgReviewDays, overdue, rejected };
};

const Tile = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">{label}</p><p className="text-3xl font-bold text-foreground">{value}</p>{hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}</CardContent></Card>
);

const ChartCard = ({ title, children, empty }: { title: string; children: React.ReactNode; empty?: boolean }) => (
  <Card>
    <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
    <CardContent>{empty ? <p className="text-sm text-muted-foreground py-10 text-center">Not enough data yet.</p> : <div className="h-64">{children}</div>}</CardContent>
  </Card>
);

/** Personal performance: used on the intern/employee analytics page and on the admin's view of a person. */
const PerformanceCharts = ({ tasks, subs, onlyAssignedWeeks = false }: { tasks: TaskRow[]; subs: SubRow[]; onlyAssignedWeeks?: boolean }) => {
  const st = computeStats(tasks, subs);

  const weekNums = [...new Set(tasks.map((t) => t.week).filter(Boolean) as number[])].sort((a, b) => a - b);
  const byWeek = weekNums.map((w) => {
    const wt = tasks.filter((t) => t.week === w);
    return {
      name: `Week ${w}`,
      Approved: wt.filter((t) => t.status === "approved").length,
      "Awaiting review": wt.filter((t) => t.status === "submitted").length,
      Open: wt.filter((t) => !["approved", "submitted"].includes(t.status)).length,
    };
  });

  // Submissions per calendar week (last 8 weeks)
  const now = new Date();
  const trend = Array.from({ length: 8 }, (_, i) => {
    const start = new Date(now.getTime() - (7 - i) * 7 * 86400000);
    const end = new Date(start.getTime() + 7 * 86400000);
    return {
      name: start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      Submissions: subs.filter((s) => { const d = new Date(s.submitted_at); return d >= start && d < end; }).length,
    };
  });

  const timing = [{ name: "On time", Tasks: st.onTime }, { name: "Late", Tasks: st.late }];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Tile label="Completion rate" value={`${st.rate}%`} hint={`${st.approved} of ${st.total} approved`} />
        <Tile label="On-time submissions" value={st.onTimeRate === null ? "—" : `${st.onTimeRate}%`} hint={`${st.onTime} on time · ${st.late} late`} />
        <Tile label="Average review time" value={st.avgReviewDays === null ? "—" : `${st.avgReviewDays.toFixed(1)} days`} hint="from submit to review" />
        <Tile label="Overdue now" value={String(st.overdue)} hint={st.rejected ? `${st.rejected} sent back for changes` : "tasks past deadline"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Progress by week" empty={byWeek.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byWeek} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Approved" stackId="a" fill={C.approved} stroke="hsl(var(--card))" strokeWidth={2} />
              <Bar dataKey="Awaiting review" stackId="a" fill={C.submitted} stroke="hsl(var(--card))" strokeWidth={2} />
              <Bar dataKey="Open" stackId="a" fill={C.open} stroke="hsl(var(--card))" strokeWidth={2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Submissions per week (last 8 weeks)" empty={subs.length === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="Submissions" stroke={C.approved} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))", fill: C.approved }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Submission timing" empty={st.onTime + st.late === 0}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timing} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="Tasks" fill={C.approved} radius={[4, 4, 0, 0]} maxBarSize={56} label={{ position: "top", fill: C.text, fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
export default PerformanceCharts;
