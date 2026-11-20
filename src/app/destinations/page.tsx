import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StudyDestination from "@/components/StudyDestination";

export default function Destinations() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />
      <main>
        <StudyDestination />
      </main>
      <Footer />
    </div>
  );
}
