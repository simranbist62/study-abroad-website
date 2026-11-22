"use client";

import { useState, useEffect } from "react";
import { Service } from "@/lib/api";
import { api } from "@/lib/axios";
import ServiceCard from "./ServiceCard";
import { motion } from "motion/react";
import Link from "next/link";

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function getServices() {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services", error);
      }
    }
    getServices();
  }, []);

  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-boldtext-white">
          Our services
        </h1>
        <p className="mt-3 max-w-2xl text-[#9bb3ae]">
          From your first counselling session to your visa, here is how we help.
        </p>
      </div>

      {/* Cards: all 5 services */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <motion.div className="mt-8" whileTap={{ scale: 0.95 }}>
        <Link
          href="/book-counseling"
          className="gap-2 rounded-lg bg-[#4fc3ad] px-5 py-3 font-semibold text-black"
        >
          Book counselling
        </Link>
      </motion.div>
    </section>
  );
}
