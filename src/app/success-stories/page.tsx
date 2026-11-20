import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Stories from "@/components/Stories";

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />
      <main>
        <Stories />
      </main>
      <Footer />
    </div>
  );
}
