import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppRole, homePath } from "@/lib/roles";

const loginFor = (role: AppRole) => (role === "intern" ? "/intern/login" : role === "employee" ? "/employee/login" : "/auth");

/** Only lets users with the given role in; everyone else goes to the right login or their own home. */
const RequireRole = ({ role, children }: { role: AppRole; children: ReactNode }) => {
  const { user, role: myRole, loading, roleLoading } = useAuth();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to={loginFor(role)} replace />;
  if (myRole !== role) return <Navigate to={homePath(myRole)} replace />;
  return <>{children}</>;
};

export default RequireRole;
