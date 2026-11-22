"use client";

import { Testimonial } from "@/lib/api";
import { useCollection } from "@/lib/useCollection";
import TestimonialCard from "./TestimonialCard";
import CollectionState from "./CollectionState";

export default function Stories() {
  const {
    data: testimonials,
    loading,
    error,
  } = useCollection<Testimonial>("testimonials");

  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">
          Student voices
        </h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Cards: the home page shows the first 3 */}
      {loading || error || testimonials.length === 0 ? (
        <CollectionState
          loading={loading}
          error={error}
          empty="No student stories have been published yet."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </section>
  );
}
