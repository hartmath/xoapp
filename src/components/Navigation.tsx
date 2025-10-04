import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
        if (session) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    if (session) {
      await checkAdminStatus(session.user.id);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    setIsAdmin(!!data);
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold">
                <span className="text-primary">XO</span>
                <span className="text-foreground text-sm ml-1">ADVISOR</span>
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/resources"
              className="text-foreground hover:text-primary transition-colors"
            >
              Resources
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <Button variant="accent" size="lg" asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              </>
            ) : (
              <Button variant="accent" size="lg" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/resources"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Resources
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                  >
                    My Dashboard
                  </Link>
                )}
                <Button variant="accent" className="w-full" asChild>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              </>
            ) : (
              <Button variant="accent" className="w-full" asChild>
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
