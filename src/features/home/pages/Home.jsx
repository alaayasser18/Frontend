import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import RolesSection from "../components/RolesSection";
import PlansSection from "../components/PlansSection";
import TrustStatsSection from "../components/TrustStatsSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F7F8] text-[#202B33]">
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <RolesSection />
        <PlansSection />
        <TrustStatsSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}