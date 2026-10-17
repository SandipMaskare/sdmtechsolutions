import { Link } from "react-router-dom";
import { CheckCircle2, Clock, ClipboardList, Send, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PortalLayout, { PortalKind, portalCopy } from "@/components/portal/PortalLayout";
import { usePortalTasks, statusMeta } from "@/hooks/usePortalTasks";
import { useUserRole } from "@/hooks/useUserRole";
import { durationText, currentWeek, missingFields } from "@/lib/internProfile";
import { findDomain, WEEKS } from "@/data/internshipPlan";

const PortalDashboard = ({ kind }: { kind: PortalKind }) => {
  const c = portalCopy[kind];
  const { tasks, loading, error } = usePortalTasks();
  const { profile } = useUserRole();

  const count = (s: string) => tasks.filter((t) => t.status === s).length;
  const overdue = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < new Date() && !["submitted", "approved"].includes(t.status)
  );
  const upcoming = tasks
    .filter((t) => !["submitted", "approved"].includes(t.status))
    .sort((a, b) => (a.deadline || "9").localeCompare(b.deadline || "9"))
    .slice(0, 5);

  const stats = [
    { label: "To do", value: count("pending"), icon: ClipboardList, color: "text-slate-600" },
    { label: "In progress", value: count("in_progress"), icon: Clock, color: "text-blue-600" },
    { label: "Submitted", value: count("submitted"), icon: Send, color: "text-purple-600" },
    { label: "Approved", value: count("approved"), icon: CheckCircle2, color: "text-green-600" },
  ];

  return (
    <PortalLayout kind={kind}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here are your {c.work.toLowerCase()} from SDM Technology. Open one to read it, do the work, and submit it here.
          </p>
        </div>

        {missingFields(profile, kind).length > 0 && (
          <Card className="border-orange-400 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6 flex items-center justify-between gap-3 text-orange-700 dark:text-orange-300">
              <span className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 shrink-0" />Please complete your profile{kind === "intern" ? " with the internship details from your offer letter" : ""}.</span>
              <Button size="sm" asChild><Link to={`${c.base}/profile`}>Update profile</Link></Button>
            </CardContent>
          </Card>
        )}

        {kind === "intern" && profile?.internship_start && (
          <Card>
            <CardContent className="pt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Intern ID</p><p className="font-semibold">{profile.intern_id || "—"}</p></div>
              <div><p className="text-muted-foreground">Domain</p><p className="font-semibold">{findDomain(profile.internship_domain)?.label || profile.internship_domain || "—"}</p></div>
              <div className="col-span-2"><p className="text-muted-foreground">Duration</p><p className="font-semibold">{durationText(profile)}</p></div>
              {(() => { const w = currentWeek(profile); return w && w > 0 ? <div><p className="text-muted-foreground">Now</p><p className="font-semibold">Week {Math.min(w, WEEKS)} of {WEEKS}</p></div> : null; })()}
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-sm text-destructive">Could not load your {c.work.toLowerCase()}: {error}</CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold text-foreground">{loading ? "–" : s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {overdue.length > 0 && (
          <Card className="border-orange-400 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6 flex items-center gap-3 text-orange-700 dark:text-orange-300">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>You have {overdue.length} overdue {overdue.length === 1 ? c.workOne : c.workOne + "s"}. Please submit them as soon as you can.</span>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Next up</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`${c.base}/work`}>View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : upcoming.length === 0 ? (
              <p className="text-muted-foreground">
                Nothing assigned right now. When the admin gives you a {c.workOne}, it will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {upcoming.map((t) => (
                  <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link to={`${c.base}/work`} className="font-medium text-foreground hover:text-primary truncate block">{t.title}</Link>
                      <p className="text-xs text-muted-foreground">
                        {t.deadline ? `Due ${new Date(t.deadline).toLocaleDateString()}` : "No deadline"}
                      </p>
                    </div>
                    <Badge className={statusMeta[t.status]?.className}>{statusMeta[t.status]?.label || t.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default PortalDashboard;
