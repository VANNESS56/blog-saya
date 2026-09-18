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

export function MinimalistTheme() {
  return (
    <main className="min-h-screen flex flex-col theme-minimalist">
      <PageTracker />
      <Navbar />
      
      <div className="flex-1">
        {/* Minimalist might not need intro, different order */}
        <Hero />
        <WhyChooseUs />
        <OtherProducts />
        <LiveReputation />
        <Reviews />
        <SocialMedia />
        <FAQ />
        <CTA />
      </div>

      <Footer />
    </main>
  );
}
