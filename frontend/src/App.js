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
    <SectionDivider id="hero-about"         top="#040709" bottom="#FFFFFF" />
    <AboutSection />
    <SectionDivider id="about-trusted"      top="#FFFFFF" bottom="#F8FAFA" />
    <TrustedBySection />
    <SectionDivider id="trusted-portfolio"  top="#F8FAFA" bottom="#FFFFFF" />
    <PortfolioSection />
    <SectionDivider id="portfolio-partners" top="#FFFFFF" bottom="#F8FAFA" />
    <PartnersSection />
    <SectionDivider id="partners-contact"   top="#F8FAFA" bottom="#040709" />
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
