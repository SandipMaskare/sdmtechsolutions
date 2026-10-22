import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageNav from "@/components/PageNav";
import CRMSidebar from "./CRMSidebar";
import { AppRole, homePath } from "@/lib/roles";
import AppTopBar from "@/components/app/AppTopBar";
import { isAppMode } from "@/lib/appMode";

interface CRMLayoutProps {
  children: ReactNode;
  userRole: AppRole;
}

const CRMLayout = ({ children, userRole }: CRMLayoutProps) => {
  const navigate = useNavigate();

  // The CRM is for admins. Employees and interns have their own portals.
  useEffect(() => {
    if (userRole !== "admin") navigate(homePath(userRole), { replace: true });
  }, [userRole, navigate]);

  if (userRole !== "admin") return null;

  if (isAppMode()) {
    return (
      <div className="min-h-screen bg-[#f4f7f8] w-full">
        <AppTopBar />
        <main className="px-3" style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top) + 0.75rem)", paddingBottom: "6rem" }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      <CRMSidebar userRole={userRole} />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 flex items-center border-b border-border bg-background/95 px-4 py-2 backdrop-blur">
          <PageNav />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default CRMLayout;
