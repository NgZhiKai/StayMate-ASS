import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroSection from "../../components/SearchResults/HeroSection";
import HotelsGrid from "../../components/SearchResults/HotelsGrid";
import MapSection from "../../components/SearchResults/MapSection";
import ResultsSummary from "../../components/SearchResults/ResultsSummary";
import SearchCard from "../../components/SearchResults/SearchCard";
import { useSearchResults } from "../../hooks/useSearchResults";
import Breadcrumbs from "../../components/SearchResults/Breadcrumbs";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const city = query.get("city") ?? "";
  const country = query.get("country") ?? "";

  const [searchInput, setSearchInput] = useState(`${city}|${country}`);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const toggleLayout = () => setLayout(layout === "grid" ? "list" : "grid");

  const { hotels, loading, destinations, hoveredHotelId, setHoveredHotelId } = useSearchResults(city, country);

  const handleSearch = () => {
    if (!searchInput) return;
    const [newCity, newCountry] = searchInput.split("|");
    navigate(`/search?city=${encodeURIComponent(newCity)}&country=${encodeURIComponent(newCountry)}`);
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 via-pink-50 to-white min-h-screen select-none">
      {/* Hero Section with gradient overlay */}
      <HeroSection
        city={city}
        country={country}
        className="relative after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/10 after:to-black/30"
      />

      {/* Floating Search Card */}
      <div className="-mt-16 relative z-10">
        <SearchCard
          destinations={destinations}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearch}
          className="bg-white shadow-lg rounded-3xl p-6 max-w-4xl mx-auto border border-transparent hover:border-gradient-to-r hover:from-pink-400 hover:to-purple-500 transition-all duration-300"
        />
      </div>

      {/* Breadcrumb */}
      <div className="relative mt-6">
        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            ...(country ? [{ label: country, path: `/search?country=${country}` }] : []),
            ...(city ? [{ label: city }] : []),
            { label: "Search results" },
          ]}
        />
      </div>

      {/* Results Summary with layout toggle */}
      {!loading && hotels.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-10 flex justify-between items-center">
          <ResultsSummary
            city={city}
            country={country}
            hotelsCount={hotels.length}
            layout={layout}
            toggleLayout={toggleLayout}
            loading={loading}
          />
        </div>
      )}

      {/* Main content: Map + Hotels */}
      {!loading && hotels.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row mt-4 gap-4 lg:gap-6 h-[70vh]">
          {/* Sticky Map */}
          <div className="lg:w-1/4 h-full">
            <MapSection
              hotels={hotels}
              hoveredHotelId={hoveredHotelId}
            />
          </div>

          {/* Hotels Grid/List */}
          <div className="lg:w-3/4 h-full overflow-y-auto">
            <HotelsGrid
              hotels={hotels}
              hoveredHotelId={hoveredHotelId}
              setHoveredHotelId={setHoveredHotelId}
              layout={layout}
            />
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;