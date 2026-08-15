import React from "react";
import Navbar from "@/components/Navbar";
import ButtonPlaygroundSection from "@/components/sections/ButtonPlaygroundSection";
import TextPlaygroundSection from "@/components/sections/TextPlaygroundSection";
import CardIconPlaygroundSection from "@/components/sections/CardIconPlaygroundSection";
import FullSectionsPlaygroundSection from "@/components/sections/FullSectionsPlaygroundSection";
import ParallaxPlaygroundSection from "@/components/sections/ParallaxPlaygroundSection";
import PartnersV2Section from "@/components/sections/PartnersV2Section";
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
import Kontakt from "@/components/sections/Kontakt";

/**
 * RoboczePage — dedicated "work-in-progress" page collecting the sections we
 * keep in the pipeline but don't want on the front page yet. Rendered at
 * /robocze and linked from the main navigation.
 */
const RoboczePage = () => (
  <main data-testid="robocze-main" className="sc-app">
    <Navbar />
    <ButtonPlaygroundSection />
    <TextPlaygroundSection />
    <CardIconPlaygroundSection />
    <FullSectionsPlaygroundSection />
    <ParallaxPlaygroundSection />
    <PartnersV2Section />
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
    <Kontakt />
  </main>
);

export default RoboczePage;
