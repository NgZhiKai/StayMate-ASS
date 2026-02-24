import React from "react";
import { useLocation } from "react-router-dom";
import { SearchResult } from "../../components/Search";
import {
  HeroSection,
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
  const city = query.get("city") ?? "";
  const country = query.get("country") ?? "";

  const { searchInput, setSearchInput, layout, toggleLayout, handleSearch } =
    useSearchPage(city, country);

  const { hotels, loading, destinations, hoveredHotelId, setHoveredHotelId } =
    useSearchResults(city, country);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white select-none">
      <HeroSection city={city} country={country} />
      <SearchResult
        destinations={destinations}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
      />

      <SearchBreadcrumbs city={city} country={country} />

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