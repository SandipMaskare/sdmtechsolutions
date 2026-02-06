import { ReactNode } from "react";
import CRMSidebar from "./CRMSidebar";

interface CRMLayoutProps {
  children: ReactNode;
  userRole: "admin" | "employee";
}

const CRMLayout = ({ children, userRole }: CRMLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <CRMSidebar userRole={userRole} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default CRMLayout;
