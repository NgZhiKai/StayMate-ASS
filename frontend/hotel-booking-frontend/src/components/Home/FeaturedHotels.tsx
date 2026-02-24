// components/Home/FeaturedHotels.tsx
import React from "react";
import { Destination } from "../../types/Hotels";

interface FeaturedHotelsProps {
  destinations: Destination[];
}

const FeaturedHotels: React.FC<FeaturedHotelsProps> = ({ destinations }) => {
  const featured = destinations.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 reveal">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        Featured hotels
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {featured.map((dest) => (
          <div
            key={`featured-${dest.city}`}
            className="min-w-[260px] bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            <img
              src={dest.imageUrl}
              alt={dest.city}
              className="h-44 w-full object-cover rounded-t-3xl"
            />
            <div className="p-5">
              <h3 className="font-semibold text-lg">{dest.city}</h3>
              <p className="text-sm text-gray-500">{dest.country}</p>
              <p className="text-sm font-medium text-gray-800 mt-1">
                {dest.count}+ available stays
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;