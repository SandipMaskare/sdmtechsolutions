import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LogIn, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import sdmLogo from "@/assets/sdm-logo.webp";

const titles: [string, string][] = [
  ["/services/", "Service"],
  ["/services", "Services"],
  ["/internships", "Internships"],
  ["/careers/", "Job details"],
  ["/careers", "Careers"],
  ["/blog/", "Article"],
  ["/blog", "Blog"],
  ["/about", "About us"],
  ["/contact", "Contact us"],
  ["/auth", "Sign in"],
  ["/profile", "My profile"],
  ["/account", "My account"],
  ["/privacy-policy", "Privacy policy"],
  ["/terms", "Terms"],
  ["/disclaimer", "Disclaimer"],
];

/** Native-style top bar used instead of the website header inside the installed app. */
const AppTopBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHome = pathname === "/";
  const title = isHome ? "SDM Technology" : titles.find(([p]) => pathname.startsWith(p))?.[1] ?? "SDM Technology";

  const back = () => {
    if (typeof window.history.state?.idx === "number" && window.history.state.idx > 0) navigate(-1);
    else navigate("/");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0f766e] text-white" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="flex items-center justify-between px-3 h-14">
        <div className="flex items-center gap-2 min-w-0">
          {isHome ? (
            <span className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shrink-0">
              <img src={sdmLogo} alt="SDM" className="h-7 w-7 object-contain" width={28} height={28} />
            </span>
          ) : (
            <button onClick={back} aria-label="Back" className="h-10 w-10 -ml-1 flex items-center justify-center rounded-full active:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="font-display font-semibold text-lg truncate">{title}</h1>
        </div>
        <Link to={user ? "/enter" : "/intern/login"} aria-label={user ? "Open my portal" : "Sign in"} className="h-10 w-10 flex items-center justify-center rounded-full active:bg-white/20">
          {user ? <UserCircle className="w-6 h-6" /> : <LogIn className="w-5 h-5" />}
        </Link>
      </div>
    </header>
  );
};

export default AppTopBar;
