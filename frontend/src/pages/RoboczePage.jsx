import React from "react";
import Navbar from "@/components/Navbar";
import PartnersV2Section from "@/components/sections/PartnersV2Section";
import SavingsSection from "@/components/sections/SavingsSection";
import BusinessContinuitySection from "@/components/sections/BusinessContinuitySection";
import SectorsSection from "@/components/sections/SectorsSection";
import SwitchComplianceSection from "@/components/sections/SwitchComplianceSection";
import HardwareGallerySection from "@/components/sections/HardwareGallerySection";
import NGFWSection from "@/components/sections/NGFWSection";
import ThreatWiseSection from "@/components/sections/ThreatWiseSection";
import NetAppAFFSection from "@/components/sections/NetAppAFFSection";
import ServerAssemblySection from "@/components/sections/ServerAssemblySection";
import DataReductionSection from "@/components/sections/DataReductionSection";
import BaramundiSection from "@/components/sections/BaramundiSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ContactSection from "@/components/sections/ContactSection";

/**
 * RoboczePage — dedicated "work-in-progress" page collecting the sections we
 * keep in the pipeline but don't want on the front page yet. Rendered at
 * /robocze and linked from the main navigation.
 */
const RoboczePage = () => (
  <main data-testid="robocze-main" className="sc-app">
    <Navbar />
    <PartnersV2Section />
    <SavingsSection />
    <BusinessContinuitySection />
    <SectorsSection />
    <SwitchComplianceSection />
    <HardwareGallerySection />
    <NGFWSection />
    <ThreatWiseSection />
    <NetAppAFFSection />
    <ServerAssemblySection />
    <DataReductionSection />
    <BaramundiSection />
    <PortfolioSection />
    <ContactSection />
  </main>
);

export default RoboczePage;
