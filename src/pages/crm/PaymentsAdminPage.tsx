import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CRMLayout from "@/components/crm/CRMLayout";
import PaymentAdmin from "@/components/crm/PaymentAdmin";
import PaymentMethodsAdmin from "@/components/crm/PaymentMethodsAdmin";
import { useUserRole } from "@/hooks/useUserRole";

const PaymentsAdminPage = () => {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display">Payments</h1>
          <p className="text-muted-foreground mt-1">Only admins can assign payments. Interns pay, enter the transaction number, and you verify it here.</p>
        </div>
        <Card><CardHeader><CardTitle>Payment methods</CardTitle></CardHeader><CardContent><PaymentMethodsAdmin /></CardContent></Card>
        <Card><CardHeader><CardTitle>All payments</CardTitle></CardHeader><CardContent><PaymentAdmin /></CardContent></Card>
      </div>
    </CRMLayout>
  );
};
export default PaymentsAdminPage;
