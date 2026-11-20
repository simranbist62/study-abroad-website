import Navbar from "@/components/Navbar";
import DestinationDetails from "@/components/DestinationDetails";
import Footer from "@/components/Footer";

export default function DestinationDetailsPage() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />
      <main>
        <DestinationDetails />
      </main>
      <Footer />
    </div>
  );
}
