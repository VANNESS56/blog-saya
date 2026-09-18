import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Intro } from "@/components/layout/Intro";
import { PageTracker } from "@/components/layout/PageTracker";
import { Hero } from "@/components/sections/Hero";
import { SocialMedia } from "@/components/sections/SocialMedia";
import { OtherProducts } from "@/components/sections/OtherProducts";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Reviews } from "@/components/sections/Reviews";
import { LiveReputation } from "@/components/sections/LiveReputation";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export function GamingTheme() {
  return (
    <main className="min-h-screen flex flex-col theme-gaming">
      <PageTracker />
      <Intro />
      <Navbar />
      
      <div className="flex-1">
        <Hero />
        <SocialMedia />
        <LiveReputation />
        <OtherProducts />
        <WhyChooseUs />
        <Reviews />
        <FAQ />
        <CTA />
      </div>

      <Footer />
    </main>
  );
}
