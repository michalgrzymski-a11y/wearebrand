import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ValuesSection from "@/components/sections/ValuesSection";
import AboutV2Section from "@/components/sections/AboutV2Section";
import RackServerSection from "@/components/sections/RackServerSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TapeLibrarySection from "@/components/sections/TapeLibrarySection";
import BusinessContinuitySection from "@/components/sections/BusinessContinuitySection";
import ProcessRackSection from "@/components/sections/ProcessRackSection";
import SavingsSection from "@/components/sections/SavingsSection";
import Matrix3DSection from "@/components/sections/Matrix3DSection";
import SwitchComplianceSection from "@/components/sections/SwitchComplianceSection";
import HardwareGallerySection from "@/components/sections/HardwareGallerySection";
import NGFWSection from "@/components/sections/NGFWSection";
import ThreatWiseSection from "@/components/sections/ThreatWiseSection";
import NetAppAFFSection from "@/components/sections/NetAppAFFSection";
import CorridorHeroSection from "@/components/sections/CorridorHeroSection";
import ServerAssemblySection from "@/components/sections/ServerAssemblySection";
import DataReductionSection from "@/components/sections/DataReductionSection";
import BaramundiSection from "@/components/sections/BaramundiSection";
import SectorsSection from "@/components/sections/SectorsSection";
import SwitchSection from "@/components/sections/SwitchSection";
import PartnersV2Section from "@/components/sections/PartnersV2Section";
import ContactSection from "@/components/sections/ContactSection";
import PartnerDetailPage from "@/pages/PartnerDetailPage";

const Home = () => (
  <main data-testid="home-main" className="sc-app">
    <Navbar />
    <HeroSection />
    <ValuesSection />
    <AboutV2Section />
    <ProcessRackSection />
    <RackServerSection />
    <SavingsSection />
    <TrustedBySection />
    <PortfolioSection />
    <TapeLibrarySection />
    <BusinessContinuitySection />
    <SectorsSection />
    <SwitchSection />
    <PartnersV2Section />
    <ContactSection />
    <Matrix3DSection />
    <SwitchComplianceSection />
    <HardwareGallerySection />
    <NGFWSection />
    <ThreatWiseSection />
    <NetAppAFFSection />
    <CorridorHeroSection />
    <ServerAssemblySection />
    <DataReductionSection />
    <BaramundiSection />
  </main>
);

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/partners/:slug" element={<PartnerDetailPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
