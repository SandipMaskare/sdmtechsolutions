import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { homePath } from "@/lib/roles";
import sdmLogo from "@/assets/sdm-logo.webp";

/** Home screen of the installed app: skips the marketing site and opens the right portal. */
const AppEntry = () => {
  const { role, user, loading } = useUserRole();
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <img src={sdmLogo} alt="SDM Technology" className="h-16 w-16 object-contain animate-pulse" />
        <p className="text-sm text-muted-foreground">SDM Technology</p>
      </div>
    );
  }
  if (!user || !role) return <Navigate to="/" replace />;
  return <Navigate to={homePath(role)} replace />;
};

export default AppEntry;
