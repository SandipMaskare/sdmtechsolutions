import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { GraduationCap, Briefcase, UserCircle, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { homePath } from "@/lib/roles";

interface App {
  id: string;
  status: string;
  applied_at: string;
  jobs: { title: string; kind: string } | null;
}

const AccountPage = () => {
  const { user, role, loading, roleLoading } = useAuth();
  const { profile } = useUserRole();
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("job_applications")
      .select("id, status, applied_at, jobs(title, kind)")
      .eq("user_id", user.id)
      .order("applied_at", { ascending: false })
      .then(({ data }) => setApps((data as unknown as App[]) || []));
  }, [user]);

  if (loading || roleLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (role) return <Navigate to={homePath(role)} replace />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-28 pb-16 container mx-auto px-4 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">
            Hello{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">Your SDM Technology account.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h2 className="font-semibold">Internships</h2>
              <p className="text-sm text-muted-foreground">Learn on real projects and earn a certificate.</p>
              <Button asChild size="sm"><Link to="/internships">Browse internships</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Briefcase className="w-8 h-8 text-primary" />
              <h2 className="font-semibold">Jobs</h2>
              <p className="text-sm text-muted-foreground">See current openings at SDM Technology.</p>
              <Button asChild size="sm"><Link to="/careers">View careers</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <UserCircle className="w-8 h-8 text-primary" />
              <h2 className="font-semibold">My profile</h2>
              <p className="text-sm text-muted-foreground">Update your details and photo.</p>
              <Button asChild size="sm" variant="outline"><Link to="/profile">Edit profile</Link></Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> My applications</CardTitle></CardHeader>
          <CardContent>
            {apps.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nothing here yet. Applications you make through the website form appear here. Applications sent through a Google Form are handled by our team directly.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {apps.map((a) => (
                  <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{a.jobs?.title || "Position"}</p>
                      <p className="text-xs text-muted-foreground">{a.jobs?.kind === "internship" ? "Internship" : "Job"} · {new Date(a.applied_at).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">{a.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
