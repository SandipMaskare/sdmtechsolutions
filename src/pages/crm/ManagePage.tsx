import { Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CRMLayout from "@/components/crm/CRMLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { toolByKey } from "@/components/crm/adminTools";

/** One page that hosts any admin tool inside the dashboard layout. */
const ManagePage = ({ tool }: { tool?: string }) => {
  const params = useParams();
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  const t = toolByKey(tool || params.tool);
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth");
    else if (role !== "admin") navigate("/crm/dashboard");
  }, [role, loading, user, navigate]);
  const spinner = <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <CRMLayout userRole="admin">
      {t ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 text-white flex items-center justify-center shadow"><t.icon className="w-5 h-5" /></span>
            <div><h1 className="text-2xl font-bold text-foreground font-display leading-tight">{t.label}</h1><p className="text-xs text-muted-foreground">{t.group}</p></div>
          </div>
          <Suspense fallback={spinner}><t.Comp /></Suspense>
        </div>
      ) : <p className="text-muted-foreground">This page does not exist.</p>}
    </CRMLayout>
  );
};
export default ManagePage;
