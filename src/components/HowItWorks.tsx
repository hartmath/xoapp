import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create A Profile",
    description:
      "Enter your SSN or former State # to access your information.",
  },
  {
    number: "02",
    title: "Select Your Needs",
    description:
      "Choose the resources you need from housing to employment.",
  },
  {
    number: "03",
    title: "Get Connected",
    description:
      "Our platform matches you directly with local service providers.",
  },
  {
    number: "04",
    title: "Stay Informed",
    description:
      "Track your progress and manage your resources, all within the app.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight px-4">
            How <span className="text-primary">XO Advisor</span> Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Getting started with XO Advisor is simple. Follow these simple steps to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-start space-y-3 sm:space-y-4 p-4 sm:p-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-5xl sm:text-6xl font-bold text-primary/20">
                    {step.number}
                  </div>
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-primary/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
