import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, User, Shield, LayoutDashboard, MoreVertical, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import sdmLogo from "@/assets/sdm-logo.jpg";
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
  { name: "Services", href: "/services" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

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
        <DropdownMenuItem onClick={() => { navigate("/crm/dashboard"); setIsOpen(false); }}>
          <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
        </DropdownMenuItem>
        {role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { navigate("/admin"); setIsOpen(false); }}>
              <Shield className="w-4 h-4 mr-2" /> Admin Panel
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={sdmLogo} alt="SDM Technology" className="h-12 md:h-14" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium transition-colors duration-300 ${
                  isActive(link.href) ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
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
                <Button onClick={() => navigate("/contact")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6">
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

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
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
