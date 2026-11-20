"use client";

import { Service } from "@/lib/api";
import { useCollection } from "@/lib/useCollection";
import ServiceCard from "./ServiceCard";
import { motion } from "motion/react";
import Link from "next/link";
import CollectionState from "./CollectionState";

export default function OurServices() {
  const { data: services, loading, error } = useCollection<Service>("services");

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-white">
          Our services
        </h1>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
        <p className="mt-3 max-w-2xl text-[#9bb3ae]">
          From your first counselling session to your visa, here is how we help.
        </p>
      </div>

      {/* Cards: all 5 services */}
      {loading || error || services.length === 0 ? <CollectionState loading={loading} error={error} empty="No services have been added yet." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>}
      <motion.div className="mt-8" whileTap={{ scale: 0.95 }}>
        <Link
          href="/book"
          className="gap-2 rounded-lg bg-[#4fc3ad] px-5 py-3 font-semibold text-black"
        >
          Book counselling
        </Link>
      </motion.div>
    </section>
  );
}
