"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function CTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#e8a33d] to-[#f2c36b] p-8 text-[#2b1c00] sm:p-10"
      >
        <div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Ready to start your journey?
          </h2>
          <p className="mt-1">Your first counselling session is free.</p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/book"
            className="flex items-center gap-2 rounded-lg bg-[#12302c] px-5 py-3 font-semibold text-white"
          >
            Book counselling
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
