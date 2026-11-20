"use client";

import CTA from "@/components/CTA";
import Destinations from "@/components/Destinations";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />

      <main>
        <Hero />
        <Destinations />
        <Services />
        <Testimonials />
        <CTA />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
