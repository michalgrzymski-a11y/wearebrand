import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import PartnersSection from "@/components/sections/PartnersSection";
import ContactSection from "@/components/sections/ContactSection";
import SectionDivider from "@/components/SectionDivider";

const Home = () => (
  <main data-testid="home-main" className="sc-app">
    <Navbar />
    <HeroSection />
    <SectionDivider id="hero-about"        from="#040709" to="#FFFFFF" height={260} />
    <AboutSection />
    <SectionDivider id="about-trusted"     from="#FFFFFF" to="#F8FAFA" height={120} />
    <TrustedBySection />
    <SectionDivider id="trusted-portfolio" from="#F8FAFA" to="#040709" height={260} />
    <PortfolioSection />
    <SectionDivider id="portfolio-partners" from="#040709" to="#F8FAFA" height={260} />
    <PartnersSection />
    <SectionDivider id="partners-contact"  from="#F8FAFA" to="#FFFFFF" height={120} />
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
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
