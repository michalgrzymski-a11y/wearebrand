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

const Home = () => (
  <main data-testid="home-main" className="sc-app">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <TrustedBySection />
    <PortfolioSection />
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
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
