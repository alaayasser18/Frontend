import "../../../styles/home/Home.css";
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
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <RolesSection />
      <PlansSection />
      <TrustStatsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
