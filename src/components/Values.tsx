"use client";

import { motion } from "motion/react";
import { Target, Compass, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our mission",
    text: "Make studying abroad clear, affordable and achievable.",
  },
  {
    icon: Compass,
    title: "Our approach",
    text: "Honest advice first, applications second.",
  },
  {
    icon: HeartHandshake,
    title: "Our promise",
    text: "Your first session is always free.",
  },
];

export default function Values() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-5 sm:px-8">
      {/* Section title */}

      {/* Cards */}
      <div className="grid gap-5 md:grid-cols-4">
        {values.map((v) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="rounded-2xl border border-[#2a403c] bg-[#162826] p-4 transition-colors hover:border-teal-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
              <v.icon size={24} />
            </div>
            <h3 className="font-serif text-md font-bold text-white">
              {v.title}
            </h3>
            <p className="mt-2 text-[#9bb3ae] text-md">{v.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
