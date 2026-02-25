import React from "react";
import { HotelsGrid, MapSection } from "../../components/SearchResults";
import HotelFilters from "./HotelFilters";
import { useHotelFilters } from "../../hooks/useHotelFilters";

interface MapHotelsSectionProps {
  hotels: any[];
  layout: "grid" | "list";
  hoveredHotelId: number | null;
  setHoveredHotelId: (id: number | null) => void;
}

const MapHotelsSection: React.FC<MapHotelsSectionProps> = ({
  hotels,
  layout,
  hoveredHotelId,
  setHoveredHotelId,
}) => {
  const { filters, handleFilterChange } = useHotelFilters();

  const filteredHotels = hotels.filter((hotel) => {
    const priceOk =
      (!filters.minPrice || hotel.minPrice >= Number(filters.minPrice)) &&
      (!filters.maxPrice || hotel.maxPrice <= Number(filters.maxPrice));

    const ratingOk =
      (!filters.minRating || hotel.averageRating >= Number(filters.minRating)) &&
      (!filters.maxRating || hotel.averageRating <= Number(filters.maxRating));

    return priceOk && ratingOk;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row mt-6 gap-6">
      {/* Sidebar */}
      <div className="lg:w-1/3 flex flex-col gap-4 sticky top-4">
        {/* Map */}
        <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <MapSection hotels={filteredHotels} hoveredHotelId={hoveredHotelId} />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Filter by:</h3>
          <span className="text-sm text-gray-500 mb-2">Popular filters</span>
          <HotelFilters filters={filters} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="lg:w-2/3 h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-none">
        <HotelsGrid
          hotels={filteredHotels}
          hoveredHotelId={hoveredHotelId}
          setHoveredHotelId={setHoveredHotelId}
          layout={layout}
        />
      </div>
    </div>
  );
};

export default MapHotelsSection;