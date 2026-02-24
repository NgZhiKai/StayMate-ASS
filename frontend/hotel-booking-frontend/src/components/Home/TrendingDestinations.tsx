import React from "react";
import { useNavigate } from "react-router-dom";
import { Destination } from "../../types/Hotels";

interface TrendingProps {
  destinations: Destination[];
  loading: boolean;
}

const TrendingDestinations: React.FC<TrendingProps> = ({ destinations, loading }) => {
  const navigate = useNavigate();

  const handleDestinationClick = (city: string, country: string) => {
    navigate(
      `/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 reveal">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
        Trending destinations
      </h2>
      <p className="text-gray-500 mt-2 mb-10">Most popular choices for travellers</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-3xl animate-pulse" />
            ))
          : destinations.map((dest) => (
              <div
                key={`${dest.city}-${dest.country}`}
                onClick={() => handleDestinationClick(dest.city, dest.country)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.city}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full mb-2">
                    {dest.count}+ stays
                  </span>
                  <h3 className="text-xl font-semibold">{dest.city}</h3>
                  <p className="text-sm opacity-80">{dest.country}</p>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default TrendingDestinations;