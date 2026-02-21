import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchHotelsByLocation, fetchHotelDestinations } from "../../services/Hotel/hotelApi";
import HotelCard from "../../components/Hotel/HotelCard";
import { HotelData } from "../../types/Hotels";
import SearchBar from "../../components/Search/SearchBar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface Destination {
  city: string;
  country: string;
  count: number;
  imageUrl: string;
}

const SearchResultsPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const city = query.get("city") ?? "";
  const country = query.get("country") ?? "";

  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(`${city}|${country}`);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hoveredHotelId, setHoveredHotelId] = useState<number | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        const data = await searchHotelsByLocation(city, country);
        setHotels(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, [city, country]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchHotelDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load popular destinations", err);
      }
    };
    loadDestinations();
  }, []);

  const handleSearch = () => {
    if (!searchInput) return;
    const [newCity, newCountry] = searchInput.split("|");
    navigate(
      `/search?city=${encodeURIComponent(newCity)}&country=${encodeURIComponent(newCountry)}`
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen select-none">
      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white pb-32 pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Hotels in {city || country}</h1>
        </div>
      </div>

      {/* SEARCH CARD */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <SearchBar
            destinations={destinations}
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* RESULTS SUMMARY */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        {!loading && hotels.length > 0 && (
          <p className="text-lg font-medium text-gray-700 mb-4">
            {city || country}: {hotels.length} exact matches found
          </p>
        )}
      </div>

      {/* SPLIT LAYOUT: MAP LEFT (1/4) / GRID RIGHT (3/4) */}
      {!loading && hotels.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 flex gap-6 h-[70vh]">
          {/* LEFT: MAP */}
          <div className="w-1/4 h-full rounded-xl overflow-hidden shadow-lg">
            <MapContainer
              center={[hotels[0].latitude, hotels[0].longitude]}
              zoom={12}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
              {hotels.map((hotel) => (
                <Marker
                  key={hotel.id}
                  position={[hotel.latitude, hotel.longitude]}
                  opacity={hoveredHotelId === hotel.id ? 1 : 0.7}
                >
                  {hoveredHotelId === hotel.id && (
                    <Popup closeButton={false}>
                      <div className="font-semibold">{hotel.name}</div>
                      <div>{hotel.address}</div>
                    </Popup>
                  )}
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* RIGHT: HOTELS GRID */}
          <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto h-full p-2">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                onMouseEnter={() => setHoveredHotelId(hotel.id)}
                onMouseLeave={() => setHoveredHotelId(null)}
              >
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;