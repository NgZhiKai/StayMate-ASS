import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../services/Hotel";
import SearchBar from "../components/Search/SearchBar";

interface Destination {
  city: string;
  country: string;
  count: number;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<string>(""); // "City|Country"
  const navigate = useNavigate();

  // Fetch destinations
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        const data = await hotelApi.fetchHotelDestinations();
        setDestinations(data || []); // <-- fallback to empty array
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    loadDestinations();
  }, []);

  const handleSearch = () => {
    if (!selectedDestination) return;
    const [city, country] = selectedDestination.split("|");
    navigate(`/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen select-none">

      {/* ================= HERO SECTION ================= */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white pb-20 sm:pb-32 pt-20 sm:pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Find your next stay</h1>
          <p className="text-lg sm:text-xl opacity-90">
            Search low prices on hotels and much more...
          </p>
        </div>
      </div>

      {/* ================= FLOATING SEARCH CARD ================= */}
      <div className="max-w-4xl mx-auto px-6 relative z-50 -translate-y-1/2">
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-shadow duration-300">
          <SearchBar
            destinations={destinations}
            value={selectedDestination}
            onChange={setSelectedDestination}
            onSearch={handleSearch}
            placeholder="Select a destination"
            buttonLabel="Search"
          />
        </div>
      </div>

      {/* ================= TRENDING DESTINATIONS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending destinations</h2>
        <p className="text-gray-600 mb-10">Most popular choices for travellers</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {destinations.map((dest) => (
              <div
                key={`${dest.city}-${dest.country}`}
                onClick={() =>
                  navigate(
                    `/search?city=${encodeURIComponent(dest.city)}&country=${encodeURIComponent(dest.country)}`
                  )
                }
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.city}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-xl font-bold">{dest.city}</h3>
                  <p className="text-sm opacity-90">{dest.country}</p>
                  <p className="text-sm mt-1">{dest.count}+ hotels</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;