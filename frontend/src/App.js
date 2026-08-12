import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/hero/Hero";
import Wartosci from "@/components/sections/Wartosci";
import ZaufaliNam from "@/components/sections/ZaufaliNam";
import Proces from "@/components/sections/Proces";
import Portfolio from "@/components/sections/Portfolio";
import Obszary from "@/components/sections/Obszary";
import TCO from "@/components/sections/TCO";
import Partnerzy from "@/components/sections/Partnerzy";
import Kontakt from "@/components/sections/Kontakt";
import PartnerDetailPage from "@/pages/PartnerDetailPage";
import RoboczePage from "@/pages/RoboczePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import NetappPage from "@/pages/NetappPage";
import CookieConsent from "@/components/CookieConsent";
import UtilityBar from "@/components/UtilityBar";
import Analytics from "@/components/Analytics";

const Home = () => (
  <main data-testid="home-main" className="sc-app">
    <Navbar />
    <UtilityBar />
    <Hero />
    <Wartosci />
    <ZaufaliNam />
    <Proces />
    <Portfolio />
    <Obszary />
    <TCO />
    <Partnerzy />
    <Kontakt />
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
            <Route path="/netapp" element={<NetappPage />} />
          </Routes>
          <CookieConsent />
          <Analytics />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
