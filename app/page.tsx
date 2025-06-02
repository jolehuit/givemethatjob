import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { PricingSection } from "@/components/landing/pricing";

const DynamicHero = dynamic(
  () => import("@/components/landing/hero").then((mod) => mod.Hero),
  { ssr: false }
);

const DynamicFeatures = dynamic(
  () => import("@/components/landing/features").then((mod) => mod.Features),
  { ssr: false }
);

const DynamicTestimonials = dynamic(
  () => import("@/components/landing/testimonials").then((mod) => mod.Testimonials),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <DynamicHero />
        <DynamicFeatures />
        <PricingSection />
        <DynamicTestimonials />
      </main>
      
      <Footer />
    </div>
  );
}