import { useNavigate } from "react-router-dom";
import CRMLayout from "@/components/crm/CRMLayout";
import BatchesManager from "@/components/admin/BatchesManager";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";

const BatchesPage = () => {
  const { role, loading, user } = useUserRole();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/auth");
    else if (role !== "admin") navigate("/crm/dashboard");
  }, [role, loading, user, navigate]);
  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return (
    <CRMLayout userRole="admin">
      <BatchesManager />
    </CRMLayout>
  );
};
export default BatchesPage;
