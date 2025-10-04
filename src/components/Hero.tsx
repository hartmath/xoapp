import { Button } from "@/components/ui/button";
import heroPhones from "@/assets/hero-phones.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 bg-gradient-to-b from-secondary to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 animate-fade-in text-center lg:text-left">
            <div className="inline-block">
              <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs sm:text-sm font-medium">
                HOPE IS BEYOND POSSIBLE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Rebuilding
              <br />
              <span className="text-primary">Lives</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Welcome to XO Advisor, where we connect ex-offenders, veterans,
              and the homeless with the resources they need to rebuild their
              lives and thrive. App Coming Soon...
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                variant="accent" 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto"
                onClick={scrollToContact}
              >
                Register Your Resources
              </Button>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative lg:ml-auto animate-fade-in-up mt-8 lg:mt-0">
            <div className="relative z-10">
              <img
                src={heroPhones}
                alt="XO Advisor mobile app interface"
                className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
