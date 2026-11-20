import Navbar from "@/components/Navbar";
import BlogDetails from "@/components/BlogDetails";
import Footer from "@/components/Footer";

export default function BlogDetailsPage() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <Navbar />
      <main>
        <BlogDetails />
      </main>
      <Footer />
    </div>
  );
}
