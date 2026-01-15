import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import sdmLogo from "@/assets/sdm-logo.jpg";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Careers", href: "#careers" },
  { name: "Contact", href: "#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      const headerOffset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a 
            href="#home" 
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center"
          >
            <img src={sdmLogo} alt="SDM Technology" className="h-12 md:h-14" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-foreground/80 hover:text-primary font-medium transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email?.split("@")[0]}
                </span>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="font-semibold"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="font-semibold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-sdm-teal-dark text-primary-foreground font-semibold px-6"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
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
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-foreground/80 hover:text-primary font-medium transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {user.email}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={signOut}
                      className="font-semibold w-full"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        navigate("/auth");
                        setIsOpen(false);
                      }}
                      className="font-semibold w-full"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        handleGetStarted();
                        setIsOpen(false);
                      }}
                      className="bg-primary hover:bg-sdm-teal-dark text-primary-foreground font-semibold w-full"
                    >
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
