import { Card } from "@/components/ui/card";
import housingIcon from "@/assets/icon-housing.jpg";
import employmentIcon from "@/assets/icon-employment.jpg";
import transportationIcon from "@/assets/icon-transportation.jpg";
import assistanceIcon from "@/assets/icon-assistance.jpg";

const features = [
  {
    icon: housingIcon,
    title: "Housing",
    description:
      "Safe and affordable housing options tailored to your needs.",
  },
  {
    icon: employmentIcon,
    title: "Employment",
    description:
      "Job opportunities and career resources to help you get back on your feet.",
  },
  {
    icon: transportationIcon,
    title: "Food and Clothing",
    description:
      "Access to food banks and clothing drives in your area.",
  },
  {
    icon: assistanceIcon,
    title: "Government Assistance",
    description:
      "Guidance on applying for benefits such as food stamps, grants, and child support.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight px-4">
            Featured Resources Available On <span className="text-primary">XO Advisor</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Comprehensive support across essential life areas to help you rebuild and thrive
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1 border-border"
            >
              <div className="mb-4 sm:mb-6">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
