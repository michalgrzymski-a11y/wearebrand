import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import SectorsSection from "@/components/sections/SectorsSection";
import PartnersSection from "@/components/sections/PartnersSection";
import SupportChatSection from "@/components/sections/SupportChatSection";
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
    <SectionDivider id="portfolio-sectors"  top="#FFFFFF" bottom="#FFFFFF" />
    <SectorsSection />
    <SectionDivider id="sectors-partners"   top="#FFFFFF" bottom="#F8FAFA" />
    <PartnersSection />
    <SectionDivider id="partners-chat"      top="#F8FAFA" bottom="#040709" />
    <SupportChatSection />
    <SectionDivider id="chat-contact"       top="#040709" bottom="#040709" />
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
