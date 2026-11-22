"use client";

import { Destination } from "@/lib/api";
import { useCollection } from "@/lib/useCollection";
import DestinationCard from "./DestinationCard";
import CollectionState from "./CollectionState";

export default function StudyDestination() {
  const {
    data: destinations,
    loading,
    error,
  } = useCollection<Destination>("destinations");
  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-8">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-white">
          Study destinations
        </h2>
        <div className="mt-2 h-1 w-14 rounded bg-gradient-to-r from-teal-500 to-amber-400" />
      </div>

      {/* Cards */}
      {loading || error || destinations.length === 0 ? (
        <CollectionState
          loading={loading}
          error={error}
          empty="No destinations have been added yet."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </section>
  );
}
