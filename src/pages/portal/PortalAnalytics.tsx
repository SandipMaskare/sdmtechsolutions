import PortalLayout, { PortalKind } from "@/components/portal/PortalLayout";
import PerformanceCharts from "@/components/analytics/PerformanceCharts";
import ProgressPanel from "@/components/portal/ProgressPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePortalTasks } from "@/hooks/usePortalTasks";

/** "My Analytics": every intern and employee can check their own performance. */
const PortalAnalytics = ({ kind }: { kind: PortalKind }) => {
  const { tasks, submissions, loading } = usePortalTasks();
  return (
    <PortalLayout kind={kind}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">My Analytics</h1>
          <p className="text-muted-foreground mt-1">See how you are doing: completion, on-time submissions and review time.</p>
        </div>
        {loading ? (
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        ) : tasks.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Your analytics will appear once you have been assigned work.</CardContent></Card>
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle className="text-base">Progress</CardTitle></CardHeader>
              <CardContent><ProgressPanel tasks={tasks as any} onlyAssigned totalWeeks={0} /></CardContent>
            </Card>
            <PerformanceCharts tasks={tasks as any} subs={submissions as any} />
          </>
        )}
      </div>
    </PortalLayout>
  );
};
export default PortalAnalytics;
