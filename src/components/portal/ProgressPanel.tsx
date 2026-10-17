import { Progress } from "@/components/ui/progress";
import { WEEKS } from "@/data/internshipPlan";

export const progressOf = (tasks: { status: string; week?: number | null }[]) => {
  const total = tasks.length;
  const approved = tasks.filter((t) => t.status === "approved").length;
  const submitted = tasks.filter((t) => t.status === "submitted").length;
  return { total, approved, submitted, pct: total ? Math.round((approved / total) * 100) : 0 };
};

/** Overall bar + one chip per internship week. */
const ProgressPanel = ({ tasks }: { tasks: { status: string; week?: number | null }[] }) => {
  const o = progressOf(tasks);
  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const wt = tasks.filter((t) => t.week === i + 1);
    return { n: i + 1, ...progressOf(wt) };
  });
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium">Overall progress</span>
          <span className="text-muted-foreground">{o.approved} of {o.total} approved{o.submitted ? ` · ${o.submitted} awaiting review` : ""} · {o.pct}%</span>
        </div>
        <Progress value={o.pct} />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {weeks.map((w) => {
          const done = w.total > 0 && w.approved === w.total;
          return (
            <div key={w.n} className={`rounded-lg border p-2 text-center text-xs ${done ? "border-green-500 bg-green-50 dark:bg-green-950/20" : w.total === 0 ? "opacity-50" : ""}`}>
              <div className="font-semibold">Week {w.n}</div>
              <div className="text-muted-foreground">{w.total ? `${w.approved}/${w.total}` : "—"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ProgressPanel;
