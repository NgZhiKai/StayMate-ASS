import React, { useEffect, useMemo, useState } from "react";
import { HotelsGrid, MapSection } from "../../components/SearchResults";
import { Modal } from "../Modal";
import HotelFilters from "./HotelFilters";
import { MapPin } from "lucide-react";
import { GradientButton } from "../Button";

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
  const hotelPriceRange = useMemo(() => {
    if (!hotels.length) return null;
    const prices = hotels.flatMap((hotel) => [hotel.minPrice, hotel.maxPrice]);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [hotels]);

  const [filters, setFilters] = useState(() => ({
    minPrice: hotelPriceRange?.min ?? 0,
    maxPrice: hotelPriceRange?.max ?? 0,
    minRating: 0,
    roomTypes: [] as string[],
  }));

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    if (!hotelPriceRange) return;
    setFilters((prev) => ({
      ...prev,
      minPrice: hotelPriceRange.min,
      maxPrice: hotelPriceRange.max,
    }));
  }, [hotelPriceRange]);

  if (!hotelPriceRange) return null;

  const filteredHotels = hotels.filter((hotel) => {
    const matchesPrice =
      hotel.minPrice >= filters.minPrice && hotel.maxPrice <= filters.maxPrice;
    const matchesRating = hotel.averageRating >= filters.minRating;
    const matchesRoomType =
      filters.roomTypes.length === 0 ||
      hotel.rooms.some((room: any) => filters.roomTypes.includes(room.room_type));

    return matchesPrice && matchesRating && matchesRoomType;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row mt-6 gap-8">
      <div className="lg:w-1/3 sticky top-6 h-fit space-y-6">
        <div className="h-[400px] rounded-2xl overflow-hidden shadow-lg relative">
          <MapSection hotels={filteredHotels} hoveredHotelId={hoveredHotelId} />
            <GradientButton
              onClick={() => setIsMapModalOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full shadow hover:bg-white flex items-center gap-2 transition"
            >
              <MapPin className="w-5 h-5 text-white" />
              Show on Map
            </GradientButton>
        </div>

        <HotelFilters
          filters={filters}
          setFilters={setFilters}
          minHotelPrice={hotelPriceRange.min}
          maxHotelPrice={hotelPriceRange.max}
        />
      </div>

      <div className="lg:w-2/3 h-[80vh] overflow-y-auto scrollbar-none">
        <HotelsGrid
          hotels={filteredHotels}
          hoveredHotelId={hoveredHotelId}
          setHoveredHotelId={setHoveredHotelId}
          layout={layout}
        />
      </div>

      {/* Modal Map */}
      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)}>
        <MapSection hotels={filteredHotels} hoveredHotelId={hoveredHotelId} />
      </Modal>
    </div>
  );
};

export default MapHotelsSection;