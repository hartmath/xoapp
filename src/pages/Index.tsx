import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import WhyChoose from "@/components/WhyChoose";
import Features from "@/components/Features";
import BecomeProvider from "@/components/BecomeProvider";
import HowItWorks from "@/components/HowItWorks";
import PrivacySecurity from "@/components/PrivacySecurity";
import ReturningCitizens from "@/components/ReturningCitizens";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <WhyChoose />
        <Features />
        <BecomeProvider />
        <HowItWorks />
        <PrivacySecurity />
        <ReturningCitizens />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
