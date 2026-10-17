import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AppRole, homePath } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";
import { isProfileComplete } from "@/lib/internProfile";

const loginFor = (role: AppRole) => (role === "intern" ? "/intern/login" : role === "employee" ? "/employee/login" : "/auth");

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Only lets users with the given role in; everyone else goes to the right login or their own home.
 * Interns must complete their profile first; deactivated accounts are signed out.
 */
const RequireRole = ({ role, children }: { role: AppRole; children: ReactNode }) => {
  const { user, role: myRole, loading, roleLoading, signOut } = useAuth();
  const location = useLocation();
  const [state, setState] = useState<{ checked: boolean; complete: boolean; active: boolean }>({ checked: false, complete: true, active: true });

  useEffect(() => {
    if (!user || myRole !== role) return;
    let alive = true;
    setState((s) => (s.complete ? s : { ...s, checked: false }));
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (!alive) return;
      setState({ checked: true, complete: role === "intern" ? isProfileComplete(data, role) : true, active: data?.is_active !== false });
    });
    return () => { alive = false; };
  }, [user, myRole, role, location.pathname]);

  useEffect(() => {
    if (state.checked && !state.active) signOut();
  }, [state, signOut]);

  if (loading || roleLoading) return <Spinner />;
  if (!user) return <Navigate to={loginFor(role)} replace />;
  if (myRole !== role) return <Navigate to={homePath(myRole)} replace />;
  if (!state.checked) return <Spinner />;
  if (!state.active) return <Navigate to={loginFor(role)} replace />;
  const profilePath = `/${role}/profile`;
  if (!state.complete && location.pathname !== profilePath) return <Navigate to={profilePath} replace />;
  return <>{children}</>;
};

export default RequireRole;
