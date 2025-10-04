import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const BecomeProvider = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4 sm:mb-6">
            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight px-4">
            Become One Of Our <span className="text-primary">Resource Providers</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Register your business as a resource and provide vital support to those in need. 
            Help ex-offenders, veterans, and the homeless rebuild their lives through essential services.
          </p>

          <Button 
            variant="accent" 
            size="lg" 
            className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto max-w-sm mx-auto"
            onClick={scrollToContact}
          >
            Register Your Resources
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BecomeProvider;
