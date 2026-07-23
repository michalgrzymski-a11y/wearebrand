import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ValuesSection from "@/components/sections/ValuesSection";
import AboutSection from "@/components/sections/AboutSection";
import RackServerSection from "@/components/sections/RackServerSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TapeLibrarySection from "@/components/sections/TapeLibrarySection";
import BusinessContinuitySection from "@/components/sections/BusinessContinuitySection";
import ProcessRackSection from "@/components/sections/ProcessRackSection";
import SavingsSection from "@/components/sections/SavingsSection";
import SectorsSection from "@/components/sections/SectorsSection";
import SwitchSection from "@/components/sections/SwitchSection";
import PartnersV2Section from "@/components/sections/PartnersV2Section";
import PartnersSection from "@/components/sections/PartnersSection";
import ContactSection from "@/components/sections/ContactSection";
import PartnerDetailPage from "@/pages/PartnerDetailPage";

const Home = () => (
  <main data-testid="home-main" className="sc-app">
    <Navbar />
    <HeroSection />
    <ValuesSection />
    <AboutSection />
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
    <PartnersSection />
    <ContactSection />
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
