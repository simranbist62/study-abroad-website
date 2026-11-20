"use client";

import { Service } from "@/lib/api";
import { useCollection } from "@/lib/useCollection";
import ServiceCard from "./ServiceCard";
import Link from "next/link";
import CollectionState from "./CollectionState";

export default function Services() {
  const { data: services, loading, error } = useCollection<Service>("services");

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">What we do</h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Cards */}
      {loading || error || services.length === 0 ? <CollectionState loading={loading} error={error} empty="No services have been added yet." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>}
      <Link
        href="/services"
        className="mt-6 inline-block text-teal-400 hover:underline"
      >
        See all services →
      </Link>
    </section>
  );
}
