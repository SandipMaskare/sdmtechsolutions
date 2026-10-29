import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, User, Shield, LayoutDashboard, MoreVertical, UserCircle, Search, ChevronDown, ArrowRight, Phone, GraduationCap, Briefcase as BriefcaseIcon, BookOpen } from "lucide-react";
import SiteSearch from "@/components/SiteSearch";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { homePath } from "@/lib/roles";
import PageNav from "@/components/PageNav";
import sdmLogo from "@/assets/sdm-logo.webp";
import AppTopBar from "@/components/app/AppTopBar";
import { isAppMode } from "@/lib/appMode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services", mega: "services" },
  { name: "Internships", href: "/internships" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeT = useRef<number>();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("keydown", key); };
  }, []);
  useEffect(() => { setMega(false); setIsOpen(false); }, [location.pathname]);
  const openMega = () => { window.clearTimeout(closeT.current); setMega(true); };
  const closeMega = () => { closeT.current = window.setTimeout(() => setMega(false), 140); };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const UserMenu = ({ mobile = false }: { mobile?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={mobile ? "default" : "icon"} className={mobile ? "w-full justify-start font-semibold" : ""}>
          <MoreVertical className="w-5 h-5" />
          {mobile && <span className="ml-2">Menu</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => { navigate("/profile"); setIsOpen(false); }}>
          <UserCircle className="w-4 h-4 mr-2" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { navigate(role ? homePath(role) : "/profile"); setIsOpen(false); }}>
          <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
        </DropdownMenuItem>
        {role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { navigate("/crm/dashboard"); setIsOpen(false); }}>
              <Shield className="w-4 h-4 mr-2" /> Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isAppMode()) return <AppTopBar />;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? "bg-background/95 border-border shadow-lg" : "bg-background/95 border-transparent"}`} onMouseLeave={closeMega}>
      <nav className={`container mx-auto px-4 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PageNav />
            <Link to="/" className="flex items-center">
              <img src={sdmLogo} alt="SDM Technology" className={`transition-all duration-300 ${scrolled ? "h-10 md:h-11" : "h-12 md:h-14"}`} />
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onMouseEnter={link.mega ? openMega : () => setMega(false)}
                onFocus={link.mega ? openMega : undefined}
                className={`sdm-navlink group relative inline-flex items-center gap-1 font-medium transition-colors duration-300 ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.name}
                {link.mega && <ChevronDown className={`w-4 h-4 transition-transform ${mega ? "rotate-180" : ""}`} />}
                <span className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 transition-all duration-300 ${isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search the site (Ctrl+K)" className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email?.split("@")[0]}
                </span>
                <UserMenu />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate("/auth")} className="font-semibold">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Button>
                <Button onClick={() => navigate("/contact")} className="sdm-cta bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
                  Contact Us <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            <button className="p-2 text-foreground" aria-label="Search" onClick={() => setSearchOpen(true)}><Search className="w-6 h-6" /></button>
            <button className="p-2 text-foreground" aria-label="Menu" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Services mega menu (desktop) */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
              onMouseEnter={openMega} onMouseLeave={closeMega}
              className="hidden md:block absolute left-0 right-0 top-full border-t border-border bg-background shadow-2xl"
            >
              <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-6">
                <div className="col-span-8 grid grid-cols-2 gap-2">
                  {services.map((sv) => (
                    <Link key={sv.slug} to={`/services/${sv.slug}`} className="group flex gap-3 rounded-xl p-3 hover:bg-primary/5 transition-colors">
                      <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><sv.icon className="w-5 h-5" /></span>
                      <span><span className="block font-semibold text-foreground group-hover:text-primary transition-colors">{sv.title}</span><span className="block text-xs text-muted-foreground line-clamp-2">{sv.description}</span></span>
                    </Link>
                  ))}
                </div>
                <div className="col-span-4 space-y-2 rounded-2xl p-5 text-white bg-gradient-to-br from-teal-600 via-cyan-700 to-indigo-700">
                  <p className="font-display font-semibold text-lg">Build your future with SDM</p>
                  <p className="text-sm text-white/85">Real projects, mentor review and a certificate.</p>
                  <div className="flex flex-col gap-1.5 pt-2 text-sm">
                    <Link to="/internships" className="flex items-center gap-2 hover:underline"><GraduationCap className="w-4 h-4" /> Internships</Link>
                    <Link to="/careers" className="flex items-center gap-2 hover:underline"><BriefcaseIcon className="w-4 h-4" /> Careers</Link>
                    <Link to="/blog" className="flex items-center gap-2 hover:underline"><BookOpen className="w-4 h-4" /> Guides and insights</Link>
                    <a href="tel:+917038523408" className="flex items-center gap-2 hover:underline"><Phone className="w-4 h-4" /> +91 7038523408</a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-border"
            >
              <div className="flex flex-col gap-4 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-medium transition-colors ${
                      isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" /> {user.email}
                    </span>
                    <UserMenu mobile />
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => { navigate("/auth"); setIsOpen(false); }} className="font-semibold w-full">
                      <LogIn className="w-4 h-4 mr-2" /> Sign In
                    </Button>
                    <Button onClick={() => { navigate("/contact"); setIsOpen(false); }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full">
                      Contact Us
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
