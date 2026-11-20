"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function AboutHero() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-5 sm:px-8">
      <div className="mb-8">
        <h2 className="font-serif text-4xl font-bold text-white">About Us</h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative h-120 w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-white/30 "
      >
        <Image
          src="/images/city.webp"
          alt="Our team and students"
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />
      </motion.div>
      <p className="mt-5 max-w-3xl text-md leading-8 text-teal-50/90">
        Northbound is a team of former international students and certified
        counsellors. Since 2014 we have helped more than 4,000 students find
        courses that fit their goals and budgets. We are open about fees,
        timelines and risks, and we only recommend universities we would choose
        ourselves.
      </p>
    </section>
  );
}
