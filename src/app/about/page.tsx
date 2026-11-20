"use client";

import Navbar from "@/components/Navbar";
import AboutHero from "@/components/AboutHero";
import Values from "@/components/Values";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />

      <main>
        <AboutHero />
        <Values />
      </main>

      <Footer />
    </div>
  );
}
