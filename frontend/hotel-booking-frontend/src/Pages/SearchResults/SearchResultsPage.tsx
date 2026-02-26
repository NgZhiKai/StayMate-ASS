import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "../../components/Misc";
import { SearchLayout } from "../../components/Search";
import {
  LoadingSkeleton,
  MapHotelsSection,
  ResultsSummary,
  SearchBreadcrumbs,
} from "../../components/SearchResults";
import { useSearchPage, useSearchResults } from "../../hooks";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage: React.FC = () => {
  const query = useQuery();

  // Read initial query params
  const initialCity = query.get("city") ?? "";
  const initialCountry = query.get("country") ?? "";
  const initialCheckIn = query.get("checkIn") ?? "";
  const initialCheckOut = query.get("checkOut") ?? "";

  // Manage search input and dates
  const {
    searchInput,
    setSearchInput,
    layout,
    toggleLayout,
    handleSearch,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
  } = useSearchPage(initialCity, initialCountry, initialCheckIn, initialCheckOut);

  // Fetch hotels filtered by location and optional check-in/check-out
  const { hotels, loading, destinations, hoveredHotelId, setHoveredHotelId } =
    useSearchResults(initialCity, initialCountry, checkIn, checkOut);

  // Keep searchInput in sync if URL changes (e.g., user navigates back)
  useEffect(() => {
    setSearchInput(`${initialCity}|${initialCountry}`);
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
  }, [initialCity, initialCountry, initialCheckIn, initialCheckOut]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white select-none">
      <HeroSection
        title={`Hotels in ${initialCity}`}
        highlight={initialCity}
        description="Find the perfect stay for your trip."
        padding="lg"
        align="left"
      />

      <SearchLayout
        destinations={destinations}
        selectedDestination={searchInput}
        setSelectedDestination={setSearchInput}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        onSearch={handleSearch}
      />

      <SearchBreadcrumbs city={initialCity} country={initialCountry} />

      {!loading && hotels.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-10 flex justify-between items-center">
          <ResultsSummary
            city={initialCity}
            country={initialCountry}
            hotelsCount={hotels.length}
            layout={layout}
            toggleLayout={toggleLayout}
            loading={loading}
          />
        </div>
      )}

      {!loading && hotels.length > 0 && (
        <MapHotelsSection
          hotels={hotels}
          layout={layout}
          hoveredHotelId={hoveredHotelId}
          setHoveredHotelId={setHoveredHotelId}
        />
      )}

      {loading && <LoadingSkeleton />}
    </div>
  );
};

export default SearchResultsPage;