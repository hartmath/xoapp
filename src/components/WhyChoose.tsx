import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Users, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle2,
    title: "Simplified Resource Access",
    description: "Get personalized recommendations for essential services.",
  },
  {
    icon: Users,
    title: "Trusted Partnerships",
    description: "Connect with reliable providers and organizations.",
  },
  {
    icon: ShieldCheck,
    title: "User-Friendly Platform",
    description: "Navigate and manage your support needs with ease and confidence.",
  },
];

const WhyChoose = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight px-4">
            Why Choose <span className="text-primary">XO Advisor?</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            XO Advisor goes beyond providing resources. We empower individuals with the support, 
            guidance, and tools needed to rebuild and thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 lg:mt-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
