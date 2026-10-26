import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Send, LogOut, Home, UserCircle, Wallet, BarChart3, Compass, BookOpen, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { durationText } from "@/lib/internProfile";
import PageNav from "@/components/PageNav";
import sdmLogo from "@/assets/sdm-logo.webp";
import { cn } from "@/lib/utils";
import { isAppMode } from "@/lib/appMode";

export type PortalKind = "employee" | "intern";

export const portalCopy = {
  employee: { base: "/employee", title: "Employee Portal", work: "Tasks", workOne: "task", workLabel: "My Tasks" },
  intern: { base: "/intern", title: "Intern Portal", work: "Projects", workOne: "project", workLabel: "My Projects" },
} as const;

const PortalLayout = ({ kind, children }: { kind: PortalKind; children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const c = portalCopy[kind];
  const { profile } = useUserRole();

  const links = [
    { to: c.base, end: true, icon: LayoutDashboard, label: "Dashboard" },
    { to: `${c.base}/work`, end: false, icon: ClipboardList, label: c.workLabel },
    { to: `${c.base}/submissions`, end: false, icon: Send, label: "My Submissions" },
    { to: `${c.base}/learn`, end: false, icon: BookOpen, label: "Learning" },
    { to: `${c.base}/analytics`, end: false, icon: BarChart3, label: "My Analytics" },
    ...(kind === "intern" ? [{ to: `${c.base}/payments`, end: false, icon: Wallet, label: "Payments" }, { to: `${c.base}/letters`, end: false, icon: FileSignature, label: "My Letters" }] : []),
    { to: `${c.base}/profile`, end: false, icon: UserCircle, label: "My Profile" },
  ];

  const logout = async () => {
    await signOut();
    navigate(`${c.base}/login`);
  };

  if (isAppMode()) {
    const tabs = [
      { to: c.base, end: true, icon: LayoutDashboard, label: "Home" },
      { to: `${c.base}/work`, end: false, icon: ClipboardList, label: kind === "intern" ? "Projects" : "Tasks" },
      { to: `${c.base}/submissions`, end: false, icon: Send, label: "Submits" },
      ...(kind === "intern" ? [{ to: `${c.base}/payments`, end: false, icon: Wallet, label: "Payments" }] : [{ to: `${c.base}/analytics`, end: false, icon: BarChart3, label: "Stats" }]),
      { to: `${c.base}/profile`, end: false, icon: UserCircle, label: "Profile" },
    ];
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <header className="sticky top-0 z-40 bg-[#0f766e] text-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="flex items-center justify-between px-4 h-14">
            <Link to={c.base} className="flex items-center gap-2.5 min-w-0">
              <span className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                <img src={sdmLogo} alt="SDM" className="h-6 w-6 object-contain" width={24} height={24} />
              </span>
              <span className="font-display font-semibold truncate">{c.title}</span>
            </Link>
            <div className="flex items-center gap-1">
              {kind === "intern" && (
                <Link to={`${c.base}/analytics`} aria-label="My analytics" className="h-10 w-10 flex items-center justify-center rounded-full active:bg-white/20">
                  <BarChart3 className="w-5 h-5" />
                </Link>
              )}
              <Link to="/" aria-label="Explore SDM Technology" className="h-10 w-10 flex items-center justify-center rounded-full active:bg-white/20">
                <Compass className="w-5 h-5" />
              </Link>
              <button onClick={logout} aria-label="Log out" className="h-10 w-10 flex items-center justify-center rounded-full active:bg-white/20">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 pt-4 pb-28">{children}</main>
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, paddingBottom: "env(safe-area-inset-bottom)" }}>
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn("flex flex-col items-center justify-center gap-0.5 pt-2 pb-1.5 text-[11px] font-medium transition-colors active:bg-accent", isActive ? "text-primary" : "text-muted-foreground")
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn("h-7 w-12 rounded-full flex items-center justify-center transition-colors", isActive && "bg-accent")}>
                    <t.icon className="w-5 h-5" />
                  </span>
                  {t.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
          <PageNav />
          <Link to={c.base} className="flex items-center gap-3">
            <img src={sdmLogo} alt="SDM Technology" className="h-9" width={36} height={36} />
            <span className="font-display font-semibold text-foreground hidden sm:block">{c.title}</span>
            <Badge variant="secondary" className="capitalize">{kind}</Badge>
          </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {kind === "intern" && profile?.internship_start && (
              <Link to={`${c.base}/profile`} className="hidden lg:flex flex-col items-end leading-tight text-xs text-muted-foreground hover:text-foreground">
                <span className="font-medium text-foreground">{profile.intern_id || "Intern"}{profile.internship_domain ? ` · ${profile.internship_domain}` : ""}</span>
                <span>{durationText(profile)}</span>
              </Link>
            )}
            <span className="text-sm text-muted-foreground hidden md:block max-w-[200px] truncate">{user?.email}</span>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`${c.base}/profile`}><UserCircle className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Profile</span></Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><Home className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Website</span></Link>
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 sm:mr-1" /><span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
        <nav className="container mx-auto px-4 flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                  isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )
              }
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default PortalLayout;
