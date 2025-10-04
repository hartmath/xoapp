import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, Eye } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    title: "Encrypted Data",
    description: "Keeps your info safe from unauthorized access.",
  },
  {
    icon: Shield,
    title: "Secure Login",
    description: "Multi-factor authentication for extra protection.",
  },
  {
    icon: Eye,
    title: "Privacy First",
    description: "Your personal information is never shared without consent.",
  },
];

const PrivacySecurity = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Privacy And Security At <span className="text-primary">XO Advisor</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We prioritize your privacy and security. At XO Advisor, we are committed to 
            security standards ensuring that your data is protected at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {securityFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300 text-center"
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacySecurity;
