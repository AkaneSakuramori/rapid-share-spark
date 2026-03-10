import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Menu, X, Zap, Sun, Moon, Github, Code2, BookOpen, HelpCircle } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const navLinks = [
    { label: "Upload", icon: Upload, to: "/", scroll: true },
    { label: "API", icon: Code2, to: "/api" },
    { label: "Blog", icon: BookOpen, to: "/blog" },
    { label: "FAQ", icon: HelpCircle, to: "/faq" },
    { label: "GitHub", icon: Github, href: "https://github.com", external: true },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg shadow-background/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-14 px-4 lg:px-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">Rapidx</span>
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <motion.div key={link.label} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
              {link.external ? (
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground transition-colors" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon className="w-3.5 h-3.5" /> {link.label}
                  </a>
                </Button>
              ) : link.scroll ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 transition-colors ${location.pathname === "/" ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => {
                    if (location.pathname === "/") {
                      document.getElementById("upload-zone")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.location.href = "/#upload-zone";
                    }
                  }}
                >
                  <link.icon className="w-3.5 h-3.5" /> {link.label}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 transition-colors ${location.pathname === link.to ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"}`}
                  asChild
                >
                  <Link to={link.to!}>
                    <link.icon className="w-3.5 h-3.5" /> {link.label}
                  </Link>
                </Button>
              )}
            </motion.div>
          ))}
          <div className="w-px h-5 bg-border mx-2" />
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </motion.div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground" onClick={toggleTheme}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <motion.button className="p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" whileTap={{ scale: 0.9 }}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm py-2.5 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                      <link.icon className="w-4 h-4" /> {link.label}
                    </a>
                  ) : (
                    <Link to={link.to!} className={`text-sm py-2.5 transition-colors flex items-center gap-2 ${location.pathname === link.to ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                      <link.icon className="w-4 h-4" /> {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
