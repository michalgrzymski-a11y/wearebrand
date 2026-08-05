import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ValuesSection from "@/components/sections/ValuesSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import AboutV2Section from "@/components/sections/AboutV2Section";
import PortfolioSection from "@/components/sections/PortfolioSection";
import SwitchSection from "@/components/sections/SwitchSection";
import SavingsSection from "@/components/sections/SavingsSection";
import PartnersSection from "@/components/sections/PartnersSection";
import ContactSection from "@/components/sections/ContactSection";
import PartnerDetailPage from "@/pages/PartnerDetailPage";
import RoboczePage from "@/pages/RoboczePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import CookieConsent from "@/components/CookieConsent";

const Home = () => (
  <main data-testid="home-main" className="sc-app">
    <Navbar />
    <HeroSection />
    <ValuesSection />
    <TrustedBySection />
    <AboutV2Section />
    <PortfolioSection />
    <SwitchSection />
    <SavingsSection />
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
            <Route path="/robocze" element={<RoboczePage />} />
            <Route path="/partners/:slug" element={<PartnerDetailPage />} />
            <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
