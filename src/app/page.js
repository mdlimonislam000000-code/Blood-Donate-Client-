
import Hero from "@/components/Hero";
import Image from "next/image";
import EmergencyBlood from "./blood-requests/page";
import ImpactStats from "@/components/ImpactStats";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import TopHeroes from "@/components/TopHeroes";
import Footer from "@/components/Footer";

export const metadata = {
  title: "MMJ Blood Donate - Home | Save Lives, Donate Blood",
  description: "Find blood donors easily, post emergency requests, and connect with people in need through MMJ Blood Bank.",
};

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
