import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "Where do inmates go when they are released?",
    answer: "Upon release, inmates typically return to their home communities or designated halfway houses. Many connect with family members, while others may need temporary shelter assistance. XO Advisor helps connect returning citizens with housing resources, transitional programs, and support services to ensure a smooth reintegration into society.",
  },
  {
    question: "How many people are released from prison every year?",
    answer: "Approximately 600,000 individuals are released from state and federal prisons each year in the United States. This represents a significant population that needs support and resources to successfully reintegrate into their communities and reduce recidivism rates.",
  },
];

const ReturningCitizens = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Info You Need To <span className="text-primary">Know</span>
            </h2>
            <p className="text-2xl font-semibold text-muted-foreground">
              Returning Citizens
            </p>
          </div>

          <Card className="border-border p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReturningCitizens;
