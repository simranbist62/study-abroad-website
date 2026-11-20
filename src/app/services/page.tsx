import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OurServices from "@/components/OurService";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";

export default function Services() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />
      <main>
        <OurServices />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
