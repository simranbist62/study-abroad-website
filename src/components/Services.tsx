"use client";

import { useState, useEffect } from "react";
import { Service } from "@/lib/api";
import { api } from "@/lib/axios";
import ServiceCard from "./ServiceCard";
import Link from "next/link";

export default function Services() {
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
    <section className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">What we do</h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <Link
        href="/services"
        className="mt-6 inline-block text-teal-400 hover:underline"
      >
        See all services →
      </Link>
    </section>
  );
}
