import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase as typedClient } from "@/integrations/supabase/client";
import { C, tooltipStyle } from "./PerformanceCharts";

const supabase: any = typedClient;
const axis = { stroke: C.text, fontSize: 12, tickLine: false, axisLine: false } as const;

/** Admin analytics: whole-team graphs. */
const TeamCharts = () => {
  const [perPerson, setPerPerson] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [pay, setPay] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [t, p, pm] = await Promise.all([
        supabase.from("tasks").select("assigned_to,status,domain"),
        supabase.from("profiles").select("user_id,full_name"),
        supabase.from("payments").select("status,amount"),
      ]);
      const tasks = t.data || [];
      const names: Record<string, string> = {};
      (p.data || []).forEach((x: any) => (names[x.user_id] = x.full_name));

      const per: Record<string, any> = {};
      tasks.forEach((x: any) => {
        if (!x.assigned_to) return;
        const r = (per[x.assigned_to] ||= { name: (names[x.assigned_to] || "User").split(" ")[0], Approved: 0, "Awaiting review": 0, Open: 0 });
        if (x.status === "approved") r.Approved++; else if (x.status === "submitted") r["Awaiting review"]++; else r.Open++;
      });
      setPerPerson(Object.values(per));

      const labels: Record<string, string> = { pending: "To do", in_progress: "In progress", submitted: "Submitted", approved: "Approved", rejected: "Needs changes" };
      setStatus(Object.keys(labels).map((k) => ({ name: labels[k], Tasks: tasks.filter((x: any) => x.status === k).length })));

      const dm: Record<string, any> = {};
      tasks.forEach((x: any) => {
        const k = x.domain || "Other";
        const r = (dm[k] ||= { name: k, Approved: 0, Open: 0 });
        x.status === "approved" ? r.Approved++ : r.Open++;
      });
      setDomains(Object.values(dm));

      const pl: Record<string, string> = { requested: "Due", submitted: "To verify", verified: "Verified", rejected: "Rejected", waived: "Waived" };
      setPay(Object.keys(pl).map((k) => ({ name: pl[k], Payments: (pm.data || []).filter((x: any) => x.status === k).length })));
    })();
  }, []);

  const card = (title: string, data: any[], chart: React.ReactNode) => (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>{data.length === 0 ? <p className="text-sm text-muted-foreground py-10 text-center">Not enough data yet.</p> : <div className="h-72">{chart}</div>}</CardContent>
    </Card>
  );

  const stackProps = { stroke: "hsl(var(--card))", strokeWidth: 2 };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {card("Tasks by status", status.filter((s) => s.Tasks > 0), (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={status} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Bar dataKey="Tasks" fill={C.approved} radius={[4, 4, 0, 0]} maxBarSize={56} label={{ position: "top", fill: C.text, fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      ))}
      {card("Progress per person", perPerson, (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={perPerson} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} horizontal={false} />
            <XAxis type="number" allowDecimals={false} {...axis} /><YAxis type="category" dataKey="name" width={80} {...axis} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Approved" stackId="a" fill={C.approved} {...stackProps} />
            <Bar dataKey="Awaiting review" stackId="a" fill={C.submitted} {...stackProps} />
            <Bar dataKey="Open" stackId="a" fill={C.open} {...stackProps} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ))}
      {card("Progress by domain", domains, (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={domains} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="name" {...axis} interval={0} tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} {...axis} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Approved" stackId="a" fill={C.approved} {...stackProps} />
            <Bar dataKey="Open" stackId="a" fill={C.open} {...stackProps} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ))}
      {card("Payments by status", pay.filter((x) => x.Payments > 0), (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pay} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="name" {...axis} /><YAxis allowDecimals={false} {...axis} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Bar dataKey="Payments" fill={C.approved} radius={[4, 4, 0, 0]} maxBarSize={56} label={{ position: "top", fill: C.text, fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      ))}
    </div>
  );
};
export default TeamCharts;
