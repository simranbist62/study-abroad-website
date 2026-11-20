import Navbar from "@/components/Navbar";
import Blogs from "@/components/Blogs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />
      <main>
        <Blogs />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
