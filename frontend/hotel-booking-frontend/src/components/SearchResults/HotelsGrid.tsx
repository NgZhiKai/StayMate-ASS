import React from "react";
import { Link } from "react-router-dom";
import { HotelData } from "../../types/Hotels";
import { HotelCard } from "../Hotel";

interface HotelsGridProps {
  hotels: HotelData[];
  hoveredHotelId: number | null;
  setHoveredHotelId: (id: number | null) => void;
  layout: "grid" | "list";
}

const HotelsGrid: React.FC<HotelsGridProps> = ({
  hotels,
  hoveredHotelId,
  setHoveredHotelId,
  layout,
}) => {
  return (
    <div
      className={`transition-all duration-300 w-full ${
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
          : "flex flex-col gap-5"
      }`}
    >
      {hotels.map((hotel) => (
        <Link
          key={hotel.id}
          to={`/hotel/${hotel.id}`}
          className="h-full cursor-pointer group relative rounded-2xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl hover:scale-105"
          onMouseEnter={() => setHoveredHotelId(hotel.id)}
          onMouseLeave={() => setHoveredHotelId(null)}
          aria-label={`Open ${hotel.name} details`}
        >
          <HotelCard hotel={hotel} layout={layout} hovered={hoveredHotelId === hotel.id} />
        </Link>
      ))}
    </div>
  );
};

export default HotelsGrid;
