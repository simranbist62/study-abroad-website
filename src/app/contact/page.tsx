import ContactInfo from "@/components/ContactInfo";
import EnquiryForm from "@/components/EnquiryForm";

export default function Contact() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-white">Contact us</h1>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
        <p className="mt-3 max-w-2xl text-[#9bb3ae]">Questions about courses, costs or visas? Send us a message and we will reply within one working day.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2"><ContactInfo /><EnquiryForm /></div>
    </section>
  );
}
