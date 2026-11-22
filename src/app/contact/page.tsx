import ContactInfo from "@/components/ContactInfo";
import EnquiryForm from "@/components/EnquiryForm";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0e1b19]">
      <main>
        <section className="mx-auto max-w-[1200px] px-4 sm:px-8">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-white">
              Contact us
            </h1>
            <p className="mt-3 max-w-2xl text-[#9bb3ae]">
              Questions about courses, costs or visas? Send us a message and we
              will reply within one working day.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <ContactInfo />
            <EnquiryForm />
          </div>
        </section>
      </main>
    </div>
  );
}
