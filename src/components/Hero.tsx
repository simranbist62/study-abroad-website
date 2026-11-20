"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const images = [
  { src: "/images/london.webp", alt: "London", offset: false },
  { src: "/images/switzerland.avif", alt: "Switzerland", offset: true },
  { src: "/images/city.webp", alt: "City", offset: false },
  { src: "/images/australia.webp", alt: "Australia", offset: true },
];

const stats = [
  ["4,000+", "Students helped"],
  ["12 yrs", "Of experience"],
  ["5", "Study destinations"],
  ["Free", "First counselling"],
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-5 sm:px-8">
      <div className="grid items-center gap-12 rounded-[30px] bg-gradient-to-br from-teal-700 via-teal-950 to-blue-950 px-6 py-16 text-white sm:px-12 lg:grid-cols-2 lg:px-16">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm">
            Free first session · 4,000+ students helped
          </span>

          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight lg:text-6xl">
            Study abroad with a plan,{" "}
            <span className="text-amber-400">not a guess.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-teal-50/90">
            Free counselling, honest cost advice and support from shortlist to
            visa.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/book"
                className="block rounded-lg bg-amber-400 px-5 py-2.5 font-semibold text-slate-950 hover:bg-amber-300"
              >
                Book counselling
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/destinations"
                className="block rounded-lg border border-white px-5 py-2.5 font-semibold hover:bg-white hover:text-teal-950"
              >
                Explore destinations
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right images: pop in one by one */}
        <div className="grid grid-cols-2 items-center gap-4 sm:gap-5">
          {images.map((img, i) => (
            <motion.img
              key={img.alt}
              src={img.src}
              alt={img.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className={`h-36 w-full rounded-2xl border-2 border-white/30 object-cover sm:h-44 ${
                img.offset ? "mt-8" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 mx-3 -mt-8 grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-[#142c29] px-4 py-4 text-center shadow-xl sm:grid-cols-4 sm:px-6"
      >
        {stats.map(([value, label]) => (
          <div key={label}>
            <h2 className="font-serif text-xl font-bold text-teal-400 sm:text-2xl">
              {value}
            </h2>
            <p className="mt-1 text-sm text-teal-100/70">{label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
