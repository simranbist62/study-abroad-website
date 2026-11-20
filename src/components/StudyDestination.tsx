"use client";

import { useState, useEffect } from "react";
import { Destination } from "@/lib/api";
import { api } from "@/lib/axios";
import DestinationCard from "./DestinationCard";

export default function StudyDestination() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    async function getDestinations() {
      try {
        const response = await api.get("/destinations");
        setDestinations(response.data);
      } catch (error) {
        console.error("Error fetching destinations: ", error);
      }
    }
    getDestinations();
  }, []);
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">
          Study destinations
        </h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </section>
  );
}
