import Footer from "@/components/SiteFooter";
import Navbar from "@/components/SiteHeader";
import OurServices from "@/components/OurService";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";

export default function Services() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <main>
        <OurServices />
        <FAQ />
      </main>
    </div>
  );
}
