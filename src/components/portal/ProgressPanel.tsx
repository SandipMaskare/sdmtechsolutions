import { Progress } from "@/components/ui/progress";
import { WEEKS } from "@/data/internshipPlan";

export const progressOf = (tasks: { status: string; week?: number | null }[]) => {
  const total = tasks.length;
  const approved = tasks.filter((t) => t.status === "approved").length;
  const submitted = tasks.filter((t) => t.status === "submitted").length;
  return { total, approved, submitted, pct: total ? Math.round((approved / total) * 100) : 0 };
};

/**
 * Overall bar + one box per week.
 * `onlyAssigned` (used on the intern's own pages) shows just the weeks that have tasks, so a
 * 1-month intern never sees eight weeks, and a new week appears when its tasks are assigned.
 * Admins see every week of the internship (`totalWeeks`).
 */
const ProgressPanel = ({ tasks, totalWeeks = WEEKS, onlyAssigned = false }: {
  tasks: { status: string; week?: number | null }[]; totalWeeks?: number; onlyAssigned?: boolean;
}) => {
  const o = progressOf(tasks);
  const maxAssigned = Math.max(0, ...tasks.map((t) => t.week || 0));
  const count = Math.max(totalWeeks, maxAssigned);
  let weeks = Array.from({ length: count }, (_, i) => {
    const wt = tasks.filter((t) => t.week === i + 1);
    return { n: i + 1, ...progressOf(wt) };
  });
  if (onlyAssigned) weeks = weeks.filter((w) => w.total > 0);
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium">Overall progress</span>
          <span className="text-muted-foreground">{o.approved} of {o.total} approved{o.submitted ? ` · ${o.submitted} awaiting review` : ""} · {o.pct}%</span>
        </div>
        <Progress value={o.pct} />
      </div>
      {weeks.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
      )}
    </div>
  );
};
export default ProgressPanel;
