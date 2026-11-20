"use client";

import { useState, useEffect } from "react";
import { Testimonial } from "@/lib/api";
import { api } from "@/lib/axios";
import TestimonialCard from "./TestimonialCard";

export default function Stories() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function getTestimonials() {
      try {
        const response = await api.get("/testimonials");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials", error);
      }
    }
    getTestimonials();
  }, []);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">
          Student voices
        </h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Cards: the home page shows the first 3 */}
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
