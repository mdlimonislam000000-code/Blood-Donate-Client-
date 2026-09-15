
import Hero from "@/components/Hero";
import Image from "next/image";
import EmergencyBlood from "./blood-requests/page";
import ImpactStats from "@/components/ImpactStats";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import TopHeroes from "@/components/TopHeroes";
import Footer from "@/components/Footer";

export default function Home() {
  return (
   <div>
    <Hero></Hero>
    <EmergencyBlood></EmergencyBlood>
    <ImpactStats></ImpactStats>
    <HowItWorks></HowItWorks>
    <WhyChooseUs></WhyChooseUs>
    <TopHeroes></TopHeroes>
    <Footer></Footer>
   </div>
  );
}
