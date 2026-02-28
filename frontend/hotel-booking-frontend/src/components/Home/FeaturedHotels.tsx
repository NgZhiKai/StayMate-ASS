import React from "react";
import { Link } from "react-router-dom";
import { useFeaturedHotels } from "../../hooks";
import { HotelCard } from "../Hotel";
import { LoadingSpinner } from "../Misc";

const FeaturedHotels: React.FC = () => {
  const { hotels, loading, error } = useFeaturedHotels();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 reveal">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        Featured Hotels
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
        {hotels.map((hotel) => (
          <Link
            key={hotel.id}
            to={`/hotel/${hotel.id}`}
            className="w-[260px] sm:w-[280px] flex-shrink-0 text-left"
            aria-label={`Open ${hotel.name} details`}
          >
            <HotelCard hotel={hotel} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;
