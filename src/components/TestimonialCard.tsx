"use client";

import { motion } from "motion/react";
import { Testimonial } from "@/lib/api";

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="flex h-full flex-col rounded-2xl border border-[#2a403c] bg-[#162826] p-6"
    >
      <div className="tracking-widest text-amber-400" aria-label="5 stars">
        ★★★★★
      </div>

      <blockquote className="mt-3 flex-1 leading-7 text-white/90">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 text-sm text-[#9bb3ae]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white">
          {testimonial.name[0]}
        </span>
        <span>
          <b className="text-white">{testimonial.name}</b>
          <br />
          {testimonial.course}, {testimonial.destination}
        </span>
      </figcaption>
    </motion.figure>
  );
}
