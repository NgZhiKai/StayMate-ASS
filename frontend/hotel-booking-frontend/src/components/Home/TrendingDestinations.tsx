import React from "react";
import { Link } from "react-router-dom";
import { Destination } from "../../types/Hotels";

interface TrendingProps {
  destinations: Destination[];
  loading: boolean;
}

const TrendingDestinations: React.FC<TrendingProps> = ({ destinations, loading }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 reveal">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Trending destinations
      </h2>
      <p className="text-gray-500 mt-2 mb-10">Most popular choices for travellers</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 8 }, (_, idx) => `loading-skeleton-${idx + 1}`).map((skeletonKey) => (
              <div key={skeletonKey} className="h-72 bg-gray-200 rounded-3xl animate-pulse" />
            ))
          : destinations.map((dest) => (
              <Link
                key={`${dest.city}-${dest.country}`}
                to={`/search?city=${encodeURIComponent(dest.city)}&country=${encodeURIComponent(dest.country)}`}
                className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                aria-label={`Search stays in ${dest.city}, ${dest.country}`}
              >
                <img src={dest.imageBase64} alt={dest.city} className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full mb-2">
                    {dest.count}+ stays
                  </span>
                  <h3 className="text-xl font-semibold">{dest.city}</h3>
                  <p className="text-sm opacity-80">{dest.country}</p>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default TrendingDestinations;
