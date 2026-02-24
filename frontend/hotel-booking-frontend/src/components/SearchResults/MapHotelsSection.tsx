import React from "react";
import { HotelsGrid, MapSection } from "../../components/SearchResults";

interface MapHotelsSectionProps {
  hotels: any[];
  layout: "grid" | "list";
  hoveredHotelId: number | null;
  setHoveredHotelId: (id: number | null) => void;
}

export const MapHotelsSection: React.FC<MapHotelsSectionProps> = ({
  hotels,
  layout,
  hoveredHotelId,
  setHoveredHotelId,
}) => (
  <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row mt-4 gap-6 h-[70vh]">
    <div className="lg:w-1/4 h-full rounded-2xl shadow-lg bg-gradient-to-b from-purple-50 via-pink-50 to-white overflow-hidden sticky top-4">
      <MapSection hotels={hotels} hoveredHotelId={hoveredHotelId} />
    </div>

    <div className="lg:w-3/4 h-full overflow-y-auto scrollbar-none">
      <HotelsGrid
        hotels={hotels}
        hoveredHotelId={hoveredHotelId}
        setHoveredHotelId={setHoveredHotelId}
        layout={layout}
      />
    </div>
  </div>
);

export default MapHotelsSection;