"use client";

import { motion } from "motion/react";
import { Service } from "@/lib/api";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full rounded-2xl border border-[#2a403c] bg-[#162826] p-6 transition-colors hover:border-teal-500"
    >
      <h3 className="font-serif text-xl font-bold text-white">
        {service.title}
      </h3>
      <p className="mt-2 leading-7 text-[#9bb3ae]">{service.desc}</p>
    </motion.div>
  );
}
